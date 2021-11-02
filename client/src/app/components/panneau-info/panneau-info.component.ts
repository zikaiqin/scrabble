import { Component } from '@angular/core';
import { DEFAULT_HAND_SIZE } from '@app/classes/game-config';
import { PlayerHand } from '@app/classes/player-hand';
import { GameService } from '@app/services/game.service';
import { WebsocketService } from '@app/services/websocket.service';
import { CommandService } from '@app/services/command.service';
import { MessageType } from '@app/classes/message';
import { TextboxService } from '@app/services/textbox.service';

enum PlayerType {
    Human,
    Bot,
}

@Component({
    selector: 'app-panneau-info',
    templateUrl: './panneau-info.component.html',
    styleUrls: ['./panneau-info.component.scss'],
})
export class PanneauInfoComponent {
    readonly playerType = PlayerType;

    playerHand: PlayerHand = new PlayerHand();
    opponentHand: PlayerHand = new PlayerHand();

    playerScore = 0;
    opponentScore = 0;

    isVisibleWinner: boolean;
    isVisiblePlayer: boolean;
    isVisibleOpponent: boolean;
    isVisibleGiveUp: boolean;
    isMyTurn: boolean;

    turnTime: number;

    constructor(
        private commandService: CommandService,
        private gameService: GameService,
        private textboxService: TextboxService,
        private websocketService: WebsocketService,
    ) {
        this.websocketService.gameTurn.asObservable().subscribe((turn) => {
            this.isMyTurn = turn;
        });
        this.websocketService.gameTime.asObservable().subscribe((time) => {
            this.turnTime = time;
        });
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
        this.isVisiblePlayer = true;
        this.isVisibleOpponent = true;
        this.isVisibleWinner = false;
        this.isVisibleGiveUp = false;
    }

    getTurnMessage(): string {
        return this.isMyTurn === undefined ? 'Initiez la partie' : this.isMyTurn ? 'Votre tour' : "Tour de l'adversaire";
    }

    getTurnColor(): string {
        return this.isMyTurn === undefined ? 'LightGray' : this.isMyTurn ? 'Green' : 'Red';
    }

    getTurnTime(): string {
        const minutes = Math.floor(this.turnTime / MINUTE);
        const seconds = this.turnTime - minutes * MINUTE;
        return `${minutes}:${seconds >= MIN_SECONDS ? seconds : `0${seconds}`}`;
    }

    getReserveSize(): number {
        return this.gameService.reserve === undefined ? 0 : this.gameService.reserve.size;
    }

    getHandSize(player: number): number | null {
        if (player === PlayerType.Human) {
            if (this.playerHand.size > DEFAULT_HAND_SIZE) {
                this.isVisiblePlayer = false;
                return null;
            }
            return this.playerHand.size;
        } else {
            if (this.opponentHand.size > DEFAULT_HAND_SIZE) {
                this.isVisibleOpponent = false;
                return null;
            }
            return this.opponentHand.size;
        }
    }

    getScore(player: number): number {
        return player === PlayerType.Human ? this.playerScore : this.opponentScore;
    }

    getName(player: number): string {
        return player === PlayerType.Human ? this.gameService.player : this.gameService.opponent;
    }

    skipTurn(): void {
        const command = '!passer';
        this.textboxService.displayMessage(MessageType.Own, command);
        this.commandService.parseCommand(command);
    }
}

const MINUTE = 60;
const MIN_SECONDS = 10;
