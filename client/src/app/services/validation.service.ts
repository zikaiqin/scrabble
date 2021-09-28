/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as data from 'src/assets/dictionnary.json';
import { GameService } from './game.service';
import { LetterPlacingService } from './letter-placing.service';

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
    startCoord: Vec2 = { x: 0, y: 0 };
    index = 1;
    points: Map<string, number> = new Map()
        .set('a', 1)
        .set('b', 3)
        .set('c', 3)
        .set('d', 2)
        .set('e', 1)
        .set('f', 4)
        .set('g', 2)
        .set('h', 4)
        .set('i', 1)
        .set('j', 8)
        .set('k', 10)
        .set('l', 1)
        .set('m', 2)
        .set('n', 1)
        .set('o', 1)
        .set('p', 3)
        .set('q', 8)
        .set('r', 1)
        .set('s', 1)
        .set('t', 1)
        .set('u', 1)
        .set('v', 4)
        .set('w', 10)
        .set('x', 10)
        .set('y', 10)
        .set('z', 10);

    private dictionnary = JSON.parse(JSON.stringify(data));

    constructor(private gameService: GameService, private letterPlacingService: LetterPlacingService) {
        const keys = this.letterPlacingService.getLetters().keys();
        const keyItr: string = keys.next().value;
        this.startCoord = {
            x: Number(keyItr.toLowerCase()[0]),
            y: Number(keyItr.slice(1, keyItr.length)),
        };
    }

    fetchWords(): string[] {
        const wordContainer: string[] = [];
        let orientation = -1;
        if (this.letterPlacingService.getLetters().size >= 2) {
            let tempWord = '';
            for (const i of this.letterPlacingService.getLetters()) {
                orientation = this.startCoord.x - Number(i[0].toLowerCase()[0]);
                tempWord += i[1].toLowerCase();
            }
            wordContainer.push(tempWord);
        }

        if (orientation === 0) {
            for (const i of this.letterPlacingService.getLetters()) {
                wordContainer.push(this.verticalCheck(i[0]));
            }
        } else if (orientation > 0) {
            for (const i of this.letterPlacingService.getLetters()) {
                wordContainer.push(this.horizontalCheck(i[0]));
            }
        } else {
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
        const yIndex = String(this.startCoord.y);
        let tempWord = '';
        for (this.index; xIndex - this.index >= ASCII_SMALL_A; this.index++) {
            if (this.gameService.gameBoard.hasLetter(String.fromCharCode(xIndex - this.index) + yIndex)) continue;
            else break;
        }
        for (this.index - 1; this.index > 0; this.index--) {
            tempWord += this.gameService.gameBoard.getLetter(String.fromCharCode(xIndex - this.index) + yIndex);
        }
        for (this.index; xIndex + this.index <= ASCII_SMALL_A + BOARD_SIZE; this.index++) {
            if (this.gameService.gameBoard.hasLetter(String.fromCharCode(xIndex + this.index) + yIndex)) continue;
            else break;
        }
        for (let j = 0; j < this.index; j++) {
            tempWord += this.gameService.gameBoard.getLetter(String.fromCharCode(this.startCoord.x + this.index) + yIndex);
        }
        this.variableReset();
        return tempWord;
    }

    horizontalCheck(coord: string): string {
        const xIndex = String.fromCharCode(this.startCoord.x);
        const yIndex = Number(coord.slice(1, coord.length));
        let tempWord = '';
        for (this.index; yIndex - this.index >= 0; this.index++) {
            if (this.gameService.gameBoard.hasLetter(xIndex + String(yIndex - this.index))) continue;
            else break;
        }
        for (this.index - 1; this.index > 0; this.index--) {
            tempWord += this.gameService.gameBoard.getLetter(xIndex + String(yIndex - this.index));
        }
        for (this.index; yIndex + this.index <= BOARD_SIZE; this.index++) {
            if (this.gameService.gameBoard.hasLetter(xIndex + String(yIndex + this.index))) continue;
            else break;
        }
        for (let j = 0; j < this.index; j++) {
            tempWord += this.gameService.gameBoard.getLetter(xIndex + String(yIndex + this.index));
        }
        this.variableReset();
        return tempWord;
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
        return temp;
    }

    calcPoints(words: string[]): number {
        let counter = 0;
        let l2 = false;
        let l3 = false;
        let w2 = false;
        let w3 = false;

        const size = this.letterPlacingService.getLetters().size;
        if (size === BINGO_WORD) counter += BINGO_BONUS;
        else if (size === 1) {
            // Only 2 possible word formed
            const bonus = this.gameService.gameBoard.bonuses.get(String.fromCharCode(this.startCoord.x) + String(this.startCoord.y));
            switch (bonus) {
                case Bonuses.L2: {
                    l2 = true;
                    break;
                }
                case Bonuses.L3: {
                    l3 = true;
                    break;
                }
                case Bonuses.W2: {
                    w2 = true;
                    break;
                }
                case Bonuses.W3: {
                    w3 = true;
                    break;
                }
            }
        }

        for (const itr of this.letterPlacingService.getLetters()) {
            if (this.gameService.gameBoard.bonuses.has(itr[0].toLowerCase())) {
                const bonus = this.gameService.gameBoard.bonuses.get(itr[0].toLowerCase());
                switch (bonus) {
                    case Bonuses.L2: {
                        const temp = (this.points.get(itr[1].toLowerCase()) as number) * 2;
                        counter += temp;
                        l2 = true;
                        break;
                    }
                    case Bonuses.L3: {
                        const temp = (this.points.get(itr[1].toLowerCase()) as number) * 3;
                        counter += temp;
                        l3 = true;
                        break;
                    }
                    case Bonuses.W2: {
                        w2 = true;
                        break;
                    }
                    case Bonuses.W3: {
                        w3 = true;
                        break;
                    }
                }
            }
        }
        if (w2) counter *= 2;
        if (w3) counter *= 3;

        return counter;
    }

    calcWordPoints(word: string): number {
        let counter = 0;
        for (const itr of word) {
            counter += this.points.get(itr[1].toLowerCase()) as number;
        }

        return counter;
    }
}
