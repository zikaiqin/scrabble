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
        let input = (<HTMLInputElement>document.getElementById('message')).value;
        if (input != '' && input.length <= 512) {
            this.messageService.sendMessage(MessageType.User, input);
            this.runCommand(input);
        } else if (input.length > 512) {
            this.messageService.sendMessage(MessageType.System, 'Votre message contient trop de caracteres');
        }

        (<HTMLInputElement>document.getElementById('message')).value = '';
    }

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            this.sendMessage();
        }
    }
}
