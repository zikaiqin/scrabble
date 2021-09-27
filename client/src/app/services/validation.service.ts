import { Injectable } from '@angular/core';
import * as data from 'src/assets/dictionnary.json';
import { GameService } from './game.service';
import { tableau } from './tableau.config';

const ASCII_SMALL_A = 97;
const ASCII_SMALL_E = 101;
const WORD_BONUS = 50;
const FULL_WORD = 7;
const BOARD_SIZE = 14;

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    private dictionnary = JSON.parse(JSON.stringify(data));
    private board = tableau;

    constructor(private gameService: GameService) {}

    fetchWords(): string[] {
        let tempWord = '';
        let checkWord = '';
        const wordContainer: string[] = [];
        // Assuming I have the placing coords
        const coord = { x: 0, y: 0 };

        // Horizontal negative check
        let i = 1;
        for (i; coord.x - i >= 0; i++) {
            if (this.gameService.gameBoard.hasLetter((checkWord = String(coord.x - i) + String(coord.y)))) continue;
            else break;
        }
        for (i; i > 0; i--) {
            tempWord += this.gameService.gameBoard.getLetter((checkWord = String(coord.x - i) + String(coord.y)));
        }

        // Horizontal positive check
        for (i; coord.x + i <= BOARD_SIZE; i++) {
            if (this.gameService.gameBoard.hasLetter((checkWord = String(coord.x + i) + String(coord.y)))) continue;
            else break;
        }
        for (let j = 0; j <= i; j++) {
            tempWord += this.gameService.gameBoard.getLetter((checkWord = String(coord.x + i) + String(coord.y)));
        }
        wordContainer.push(tempWord);

        tempWord = '';
        i = 1;

        // Vertical negative check
        for (i; coord.y - i >= 0; i++) {
            if (this.gameService.gameBoard.hasLetter((checkWord = String(coord.x) + String(coord.y - i)))) continue;
            else break;
        }
        for (i; i > 0; i--) {
            tempWord += this.gameService.gameBoard.getLetter((checkWord = String(coord.x) + String(coord.y - i)));
        }

        // Vertical positive check
        for (i; coord.y + i <= BOARD_SIZE; i++) {
            if (this.gameService.gameBoard.hasLetter((checkWord = String(coord.x) + String(coord.y + i)))) continue;
            else break;
        }
        for (let j = 0; j <= i; j++) {
            tempWord += this.gameService.gameBoard.getLetter((checkWord = String(coord.x) + String(coord.y + i)));
        }
        wordContainer.push(tempWord);

        return wordContainer;
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

    calcPoints(words: string[], square: string[]): number {
        // CHANGE FUNCTION FOR ARRAY OF WORDS AND NOT A WORD
        // let counter = 0;
        // for (const char of checkWord) {
        //     const ascii: number = char.charCodeAt(0);
        //     if (ascii >= ASCII_SMALL_A && ascii <= ASCII_SMALL_E) counter += Points.A;
        // }
        // for (const color in square) {
        //     if (color === Color.DARKBLUE || color === Color.RED) counter *= 3;
        //     else if (color === Color.LIGHTBLUE || color === Color.PINK) counter *= 2;
        // }
        // if  checkWord.length === FULL_WORD) counter += WORD_BONUS; // Need to take into placed letter, not checkWord length

        return 1;
    }
}
