import { Injectable } from '@angular/core';
import { GameService } from '@app/services/game.service';
import { DEFAULT_POINTS } from '@app/classes/game-config';
import { TextboxService } from './textbox.service';
import { MessageType } from '@app/classes/message';
import { PlayerHand } from '@app/classes/player-hand';

export const START_TURN_COUNT = 0;
export const MAX_TURN_SKIP_COUNT = 9;
export const DEFAULT_POINT = 0;
export const EMPTY = 0;
export const PLAYER = 1;
export const OPPONENT = 2;

@Injectable({
    providedIn: 'root',
})
export class EndGameService {
    turnSkipCounter: number = START_TURN_COUNT;
    pointDeductedPlayer: number = DEFAULT_POINT;
    pointDeductedOpponent: number = DEFAULT_POINT;
    pointAddedPlayer: number = DEFAULT_POINT;
    pointAddedOpponent: number = DEFAULT_POINT;
    playerLettersLeft: string[] = [];
    opponentLettersLeft: string[] = [];
    gameHasEnded: boolean = false;
    constructor(private gameService: GameService, private textboxService: TextboxService) {}

    turnSkipCount(): void {
        this.turnSkipCounter++;
    }

    turnSkipCountReset(): void {
        this.turnSkipCounter = START_TURN_COUNT;
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
        return this.gameHasEnded;
    }

    deductPoint(): void {
        for (const i of this.gameService.playerHand.letters) {
            this.pointDeductedPlayer += DEFAULT_POINTS.get(i[0]) as number;
        }
        this.gameService.playerScore -= this.pointDeductedPlayer;
        for (const i of this.gameService.opponentHand.letters) {
            this.pointDeductedOpponent += DEFAULT_POINTS.get(i[0]) as number;
        }
        this.gameService.opponentScore -= this.pointDeductedOpponent;
    }

    addPoint(player: number): void {
        if (player === PLAYER) {
            for (const i of this.gameService.opponentHand.letters) {
                this.pointAddedPlayer += DEFAULT_POINTS.get(i[0]) as number;
            }
            this.gameService.playerScore += this.pointAddedPlayer;
        }
        if (player === OPPONENT) {
            for (const i of this.gameService.playerHand.letters) {
                this.pointAddedOpponent += DEFAULT_POINTS.get(i[0]) as number;
            }
            this.gameService.opponentScore += this.pointAddedOpponent;
        }
    }

    checkWhoEmptiedHand(): number {
        if (this.gameService.playerHand.size === EMPTY) {
            return PLAYER;
        } else if (this.gameService.opponentHand.size === EMPTY) {
            return OPPONENT;
        }
        return EMPTY;
    }

    showLettersLeft(playerHand: PlayerHand, opponentHand: PlayerHand): void {
        for (const it of playerHand.letters) {
            this.playerLettersLeft.push(it[0]);
        }
        for (const it of opponentHand.letters) {
            this.opponentLettersLeft.push(it[0]);
        }
        this.textboxService.sendMessage(MessageType.System, 'Fin de partie - lettres restantes');
        this.textboxService.sendMessage(MessageType.System, this.gameService.player + ': ' + this.playerLettersLeft.join('').toString());
        this.textboxService.sendMessage(MessageType.System, this.gameService.opponent + ': ' + this.opponentLettersLeft.join('').toString());
    }

    endGame(): void {
        if (this.checkIfGameEnd()) {
            this.deductPoint();
            this.addPoint(this.checkWhoEmptiedHand());
            this.showLettersLeft(this.gameService.playerHand, this.gameService.opponentHand);
        }
    }
}
