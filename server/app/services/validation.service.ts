import { Board } from '@app/classes/board';
import { DEFAULT_POINTS, DEFAULT_TURN_TIMEOUT } from '@app/classes/config';
import { MessageType } from '@app/classes/message';
import { Vec2 } from '@app/classes/vec2';
import { Service } from 'typedi';
import { ObjectivesService } from '@app/services/objectives';
import { Player } from '@app/classes/player';
import { Game } from '@app/classes/game';
import { PlacingService } from '@app/services/placing.service';
import { SocketService } from './socket.service';
import { GameDisplayService } from '@app/services/game-display.service';
import { EndGameService } from '@app/services/end-game.service';

export const ASCII_SMALL_A = 97;
const BINGO_BONUS = 50;
const BINGO_WORD = 7;
const BOARD_SIZE = 15;

enum Bonuses {
    L2 = 'Lx2',
    L3 = 'Lx3',
    W2 = 'Wx2',
    W3 = 'Wx3',
}

@Service()
export class ValidationService {
    startCoord: Vec2;
    index = 1;
    coordContainer: string[][]; // Contains the formed words' index where the letter is placed
    newWord: Map<string, string>;
    gameBoard: Board;

    // Key -- ID of the room <br>
    // Value -- Valid words in the game's dictionary
    readonly dictionaries = new Map<string, string[]>();

