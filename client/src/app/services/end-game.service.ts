import { Injectable } from '@angular/core';
import { DEFAULT_POINTS } from '@app/classes/game-config';
import { MessageType } from '@app/classes/message';
import { PlayerHand } from '@app/classes/player-hand';
import { GameService } from '@app/services/game.service';
import { TextboxService } from './textbox.service';

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
    playerHand: PlayerHand = new PlayerHand();
    opponentHand: PlayerHand = new PlayerHand();
    playerScore = 0;
    opponentScore = 0;

    constructor(private gameService: GameService, private textboxService: TextboxService) {
        this.gameService.playerHand.asObservable().subscribe((playerHand) => {
            this.playerHand = playerHand;
        });
        this.gameService.opponentHand.asObservable().subscribe((opponentHand) => {
            this.opponentHand = opponentHand;
        });
        this.gameService.playerScore.asObservable().subscribe((playerScore) => {
            this.playerScore = playerScore;
        });
        this.gameService.opponentScore.asObservable().subscribe((opponentScore) => {
            this.opponentScore = opponentScore;
        });
    }

    turnSkipCount(): void {
        this.turnSkipCounter++;
    }

    turnSkipCountReset(): void {
        this.turnSkipCounter = START_TURN_COUNT;
    }

    checkIfGameEnd(): boolean {
        if (this.gameService.reserve.size === EMPTY) {
            if (this.playerHand.size === EMPTY || this.opponentHand.size === EMPTY) {
                return true;
            }
        }
        if (this.turnSkipCounter === MAX_TURN_SKIP_COUNT) {
            return true;
        }
        return false;
    }

    deductPoint(): void {
        for (const i of this.playerHand.letters) {
            this.pointDeductedPlayer += DEFAULT_POINTS.get(i[0]) as number;
        }

        this.playerScore -= this.pointDeductedPlayer;
        this.gameService.playerScore.next(this.playerScore);
        for (const i of this.opponentHand.letters) {
            this.pointDeductedOpponent += DEFAULT_POINTS.get(i[0]) as number;
        }
        this.opponentScore -= this.pointDeductedOpponent;
        this.gameService.opponentScore.next(this.opponentScore);
    }

    addPoint(player: number): void {
        if (player === PLAYER) {
            for (const i of this.opponentHand.letters) {
                this.pointAddedPlayer += DEFAULT_POINTS.get(i[0]) as number;
            }
            this.playerScore += this.pointAddedPlayer;
            this.gameService.playerScore.next(this.playerScore);
        }
        if (player === OPPONENT) {
            for (const i of this.playerHand.letters) {
                this.pointAddedOpponent += DEFAULT_POINTS.get(i[0]) as number;
            }
            this.opponentScore += this.pointAddedOpponent;
            this.gameService.opponentScore.next(this.opponentScore);
        }
    }

    checkWhoEmptiedHand(): number {
        if (this.playerHand.size === EMPTY) {
            return PLAYER;
        } else if (this.opponentHand.size === EMPTY) {
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
            this.showLettersLeft(this.playerHand, this.opponentHand);
        }
    }
}
