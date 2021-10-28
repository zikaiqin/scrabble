import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { GameInfo } from '@app/classes/game-info';
import { Subject } from 'rxjs';

const url = '//localhost:3000';

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    socket: Socket;
    socketError = new Subject<string>();
    roomList = new Subject<GameInfo[]>();

    constructor() {
        this.socket = io(url, { autoConnect: false, reconnection: false });
        this.socket.on('connect', () => {
            this.socket.on('updateRooms', (rooms) => this.roomList.next(rooms));

            // TODO: implement logic to start game (switch to game view, init gameService) upon receiving signal from server
            this.socket.on('startGame', () => {
                void 0;
            });
        });
        this.socket.on('disconnect', (reason) => {
            if (reason === 'io client disconnect') {
                return;
            }
            this.roomList.next([]);
            this.socketError.next('connectionLost');
            this.socket.connect();
        });
    }

    // TODO?: using acknowledgement, throw on timeout
    createRoom(configs: GameInfo): void {
        this.socket.emit('createRoom', configs);
    }

    joinRoom(roomID: string): void {
        this.socket.emit('joinRoom', roomID, (response: string) => {
            if (response !== 'ok') {
                this.socketError.next('roomNotFound');
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
