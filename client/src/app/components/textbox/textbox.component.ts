import { Component } from '@angular/core';

@Component({
    selector: 'app-textbox',
    templateUrl: './textbox.component.html',
    styleUrls: ['./textbox.component.scss'],
})
export class TextboxComponent {
    sendMessage(){
        let message = (<HTMLInputElement>document.getElementById("message")).value;
        (<HTMLInputElement>document.getElementById("thread")).textContent = "User: " + message;

        //let textArea = document.getElementById("thread");   
        //let newMessage = document.createTextNode(message)
        //document.getElementById("thread").innerText += newMessage;
    }
    
}