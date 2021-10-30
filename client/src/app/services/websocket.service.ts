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

    constructor(private textBox: TextboxService) {}

    handleSocket(): void {
        this.socket.on('connect', () => {
            // eslint-disable-next-line no-console
            console.log(`connection on socket: "${this.socket.id}"`);
            this.socket.on('updateRooms', (rooms) => this.roomList.next(rooms));

            this.socket.on('startGame', (configs: GameInfo) => {
                this.startGame.next(configs);
            });

            this.socket.on('receiveMessage', (type: MessageType, message: string) => {
                // eslint-disable-next-line no-console
                console.log(`received message on socket: "${this.socket.id}"`);
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

    createRoom(configs: GameInfo): void {
        this.socket.emit('createRoom', configs);
    }

    joinRoom(roomID: string): void {
        this.socket.emit('joinRoom', roomID, (response: { status: string; configs: GameInfo }) => {
            if (response.status !== 'ok') {
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
        this.socket = io(url).connect();
        this.handleSocket();
    }

    disconnect(): void {
        this.socket.disconnect();
    }
}
