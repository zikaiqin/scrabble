export class PlayerHand {
    readonly letters: string[];
    size: number;

    constructor() {
        this.letters = [];
        this.size = 0;
    }

    has(letter: string): boolean {
        return this.letters.includes(letter);
    }

    get(letter: string): number {
        return this.letters.filter((letterInHand) => letterInHand === letter).length;
    }

    add(letter: string): void {
        this.letters.push(letter);
        this.size++;
    }

    addAll(letters: string[]): void {
        this.letters.push(...letters);
        this.size += letters.length;
    }

    remove(letter: string): void {
        const index = this.letters.indexOf(letter);
        if (index >= 0) {
            this.letters.splice(index, 1);
            this.size--;
        }
    }
}
