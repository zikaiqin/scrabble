import { Injectable } from '@angular/core';
import { MessageType } from '@app/classes/message';
import { PlayerHand } from '@app/classes/player-hand';
import { GameService } from '@app/services/game.service';
import { TextboxService } from '@app/services/textbox.service';
<<<<<<< HEAD
=======
import { ValidationService } from '@app/services/validation.service';
>>>>>>> develop

const BOUNDARY = 15;
const VALIDATION_TIMEOUT = 3000;
const CENTER_TILE = 'h8';
const WILDCARD = '*';
const SPECIAL_CHARS = new Map<string, string>([
    ['à', 'a'],
    ['è', 'e'],
    ['ù', 'u'],
    ['é', 'e'],
    ['â', 'a'],
    ['ê', 'e'],
    ['î', 'i'],
    ['ô', 'o'],
    ['û', 'u'],
    ['ë', 'e'],
    ['ï', 'i'],
    ['ü', 'u'],
    ['ç', 'c'],
    ['À', 'A'],
    ['È', 'E'],
    ['Ù', 'U'],
    ['É', 'E'],
    ['Â', 'A'],
    ['Ê', 'E'],
    ['Î', 'I'],
    ['Ô', 'O'],
    ['Û', 'U'],
    ['Ë', 'E'],
    ['Ï', 'I'],
    ['Ü', 'U'],
    ['Ç', 'C'],
]);

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

    constructor(private textboxService: TextboxService, private gameService: GameService, private validationService: ValidationService) {
        this.gameService.turnState.subscribe({
            next: (turn: boolean) => (this.turnState = turn),
        });
    }

    /**
     * @description Wrapper function that calls all validation functions
     * @param position the position parameter entered by the player
     * @param word the word entered by the player
     */
    
    validateCommand(position: string, word: string): boolean {
        this.word = word
            .split('')
            .map((letter) => this.mapSpecialChars(letter))
            .join('');

        if (!(this.isMyTurn() && this.isValidParam(position) && this.isInBounds())) {
            return false;
        }
        this.letters = new Map<string, string>();
        this.generateLetters();

        const canPlace = this.isAdjacent() && this.isInHand();
        if (canPlace) {
            this.placeLetters();
            this.validationService.init(this.startCoords, this.letters);
            this.isInDict();
        }
        return canPlace;
    }

    /**
     * @description Generate a map of coords/letter pairs from startCoords and direction
     */
    generateLetters(): void {
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

    /**
     * @description Place the letters onto the board
     */
    placeLetters(): void {
        Array.from(this.letters.entries()).forEach((entry) => {
            this.gameService.gameBoard.placeLetter(entry[0], entry[1]);
            this.gameService.playerHand.remove(entry[1]);
        });
    }

    /**
     * @description Remove the placed letters from the board and return them to the hand
     */
    returnLetters(): void {
        Array.from(this.letters.entries()).forEach((entry) => {
            this.gameService.gameBoard.removeAt(entry[0]);
            this.gameService.playerHand.add(entry[1]);
        });
    }

    /**
     * @description Draw as many letters as possible from the reserve and place them into the hand
     */
    replenishHand(): void {
        Array.from(this.letters.keys()).forEach(() => {
            const letter = this.gameService.reserve.drawOne();
            if (letter !== undefined) {
                this.gameService.playerHand.add(letter);
            }
        });
    }

    /**
     * @description Assert that the position parameter entered in textbox is valid
     * @param position the position parameter entered by the player
     */
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

    /**
     * @description Assert that it is the player's turn
     */
    isMyTurn(): boolean {
        if (!this.turnState) {
            this.textboxService.sendMessage(MessageType.System, 'La commande !placer peut seulement être utilisé lors de votre tour');
        }
        return this.turnState;
    }

    /**
     * @description Assert that no letters are being placed out of bounds
     */
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

    /**
     * @description Assert that the letters are adjacent to at least one existing letter
     * @description Assert that overlapping letters match the ones on the board
     * @description Remove overlapping letters from letters to be placed
     */
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

    /**
     * @description Assert that the player has the required letters in hand
     */
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

    /**
     * @description Assert that the newly placed word is included in the dictionary
     */
    isInDict(): boolean {
        const isInDict = this.validationService.findWord(this.validationService.fetchWords());
        setTimeout(() => {
            if (isInDict) {
                this.gameService.playerScore += this.validationService.calcPoints();
                this.replenishHand();
            } else {
                this.textboxService.sendMessage(MessageType.System, 'Le mot ne figure pas dans le dictionnaire de jeu');
                this.returnLetters();
            }
            this.gameService.turnState.next(!this.turnState);
        }, VALIDATION_TIMEOUT);
        return isInDict;
    }

    mapSpecialChars(letter: string): string | undefined {
        const specialChars = /[àèùéâêîôûëïüç]/i;
        return specialChars.test(letter) ? SPECIAL_CHARS.get(letter) : letter;
    }
}
