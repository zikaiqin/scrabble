import { Injectable } from '@angular/core';
import { GameService } from './game.service';
import { DEFAULT_POINTS } from '@app/classes/game-config';
import { Vec2 } from '@app/classes/vec2';
import * as data from 'src/assets/dictionnary.json';

const ASCII_SMALL_A = 97;
const BINGO_BONUS = 50;
const BINGO_WORD = 7;
const BOARD_SIZE = 14;

enum Bonuses {
    L2 = 'Lx2',
    L3 = 'Lx3',
    W2 = 'Wx2',
    W3 = 'Wx3',
}

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    startCoord: Vec2;
    index = 1;
    coordContainer: Map<string, number>; // Contains the formed words associated with an index where the letter is placed
    newWord: Map<string, string>;

    private dictionnary = JSON.parse(JSON.stringify(data));

    constructor(private gameService: GameService) {}

    init(startCoords: string, word: Map<string, string>) {
        this.startCoord = {
            x: Number(startCoords.charAt(0)),
            y: Number(startCoords.slice(1)),
        };
        this.newWord = word;
        this.coordContainer = new Map<string, number>();
    }

    fetchWords(): string[] {
        const wordContainer: string[] = [];
        let orientation = -1;
        if (this.newWord.size >= 2) {
            let tempWord = '';
            // Adds the word that he placed since a word has a minimum of a length of 2
            for (const i of this.newWord) {
                orientation = this.startCoord.x - Number(i[0].toLowerCase()[0]);
                tempWord += i[1].toLowerCase();
            }
            wordContainer.push(tempWord);
            this.coordContainer.set(tempWord, 0);
            // Checks if the words is oriented horizontally or vertically
            if (orientation === 0) {
                for (const i of this.newWord) {
                    wordContainer.push(this.verticalCheck(i[0]));
                }
            } else if (orientation > 0) {
                for (const i of this.newWord) {
                    wordContainer.push(this.horizontalCheck(i[0]));
                }
            }
        } else {
            // IF the player only placed 1 letter on the board
            wordContainer.push(this.verticalCheck(String.fromCharCode(this.startCoord.x) + String(this.startCoord.y)));
            wordContainer.push(this.horizontalCheck(String.fromCharCode(this.startCoord.x) + String(this.startCoord.y)));
        }
        return wordContainer;
    }

    variableReset(): void {
        this.index = 1;
    }

    verticalCheck(coord: string): string {
        const xIndex = coord.toLowerCase()[0].charCodeAt(0);
        const yIndex = coord.slice(1, coord.length);
        let tempWord = '';
        // Scanning through the small indexes
        for (this.index; xIndex - this.index >= ASCII_SMALL_A; this.index++) {
            if (!this.gameService.gameBoard.hasCoords(String.fromCharCode(xIndex - this.index) + yIndex)) break;
        }
        const stringIndex = this.index - 1; // Index of the placed letter
        for (this.index - 1; this.index > 0; this.index--) {
            tempWord += this.gameService.gameBoard.getLetter(String.fromCharCode(xIndex - this.index) + yIndex);
        }
        // Scanning through the big indexes
        for (this.index; xIndex + this.index <= ASCII_SMALL_A + BOARD_SIZE; this.index++) {
            if (!this.gameService.gameBoard.hasCoords(String.fromCharCode(xIndex + this.index) + yIndex)) break;
        }
        for (let j = 0; j < this.index; j++) {
            tempWord += this.gameService.gameBoard.getLetter(String.fromCharCode(this.startCoord.x + this.index) + yIndex);
        }
        this.variableReset();
        this.coordContainer.set(tempWord, stringIndex);
        return tempWord;
    }

    horizontalCheck(coord: string): string {
        const xIndex = coord[0];
        const yIndex = Number(coord.slice(1, coord.length));
        let tempWord = '';
        // Scanning through the small indexes
        for (this.index; yIndex - this.index >= 0; this.index++) {
            if (!this.gameService.gameBoard.hasCoords(xIndex + String(yIndex - this.index))) break;
        }
        const stringIndex = this.index - 1; // Index of the placed letter
        for (this.index - 1; this.index > 0; this.index--) {
            tempWord += this.gameService.gameBoard.getLetter(xIndex + String(yIndex - this.index));
        }
        // Scanning through the big indexes
        for (this.index; yIndex + this.index <= BOARD_SIZE; this.index++) {
            if (!this.gameService.gameBoard.hasCoords(xIndex + String(yIndex + this.index))) break;
        }
        for (let j = 0; j < this.index; j++) {
            tempWord += this.gameService.gameBoard.getLetter(xIndex + String(yIndex + this.index));
        }
        this.variableReset();
        this.coordContainer.set(tempWord, stringIndex);
        return tempWord;
    }

    findWord(words: string[]): boolean {
        return words.every((word: string) => {
            return (
                word.length >= 2 &&
                !(word.includes('-') || word.includes("'")) &&
                this.dictionnary.words.some((actualWord: string) => word === actualWord)
            );
        });
    }

    calcPoints(): number {
        let counter = 0;
        let w2 = false;
        let w3 = false;
        const tempMap: Map<string, string | undefined> = new Map();

        // Associating which letter amongst the placed letters has bonus attached to it in tempMap
        for (const letter of this.newWord) {
            if (this.gameService.gameBoard.bonuses.has(letter[0])) {
                tempMap.set(letter[1], this.gameService.gameBoard.getBonus(letter[0]));
            }
        }

        for (const word of this.coordContainer) {
            let tempPoints = 0;
            for (let letter = 0; letter < word[0].length; letter++) {
                // IF letter is the one that is placed AND has a bonus attached to it
                if (letter === word[1] && tempMap.has(word[0][letter])) {
                    const bonus = tempMap.get(word[0][letter]);
                    switch (bonus) {
                        case Bonuses.L2: {
                            tempPoints += (DEFAULT_POINTS.get(word[0][letter]) as number) * 2;
                            break;
                        }
                        case Bonuses.L3: {
                            tempPoints += (DEFAULT_POINTS.get(word[0][letter]) as number) * 3;
                            break;
                        }
                        case Bonuses.W2: {
                            tempPoints += DEFAULT_POINTS.get(word[0][letter]) as number;
                            w2 = true;
                            break;
                        }
                        case Bonuses.W3: {
                            tempPoints += DEFAULT_POINTS.get(word[0][letter]) as number;
                            w3 = true;
                            break;
                        }
                    }
                } else tempPoints += DEFAULT_POINTS.get(word[0][letter]) as number;
            }
            counter += tempPoints;
            if (w2) {
                counter *= 2;
                w2 = false;
            }
            if (w3) {
                counter *= 3;
                w3 = false;
            }
        }
        // IF the player placed all of his hand, gains 50 pts
        if (this.newWord.size === BINGO_WORD) counter += BINGO_BONUS;

        return counter;
    }
}
