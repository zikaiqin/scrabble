import { Injectable } from '@angular/core';
import { Message } from '@app/classes/message';
import { Observable } from 'rxjs';
import { CommandService } from './command.service';
import { TextboxService } from './textbox.service';
import { TurnService } from './turn.service';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    constructor(private textbox: TextboxService, private command: CommandService, private turn: TurnService) {}

    changeTurn(bool: boolean): void {
        this.turn.changeTurn(bool);
    }

    sendMessage(type: string, text: string): void {
        this.textbox.sendMessage(type, text);
    }

    getState(): Observable<boolean> {
        return this.turn.getState();
    }

    getMessage(): Observable<Message> {
        return this.textbox.getMessage();
    }

    parseCommand(input: string): void {
        this.command.parseCommand(input);
    }
}
