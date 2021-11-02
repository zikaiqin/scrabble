import { DEFAULT_POINTS } from '@app/classes/game-config';
// import { MessageType } from '@app/classes/message';
import { Player } from '@app/classes/player';
import { GameService } from '@app/services/game.service';
import { Service } from 'typedi';

export const START_TURN_COUNT = 0;
export const MAX_TURN_SKIP_COUNT = 9;
export const DEFAULT_POINT = 0;
export const EMPTY = 0;
export const PLAYER = 1;
export const OPPONENT = 2;

@Service()
export class EndGameService {
    turnSkipCounter: number = START_TURN_COUNT;
    playerScore = 0;
    opponentScore = 0;
    private pointDeductedPlayer: number = DEFAULT_POINT;
    private pointDeductedOpponent: number = DEFAULT_POINT;
    private pointAddedPlayer: number = DEFAULT_POINT;
    private pointAddedOpponent: number = DEFAULT_POINT;
    private playerLettersLeft: string[] = [];
    private opponentLettersLeft: string[] = [];

    constructor(private gameService: GameService) {}
    /**
     * @description Function that increments the turnSkipCounter to keep track of the number of turns skipped
     */
    turnSkipCount(): void {
        this.turnSkipCounter++;
    }
    /**
     * @description Function that resets the turnSkipCounter because people aren't AFK/doing nothing
     */
    turnSkipCountReset(): void {
        this.turnSkipCounter = START_TURN_COUNT;
    }
    /**
     * @description Function that verifies if the game met one of the ending conditions
     * @returns boolean to indicate if the game ended
     */
    checkIfGameEnd(): boolean {
        if (this.gameService.reserve.size === EMPTY) {
            if (this.playerHand.size === EMPTY || this.opponentHand.size === EMPTY) {
                return true;
            }
        }
        if (this.turnSkipCounter === MAX_TURN_SKIP_COUNT) {
            return true;
        }
        return false;
    }
    /**
     * @description Function that subtracts the remaining letters value to the score
     */
    deductPoint(): void {
        for (const i of this.playerHand.letters) {
            this.pointDeductedPlayer += DEFAULT_POINTS.get(i[0]) as number;
        }

        this.gameService.playerScore -= this.pointDeductedPlayer;
        for (const i of this.opponentHand.letters) {
            this.pointDeductedOpponent += DEFAULT_POINTS.get(i[0]) as number;
        }
        this.gameService.opponentScore -= this.pointDeductedOpponent;
    }
    /**
     * @description Function that adds the remaining letters value of the enemy to the score
     * @param player number that represents if it is the player
     */
    addPoint(player: number): void {
        if (player === PLAYER) {
            for (const i of this.opponentHand.letters) {
                this.pointAddedPlayer += DEFAULT_POINTS.get(i[0]) as number;
            }
            this.gameService.playerScore += this.pointAddedPlayer;
        }
        if (player === OPPONENT) {
            for (const i of this.playerHand.letters) {
                this.pointAddedOpponent += DEFAULT_POINTS.get(i[0]) as number;
            }
            this.gameService.opponentScore += this.pointAddedOpponent;
        }
    }
    /**
     * @description Function that verifies who has an empty hand (bot/player)
     * @returns a number that represents one or the other (1 --> player, 2 --> opponent)
     */
    checkWhoEmptiedHand(): number {
        if (this.playerHand.size === EMPTY) {
            return PLAYER;
        } else if (this.opponentHand.size === EMPTY) {
            return OPPONENT;
        }
        return EMPTY;
    }
    /**
     * @description Function that displays in the chat the remaining letter of both parties
     * @param playerHand the hand that the player possesses
     * @param opponentHand the hand that the opponent possesses
     */
    showLettersLeft(playerHand: Player, opponentHand: Player): void {
        for (const it of playerHand.hand) {
            this.playerLettersLeft.push(it[0]);
        }
        for (const it of opponentHand.hand) {
            this.opponentLettersLeft.push(it[0]);
        }
        /* this.textboxService.sendMessage(MessageType.System, 'Fin de partie - lettres restantes');
        this.textboxService.sendMessage(MessageType.System, this.gameService.player + ': ' + this.playerLettersLeft.join('').toString());
        this.textboxService.sendMessage(MessageType.System, this.gameService.opponent + ': ' + this.opponentLettersLeft.join('').toString());*/
    }
    /**
     * @description Wrapper function that runs the procedures to end the game
     */
    endGame(): void {
        if (this.checkIfGameEnd()) {
            this.deductPoint();
            this.addPoint(this.checkWhoEmptiedHand());
        }
    }
}