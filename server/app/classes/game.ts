import { Board } from '@app/classes/board';
import { DEFAULT_HAND_SIZE } from '@app/classes/config';
import { Player } from '@app/classes/player';
import { Reserve } from '@app/classes/reserve';

export class Game {
    // Key -- Player's socket ID <br>
    // Value -- Player
    readonly players: Map<string, Player>;
    readonly reserve = new Reserve();

    constructor(readonly board: Board, players: Map<string, Player>) {
        this.players = players;
        Array.from(this.players.values()).forEach((player) => {
            const hand = this.reserve.draw(DEFAULT_HAND_SIZE);
            if (hand !== undefined) {
                player.addAll(hand);
            }
        });
    }
}
