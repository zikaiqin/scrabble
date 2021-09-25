import { Component } from '@angular/core';
import { MessageType } from '@app/classes/message';
import { GameService } from '@app/services/game.service';

const MAX_MESSAGE_LENGTH = 512;

@Component({
    selector: 'app-inputbar',
    templateUrl: './inputbar.component.html',
    styleUrls: ['./inputbar.component.scss'],
})
export class InputbarComponent {
    message: string;

    constructor(private gameService: GameService) {}

    isCommand(input: string): boolean {
        return input[0] === '!';
    }

    sendMessage(): void {
        if (this.message === '') {
            return;
        }
        if (this.message.length > MAX_MESSAGE_LENGTH) {
            this.gameService.sendMessage(MessageType.System, 'Votre message dépasse 512 charactères');
        }
        if (this.isCommand(this.message)) {
            this.gameService.parseCommand(this.message);
        } else {
            this.gameService.sendMessage(MessageType.User, this.message);
        }
        this.message = '';
    }
}
