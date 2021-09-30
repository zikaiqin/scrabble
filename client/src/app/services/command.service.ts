import { Injectable } from '@angular/core';
import { LetterPlacingService } from '@app/services/letter-placing.service';
import { LetterExchangeService } from '@app/services/letter-exchange.service';
import { TextboxService } from '@app/services/textbox.service';
import { MessageType } from '@app/classes/message';

@Injectable({
    providedIn: 'root',
})
export class CommandService {
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
    ]);

    constructor(
        private textboxService: TextboxService,
        private letterPlacingService: LetterPlacingService,
        private letterExchangeService: LetterExchangeService,
    ) {}

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
