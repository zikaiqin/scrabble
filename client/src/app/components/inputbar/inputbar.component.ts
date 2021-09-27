import { Component } from '@angular/core';
import { MessageType } from '@app/classes/message';
import { CommandService } from '@app/services/command.service';
import { TextboxService } from '@app/services/textbox.service';

const MAX_MESSAGE_LENGTH = 512;

@Component({
    selector: 'app-inputbar',
    templateUrl: './inputbar.component.html',
    styleUrls: ['./inputbar.component.scss'],
})
export class InputbarComponent {
    message: string;

    constructor(private textboxService: TextboxService, private commandService: CommandService) {}

    isCommand(input: string): boolean {
        return input[0] === '!';
    }

    sendMessage(): void {
        if (this.message === '') {
            return;
        }
        if (this.message.length > MAX_MESSAGE_LENGTH) {
            this.textboxService.sendMessage(MessageType.System, `Votre message dépasse ${MAX_MESSAGE_LENGTH} caractères`);
        }
        if (this.isCommand(this.message)) {
            this.commandService.parseCommand(this.message);
        } else {
            this.textboxService.sendMessage(MessageType.User, this.message);
        }
        this.message = '';
    }
}
