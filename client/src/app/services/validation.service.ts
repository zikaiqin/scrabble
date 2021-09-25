import { Injectable } from '@angular/core';
import * as data from 'src/assets/dictionnary.json';
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
    fieldBoard: string[][] = [];
    private dictionnary = JSON.parse(JSON.stringify(data));

    fetchWords(commandLine: string): string[] {
        // Assuming we are working with small letters
        const splitted = commandLine.split(' ');

        // Assuming that !command is within the string
        // Assuming index starts at 0
        const x = splitted[1].charCodeAt(0) - ASCII_SMALL_A;
        const y = Number(splitted[2]) - 1;

        const container: string[] = [];
        let word = '';
        let i = 0;
        let j = 0;
        // Negative horizontal axis
        for (i; y - i >= 0; i++) {
            if (this.fieldBoard[x][y - i] === null) {
                break;
            }
        }
        for (i; i >= 0; i--) {
            word += this.fieldBoard[x][y - i];
        }

        // Positive horizontal axis
        for (i; y + i <= BOARD_SIZE; i++) {
            if (this.fieldBoard[x][y + i] !== null) {
                word += this.fieldBoard[x][y + i];
            }
        }
        container.push(word);
        word = '';
        /* ---------------------------------------------------- */
        // Negative vertical axis
        for (j; x - j >= 0; j++) {
            if (this.fieldBoard[x - j][y] === null) {
                break;
            }
        }
        for (j; j >= 0; j--) {
            word += this.fieldBoard[x - j][y];
        }

        // Positive vertical axis
        for (j; x + j <= BOARD_SIZE; j++) {
            if (this.fieldBoard[x + j][y] !== null) {
                word += this.fieldBoard[x + j][y];
            }
        }
        container.push(word);

        return container;
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
