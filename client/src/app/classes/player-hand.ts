export class PlayerHand {
    readonly letters: string[];

    constructor() {
        this.letters = [];
    }

    has(letter: string): boolean {
        return this.letters.includes(letter);
    }

    get(letter: string): number {
        return this.letters.filter((letterInHand) => letterInHand === letter).length;
    }

    add(letter: string): void {
        this.letters.push(letter);
    }

    addAll(letters: string[]): void {
        this.letters.push(...letters);
    }

    remove(letter: string): void {
        const index = this.letters.indexOf(letter);
        if (index >= 0) {
            this.letters.splice(index, 1);
        }
    }

    get size(): number {
        return this.letters.length;
    }
}
