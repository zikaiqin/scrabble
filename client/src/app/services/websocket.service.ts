import { Injectable } from '@angular/core';
import { GameInfo } from '@app/classes/game-info';
import { MessageType } from '@app/classes/message';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { TextboxService } from './textbox.service';
import { AlertService } from '@app/services/alert.service';

const url = '//localhost:3000';

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    socket: Socket;
    socketEvent = new Subject<string>();
    startGame = new Subject<GameInfo>();
    roomList = new Subject<GameInfo[]>();

    constructor(private textBox: TextboxService, private alertService: AlertService) {}

    attachListeners(): void {
        this.socket.on('connect', () => {
            this.socket.on('updateRooms', (rooms: GameInfo[]) => {
                this.roomList.next(rooms);
            });

            this.socket.on('startGame', (configs: GameInfo) => {
                this.startGame.next(configs);
            });

            this.socket.on('receiveMessage', (type: MessageType, message: string) => {
                this.textBox.displayMessage(type, message);
            });
        });
        this.socket.on('disconnect', (reason) => {
            if (reason === 'io client disconnect') {
                return;
            }
            this.roomList.next([]);
            this.alertService.showAlert('La connexion au serveur a été interrompue');
            this.socketEvent.next('connectionLost');
        });
    }

    placeLetters(position: string, word: string): void {
        this.socket.emit('place', position, word);
    }

    exchangeLetters(letters: string): void {
        this.socket.emit('exchange', letters);
    }

    sendMessage(message: string): void {
        this.socket.emit('sendMessage', message);
    }

    createRoom(configs: GameInfo): void {
        this.socket.emit('createRoom', configs);
    }

    joinRoom(roomID: string): void {
        this.socket.emit('joinRoom', roomID, (response: { status: string; configs: GameInfo }) => {
            if (response.status !== 'ok') {
                this.alertService.showAlert("La partie que vous avez essayé de joindre n'est plus disponible");
            }
        });
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
