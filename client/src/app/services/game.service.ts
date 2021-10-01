import { Injectable } from '@angular/core';
import { GameBoard } from '@app/classes/game-board';
import { DEFAULT_BONUSES, DEFAULT_BOT_NAMES, DEFAULT_HAND_SIZE } from '@app/classes/game-config';
import { PlayerHand } from '@app/classes/player-hand';
import { Reserve } from '@app/classes/reserve';
import { Subject } from 'rxjs';
import { GridService } from './grid.service';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    isInit: boolean;
    isStarted: boolean;

    player: string;
    opponent: string;

    playerHand: PlayerHand;
    opponentHand: PlayerHand;

    playerScore: number;
    opponentScore: number;

    reserve: Reserve;

    gameBoard: GameBoard;

    turnState = new Subject<boolean>();

    constructor(private gridService: GridService) {}

    init(username: string): void {
        const validBotNames = DEFAULT_BOT_NAMES.filter((name) => name !== username);

        this.player = username;
        this.opponent = validBotNames[Math.floor(Math.random() * validBotNames.length)];

        this.playerHand = new PlayerHand();
        this.opponentHand = new PlayerHand();

        this.isInit = true;
        this.isStarted = false;
    }

    start(): void {
        const turnState = Boolean(Math.floor(Math.random() * 2));

        this.reserve = new Reserve();

        this.gameBoard = new GameBoard(DEFAULT_BONUSES);

        this.playerScore = 0;
        this.opponentScore = 0;

        const playerHand = this.reserve.draw(DEFAULT_HAND_SIZE);
        const opponentHand = this.reserve.draw(DEFAULT_HAND_SIZE);

        if (playerHand !== undefined && opponentHand !== undefined) {
            this.playerHand.addAll(playerHand);
            this.opponentHand.addAll(opponentHand);
        }
        this.turnState.next(turnState);
    }
    updateHand(playhand: PlayerHand): void {
        this.gridService.drawPlayerHand();
        this.gridService.drawPlayerHandLetters(playhand.letters);
    }
    updateGame(positions: Map<string, string>) {
        this.gridService.clearGrid();
        this.gridService.drawGridLetters(positions);
    }
}
