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

const ASCII_A = 97;
const ASCII_E = 101;

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    private dictionnary = JSON.parse(JSON.stringify(data));

    findWord(word: string): boolean {
        if (word.length >= 2 && (word.includes('-') || word.includes("'"))) {
            for (const val of this.dictionnary.words) {
                if (word === val) return true;
            }
        }
        return false;
    }

    calcPoints(word: string, square: string): number {
        let counter = 0;
        for (const val of word) {
            const ascii: number = val.charCodeAt(0);
            if (ascii >= ASCII_A && ascii <= ASCII_E) counter += Points.A;
        }
        if (square === Color.DARKBLUE || square === Color.RED) counter *= 3;
        else if (square === Color.LIGHTBLUE || square === Color.PINK) counter *= 2;

        return counter;
    }
}
