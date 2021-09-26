export class PlayerHand {
    readonly letters: Map<string, number>;
    size: number;

    constructor() {
        this.letters = new Map<string, number>();
        this.size = 0;
    }

    has(letter: string): boolean {
        return this.letters.has(letter);
    }

    get(letter: string): number | undefined {
        return this.letters.get(letter);
    }

    add(letter: string): void {
        const number = this.letters.get(letter);
        if (!number) {
            this.letters.set(letter, 1);
        } else {
            this.letters.set(letter, number + 1);
        }
        this.size++;
    }

    remove(letter: string): void {
        const number = this.letters.get(letter);
        if (number) {
            if (number > 1) {
                this.letters.set(letter, number - 1);
            } else {
                this.letters.delete(letter);
            }
            this.size--;
        }
    }
}
