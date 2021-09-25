import { Injectable } from '@angular/core';
import { Message } from '@app/classes/message';
import { Observable } from 'rxjs';
import { CommandService } from './command.service';
import { TextboxService } from './textbox.service';
import { TurnService } from './turn.service';
import { ValidationService } from './validation.service';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    playerScore: number;

    constructor(private textbox: TextboxService, private command: CommandService, private turn: TurnService, private validation: ValidationService) {}

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

    checkWord(word: string, square: string[]): boolean {
        if (this.validation.findWord(word)) {
            this.playerScore = this.validation.calcPoints(word, square);
            return true;
        }
        return false;
    }
}
