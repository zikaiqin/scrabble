import { Injectable } from '@angular/core';
import * as data from 'src/assets/dictionnary.json';
import { GameService } from './game.service';
import { tableau } from './tableau.config';

// const ASCII_SMALL_A = 97;
// const ASCII_SMALL_E = 101;
// const WORD_BONUS = 50;
// const FULL_WORD = 7;
const BOARD_SIZE = 14;

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    index = 1;
    startCoord = { x: 0, y: 0 }; // Assuming I have the command line available
    tempWord = '';
    checkWord = '';
    private dictionnary = JSON.parse(JSON.stringify(data));
    private board = tableau;

    constructor(private gameService: GameService) {}

    fetchWords(): string[] {
        const wordContainer: string[] = [];

        // TODO code checks for word forming for every placed letter and not just the first one
        // Will need the command line to accomplish it
        this.horizontalCheck();
        wordContainer.push(this.tempWord);

        this.tempWord = '';
        this.index = 1;

        this.verticalCheck();
        wordContainer.push(this.tempWord);

        return wordContainer;
    }

    horizontalCheck(): void {
        for (this.index; this.startCoord.x - this.index >= 0; this.index++) {
            if (this.gameService.gameBoard.hasLetter((this.checkWord = String(this.startCoord.x - this.index) + String(this.startCoord.y)))) continue;
            else break;
        }
        for (this.index; this.index > 0; this.index--) {
            this.tempWord += this.gameService.gameBoard.getLetter(
                (this.checkWord = String(this.startCoord.x - this.index) + String(this.startCoord.y)),
            );
        }
        for (this.index; this.startCoord.x + this.index <= BOARD_SIZE; this.index++) {
            if (this.gameService.gameBoard.hasLetter((this.checkWord = String(this.startCoord.x + this.index) + String(this.startCoord.y)))) continue;
            else break;
        }
        for (let j = 0; j <= this.index; j++) {
            this.tempWord += this.gameService.gameBoard.getLetter(
                (this.checkWord = String(this.startCoord.x + this.index) + String(this.startCoord.y)),
            );
        }
    }

    verticalCheck(): void {
        for (this.index; this.startCoord.y - this.index >= 0; this.index++) {
            if (this.gameService.gameBoard.hasLetter((this.checkWord = String(this.startCoord.x) + String(this.startCoord.y - this.index)))) continue;
            else break;
        }
        for (this.index; this.index > 0; this.index--) {
            this.tempWord += this.gameService.gameBoard.getLetter(
                (this.checkWord = String(this.startCoord.x) + String(this.startCoord.y - this.index)),
            );
        }
        for (this.index; this.startCoord.y + this.index <= BOARD_SIZE; this.index++) {
            if (this.gameService.gameBoard.hasLetter((this.checkWord = String(this.startCoord.x) + String(this.startCoord.y + this.index)))) continue;
            else break;
        }
        for (let j = 0; j <= this.index; j++) {
            this.tempWord += this.gameService.gameBoard.getLetter(
                (this.checkWord = String(this.startCoord.x) + String(this.startCoord.y + this.index)),
            );
        }
    }

    findWord(words: string[]): boolean {
        let temp = false;
        for (const itr of words) {
            if (itr.length >= 2 && !(itr.includes('-') || itr.includes("'"))) {
                for (const val of this.dictionnary.words) {
                    if (itr === val) temp = true;
                }
                if (temp === false) return false;
            }
        }
        return true;
    }

    // calcPoints(words: string[], square: string[]): number {
    //     CHANGE FUNCTION FOR ARRAY OF WORDS AND NOT A WORD
    //     let counter = 0;
    //     for (const char of checkWord) {
    //         const ascii: number = char.charCodeAt(0);
    //         if (ascii >= ASCII_SMALL_A && ascii <= ASCII_SMALL_E) counter += Points.A;
    //     }
    //     for (const color in square) {
    //         if (color === Color.DARKBLUE || color === Color.RED) counter *= 3;
    //         else if (color === Color.LIGHTBLUE || color === Color.PINK) counter *= 2;
    //     }
    //     if  checkWord.length === FULL_WORD) counter += WORD_BONUS; // Need to take into placed letter, not checkWord length

    //     return 1;
    // }
}
