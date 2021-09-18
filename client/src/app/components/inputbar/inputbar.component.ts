import { Component, HostListener} from "@angular/core";
import { TextboxService } from "@app/services/textbox.service";


@Component({ 
    selector: 'app-inputbar',
    templateUrl: './inputbar.component.html',
    styleUrls: ['./inputbar.component.scss']
})
export class InputbarComponent {
    
    constructor(private messageService: TextboxService) { }
    buttonPressed = '';

    sendMessage(): void {
        let input = (<HTMLInputElement>document.getElementById('message')).value;
        if(input != '' && input.length <= 512){
            this.messageService.sendMessage('User: ' + input.fontcolor("blue"));
            input = '';
        (<HTMLInputElement>document.getElementById('message')).value = input;
        }else if(input.length > 512){
            this.messageService.sendMessage('Systeme: Votre message contient trop de caracteres')
        }

    }
    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        if(event.keyCode === 13){
           this.sendMessage(); 
        }
    }
    
}

    //templateUrl: './inputbar.component.html'