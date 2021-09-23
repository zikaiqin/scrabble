import { Component, HostListener } from '@angular/core';
import { TextboxService, MessageType } from '@app/services/textbox.service';

@Component({
    selector: 'app-inputbar',
    templateUrl: './inputbar.component.html',
    styleUrls: ['./inputbar.component.scss'],
})
export class InputbarComponent {
    constructor(private messageService: TextboxService) {}
    buttonPressed = '';
    messages: string;

    checkIfCommand(input: string) {
        if (input[0] == '!') {
            return true;
        }
        return false;
    }

    runCommand(input: string) {
        if (this.checkIfCommand(input)) {
            switch (input) {
                case '!help':
                    this.messageService.sendMessage(MessageType.System, 'Voici une liste des commandes');
                    break;
                default:
                    this.messageService.sendMessage(MessageType.System, 'Cette commande n\'existe pas');
            }
        }
    }

    sendMessage(): void {
        if (this.messages != '' && this.messages.length <= 512) {
            this.messageService.sendMessage(MessageType.User, this.messages);
            this.runCommand(this.messages);
        } else if (this.messages.length > 512) {
            this.messageService.sendMessage(MessageType.System, 'Votre message contient trop de caracteres');
        }
        this.messages = '';
    }

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            this.sendMessage();
        }
    }
}
