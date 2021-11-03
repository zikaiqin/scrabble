import { Injectable } from '@angular/core';
import { GameBoard } from '@app/classes/game-board';
import { MessageType } from '@app/classes/message';
import { PlayerHand } from '@app/classes/player-hand';
import { TextboxService } from '@app/services/textbox.service';
import { WebsocketService } from '@app/services/websocket.service';

@Injectable({
    providedIn: 'root',
})
export class LetterPlacingService {
    startCoords: string;
    endCoords: string;
    direction: string;
    word: string;
    letters: Map<string, string>;
    gameBoard: GameBoard;

    private turnState: boolean;
    private playerHand: PlayerHand = new PlayerHand();

    constructor(private textboxService: TextboxService, private websocketService: WebsocketService) {
        this.websocketService.turn.subscribe((turn) => {
            this.turnState = turn;
        });
        this.websocketService.board.subscribe((letters) => {
            this.gameBoard.letters = new Map<string, string>(letters);
        });
        this.websocketService.hands.subscribe((hands) => {
            this.playerHand.letters = hands.ownHand;
        });
    }

    /**
     * @description Wrapper function that calls all validation functions
     * @param position the position parameter entered by the player
     * @param word the word entered by the player
     */

    validateCommand(position: string, word: string): boolean {
        if (!(this.isMyTurn(this.turnState) && this.isValidParam(position, word) && this.isInBounds(this.startCoords, this.direction, this.word))) {
            return false;
        }
        this.letters = new Map<string, string>();
        this.generateLetters(this.letters, this.word, this.startCoords, this.direction);

        return this.isAdjacent(this.gameBoard, this.letters, this.startCoords, this.endCoords) && this.isInHand(this.letters, this.playerHand);
    }

    /**
     * @description Generate a map of coords/letter pairs from startCoords and direction
     */
    generateLetters(letters: Map<string, string>, word: string, startCoords: string, direction: string): void {
        word.split('').forEach((letter, index) => {
            if (direction === 'h') {
                letters.set(startCoords.charAt(0) + String(Number(startCoords.slice(1)) + index), letter);
            } else {
                letters.set(String.fromCharCode(startCoords.charCodeAt(0) + index) + startCoords.slice(1), letter);
            }
        });
    }

    /**
     * @description Assert that the position parameter entered in textbox is valid
     * @param position the position parameter entered by the player
     * @param word the word entered by the player
     */
    isValidParam(position: string, word: string): boolean {
        const validPosition = /[a-o](?:1[0-5]|[1-9])[vh]/;
        const validWord = /^[a-zA-Z]+$/;
        let isValid = false;
        if (word !== undefined) {
            word = word
                .split('')
                .map((letter) => this.mapSpecialChars(letter))
                .join('');
            isValid = validPosition.test(position) && validWord.test(word);
        }
        if (!isValid) {
            this.textboxService.displayMessage(MessageType.System, 'La commande !placer requiert des paramètres valides');
        } else {
            this.startCoords = position.slice(0, position.length - 1);
            this.direction = position.charAt(position.length - 1);
            this.word = word;
        }
        return isValid;
    }

    /**
     * @description Assert that it is the player's turn
     */
    isMyTurn(isMyTurn: boolean | undefined): boolean {
        if (!isMyTurn) {
            this.textboxService.displayMessage(MessageType.System, 'La commande !placer peut seulement être utilisé lors de votre tour');
        }
        return Boolean(isMyTurn);
    }

    /**
     * @description Assert that no letters are being placed out of bounds
     */
    isInBounds(startCoords: string, direction: string, word: string): boolean {
        let endCoords: string;
        if (direction === 'h') {
            endCoords = startCoords.charAt(0) + String(Number(startCoords.slice(1)) + word.length - 1);
        } else {
            endCoords = String.fromCharCode(startCoords.charCodeAt(0) + word.length - 1) + startCoords.slice(1);
        }
        const inBounds: boolean = endCoords.charAt(0) < 'p' && Number(endCoords.slice(1)) <= BOUNDARY;
        if (!inBounds) {
            this.textboxService.displayMessage(MessageType.System, 'Le mot ne peut être placé à cet endroit car il dépasserait le plateau');
        } else {
            this.endCoords = endCoords;
        }
        return inBounds;
    }

