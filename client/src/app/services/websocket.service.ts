import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { GameInfo } from '@app/classes/game-info';
import { Subject } from 'rxjs';
import { MessageType } from '@app/classes/message';
import { TextboxService } from './textbox.service';

const url = '//localhost:3000';

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    socket: Socket;
    socketEvent = new Subject<string>();
    startGame = new Subject<GameInfo>();
    roomList = new Subject<GameInfo[]>();

    constructor(private textBox: TextboxService) {
        this.socket = io(url, { autoConnect: false, reconnection: false });
        this.socket.on('connect', () => {
            this.socket.on('updateRooms', (rooms) => this.roomList.next(rooms));

            this.socket.on('startGame', (configs: GameInfo) => {
                this.startGame.next(configs);
            });

            this.socket.on('receiveMessage', (type: MessageType, message: string) => {
                this.textBox.sendMessage(type, message);
            });
        });
        this.socket.on('disconnect', (reason) => {
            if (reason === 'io client disconnect') {
                return;
            }
            this.roomList.next([]);
            this.socketEvent.next('connectionLost');
            this.socket.connect();
        });
    }

    sendMessage(message: string): void {
        this.socket.emit('sendMessage', message);
    }

    // TODO?: using acknowledgement, throw on timeout
    createRoom(configs: GameInfo): void {
        this.socket.emit('createRoom', configs);
    }

    joinRoom(roomID: string): void {
        this.socket.emit('joinRoom', roomID, (response: string) => {
            if (response !== 'ok') {
                this.socketEvent.next('roomNotFound');
            }
        });
    }

    /**
     * @description Leave the waiting room
     */
    leaveRoom(): void {
        this.socket.emit('leaveRoom');
    }

    /**
     * @description Leave an active game
     */
    abandonGame(): void {
        void 0;
    }

    connect(): void {
        this.socket.connect();
    }

    disconnect(): void {
        this.socket.disconnect();
    }
}
