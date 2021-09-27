import { Injectable } from '@angular/core';
import { TextboxService } from '@app/services/textbox.service';
import { GameService } from '@app/services/game.service';
import { MessageType } from '@app/classes/message';
import { PlayerHand } from '@app/classes/player-hand';

const BOUNDARY = 16;
const CHARCODE_OF_A = 97;
const CENTER_TILE = 'h8';
const WILDCARD = '*';

@Injectable({
    providedIn: 'root',
})
export class LetterPlacingService {
    private position: string;
    private word: string;
    private turnState: boolean;

    private letters: Map<string, string>;

    constructor(private textboxService: TextboxService, private gameService: GameService) {
        this.gameService.turnState.subscribe({
            next: (turn: boolean) => (this.turnState = turn),
        });
    }

    validateCommand(position: string, word: string): boolean {
        this.position = position;
        this.word = word;

        if (!(this.isMyTurn() && this.isValidParam() && this.isInBounds() && this.isInDict())) {
            return false;
        }
        this.letters = new Map<string, string>();
        this.generateLetters();

        const canPlace = this.isChaining() && this.isInHand();
        if (canPlace) {
            this.placeLetters();
            this.replenishHand();
            this.updateScore();
        }
        return canPlace;
    }

    generateLetters() {
        const wildCard = /[A-Z]/;

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const startX = Number(this.position.slice(1, -1));
        const startY = this.position.charAt(0);
        const direction = this.position.charAt(this.position.length - 1);
        const letters = this.word.split('');

        if (direction === 'h') {
            letters.forEach((letter, index) => {
                this.letters.set(startY + String(startX + index), wildCard.test(letter) ? WILDCARD : letter);
            });
        } else {
            letters.forEach((letter, index) => {
                this.letters.set(String.fromCharCode(startY.charCodeAt(0) + index) + String(startX), wildCard.test(letter) ? WILDCARD : letter);
            });
        }
    }

    placeLetters(): void {
        Array.from(this.letters.entries()).forEach((entry) => {
            this.gameService.gameBoard.placeLetter(entry[0], entry[1]);
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    replenishHand(): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    updateScore(): void {}

    isValidParam(): boolean {
        const validPosition = /[a-o](?:1[0-5]|[1-9])[vh]/;
        const validWord = /[a-zA-Z]+/;

        const isValid: boolean = this.word !== undefined && validPosition.test(this.position) && validWord.test(this.word);
        if (!isValid) {
            this.textboxService.sendMessage(MessageType.System, 'La commande !placer requiert des paramètres valides');
        }
        return isValid;
    }

    isMyTurn(): boolean {
        // FIXME: temp bypass
        return true;
        // eslint-disable-next-line no-unreachable
        if (!this.turnState) {
            this.textboxService.sendMessage(MessageType.System, 'La commande !placer peut seulement être utilisé lors de votre tour');
        }
        return this.turnState;
    }

    isInBounds(): boolean {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const startX = Number(this.position.slice(1, -1));
        const startY = this.position.charCodeAt(0) - CHARCODE_OF_A;
        const direction = this.position.charAt(this.position.length - 1);

        const inBounds: boolean = direction === 'h' ? startX + this.word.length <= BOUNDARY : startY + this.word.length < BOUNDARY;
        if (!inBounds) {
            this.textboxService.sendMessage(MessageType.System, 'Le mot ne peut être placé à cet endroit car il dépasserait le plateau');
        }
        return inBounds;
    }

    isInDict(): boolean {
        return true;
    }

    isChaining(): boolean {
        let isChaining: boolean;
        if (this.gameService.gameBoard.size() === 0) {
            isChaining = this.letters.has(CENTER_TILE);
            if (!isChaining) {
                this.textboxService.sendMessage(MessageType.System, 'Le mot doit toucher la case H8 lors du premier tour');
            }
            return isChaining;
        }
        const overlaps = Array.from(this.letters.entries()).filter((entry) => this.gameService.gameBoard.hasLetter(entry[0]));
        if (overlaps) {
            isChaining = overlaps.every((entry) => this.gameService.gameBoard.getLetter(entry[0]) === entry[1]);
            if (!isChaining) {
                this.textboxService.sendMessage(MessageType.System, 'Le mot cause un conflit avec des lettres déjà placées');
            }
            overlaps.forEach((entry) => this.letters.delete(entry[0]));
        } else {
            isChaining = false;
            this.textboxService.sendMessage(MessageType.System, 'Le mot doit toucher au moins une lettre déjà placée');
        }
        return isChaining;
    }

    isInHand(): boolean {
        const letters = Array.from(this.letters.values());
        const testHand = new PlayerHand();
        letters.forEach((letter) => testHand.add(letter));

        // using unique set of letters in word as key, compare to amount of letters in hand
        const isInHand = [...new Set<string>(letters)].every((letter) => {
            const amountRequired = testHand.get(letter);
            const amountInHand = this.gameService.playerHand.get(letter);
            return amountRequired !== undefined && amountInHand !== undefined ? amountRequired <= amountInHand : false;
        });
        if (!isInHand) {
            this.textboxService.sendMessage(
                MessageType.System,
                'Le mot ne peut être placé car il contient des lettres qui ne sont pas dans votre main',
            );
        }
        return isInHand;
    }
}
