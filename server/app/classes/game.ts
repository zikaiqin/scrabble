import { Player } from '@app/classes/player';
import { Reserve } from '@app/classes/reserve';
import { Board } from '@app/classes/board';
import { DEFAULT_HAND_SIZE } from '@app/classes/game-config';

export class Game {
    private reserve = new Reserve();

    constructor(readonly board: Board, readonly players: Map<string, Player>) {
        Array.from(this.players.values()).forEach((player) => {
            const hand = this.reserve.draw(DEFAULT_HAND_SIZE);
            if (hand !== undefined) {
                player.addAll(hand);
            }
        });
    }
}