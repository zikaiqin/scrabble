import { Injectable } from '@angular/core';
import { MessageType } from '@app/classes/message';
import { LetterPlacingService } from '@app/services/letter-placing.service';
import { LetterExchangeService } from '@app/services/letter-exchange.service';
import { TextboxService } from '@app/services/textbox.service';
import { TurnService } from './turn.service';

@Injectable({
    providedIn: 'root',
})
export class CommandService {
    debugActive: boolean = false;
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
        [
            '!passer',
            (): boolean => {
                this.turnService.changeTurn(false);
                // eslint-disable-next-line no-invalid-this
                this.textboxService.sendMessage(MessageType.System, 'Votre tour a été passé');
                return true;
            },
        ],
    ]);

    constructor(
        private textboxService: TextboxService,
        private letterPlacingService: LetterPlacingService,
        private letterExchangeService: LetterExchangeService,
        private turnService: TurnService,
    ) {}


    parseCommand(message: string): void {
        let command: string;
        let params: string[];
        // eslint-disable-next-line prefer-const
        [command, ...params] = message.split(' ');

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
