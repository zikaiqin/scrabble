export class GameBoard {
    // TODO: assign a type to bonuses
    readonly letters: Map<string, string>;
    readonly bonuses: Map<string, unknown>;

    constructor(bonuses: Map<string, unknown>) {
        this.letters = new Map<string, string>();
        this.bonuses = new Map<string, unknown>(bonuses);
    }

    size(): number {
        return this.letters.size;
    }

    hasCoords(coords: string): boolean {
        return this.letters.has(coords);
    }

    placeLetter(coords: string, letter: string): void {
        if (!this.hasCoords(coords)) {
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
