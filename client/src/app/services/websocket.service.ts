import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

const url = '//localhost:3000';

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>;

    constructor() {
        this.socket = io(url);
        this.socket.on('connect', () => {
            // eslint-disable-next-line no-console
            console.log(`connection to server on socket: ${this.socket.id}`);
        });
    }
}
