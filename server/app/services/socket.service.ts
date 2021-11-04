import { GameInfo } from '@app/classes/game-info';
import { MessageType } from '@app/classes/message';
import EventEmitter from 'events';
import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';
// import { EndGameService } from '@app/services/end-game.service';

@Service()
export class SocketService {
    readonly waitingRooms = new Map<string, GameInfo>();
    readonly activeRooms = new Map<string, string>();
    readonly socketEvents = new EventEmitter();

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
                this.activeRooms.set(socket.id, room);
                this.sio.emit('updateRooms', this.roomList);
            });

            socket.on('joinRoom', (username: string, room: string, response) => {
                const configs = this.waitingRooms.get(room);
                if (configs === undefined) {
                    // eslint-disable-next-line no-console
                    console.log(`client on socket: "${socket.id}" attempted to join non-existent room with id: "${room}"`);
                    response({
                        status: 'fail',
                    });
                } else {
                    // eslint-disable-next-line no-console
                    console.log(`client on socket: "${socket.id}" joined room with id: "${room}"`);
                    socket.join(room);
                    this.activeRooms.set(socket.id, room);
                    this.socketEvents.emit('createGame', room, configs, [
                        { socketID: room.slice(1), username: configs.username },
                        { socketID: socket.id, username },
                    ]);
                    this.deleteRoom(room);
                    response({
                        status: 'ok',
                    });
                }
            });

            socket.on('sendMessage', (message: string) => {
                const room = this.activeRooms.get(socket.id);
                if (room === undefined) {
                    return;
                }
                socket.broadcast.to(room).emit('receiveMessage', MessageType.User, message);
            });

            // TODO
            socket.on('place', (startCoord: string, letters: Map<string, string>) => {
                const room = this.activeRooms.get(socket.id);
                if (room === undefined) {
                    return;
                }
                this.socketEvents.emit('place', startCoord, letters, room, socket.id);
            });

            // TODO
            socket.on('exchange', (letters: string) => {
                const room = this.activeRooms.get(socket.id);
                const message = `Succès de la commande : !échanger ${letters}`;
                if (room === undefined) {
                    return;
                }
                this.socketEvents.emit('exchange');
                socket.emit('receiveMessage', MessageType.System, message);
            });

            socket.on('skipTurn', () => {
                const roomId = this.activeRooms.get(socket.id);
                if (roomId !== undefined) {
                    this.socketEvents.emit('skipTurn', roomId);
                }
            });

            socket.on('disconnect', (reason) => {
                // eslint-disable-next-line no-console
                console.log(`client on socket: "${socket.id}" has disconnected with reason: "${reason}"`);
                this.disconnect(socket);
            });

            socket.on('gaveUp', () => {
                const room = this.activeRooms.get(socket.id);
                if (room === undefined) {
                    return;
                }
                this.sio.to(room).emit('playerGaveUp');
                this.disconnect(socket);
            })
        });
    }

    disconnect(socket: io.Socket) {
        const roomID = this.activeRooms.get(socket.id);
        if (roomID === undefined) {
            return;
        }
        socket.leave(roomID);
        this.activeRooms.delete(socket.id);
        this.socketEvents.emit('disconnect', socket.id, roomID);
        this.deleteRoom(roomID);
    }

    deleteRoom(roomID: string) {
        this.waitingRooms.delete(roomID);
        this.sio.emit('updateRooms', this.roomList);
    }

    sendSystemMessage(roomID: string, message: string) {
        this.sio.to(roomID).emit('receiveMessage', MessageType.System, message);
    }

    setConfigs(
        socketID: string,
        self: string,
        opponent: string,
        bonuses: Map<string, string>,
        reserve: string[],
        hand: string[],
        turnState?: boolean,
    ) {
        this.sio.to(socketID).emit('initGame', self, opponent, Array.from(bonuses.entries()), reserve, hand, turnState);
    }

    updateTime(roomID: string, time: number) {
        this.sio.to(roomID).emit('updateTime', time);
    }

    updateTurn(socketID: string, turnState: boolean) {
        this.sio.to(socketID).emit('updateTurn', turnState);
    }

    displayLettersLeft(roomID: string, message: string) {
        this.sio.to(roomID).emit('receiveMessage', MessageType.System, message);
    }

    gameEnded(roomId: string) {
        this.sio.to(roomId).emit('gameDone');
    }

    getWinner(roomId: string, winner: string) {
        this.sio.to(roomId).emit('getWinner', winner);
    }

    get roomList(): GameInfo[] {
        return Array.from(this.waitingRooms.entries(), ([roomID, configs]) => {
            return { ...configs, roomID };
        });
    }
}
