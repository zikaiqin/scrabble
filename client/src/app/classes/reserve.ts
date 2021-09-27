export class Reserve {
    readonly letters: string[];
    size: number;

    constructor() {
        this.letters = Object.assign([], BASE_RESERVE);
        this.size = this.letters.length;
    }

    draw(): string | undefined {
        if (this.size <= 0) {
            return undefined;
        }
        const index = Math.floor(Math.random() * this.size);
        const removedLetter: string = this.letters[index];
        this.letters.splice(index, 1);
        return removedLetter;
    }

    exchangeLetters(hand: string[], lettersToBeRemoved: string[], reserve: string[]): number {
        if (reserve.length < 7) return -1;
        else {
            for (let i = 0; i < lettersToBeRemoved.length; i++) {
                hand.splice(hand.indexOf(lettersToBeRemoved[i]), 1);
            }
            // this.moveLettersToHand(hand, reserve, lettersToBeRemoved.length);
            reserve.push(...lettersToBeRemoved);
            return 1;
        }
    }
}

const BASE_RESERVE: string[] = [
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'a',
    'b',
    'b',
    'c',
    'c',
    'd',
    'd',
    'd',
    'e',
    'e',
    'e',
    'e',
    'e',
    'e',
    'e',
    'e',
    'e',
    'e',
    'e',
    'e',
    'e',
    'e',
    'e',
    'f',
    'f',
    'g',
    'g',
    'h',
    'h',
    'i',
    'i',
    'i',
    'i',
    'i',
    'i',
    'i',
    'i',
    'j',
    'k',
    'l',
    'l',
    'l',
    'l',
    'l',
    'm',
    'm',
    'm',
    'n',
    'n',
    'n',
    'n',
    'n',
    'n',
    'o',
    'o',
    'o',
    'o',
    'o',
    'o',
    'p',
    'p',
    'q',
    'r',
    'r',
    'r',
    'r',
    'r',
    'r',
    's',
    's',
    's',
    's',
    's',
    's',
    't',
    't',
    't',
    't',
    't',
    't',
    'u',
    'u',
    'u',
    'u',
    'u',
    'u',
    'v',
    'v',
    'w',
    'x',
    'y',
    'z',
    '*',
    '*',
];