    /**
     * @description Assert that the letters are adjacent to at least one existing letter
     * @description Assert that overlapping letters match the ones on the board
     * @description Remove overlapping letters from letters to be placed
     */
    isAdjacent(gameBoard: GameBoard, toPlace: Map<string, string>, startCoords: string, endCoords: string): boolean {
        let isAdjacent: boolean;
        if (gameBoard.size() === 0) {
            isAdjacent = toPlace.has(CENTER_TILE);
            if (!isAdjacent) {
                this.textboxService.displayMessage(MessageType.System, 'Le mot doit toucher la case H8 lors du premier tour');
            }
            return isAdjacent;
        }
        const overlaps = Array.from(toPlace.entries()).filter((entry) => gameBoard.hasCoords(entry[0]));
        if (overlaps) {
            isAdjacent = overlaps.every((entry) => gameBoard.getLetter(entry[0]) === entry[1]);
            if (!isAdjacent) {
                this.textboxService.displayMessage(MessageType.System, 'Le mot cause un conflit avec des lettres déjà placées');
                return false;
            }
            overlaps.forEach((entry) => toPlace.delete(entry[0]));
            this.letters = toPlace;
        }
        const cornerTiles: string[] = [
            String.fromCharCode(startCoords.charCodeAt(0) - 1) + String(Number(startCoords.slice(1)) - 1),
            String.fromCharCode(startCoords.charCodeAt(0) - 1) + String(Number(endCoords.slice(1)) + 1),
            String.fromCharCode(endCoords.charCodeAt(0) + 1) + String(Number(startCoords.slice(1)) - 1),
            String.fromCharCode(endCoords.charCodeAt(0) + 1) + String(Number(endCoords.slice(1)) + 1),
        ];
        const cornerCoords = {
            startX: startCoords.slice(1) === '1' ? 1 : Number(startCoords.slice(1)) - 1,
            startY: startCoords.charAt(0) === 'a' ? 'a'.charCodeAt(0) : startCoords.charCodeAt(0) - 1,
            endX: endCoords.slice(1) === '15' ? BOUNDARY : Number(endCoords.slice(1)) + 1,
            endY: endCoords.charAt(0) === 'o' ? 'o'.charCodeAt(0) : endCoords.charCodeAt(0) + 1,
        };
        const xRange: string[] = Array.from(Array(cornerCoords.endX - cornerCoords.startX + 1).keys(), (x) => String(x + cornerCoords.startX));
        const yRange: string[] = Array.from(Array(cornerCoords.endY - cornerCoords.startY + 1).keys(), (y) =>
            String.fromCharCode(y + cornerCoords.startY),
        );
        const adjacentTiles: string[] = xRange
            .map((x) => yRange.map((y) => y + x))
            .reduce((flatArray, currentArray) => flatArray.concat(currentArray))
            .filter((coords) => !toPlace.has(coords) && !cornerTiles.includes(coords));

        isAdjacent = adjacentTiles.some((coords) => gameBoard.hasCoords(coords));
        if (!isAdjacent) {
            this.textboxService.displayMessage(MessageType.System, 'Le mot doit toucher au moins une lettre déjà placée');
        }
        return isAdjacent;
    }

    /**
     * @description Assert that the player has the required letters in hand
     */
    isInHand(expectedHand: Map<string, string>, actualHand: PlayerHand): boolean {
        const letters = Array.from(expectedHand.values());
        const testHand: PlayerHand = new PlayerHand();
        letters.forEach((letter) => testHand.add(WILDCARD_RE.test(letter) ? WILDCARD : letter));

        // using unique set of letters in word as key, compare to amount of letters in hand
        const isInHand: boolean = [...new Set<string>(testHand.letters)].every((letter) => {
            const amountRequired = testHand.get(letter);
            const amountInHand = actualHand.get(letter);
            return amountRequired <= amountInHand;
        });
        if (!isInHand) {
            this.textboxService.displayMessage(
                MessageType.System,
                'Le mot ne peut être placé car il contient des lettres qui ne sont pas dans votre main',
            );
        }
        return isInHand;
    }

    mapSpecialChars(letter: string): string | undefined {
        const specialChars = /[àèùéâêîôûëïüç]/i;
        return specialChars.test(letter) ? SPECIAL_CHARS.get(letter) : letter;
    }
}

const BOUNDARY = 15;
const CENTER_TILE = 'h8';
const WILDCARD = '*';
const WILDCARD_RE = /[A-Z]/;
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
