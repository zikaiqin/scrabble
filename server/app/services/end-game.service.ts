import { DEFAULT_POINTS } from '@app/classes/game-config';
import { Reserve } from '@app/classes/reserve';
import { Player } from '@app/classes/player';
import { Service } from 'typedi';

export const MAX_TURN_SKIP_COUNT = 6;

@Service()
export class EndGameService {
    readonly turnSkipMap = new Map<string, number>();
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
    deductPoints(player: Player): void {
        player.hand.forEach((letter) => {
            player.score -= DEFAULT_POINTS.get(letter) as number;
        });
    }
    /**
     * @description Function that adds the remaining letters value of the enemy to the score
     * @param player player that emptied their hand
     * @param hand other player's hand
     */
    addPoints(player: Player, hand: string[]): void {
        hand.forEach((letter) => {
            player.score += DEFAULT_POINTS.get(letter) as number;
        });
    }
    /**
     * @description Function that verifies who has an empty hand (bot/player)
     * @returns a number that represents one or the other (1 --> player, 2 --> opponent)
     */
    checkWhoEmptiedHand(player1: Player, player2: Player): [Player, string[]] | undefined {
        let playerWhoEmptiedHand: Player | undefined;
        let otherHand: string[] | undefined;
        if (player1.hand.length === 0) {
            playerWhoEmptiedHand = player1;
            otherHand = player2.hand;
        }
        if (player2.hand.length === 0) {
            playerWhoEmptiedHand = player2;
            otherHand = player1.hand;
        }
        return playerWhoEmptiedHand && otherHand ? [playerWhoEmptiedHand, otherHand] : undefined;
    }
    /**
     * @description Function that displays in the chat the remaining letter of both parties
     */
    showLettersLeft(player1: Player, player2: Player): string[] {
        const text: string[] = [];
        text.push('Fin de partie - lettres restantes');
        text.push(`${player1.name}:\t${player1.hand.join('')}`);
        text.push(`${player2.name}:\t${player2.hand.join('')}`);
        return text;
    }

    getWinner(player1: Player, player2: Player): string {
        return player1.score > player2.score ? player1.name : player1.score < player2.score ? player2.name : `${player1.name} et ${player2.name}`;
    }
    /**
     * @description Sets the final points of each player
     */
    setPoints(player1: Player, player2: Player): void {
        this.deductPoints(player1);
        this.deductPoints(player2);
        const result = this.checkWhoEmptiedHand(player1, player2);
        if (result) {
            this.addPoints(...result);
        }
    }
}
