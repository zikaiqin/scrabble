import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

const url = '//localhost:3000';

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    socket: Socket;
    roomState: string;

    constructor() {
        this.socket = io(url);
        this.socket.on('connect', () => {
            // eslint-disable-next-line no-console
            console.log(`connection to server on socket: ${this.socket.id}`);
            this.socket.on('roomFull', (message: string) => {
                return this.roomState = message;
            });
        });
    }

    createRoom(room: string): void {
        this.socket.emit('createRoom', room);
    }

    joinRoom(room: string): void {
        this.socket.emit('joinRoom', room);
        // eslint-disable-next-line no-console
        console.log('join room client');
    }
}
