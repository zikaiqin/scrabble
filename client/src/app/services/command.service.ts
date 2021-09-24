import { Injectable } from '@angular/core';
import { TextboxService } from '@app/services/textbox.service';
import { MessageType } from '@app/classes/message';

@Injectable({
    providedIn: 'root',
})
export class CommandService {
    readonly commandLookup = new Map<string, (...params: string[]) => void>([
        [
            '!help',
            () => {
                // eslint-disable-next-line no-invalid-this
                this.textboxService.sendMessage(
                    MessageType.System,
                    // eslint-disable-next-line no-invalid-this
                    `Voici une liste des commandes : ${Array.from(this.commandLookup.keys()).join(', ')}`,
                );
            },
        ],
        [
            '!placer',
            () => {
                const placeholder = '';
                placeholder.concat('');
            },
        ],
    ]);

    constructor(private textboxService: TextboxService) {}

    parseCommand(input: string): void {
        let command: string;
        let params: string[];
        // eslint-disable-next-line prefer-const
        [command, ...params] = input.split(' ');

        const exec: ((...args: string[]) => void) | undefined = this.commandLookup.get(command);
        if (!exec) {
            this.textboxService.sendMessage(MessageType.System, `La commande ${command} n'existe pas`);
        } else {
            this.textboxService.sendMessage(MessageType.System, `Vous avez utilisé la commande ${command}`);
            exec(...params);
        }
    }
}
