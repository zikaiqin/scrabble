import * as io from 'socket.io';
import * as http from 'http';

export const MAX_CLIENT_PER_ROOM = 2;

export class WebSocketService {
    rooms: Map<string, number> = new Map([
        ['room1', 0],
        ['room2', 0],
        ['room3', 0],
        ['room4', 0],
        ['room5', 0],
    ]);

    private sio: io.Server;

    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets() {
        this.sio.on('connection', (socket: io.Socket) => {
            // eslint-disable-next-line no-console
            console.log(`new client connected on socket: ${socket.id}`);
        });

        this.sio.on('createRoom', (roomName: string) => {
            this.rooms.set(roomName, 1);
            this.sio.socketsJoin(roomName);
        });

        this.sio.on('joinRoom', (roomName: string) => {
            let clients = this.rooms.get(roomName);
            if (clients) {
                if (clients === MAX_CLIENT_PER_ROOM) {
                    this.sio.emit('roomFull', 'Room is full');
                } else {
                    this.sio.socketsJoin(roomName);
                    console.log('room joined');
                    clients++;
                    this.rooms.set(roomName, clients);
                }
            }
        });
    }
}
