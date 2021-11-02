import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AlertService } from '@app/services/alert.service';
import { TextboxService } from '@app/services/textbox.service';
import { GameInfo } from '@app/classes/game-info';

const url = '//localhost:3000';

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    socket: Socket;

    connectionEvent = new Subject<string>();
    startGame = new Subject<GameInfo>();
    roomList = new Subject<GameInfo[]>();

    gameTime = new Subject<number>();
    gameTurn = new Subject<boolean>();

    constructor(private textBox: TextboxService, private alertService: AlertService) {}

    attachListeners(): void {
        this.socket.on('connect', () => {
            this.socket.on('updateRooms', (rooms: GameInfo[]) => {
                this.roomList.next(rooms);
            });

            this.socket.on('setConfigs', (self: string, opponent: string, bonuses: Map<string, string>, hand: string[]) => {
                void [self, opponent, bonuses, hand];
                this.startGame.next(/* send configs to game-page */);
            });

            this.socket.on('receiveMessage', (type: string, message: string) => {
                this.textBox.displayMessage(type, message);
            });

            this.socket.on('updateHand', (hand: string[]) => {
                void hand;
            });

            this.socket.on('updateBoard', (board: string[][]) => {
                void board;
            });

            this.socket.on('updateReserve', (reserve: string[]) => {
                void reserve;
            });

            this.socket.on('updateScores', (scores: number[]) => {
                // scores[0]: own score | scores[1]: opponent score
                void scores;
            });

            this.socket.on('updateTime', (time: number) => {
                this.gameTime.next(time);
            });

            this.socket.on('updateTurn', (turn: boolean) => {
                this.gameTurn.next(turn);
            });
        });
        this.socket.on('disconnect', (reason) => {
            if (reason === 'io client disconnect') {
                return;
            }
            this.roomList.next([]);
            this.alertService.showAlert('La connexion au serveur a été interrompue');
            this.connectionEvent.next('connectionLost');
        });
    }

    /**
     * @param configs configs for new game. No room ID, difficulty optional.
     * @link NewGameMenuComponent.newGame
     */
    createRoom(configs: GameInfo): void {
        this.socket.emit('createRoom', configs);
    }

    /**
     * @param info username and ID of room to join
     * @link GameBrowserComponent.joinRoom
     */
    joinRoom(info: GameInfo): void {
        this.socket.emit('joinRoom', info.username, info.roomID, (response: { status: string }) => {
            if (response.status !== 'ok') {
                this.alertService.showAlert("La partie que vous avez essayé de joindre n'est plus disponible");
            }
        });
    }

    sendMessage(message: string): void {
        this.socket.emit('sendMessage', message);
    }

    placeLetters(startCoord: string, letters: Map<string, string>): void {
        this.socket.emit('place', startCoord, letters);
    }

    exchangeLetters(letters: string): void {
        this.socket.emit('exchange', letters);
    }

    skipturn(): void {
        this.socket.emit('skipTurn');
    }

    /**
     * @description Leave an active game
     */
    abandonGame(): void {
        void 0;
    }

    connect(): void {
        this.socket = io(url).connect();
        this.attachListeners();
    }

    disconnect(): void {
        this.socket.disconnect();
    }
}
