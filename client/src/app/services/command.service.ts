/* eslint-disable no-invalid-this --- because we have a variable that uses a service but it is declared before the constructor */
import { Injectable } from '@angular/core';
import { MessageType } from '@app/classes/message';
import { LetterExchangeService } from '@app/services/letter-exchange.service';
import { LetterPlacingService } from '@app/services/letter-placing.service';
import { TextboxService } from '@app/services/textbox.service';
import { Subscription } from 'rxjs';
import { EndGameService } from './end-game.service';
import { TurnService } from './turn.service';

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
                this.textboxService.sendMessage(
                    MessageType.System,
                    `Voici une liste des commandes : ${Array.from(this.commandLookup.keys()).join(', ')}`,
                );
                return true;
            },
        ],
        [
            '!placer',
            (position: string, word: string): boolean => {
                return this.letterPlacingService.validateCommand(position, word);
            },
        ],
        [
            '!échanger',
            (letters: string): boolean => {
                return this.letterExchangeService.validateCommand(letters);
            },
        ],
        [
            '!debug',
            (): boolean => {
                if (!this.debugActive) {
                    this.textboxService.sendMessage(MessageType.System, 'Affichages de déboguage activés');
                    this.debugActive = true;
                } else {
                    this.textboxService.sendMessage(MessageType.System, 'Affichages de déboguage désactivés');
                    this.debugActive = false;
                }
                return true;
            },
        ],
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
