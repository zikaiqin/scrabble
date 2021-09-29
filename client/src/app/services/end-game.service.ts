import { Injectable } from '@angular/core';
import { GameService } from '@app/services/game.service';
// import { ValidationService } from './validation.service';
import { TextboxService } from './textbox.service';
import { MessageType } from '@app/classes/message';

export const DEFAULT_TURN_COUNT = 0;
export const MAX_TURN_SKIP_COUNT = 7;
export const DEFAULT_POINT = 0;
export const EMPTY = 0;
export const PLAYER = 1;
export const OPPONENT = 2;

@Injectable({
    providedIn: 'root',
})
export class EndGameService {
    turnSkipCounter: number = DEFAULT_TURN_COUNT;
    pointDeductedPlayer: number = DEFAULT_POINT;
    pointDeductedOpponent: number = DEFAULT_POINT;
    pointAddedPlayer: number = DEFAULT_POINT;
    pointAddedOpponent: number = DEFAULT_POINT;
    playerLettersLeft: string[] = [];
    opponentLettersLeft: string[] = [];
    gameHasEnded: boolean = false;
    constructor(private gameService: GameService/*, private validationService: ValidationService*/, private textboxService: TextboxService) {}

    turnSkipCount(): void {
        this.turnSkipCounter++;
    }

    turnSkipCountReset(): void {
        this.turnSkipCounter = DEFAULT_TURN_COUNT;
    }

    checkIfGameEnd(): boolean {
        if (this.gameService.reserve.size === EMPTY) {
            if (this.gameService.playerHand.size === EMPTY || this.gameService.opponentHand.size === EMPTY) {
                return true;
            }
        }
        if (this.turnSkipCounter === MAX_TURN_SKIP_COUNT) {
            return true;
        }
        if (this.gameHasEnded) {
            return true;
        }
        return false;
    }

    deductPoint(): void {
        /*for (const i of this.gameService.playerHand.letters) {
            this.pointDeductedPlayer += this.validationService.points.get(i[0]) as number;
        }
        this.gameService.playerScore -= this.pointDeductedPlayer;
        for (const i of this.gameService.opponentHand.letters) {
            this.pointDeductedOpponent += this.validationService.points.get(i[0]) as number;
        }
        this.gameService.opponentScore -= this.pointDeductedOpponent;*/
    }

    addPoint(player: number): void {
        /*if (player === PLAYER) {
            for (const i of this.gameService.opponentHand.letters) {
                this.pointAddedPlayer += this.validationService.points.get(i[0]) as number;
            }
            this.gameService.playerScore += this.pointAddedPlayer;
        }
        if (player === OPPONENT) {
            for (const i of this.gameService.playerHand.letters) {
                this.pointAddedOpponent += this.validationService.points.get(i[0]) as number;
            }
            this.gameService.opponentScore += this.pointAddedOpponent;
        }*/
    }

    checkWhoEmptiedHand(): number {
        if (this.gameService.playerHand.size === EMPTY) {
            return PLAYER;
        } else if (this.gameService.opponentHand.size === EMPTY) {
            return OPPONENT;
        }
        return EMPTY;
    }

    showLettersLeft(): void {
    }

    endGame(): void {
        if (this.checkIfGameEnd()) {
            this.textboxService.sendMessage(MessageType.System, 'Game has ended');
            /*this.deductPoint();
            this.addPoint(this.checkWhoEmptiedHand());*/
        }
    }
}
