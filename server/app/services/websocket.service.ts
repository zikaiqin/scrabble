import * as io from 'socket.io';
import * as http from 'http';

export const MAX_CLIENT_PER_ROOM = 3;
export const DEFAULT_EMPTY_ROOM = 1;

export class WebSocketService {
    rooms: Map<string, number> = new Map([
        ['room1', DEFAULT_EMPTY_ROOM],
        ['room2', DEFAULT_EMPTY_ROOM],
        ['room3', DEFAULT_EMPTY_ROOM],
        ['room4', DEFAULT_EMPTY_ROOM],
        ['room5', DEFAULT_EMPTY_ROOM],
    ]);

    private sio: io.Server;

    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets() {
        this.sio.on('connection', (socket: io.Socket) => {
            // eslint-disable-next-line no-console
            console.log(`new client connected on socket: ${socket.id}`);

            socket.on('createRoom', (roomName: string) => {
                this.rooms.set(roomName, 1);
                socket.join(roomName);
            });

            socket.on('joinRoom', (roomName: string) => {
                let clients = this.rooms.get(roomName);
                if (clients) {
                    if (clients === MAX_CLIENT_PER_ROOM) {
                        this.sio.emit('roomFull', 'Room is full');
                    } else {
                        socket.join(roomName);
                        // eslint-disable-next-line no-console
                        console.log('room joined');
                        clients++;
                        this.rooms.set(roomName, clients);
                    }
                }
            });
        });
    }
}
