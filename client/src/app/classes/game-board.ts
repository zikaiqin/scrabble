export class GameBoard {
    // TODO: assign a type to bonuses
    readonly letters: Map<string, string>;
    readonly bonuses: Map<string, string>;

    constructor(bonuses: Map<string, string>) {
        this.letters = new Map<string, string>();
        this.bonuses = new Map<string, string>(bonuses);
    }

    size(): number {
        return this.letters.size;
    }

    hasLetter(coords: string): boolean {
        return this.letters.has(coords);
    }

    placeLetter(coords: string, letter: string): void {
        if (!this.hasLetter(coords)) {
            this.letters.set(coords, letter);
        }
    }

    getLetter(coords: string): string | undefined {
        return this.letters.get(coords);
    }

    // TODO: assign a type to bonuses
    getBonus(coords: string): unknown | undefined {
        return this.bonuses.get(coords);
    }
}
