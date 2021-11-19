/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Service } from 'typedi';
import { Board } from '@app/classes/board';
import { ValidationService } from '@app/services/validation.service';

const SMALL_A = 97;
const RANDOMIZER = 0.5;
const OBJECTIVE_TURN_CONDITION = 6;

@Service()
export class ObjectivesService {
    objectives: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
    private turnCounter = 0;
    private verifications: Map<number, (letters: Map<string, string>, gameBoard: Board) => boolean>;

    private objectivesPts: Map<number, number>;
    constructor(private validationService: ValidationService) {
        this.verifications = new Map<number, (letters: Map<string, string>, gameBoard: Board) => boolean>([
            [
                1,
                (letters: Map<string, string>, gameBoard: Board): boolean => {
                    const bonuses: string[] = [];
                    for (const char in letters) {
                        if (gameBoard.bonuses.has(char[0])) bonuses.push(gameBoard.getBonus(char[0]) as string);
                    }
                    return new Set(bonuses).size >= 2;
                },
            ],
            [
                2,
                (): boolean => {
                    const isValid = this.validationService.findWord(this.validationService.fetchWords());
                    if (isValid) this.turnCounter++;
                    return this.turnCounter >= OBJECTIVE_TURN_CONDITION;
                },
            ],
            [
                3,
                (letters: Map<string, string>): boolean => {
                    const arr = Array.from(new Array(letters.size), (_, value) => String.fromCharCode(SMALL_A + value).toLowerCase());
                    return new Set(arr).size !== arr.length;
                },
            ],
            [
                4,
                (letters: Map<string, string>): boolean => {
                    let wordContainer = '';
                    // eslint-disable-next-line guard-for-in
                    for (const char in letters) {
                        wordContainer += char[1];
                    }
                    const regex = /[aeiou]/gi;
                    const result = wordContainer.match(regex);
                    if (!result) return false;
                    return result.length >= 3;
                },
            ],
            [
                5,
                (letters: Map<string, string>, gameBoard: Board): boolean => {
                    let bonusCounter = 0;
                    for (const char in letters) {
                        if (gameBoard.bonuses.has(char[0])) bonusCounter++;
                    }
                    return bonusCounter >= 3;
                },
            ],
            [
                6,
                (): boolean => {
                    const words = this.validationService.fetchWords();
                    const arr = words
                        .filter((word) => word.length >= 2 && !word.includes('-') && !word.includes("'") && word !== '')
                        .map((word) => word.toLowerCase());
                    return arr.length >= 3;
                },
            ],
            [
                7,
                (letters: Map<string, string>): boolean => {
                    let wordContainer = '';
                    // eslint-disable-next-line guard-for-in
                    for (const char in letters) {
                        wordContainer += char[1];
                    }
                    const regex = /kwxyz/gi;
                    const result = wordContainer.match(regex);
                    if (!result) return false;
                    return new Set(result).size >= 2;
                },
            ],
            [
                8,
                (letters: Map<string, string>, gameBoard: Board): boolean => {
                    let containsBonus = false;
                    for (const char in letters) {
                        if (gameBoard.bonuses.has(char[0])) {
                            containsBonus = true;
                            break;
                        }
                    }
                    return letters.size >= 5 && !containsBonus;
                },
            ],
        ]);

        this.objectivesPts = new Map<number, number>([
            [1, 10],
            [2, 30],
            [3, 10],
            [4, 20],
            [5, 50],
            [6, 30],
            [7, 50],
            [8, 20],
        ]);
    }

    getPublicObjectives(): number[] {
        this.objectives.sort(() => Math.random() - RANDOMIZER);
        const element1 = this.objectives.pop();
        const element2 = this.objectives.pop();
        if (element1 === undefined && element2 === undefined) return [0, 0];
        return [element1 as number, element2 as number];
    }

    getPrivateObjectives(): number {
        this.objectives.sort(() => Math.random() - RANDOMIZER);
        const element = this.objectives.pop();
        if (element === undefined) return 0;
        return element;
    }

    checkObjective(objective: number, letters: Map<string, string>, gameBoard: Board): boolean {
        const exec: ((letters: Map<string, string>, gameBoard: Board) => boolean) | undefined = this.verifications.get(objective);
        if (!exec) return false;
        return exec(letters, gameBoard);
    }

    getPoints(objective: number): number {
        if (!this.objectivesPts.has(objective)) return 0;
        return this.objectivesPts.get(objective) as number;
    }

    resetObjArray(): void {
        this.objectives = [1, 2, 3, 4, 5, 6, 7, 8];
    }
}
