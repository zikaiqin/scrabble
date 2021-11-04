import { DEFAULT_POINTS } from '@app/classes/game-config';
import { Reserve } from '@app/classes/reserve';
import { Player } from '@app/classes/player';
import { Service } from 'typedi';

export const START_TURN_COUNT = 1;
export const MAX_TURN_SKIP_COUNT = 6;

@Service()
export class EndGameService {
    readonly turnSkipMap = new Map<string, number>();
    private pointDeductedPlayer: number = 0;
    private pointDeductedOpponent: number = 0;
    private pointAdded: number = 0;
    /**
     * @description Function that increments the turnSkipCounter to keep track of the number of turns skipped
     */
    turnSkipCount(roomID: string): void {
        const roomSkipCounter = this.turnSkipMap.get(roomID);
        if (roomSkipCounter !== undefined) {
            this.turnSkipMap.set(roomID, roomSkipCounter + 1);
        }
    }
    /**
     * @description Function that resets the turnSkipCounter because people aren't AFK/doing nothing
     */
    turnSkipCountReset(roomID: string): void {
        const roomSkipCounter = this.turnSkipMap.get(roomID);
        if (roomSkipCounter !== undefined) {
            this.turnSkipMap.set(roomID, 0);
        }
    }
    /**
     * @description Function that verifies if the game met one of the ending conditions
     * @returns boolean to indicate if the game ended
     */
    checkIfGameEnd(reserve: Reserve, player1Hand: Player, player2Hand: Player, roomID: string): boolean {
        if (reserve.size === 0) {
            if (player1Hand.size === 0 || player2Hand.size === 0) {
                return true;
            }
        }
        return this.turnSkipMap.get(roomID) === MAX_TURN_SKIP_COUNT;
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
        if (player) {
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
        let playerWhoEmptiedHand: Player | undefined;
        if (player1.hand.length === 0) {
            playerWhoEmptiedHand = player1;
        } else if (player2.hand.length === 0) {
            playerWhoEmptiedHand = player2;
        }
        return playerWhoEmptiedHand;
    }
    /**
     * @description Function that displays in the chat the remaining letter of both parties
     */
    showLettersLeft(player1: Player, player2: Player): string[] {
        const text: string[] = [];
        text.push('Fin de partie - lettres restantes');
        text.push(`${player1.name}:\t${[...player1.hand].sort().join('')}`);
        text.push(`${player2.name}:\t${[...player2.hand].sort().join('')}`);
        return text;
    }

    getWinner(player1: Player, player2: Player): string {
        return player1.score > player2.score ? player1.name : player1.score < player2.score ? player2.name : player1.name + ' et ' + player2.name;
    }
    /**
     * @description Wrapper function that runs the procedures to end the game
     */
    endGame(player1: Player, player2: Player): void {
        this.deductPoint(player1, player2);
        this.addPoint(this.checkWhoEmptiedHand(player1, player2));
    }
}
