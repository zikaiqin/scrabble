import { Injectable } from '@angular/core';
import { BoardCoords } from '@app/classes/board-coords';
import * as data from 'src/assets/dictionnary.json';
import { GameService } from './game.service';
import { tableau } from './tableau.config';

enum Color {
    LIGHTBLUE = 'light_blue',
    DARKBLUE = 'dark_blue',
    PINK = 'pink',
    RED = 'red',
}

enum Points {
    A = 1,
    B = 1,
    C = 1,
    D = 1,
    E = 1,
    F = 1,
    G = 1,
    H = 1,
    I = 1,
    J = 1,
    K = 1,
    L = 1,
    M = 1,
    N = 1,
    O = 1,
    P = 1,
    Q = 1,
    R = 1,
    S = 1,
    T = 1,
    U = 1,
    V = 1,
    W = 1,
    X = 1,
    Y = 1,
    Z = 1,
}

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
        const wordContainer: string[] = [];
        // Assuming I have the placing coords
        const coord: BoardCoords = { x: 0, y: 0 };

        // Horizontal negative check
        let i = 1;
        for (i; coord.x - i >= 0; i++) {
            if (this.gameService.boardState.has({ x: coord.x - i, y: coord.y })) continue;
            else break;
        }
        for (i; i > 0; i--) {
            tempWord += this.gameService.boardState.get({ x: coord.x - i, y: coord.y });
        }

        // Horizontal positive check
        for (i; coord.x + i <= BOARD_SIZE; i++) {
            if (this.gameService.boardState.has({ x: coord.x + i, y: coord.y })) continue;
            else break;
        }
        for (let j = 0; j <= i; j++) {
            tempWord += this.gameService.boardState.get({ x: coord.x + j, y: coord.y });
        }
        wordContainer.push(tempWord);
        tempWord = '';

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

    calcPoints(word: string[], square: string[]): number {
        // CHANGE FUNCTION FOR ARRAY OF WORDS AND NOT A WORD
        let counter = 0;
        for (const char of word) {
            const ascii: number = char.charCodeAt(0);
            if (ascii >= ASCII_SMALL_A && ascii <= ASCII_SMALL_E) counter += Points.A;
        }
        for (const color in square) {
            if (color === Color.DARKBLUE || color === Color.RED) counter *= 3;
            else if (color === Color.LIGHTBLUE || color === Color.PINK) counter *= 2;
        }
        if (word.length === FULL_WORD) counter += WORD_BONUS; // Need to take into placed letter, not word length

        return counter;
    }
}
