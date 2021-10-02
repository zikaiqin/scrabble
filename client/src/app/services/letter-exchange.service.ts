import { Injectable } from '@angular/core';
import { GameService } from '@app/services/game.service';
import { TextboxService } from '@app/services/textbox.service';
import { MessageType } from '@app/classes/message';
import { PlayerHand } from '@app/classes/player-hand';

const HAND_SIZE = 7;

@Injectable({
    providedIn: 'root',
})
export class LetterExchangeService {
    letters: string;
    turnState: boolean;

    constructor(private textboxService: TextboxService, private gameService: GameService) {
        this.gameService.turnState.subscribe({
            next: (turn: boolean) => (this.turnState = turn),
        });
    }

    validateCommand(letters: string): boolean {
        this.letters = letters;

        // conditions d'une commande valide

        // Doit etre entre 1 et 7
        if (letters.length < 1 || letters.length > HAND_SIZE) {
            this.textboxService.sendMessage(MessageType.System, 'Doit etre entre 1 et 7');
            return false;
        }
        // Verifie si ils sont tous en mimuscule
        if (letters !== letters.toLowerCase()) {
            this.textboxService.sendMessage(MessageType.System, 'Doit etre en miniscule');
            return false;
        }
        // Seulement a mon tour
        if (!this.isMyTurn()) {
            return false;
        }
        // contient dans la main

        // au moins 7 lettres dans la reserve
        const canExchange = this.isInHand(this.letters, this.gameService.playerHand) && this.capacityReserve();
        if (canExchange) {
            this.exchangeLetter();
            this.gameService.turnState.next(!this.turnState);
        }
        return canExchange;
    }

    exchangeLetter(): void {
        this.removeFromHand();
        this.letters.split('').forEach(() => {
            const letter = this.gameService.reserve.drawOne();
            if (letter !== undefined) {
                this.gameService.playerHand.add(letter);
            }
        });
    }

    removeFromHand(): void {
        this.letters.split('').forEach((letter) => {
            this.gameService.playerHand.remove(letter);
            this.gameService.reserve.receiveOne(letter);
        });
    }

    capacityReserve(): boolean {
        return this.gameService.reserve.getSize() >= HAND_SIZE;
    }

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
            this.textboxService.sendMessage(
                MessageType.System,
                'Les lettres ne peuvent pas être exchange car il contient des lettres qui ne sont pas dans votre main',
            );
        }
        return isInHand;
    }

    isMyTurn(): boolean {
        if (!this.turnState) {
            this.textboxService.sendMessage(MessageType.System, 'La commande !échanger peut seulement être utilisé lors de votre tour');
        }
        return this.turnState;
    }
}
