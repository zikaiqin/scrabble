import { Injectable } from '@angular/core';
import { TextboxService } from '@app/services/textbox.service';
import { MessageType } from '@app/classes/message';

@Injectable({
    providedIn: 'root',
})
export class CommandService {
    readonly commandLookup = new Map<string, (...params: string[]) => boolean>([
        [
            '!help',
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
                const positionTemplate = /[a-o](?:1[0-5]|[1-9])[vh]/;
                const wordTemplate = /[a-zA-Z]+/;

                const simpleValidation: boolean = word !== undefined && positionTemplate.test(position) && wordTemplate.test(word);
                if (!simpleValidation) {
                    // eslint-disable-next-line no-invalid-this
                    this.textboxService.sendMessage(MessageType.System, 'La commande !placer requiert des paramètres valides');
                }
                return simpleValidation;
            },
        ],
    ]);

    constructor(private textboxService: TextboxService) {}

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
