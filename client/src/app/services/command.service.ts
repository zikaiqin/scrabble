import { Injectable } from '@angular/core';
import { MessageType } from '@app/classes/message';
import { LetterPlacingService } from '@app/services/letter-placing.service';
import { TextboxService } from '@app/services/textbox.service';

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
                return this.placeLetterService.validateCommand(position, word);
            },
        ],
    ]);

    constructor(private textboxService: TextboxService, private placeLetterService: LetterPlacingService) {}

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
