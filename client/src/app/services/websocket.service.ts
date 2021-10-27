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
        this.socket = io(url);
        this.socket.on('connect', () => {
            // eslint-disable-next-line no-console
            console.log(`connection to server on socket: ${this.socket.id}`);

            // FIXME: switch to using acknowledgement -- see https://socket.io/docs/v4/emitting-events/#acknowledgements
            this.socket.on('roomNotFound', () => this.socketError.next('roomNotFound'));

            this.socket.on('updateRooms', (rooms) => this.roomList.next(rooms));

            // TODO: implement logic to start game (switch to game view, init gameService) upon receiving signal from server
            this.socket.on('startGame', () => {
                void 0;
            });
        });
    }

    createRoom(configs: GameInfo): void {
        this.socket.emit('createRoom', configs);
    }

    // TODO: use acknowledgement for error detection
    joinRoom(roomID: string): void {
        this.socket.emit('joinRoom', roomID);
        // eslint-disable-next-line no-console
        console.log('join room client');
    }

    fetchRooms(): void {
        this.socket.emit('fetchRooms');
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
}
