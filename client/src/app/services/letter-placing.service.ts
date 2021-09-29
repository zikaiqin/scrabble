import { Injectable } from '@angular/core';
import { TextboxService } from '@app/services/textbox.service';
import { GameService } from '@app/services/game.service';
import { MessageType } from '@app/classes/message';
import { PlayerHand } from '@app/classes/player-hand';

const BOUNDARY = 15;
const CENTER_TILE = 'h8';
const WILDCARD = '*';

@Injectable({
    providedIn: 'root',
})
export class LetterPlacingService {
    private turnState: boolean;

    private startCoords: string;
    private endCoords: string;
    private direction: string;
    private word: string;
    private letters: Map<string, string>;

    constructor(private textboxService: TextboxService, private gameService: GameService) {
        this.gameService.turnState.subscribe({
            next: (turn: boolean) => (this.turnState = turn),
        });
    }

    validateCommand(position: string, word: string): boolean {
        this.word = word;

        if (!(this.isMyTurn() && this.isValidParam(position) && this.isInBounds())) {
            return false;
        }
        this.letters = new Map<string, string>();
        this.generateLetters();

        const canPlace = this.isAdjacent() && this.isInHand();
        if (canPlace) {
            this.placeLetters();
            this.updateScore();
            this.gameService.turnState.next(!this.turnState);
        }
        return canPlace;
    }

    generateLetters() {
        const letters = this.word.split('');

        if (this.direction === 'h') {
            letters.forEach((letter, index) => {
                this.letters.set(this.startCoords.charAt(0) + String(Number(this.startCoords.slice(1)) + index), letter);
            });
        } else {
            letters.forEach((letter, index) => {
                this.letters.set(String.fromCharCode(this.startCoords.charCodeAt(0) + index) + this.startCoords.slice(1), letter);
            });
        }
    }

    placeLetters(): void {
        Array.from(this.letters.entries()).forEach((entry) => {
            this.gameService.gameBoard.placeLetter(entry[0], entry[1]);
            this.gameService.playerHand.remove(entry[1]);

            const letter = this.gameService.reserve.drawOne();
            if (letter !== undefined) {
                this.gameService.playerHand.add(letter);
            }
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    updateScore(): void {}

    isValidParam(position: string): boolean {
        const validPosition = /[a-o](?:1[0-5]|[1-9])[vh]/;
        const validWord = /[a-zA-Z]+/;

        const isValid: boolean = this.word !== undefined && validPosition.test(position) && validWord.test(this.word);
        if (!isValid) {
            this.textboxService.sendMessage(MessageType.System, 'La commande !placer requiert des paramètres valides');
        } else {
            this.startCoords = position.slice(0, position.length - 1);
            this.direction = position.charAt(position.length - 1);
        }
        return isValid;
    }

    isMyTurn(): boolean {
        if (!this.turnState) {
            this.textboxService.sendMessage(MessageType.System, 'La commande !placer peut seulement être utilisé lors de votre tour');
        }
        return this.turnState;
    }

    isInBounds(): boolean {
        if (this.direction === 'h') {
            this.endCoords = this.startCoords.charAt(0) + String(Number(this.startCoords.slice(1)) + this.word.length - 1);
        } else {
            this.endCoords = String.fromCharCode(this.startCoords.charCodeAt(0) + this.word.length - 1) + this.startCoords.slice(1);
        }
        const inBounds: boolean = this.endCoords.charAt(0) < 'p' && Number(this.endCoords.slice(1)) <= BOUNDARY;
        if (!inBounds) {
            this.textboxService.sendMessage(MessageType.System, 'Le mot ne peut être placé à cet endroit car il dépasserait le plateau');
        }
        return inBounds;
    }

    isAdjacent(): boolean {
        let isAdjacent: boolean;
        if (this.gameService.gameBoard.size() === 0) {
            isAdjacent = this.letters.has(CENTER_TILE);
            if (!isAdjacent) {
                this.textboxService.sendMessage(MessageType.System, 'Le mot doit toucher la case H8 lors du premier tour');
            }
            return isAdjacent;
        }
        const overlaps = Array.from(this.letters.entries()).filter((entry) => this.gameService.gameBoard.hasCoords(entry[0]));
        if (overlaps) {
            isAdjacent = overlaps.every((entry) => this.gameService.gameBoard.getLetter(entry[0]) === entry[1]);
            if (!isAdjacent) {
                this.textboxService.sendMessage(MessageType.System, 'Le mot cause un conflit avec des lettres déjà placées');
                return false;
            }
            overlaps.forEach((entry) => this.letters.delete(entry[0]));
        }
        const cornerTiles: string[] = [
            String.fromCharCode(this.startCoords.charCodeAt(0) - 1) + String(Number(this.startCoords.slice(1)) - 1),
            String.fromCharCode(this.startCoords.charCodeAt(0) - 1) + String(Number(this.endCoords.slice(1)) + 1),
            String.fromCharCode(this.endCoords.charCodeAt(0) + 1) + String(Number(this.startCoords.slice(1)) - 1),
            String.fromCharCode(this.endCoords.charCodeAt(0) + 1) + String(Number(this.endCoords.slice(1)) + 1),
        ];
        const cornerCoords = {
            startX: this.startCoords.slice(1) === '1' ? 1 : Number(this.startCoords.slice(1)) - 1,
            startY: this.startCoords.charAt(0) === 'a' ? 'a'.charCodeAt(0) : this.startCoords.charCodeAt(0) - 1,
            endX: this.endCoords.slice(1) === '15' ? BOUNDARY : Number(this.endCoords.slice(1)) + 1,
            endY: this.endCoords.charAt(0) === 'o' ? 'o'.charCodeAt(0) : this.endCoords.charCodeAt(0) + 1,
        };
        const xRange: string[] = Array.from(Array(cornerCoords.endX - cornerCoords.startX + 1).keys(), (x) => String(x + cornerCoords.startX));
        const yRange: string[] = Array.from(Array(cornerCoords.endY - cornerCoords.startY + 1).keys(), (y) =>
            String.fromCharCode(y + cornerCoords.startY),
        );
        const adjacentTiles: string[] = xRange
            .map((x) => yRange.map((y) => y + x))
            .reduce((flatArray, currentArray) => flatArray.concat(currentArray))
            .filter((coords) => !this.letters.has(coords) && !cornerTiles.includes(coords));

        isAdjacent = adjacentTiles.some((coords) => this.gameService.gameBoard.hasCoords(coords));
        if (!isAdjacent) {
            this.textboxService.sendMessage(MessageType.System, 'Le mot doit toucher au moins une lettre déjà placée');
        }
        return isAdjacent;
    }

    isInHand(): boolean {
        const wildCard = /[A-Z]/;
        const letters = Array.from(this.letters.values());
        const testHand: PlayerHand = new PlayerHand();
        letters.forEach((letter) => testHand.add(wildCard.test(letter) ? WILDCARD : letter));

        // using unique set of letters in word as key, compare to amount of letters in hand
        const isInHand: boolean = [...new Set<string>(letters)].every((letter) => {
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
