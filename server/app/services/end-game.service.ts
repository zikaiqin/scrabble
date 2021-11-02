import { DEFAULT_POINTS } from '@app/classes/game-config';
import { Reserve } from '@app/classes/reserve';
import { MessageType } from '@app/classes/message';
import { Player } from '@app/classes/player';
import { Service } from 'typedi';
import { SocketService } from '@app/services/socket.service';

export const START_TURN_COUNT = 0;
export const MAX_TURN_SKIP_COUNT = 6;
export const DEFAULT_POINT = 0;
export const EMPTY = 0;
export const PLAYER = 1;
export const OPPONENT = 2;

@Service()
export class EndGameService {
    turnSkipCounter: number = START_TURN_COUNT;
    private pointDeductedPlayer: number = DEFAULT_POINT;
    private pointDeductedOpponent: number = DEFAULT_POINT;
    private pointAdded: number = DEFAULT_POINT;
    private playerLettersLeft: string[] = [];
    private opponentLettersLeft: string[] = [];

    constructor(private socketService: SocketService) {}
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
    checkIfGameEnd(reserve: Reserve, player1Hand: Player, player2Hand: Player): boolean {
        if (reserve.size === EMPTY) {
            if (player1Hand.size === EMPTY || player2Hand.size === EMPTY) {
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
    deductPoint(player1: Player, player2: Player): void {
        for (const i of player1.hand) {
            this.pointDeductedPlayer += DEFAULT_POINTS.get(i[0]) as number;
        }

        player1.score -= this.pointDeductedPlayer;
        for (const i of player2.hand) {
            this.pointDeductedOpponent += DEFAULT_POINTS.get(i[0]) as number;
        }
        player2.score -= this.pointDeductedOpponent;
    }
    /**
     * @description Function that adds the remaining letters value of the enemy to the score
     * @param player number that represents if it is the player
     */
    addPoint(player: Player | undefined): void {
        if(player) {
            for (const i of player.hand) {
            this.pointAdded += DEFAULT_POINTS.get(i[0]) as number;
            }
            player.score += this.pointAdded;
        }
    }
    /**
     * @description Function that verifies who has an empty hand (bot/player)
     * @returns a number that represents one or the other (1 --> player, 2 --> opponent)
     */
    checkWhoEmptiedHand(player1: Player, player2: Player): Player | undefined {
        let playerWhoEmptiedHand: Player | undefined = undefined;
        if (player1.hand.length === EMPTY) {
            playerWhoEmptiedHand = player1;
        } else if (player2.hand.length === EMPTY) {
            playerWhoEmptiedHand = player2;
        }
        return playerWhoEmptiedHand;
    }
    /**
     * @description Function that displays in the chat the remaining letter of both parties
     * @param playerHand the hand that the player possesses
     * @param opponentHand the hand that the opponent possesses
     */
    showLettersLeft(roomID: string, player1: Player, player2: Player): void {
        for (const it of player1.hand) {
            this.playerLettersLeft.push(it[0]);
        }
        for (const it of player2.hand) {
            this.opponentLettersLeft.push(it[0]);
        }
        this.socketService.displayLettersLeft(roomID, MessageType.System, 'Fin de partie - lettres restantes');
        this.socketService.displayLettersLeft(roomID, MessageType.System, player1.name + ': ' + this.playerLettersLeft.join('').toString());
        this.socketService.displayLettersLeft(roomID, MessageType.System, player2.name + ': ' + this.opponentLettersLeft.join('').toString());
    }
    /**
     * @description Wrapper function that runs the procedures to end the game
     */
    endGame(roomID: string, reserve: Reserve, player1: Player, player2: Player): void {
        if (this.checkIfGameEnd(reserve, player1, player2)) {
            this.deductPoint(player1, player2);
            /*this.addPoint(this.checkWhoEmptiedHand(player1, player2));
            this.showLettersLeft(roomID, player1, player2);*/
        }
    }
}