    constructor(
        private objectivesService: ObjectivesService,
        private placingService: PlacingService,
        private gameDisplayService: GameDisplayService,
        private endGameService: EndGameService,
    ) {}
    /**
     * @description Startup to initialize the attributes
     * @param startCoords the starting coordinates of the placed word/letter
     * @param word the word/letter that has been placed on the gameBoard
     * @param gameBoard the current state of the board/game
     */
    init(startCoords: string, word: Map<string, string>, gameBoard: Board) {
        this.startCoord = {
            x: startCoords.charCodeAt(0),
            y: Number(startCoords.slice(1)),
        };
        this.newWord = word;
        this.coordContainer = [];
        this.gameBoard = gameBoard;
    }
    /**
     * @description Function to go get the formed words from the gameBoard
     * @returns an array of all the formed words
     */
    fetchWords(): string[] {
        const wordContainer: string[] = [];
        let orientation = 0;
        if (this.newWord.size >= 2) {
            for (const i of this.newWord) {
                orientation = this.startCoord.x - i[0].toLowerCase()[0].charCodeAt(0);
            }

            // Checks if the word is oriented horizontally or vertically

            if (orientation === 0) {
                wordContainer.push(this.checkHorizontal(this.newWord.keys().next().value));
                for (const i of this.newWord) {
                    wordContainer.push(this.checkVertival(i[0]));
                }
            } else {
                wordContainer.push(this.checkVertival(this.newWord.keys().next().value));
                for (const i of this.newWord) {
                    wordContainer.push(this.checkHorizontal(i[0]));
                }
            }
        } else {
            // IF the player only placed 1 letter on the board

            wordContainer.push(this.checkVertival(String.fromCharCode(this.startCoord.x) + String(this.startCoord.y)));
            wordContainer.push(this.checkHorizontal(String.fromCharCode(this.startCoord.x) + String(this.startCoord.y)));
        }
        return wordContainer;
    }
    /**
     * @description Resets the variable used throughout the code
     */
    resetVariable(): void {
        this.index = 1;
    }
    /**
     * @description Function to get the vertically formed word at a precise position on the gameBoard
     * @param coord the position where this function will go check
     * @returns the word formed / '' if nothing is formed
     */
    checkVertival(coord: string): string {
        const xIndex = coord.toLowerCase()[0].charCodeAt(0);
        const yIndex = coord.slice(1, coord.length);
        let tempWord = '';

        const stringIndexes: string[] = [];

        // Scanning through the small indexes
        for (this.index; xIndex - this.index >= ASCII_SMALL_A; this.index++) {
            if (!this.gameBoard.hasCoords(String.fromCharCode(xIndex - this.index) + yIndex)) break;
        }
        for (this.index -= 1; this.index > 0; this.index--) {
            const coordinates = String.fromCharCode(xIndex - this.index) + yIndex;
            tempWord += this.gameBoard.getLetter(coordinates);
            stringIndexes.push(coordinates);
        }
        // Scanning through the big indexes
        for (this.index; xIndex + this.index <= ASCII_SMALL_A + BOARD_SIZE; this.index++) {
            if (!this.gameBoard.hasCoords(String.fromCharCode(xIndex + this.index) + yIndex)) break;
        }
        for (let j = 0; j < this.index; j++) {
            const coordinates = String.fromCharCode(xIndex + j) + yIndex;
            tempWord += this.gameBoard.getLetter(coordinates);
            stringIndexes.push(coordinates);
        }
        this.resetVariable();
        if (tempWord.length <= 1) tempWord = '';
        if (stringIndexes.length > 1) this.coordContainer.push(stringIndexes);
        return tempWord;
    }
    /**
     * @description Function to get the horizontally formed word at a precise position on the gameBoard
     * @param coord the position where this function will go check
     * @returns the word formed / '' if nothing is formed
     */
    checkHorizontal(coord: string): string {
        const xIndex = coord[0];
        const yIndex = Number(coord.slice(1, coord.length));
        let tempWord = '';

        const stringIndexes: string[] = [];

        // Scanning through the small indexes
        for (this.index; yIndex - this.index > 0; this.index++) {
            if (!this.gameBoard.hasCoords(xIndex + String(yIndex - this.index))) break;
        }
        for (this.index -= 1; this.index > 0; this.index--) {
            const coordinates = xIndex + String(yIndex - this.index);
            tempWord += this.gameBoard.getLetter(coordinates);
            stringIndexes.push(coordinates);
        }
        // Scanning through the big indexes
        for (this.index; yIndex + this.index <= BOARD_SIZE; this.index++) {
            if (!this.gameBoard.hasCoords(xIndex + String(yIndex + this.index))) break;
        }
        for (let j = 0; j < this.index; j++) {
            const coordinates = xIndex + String(yIndex + j);
            tempWord += this.gameBoard.getLetter(coordinates);
            stringIndexes.push(coordinates);
        }
        this.resetVariable();
        if (tempWord.length <= 1) tempWord = '';
        if (stringIndexes.length > 1) this.coordContainer.push(stringIndexes);
        return tempWord;
    }
    /**
     * @description Function that verifies the validity of a word with the dictionnary
     * @param roomID ID of the room
     * @param words the words that needs to be verified
     * @returns true if all words are valid / false if any 1 word isn't valid
     */
    findWord(roomID: string, words: string[]): boolean {
        const wordsToCheck = words.filter((word) => word.length >= 2 && !word.includes('-') && !word.includes("'")).map((word) => word.toLowerCase());
        return wordsToCheck.every((word) => this.dictionaries.get(roomID)?.includes(word));
    }
    /**
     * @description Wrapper function that calculates all the points with all the formed words
     * @returns the total points gained
     */
    calcPoints(): number {
        let totalPoints = 0;
        let w2 = false;
        let w3 = false;
        // We use eslint-disable here because, it is necessary to have the index since we are iterating through a 2D array
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.coordContainer.length; i++) {
            let tempPoints = 0;
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let j = 0; j < this.coordContainer[i].length; j++) {
                const coordinates = this.coordContainer[i][j];
                const letter = this.gameBoard.getLetter(coordinates)?.toLowerCase() as string;
                if (this.newWord.has(coordinates) && this.gameBoard.bonuses.has(coordinates)) {
                    switch (this.gameBoard.getBonus(coordinates)) {
                        case Bonuses.L2: {
                            tempPoints += (DEFAULT_POINTS.get(letter) as number) * 2;
                            break;
                        }
                        case Bonuses.L3: {
                            tempPoints += (DEFAULT_POINTS.get(letter) as number) * 3;
                            break;
                        }
                        case Bonuses.W2: {
                            tempPoints += DEFAULT_POINTS.get(letter) as number;
                            w2 = true;
                            break;
                        }
                        case Bonuses.W3: {
                            tempPoints += DEFAULT_POINTS.get(letter) as number;
                            w3 = true;
                            break;
                        }
                    }
                } else tempPoints += DEFAULT_POINTS.get(letter) as number;
            }
            if (w2) {
                tempPoints *= 2;
                w2 = false;
            }
            if (w3) {
                tempPoints *= 3;
                w3 = false;
            }
            totalPoints += tempPoints;
        }
        // IF the player placed all of his hand, gains an extra 50 pts
        if (this.newWord.size === BINGO_WORD) totalPoints += BINGO_BONUS;
        return totalPoints;
    }

    validatePlacing(player: Player, game: Game, toPlace: Map<string, string>, socket: SocketService, roomID: string, socketId: string) {
        const isValidWord = this.findWord(roomID, this.fetchWords());
        setTimeout(() => {
            if (isValidWord) {
                player.score += this.calcPoints();
                for (const objective of game.publicObj) {
                    const objNumber = objective[0];
                    if (this.objectivesService.checkObjective(objNumber, toPlace, game)) {
                        if (game.completePublic(objNumber)) player.score += this.objectivesService.getPoints(objNumber);
                    }
                }
                if (this.objectivesService.checkObjective(player.privateObj[0], toPlace, game)) {
                    if (player.completePrivate()) player.score += this.objectivesService.getPoints(player.privateObj[0]);
                }
                this.placingService.replenishHand(game.reserve, player);
                socket.updateReserve(roomID, game.reserve.letters);
                this.gameDisplayService.updateScores(game, socket);
                this.endGameService.resetTurnSkipCount(roomID);
            } else {
                game.validTurnCounter = 0;
                this.placingService.returnLetters(toPlace, game.board, player);
                socket.sendMessage(socketId, MessageType.System, 'Votre placement forme des mots invalides');
            }
            socket.updateBoard(roomID, game.board.letters);
            socket.updateObjectives(socketId, game.publicObj, player.privateObj);
            this.gameDisplayService.updateHands(game, socket);
        }, DEFAULT_TURN_TIMEOUT);
    }
}
