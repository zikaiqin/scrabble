import { Injectable } from '@angular/core';
import { MessageType } from '@app/classes/message';
import { LetterPlacingService } from '@app/services/letter-placing.service';
import { LetterExchangeService } from '@app/services/letter-exchange.service';
import { TextboxService } from '@app/services/textbox.service';
import { TurnService } from './turn.service';
import { EndGameService } from './end-game.service';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CommandService {
    debugActive: boolean = false;
    subscription: Subscription;
    turn: boolean;
    readonly commandLookup = new Map<string, (...params: string[]) => boolean>([
        [
            '!aide',
            (): boolean => {
                // eslint-disable-next-line no-invalid-this
                this.textboxService.sendMessage(
                    MessageType.System,
                    // eslint-disable-next-line no-invalid-this
                    `Voici une liste des commandes : ${Array.from(this.commandLookup.keys()).join(', ')}`,
                );
                return true;
            },
        ],
        [
            '!placer',
            (position: string, word: string): boolean => {
                // eslint-disable-next-line no-invalid-this
                return this.letterPlacingService.validateCommand(position, word);
            },
        ],
        [
            '!échanger',
            (letters: string): boolean => {
                // eslint-disable-next-line no-invalid-this
                return this.letterExchangeService.validateCommand(letters);
            },
        ],
        [
            '!debug',
            (): boolean => {
                // eslint-disable-next-line no-invalid-this
                if (!this.debugActive) {
                    // eslint-disable-next-line no-invalid-this
                    this.textboxService.sendMessage(MessageType.System, 'Affichages de déboguage activés');
                    // eslint-disable-next-line no-invalid-this
                    this.debugActive = true;
                } else {
                    // eslint-disable-next-line no-invalid-this
                    this.textboxService.sendMessage(MessageType.System, 'Affichages de déboguage désactivés');
                    // eslint-disable-next-line no-invalid-this
                    this.debugActive = false;
                }
                return true;
            },
        ],
        /* eslint-disable no-invalid-this */
        [
            '!passer',
            (): boolean => {
                if (this.turn) {
                    this.turnService.changeTurn(false);
                    if (!this.endGameService.checkIfGameEnd()) {
                        this.endGameService.turnSkipCount();
                        this.endGameService.endGame();
                    }
                    this.textboxService.sendMessage(MessageType.System, 'Votre tour a été passé');
                    return true;
                }
                this.textboxService.sendMessage(MessageType.System, "Ce n'est pas votre tour");
                return true;
            },
        ],
        /* eslint-enable no-invalid-this */
    ]);

    constructor(
        private textboxService: TextboxService,
        private letterPlacingService: LetterPlacingService,
        private letterExchangeService: LetterExchangeService,
        private turnService: TurnService,
        private endGameService: EndGameService,
    ) {
        this.subscription = this.turnService.getState().subscribe((turn) => {
            this.turn = turn;
        });
    }

    parseCommand(message: string): void {
        const command: string = message.split(' ')[0];
        const params: string[] = message.split(' ').slice(1);

        const exec: ((...args: string[]) => boolean) | undefined = this.commandLookup.get(command);
        if (!exec) {
            this.textboxService.sendMessage(MessageType.System, `La commande ${command} n'existe pas`);
        } else {
            if (exec(...params)) {
                this.textboxService.sendMessage(MessageType.User, message);
            }
        }
    }
}
