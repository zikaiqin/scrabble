import { Injectable } from '@angular/core';
import { TextboxService } from '@app/services/textbox.service';
import { MessageType } from '@app/classes/message';

const validPosition = /[a-o](?:1[0-5]|[1-9])[vh]/;
const validWord = /[a-zA-Z]+/;

@Injectable({
    providedIn: 'root',
})
export class LetterPlacingService {
    private position: string;
    private word: string;
    // FIXME: placeholder for gameService integration
    // private letters: unknown[];

    constructor(private textboxService: TextboxService) {}

    validateCommand(position: string, word: string): boolean {
        this.position = position;
        this.word = word;
        return this.isValidParam();
    }

    isValidParam(): boolean {
        const isValid: boolean = this.word !== undefined && validPosition.test(this.position) && validWord.test(this.word);
        if (!isValid) {
            this.textboxService.sendMessage(MessageType.System, 'La commande !placer requiert des paramètres valides');
        }
        return isValid;
    }

    isMyTurn(): boolean {
        return true;
    }

    isInBounds(): boolean {
        return true;
    }

    isInDict(): boolean {
        return true;
    }

    isChaining(): boolean {
        return true;
    }

    isMatching(): boolean {
        return true;
    }

    isInHand(): boolean {
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    placeLetters(): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    replenishHand(): void {}
}
