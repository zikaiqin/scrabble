import * as io from 'socket.io';
import * as http from 'http';
import { GameInfo } from '@app/classes/game-info';
import { MessageType } from '@app/classes/message';

export class WebSocketService {
    waitingRooms = new Map<string, GameInfo>();
    activeSockets = new Map<string, string>();

    private sio: io.Server;

    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets() {
        this.sio.on('connection', (socket: io.Socket) => {
            // eslint-disable-next-line no-console
            console.log(`new client connected on socket: "${socket.id}"`);
            socket.emit('updateRooms', this.roomList);

            socket.on('createRoom', (configs: GameInfo) => {
                // eslint-disable-next-line no-console
                console.log(`new room created by client on socket: "${socket.id}"`);
                const room = `_${socket.id}`;
                socket.join(room);
                this.waitingRooms.set(room, configs);
                this.activeSockets.set(socket.id, room);
                this.sio.emit('updateRooms', this.roomList);
            });

            socket.on('joinRoom', (room: string, response) => {
                if (!this.waitingRooms.has(room)) {
                    // eslint-disable-next-line no-console
                    console.log(`client on socket: "${socket.id}" attempted to join non-existent room with id: "${room}"`);
                    response({
                        status: 'fail',
                    });
                } else {
                    // eslint-disable-next-line no-console
                    console.log(`client on socket: "${socket.id}" joined room with id: "${room}"`);
                    socket.join(room);
                    this.activeSockets.set(socket.id, room);
                    this.sio.to(room).emit('startGame', this.waitingRooms.get(room));
                    this.deleteRoom(room);
                    response({
                        status: 'ok',
                    });
                }
            });

            socket.on('disconnect', (reason) => {
                // eslint-disable-next-line no-console
                console.log(`client on socket: "${socket.id}" has disconnected with reason: "${reason}"`);
                this.disconnect(socket);
            });

            socket.on('sendMessage', (message: string) => {
                const room = this.activeSockets.get(socket.id);
                if (room === undefined) {
                    return;
                }
                this.sio.to(room).emit('receiveMessage', MessageType.User, message);
            });
        });
    }

    disconnect(socket: io.Socket) {
        const roomID = this.activeSockets.get(socket.id);
        if (roomID === undefined) {
            return;
        }
        socket.leave(roomID);
        this.activeSockets.delete(socket.id);
        this.deleteRoom(roomID);
    }

    deleteRoom(roomID: string) {
        this.waitingRooms.delete(roomID);
        this.sio.emit('updateRooms', this.roomList);
    }

    get roomList(): GameInfo[] {
        return Array.from(this.waitingRooms.entries(), ([roomID, configs]) => {
            return { ...configs, roomID };
        });
    }
}
