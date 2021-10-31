import { PlayerHand } from '@app/classes/player-hand';
import { GameService } from '@app/services/game.service';
import { Service } from 'typedi';

const HAND_SIZE = 7;

@Service()
export class LetterExchangeService {
    private playerHand: PlayerHand = new PlayerHand();

    constructor(private gameService: GameService) {}

    /**
     * @description Function that does the action of exchanging the letters in the playerHand with the reserve
     * @param letters String of all the letters that the user wants to exchange
     */
    exchangeLetter(letters: string): PlayerHand {
        this.removeFromHand(letters);
        letters.split('').forEach(() => {
            const letter = this.gameService.reserve.drawOne();
            if (letter !== undefined) {
                this.playerHand.add(letter);
            }
        });
        return this.playerHand;
    }

    /**
     * @description Function to remove letters from the player's hand
     * @param letters String of all the letters that we are going to remove from his current hand
     */
    removeFromHand(letters: string): void {
        letters.split('').forEach((letter) => {
            this.playerHand.remove(letter);
            this.gameService.reserve.receiveOne(letter);
        });
    }

    /**
     * @description Function check the capacity of the reserve
     * @returns true if reserve size is bigger than the player's maximum hand
     */
    capacityReserve(): boolean {
        return this.gameService.reserve.getSize() >= HAND_SIZE;
    }
}
