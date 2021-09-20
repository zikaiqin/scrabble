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

    checkIfCommand(input: string){
        if(input[0]=="!") {
            return true;
        }
        return false;
    }
    runCommand(input: string){
        if(this.checkIfCommand(input)){
            /*if(input == "!help"){
                this.messageService.sendMessage('Systeme: ' + 'Voici une liste des commandes'.fontcolor("red"));
            }*/
            switch (input) {
                case "!help":
                    this.messageService.sendMessage('Systeme: ' + 'Voici une liste des commandes'.fontcolor("red"));
                    break;
                default:
                    this.messageService.sendMessage('Systeme: ' + 'Cette commande n existe pas'.fontcolor("red"));

            }
        }

    }

    sendMessage(): void {
        let input = (<HTMLInputElement>document.getElementById('message')).value;
        if(input != '' && input.length <= 512){
            this.messageService.sendMessage('User: ' + input.fontcolor("blue"));
            this.runCommand(input);
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
