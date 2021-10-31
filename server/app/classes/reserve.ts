export class Reserve {
    readonly letters: string[];
    size: number;

    constructor() {
        this.letters = Object.assign([], BASE_RESERVE);
        this.size = this.letters.length;
    }

    getSize(): number {
        return this.size;
    }

    drawOne(): string | undefined {
        if (this.size <= 0) {
            return undefined;
        }
        this.size--;
        const index = Math.floor(Math.random() * this.size);
        return this.letters.splice(index, 1)[0];
    }

    draw(amount: number): string[] | undefined {
        const letters: string[] = [];
        for (let i = 0; i < amount; i++) {
            const letter = this.drawOne();
            if (letter !== undefined) {
                letters.push(letter);
            } else return undefined;
        }
        return letters;
    }

    receiveOne(word: string): void {
        this.letters.push(word);
        this.size++;
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