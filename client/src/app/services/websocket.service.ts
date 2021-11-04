import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AlertService } from '@app/services/alert.service';
import { TextboxService } from '@app/services/textbox.service';
import { GameInfo, GameInit } from '@app/classes/game-info';

const url = '//localhost:3000';

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    private socket: Socket;

    private connectionStatus = new Subject<string>();
    private roomList = new Subject<GameInfo[]>();

    private gameInit = new Subject<GameInit>();
    private gameTime = new Subject<number>();
    private gameTurn = new Subject<boolean>();
    private gameBoard = new Subject<[string, string][]>();
    private gameReserve = new Subject<string[]>();
    private gameHands = new Subject<{ ownHand: string[]; opponentHand: string[] }>();
    private gameScores = new Subject<{ ownScore: number; opponentScore: number }>();
    private gameEnded = new Subject<string>();

    constructor(private router: Router, private textBox: TextboxService, private alertService: AlertService) {}

    attachListeners(): void {
        this.socket.on('connect', () => {
            this.socket.on('updateRooms', (rooms: GameInfo[]) => {
                this.roomList.next(rooms);
            });

            this.socket.on(
                'initGame',
                (self: string, opponent: string, bonuses: [string, string][], reserve: string[], hand: string[], turnState: boolean | undefined) => {
                    this.router.navigateByUrl('/game').then(() => {
                        this.gameInit.next({ self, opponent, bonuses, reserve, hand, turnState });
                    });
                },
            );

            this.socket.on('receiveMessage', (type: string, message: string) => {
                this.textBox.displayMessage(type, message);
            });

            this.socket.on('updateBoard', (board: [string, string][]) => {
                this.gameBoard.next(board);
            });

            this.socket.on('updateReserve', (reserve: string[]) => {
                this.gameReserve.next(reserve);
            });

            this.socket.on('updateTime', (time: number) => {
                this.gameTime.next(time);
            });

            this.socket.on('updateTurn', (turn: boolean) => {
                this.gameTurn.next(turn);
            });

            this.socket.on('updateHands', (ownHand: string[], opponentHand: string[]) => {
                this.gameHands.next({ ownHand, opponentHand });
            });

            this.socket.on('updateScores', (ownScore: number, opponentScore: number) => {
                this.gameScores.next({ ownScore, opponentScore });
            });
            this.socket.on('gameEnded', (winner: string) => {
                this.gameEnded.next(winner);
            });
        });
        this.socket.on('disconnect', (reason) => {
            if (reason === 'io client disconnect') {
                return;
            }
            this.roomList.next([]);
            this.alertService.showAlert('La connexion au serveur a été interrompue');
            this.connectionStatus.next('connectionLost');
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

    skipTurn(): void {
        this.socket.emit('skipTurn');
    }

    /**
     * @description Leave an active game
     */
    giveUp(): void {
        this.socket.emit('gaveUp');
        this.socket.disconnect();
    }

    connect(): void {
        this.socket = io(url).connect();
        this.attachListeners();
    }

    disconnect(): void {
        this.socket.disconnect();
    }

    get status(): Observable<string> {
        return this.connectionStatus.asObservable();
    }

    get rooms(): Observable<GameInfo[]> {
        return this.roomList.asObservable();
    }

    get init(): Observable<GameInit> {
        return this.gameInit.asObservable();
    }

    get time(): Observable<number> {
        return this.gameTime.asObservable();
    }

    get turn(): Observable<boolean> {
        return this.gameTurn.asObservable();
    }

    get board(): Observable<[string, string][]> {
        return this.gameBoard.asObservable();
    }

    get reserve(): Observable<string[]> {
        return this.gameReserve.asObservable();
    }

    get hands(): Observable<{ ownHand: string[]; opponentHand: string[] }> {
        return this.gameHands.asObservable();
    }

    get scores(): Observable<{ ownScore: number; opponentScore: number }> {
        return this.gameScores.asObservable();
    }

    get endGame(): Observable<string> {
        return this.gameEnded.asObservable();
    }
}
