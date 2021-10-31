import { Injectable } from '@angular/core';
import { MessageType } from '@app/classes/message';
import { PlayerHand } from '@app/classes/player-hand';
import { GameService } from '@app/services/game.service';
import { TextboxService } from '@app/services/textbox.service';

const HAND_SIZE = 7;

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

        // Conditions d'une commande valide

        // Doit etre entre 1 et 7
        if (letters.length < 1 || letters.length > HAND_SIZE) {
            this.textboxService.displayMessage(MessageType.System, 'Doit etre entre 1 et 7');
            return false;
        }
        // Verifie si ils sont tous en mimuscule
        if (letters !== letters.toLowerCase()) {
            this.textboxService.displayMessage(MessageType.System, 'Doit etre en miniscule');
            return false;
        }
        // Seulement a mon tour
        if (!this.isMyTurn()) {
            return false;
        }
        // contient dans la main

        // au moins 7 lettres dans la reserve
        const canExchange = this.isInHand(this.letters, this.playerHand) && this.capacityReserve();
        if (canExchange) {
            this.exchangeLetter();
            this.gameService.turnState.next(!this.turnState);
        }
        return canExchange;
    }

    /**
     * @description Function that does the action of exchanging the letters in the playerHand with the reserve
     */
    exchangeLetter(): void {
        this.removeFromHand();
        this.letters.split('').forEach(() => {
            const letter = this.gameService.reserve.drawOne();
            if (letter !== undefined) {
                this.playerHand.add(letter);
                this.gameService.playerHand.next(this.playerHand);
            }
        });
    }

    /**
     * @description Function to remove letters from the player's hand
     */
    removeFromHand(): void {
        this.letters.split('').forEach((letter) => {
            this.playerHand.remove(letter);
            this.gameService.playerHand.next(this.playerHand);
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
            this.textboxService.displayMessage(
                MessageType.System,
                'Les lettres ne peuvent pas être exchange car il contient des lettres qui ne sont pas dans votre main',
            );
        }
        return isInHand;
    }

    /**
     * @description Function that checks if it is the players turn
     * @returns the observable that represents the turn/state of the game
     */
    isMyTurn(): boolean {
        if (!this.turnState) {
            this.textboxService.displayMessage(MessageType.System, 'La commande !échanger peut seulement être utilisé lors de votre tour');
        }
        return this.turnState;
    }
}
