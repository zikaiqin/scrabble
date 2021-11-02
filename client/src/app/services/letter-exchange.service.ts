import { Injectable } from '@angular/core';
import { MessageType } from '@app/classes/message';
import { PlayerHand } from '@app/classes/player-hand';
import { GameService } from '@app/services/game.service';
import { TextboxService } from '@app/services/textbox.service';
import { DEFAULT_HAND_SIZE } from '@app/classes/game-config';

@Injectable({
    providedIn: 'root',
})
export class LetterExchangeService {
    letters: string;
    private turnState: boolean;
    private playerHand: PlayerHand = new PlayerHand();

    constructor(private textboxService: TextboxService, private gameService: GameService) {
        this.gameService.turnState.subscribe({
            next: (turn: boolean) => (this.turnState = turn),
        });
        this.gameService.playerHand.asObservable().subscribe((playerHand) => {
            this.playerHand = playerHand;
        });
    }

    /**
     * @description Function that makes sure the command is valid
     * @param letters all the letters that the user tries to exchange
     * @returns the validity of the command --> true/false
     */
    validateCommand(letters: string): boolean {
        this.letters = letters;

        if (letters.length < 1 || letters.length > DEFAULT_HAND_SIZE) {
            this.textboxService.displayMessage(MessageType.System, 'Doit etre entre 1 et 7');
            return false;
        }
        if (letters !== letters.toLowerCase()) {
            this.textboxService.displayMessage(MessageType.System, 'Doit etre en miniscule');
            return false;
        }
        return this.gameService.reserve.size >= DEFAULT_HAND_SIZE && this.isMyTurn() && this.isInHand(this.letters, this.playerHand);
    }

    /**
     * @description Function to check if the letters that the user tries to exchange are in his hand
     * @param expectedHand the hand that the code thinks the player has
     * @param actualHand the hand that contains all the real letters
     * @returns a boolean --> true if all the letters are valid
     */
    isInHand(expectedHand: string, actualHand: PlayerHand): boolean {
        const testHand: PlayerHand = new PlayerHand();
        expectedHand.split('').forEach((letter) => testHand.add(letter));

        // using unique set of letters in word as key, compare to amount of letters in hand
        const isInHand: boolean = [...new Set<string>(expectedHand)].every((letter) => {
            const amountRequired = testHand.get(letter);
            const amountInHand = actualHand.get(letter);
            return amountRequired <= amountInHand;
        });
        if (!isInHand) {
            this.textboxService.displayMessage(MessageType.System, 'Vous ne pouvez pas échanger des lettres qui ne sont pas dans votre main');
        }
        return isInHand;
    }

    /**
     * @description Function that checks if it is the players turn
     * @returns the observable that represents the turn/state of the game
     */
    isMyTurn(): boolean {
        if (!this.turnState) {
            this.textboxService.displayMessage(MessageType.System, 'La commande !échanger peut seulement être utilisée lors de votre tour');
        }
        return this.turnState;
    }
}
