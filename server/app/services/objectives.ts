/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Service } from 'typedi';
import { Board } from '@app/classes/board';
import { ValidationService } from '@app/services/validation.service';

const SMALL_A = 97;
const RANDOMIZER = 0.5;
const OBJECTIVE_TURN_CONDITION = 6;

@Service()
export class ObjectivesService {
    private turnCounter = 0;
    private verifications: Map<number, (letters: Map<string, string>, gameBoard: Board) => boolean>;
    private objectives: number[] = [0, 1, 2, 3, 4, 5, 6, 7];
    private objectivesPts: Map<number, number>;
    constructor(private validationService: ValidationService) {
        this.verifications = new Map<number, (letters: Map<string, string>, gameBoard: Board) => boolean>([
            [
                0,
                (letters: Map<string, string>, gameBoard: Board): boolean => {
                    const bonuses: string[] = [];
                    for (const char in letters) {
                        if (gameBoard.bonuses.has(char[0])) bonuses.push(gameBoard.getBonus(char[0]) as string);
                    }
                    return new Set(bonuses).size >= 2;
                },
            ],
            [
                1,
                (): boolean => {
                    const isValid = this.validationService.findWord(this.validationService.fetchWords());
                    if (isValid) this.turnCounter++;
                    return this.turnCounter >= OBJECTIVE_TURN_CONDITION;
                },
            ],
            [
                2,
                (letters: Map<string, string>): boolean => {
                    const arr = Array.from(new Array(letters.size), (_, value) => String.fromCharCode(SMALL_A + value).toLowerCase());
                    return new Set(arr).size !== arr.length;
                },
            ],
            [
                3,
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
                4,
                (letters: Map<string, string>, gameBoard: Board): boolean => {
                    let bonusCounter = 0;
                    for (const char in letters) {
                        if (gameBoard.bonuses.has(char[0])) bonusCounter++;
                    }
                    return bonusCounter >= 3;
                },
            ],
            [
                5,
                (): boolean => {
                    const words = this.validationService.fetchWords();
                    const arr = words
                        .filter((word) => word.length >= 2 && !word.includes('-') && !word.includes("'") && word !== '')
                        .map((word) => word.toLowerCase());
                    return arr.length >= 3;
                },
            ],
            [
                6,
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
                7,
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
            [0, 10],
            [1, 30],
            [2, 10],
            [3, 20],
            [4, 50],
            [5, 30],
            [6, 50],
            [7, 20],
        ]);
    }

    getPublicObjectives(): number[] {
        this.objectives.sort(() => Math.random() - RANDOMIZER);
        return this.objectives.slice(this.objectives.length - 2);
    }

    getPrivateObjectives(): number {
        this.objectives.sort(() => Math.random() - RANDOMIZER);
        return this.objectives[0];
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
}
