import EventEmitter from 'events';
import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';
import { GameInfo, GameMode, GameType } from '@app/classes/game-info';
import { MessageType } from '@app/classes/message';
import { ROOM_MARKER } from '@app/classes/config';
import { Score } from '@app/classes/highscore';
import { HighscoreService } from '@app/services/highscore.service';

@Service()
export class SocketService {
    readonly waitingRooms = new Map<string, GameInfo>();
    readonly activeRooms = new Map<string, string>();
    readonly socketEvents = new EventEmitter();

    private sio: io.Server;

    constructor(server: http.Server, private highscoreService: HighscoreService) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets() {
        this.sio.on('connection', (socket: io.Socket) => {
            socket.emit('updateRooms', this.roomList);

            socket.on('createGame', (configs: GameInfo) => {
                const room = `${ROOM_MARKER}${socket.id}`;
                socket.join(room);
                this.activeRooms.set(socket.id, room);

                if (configs.gameType === GameType.Multi) {
                    this.waitingRooms.set(room, configs);
                    this.sio.emit('updateRooms', this.roomList);
                } else {
                    this.socketEvents.emit('createGame', room, configs, [{ socketID: socket.id, username: configs.username }]);
                }
            });

            socket.on('joinGame', (username: string, room: string, response) => {
                const configs = this.waitingRooms.get(room);
                if (configs === undefined) {
                    response({
                        status: 'fail',
                    });
                } else {
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

            socket.on('convertGame', (difficulty: number) => {
                const roomID = this.activeRooms.get(socket.id);
                if (roomID === undefined) {
                    return;
                }
                const configs = this.waitingRooms.get(roomID);
                if (configs === undefined) {
                    return;
                }
                this.waitingRooms.delete(roomID);

                configs.gameType = GameType.Single;
                configs.difficulty = difficulty;

                this.socketEvents.emit('createGame', roomID, configs, [{ socketID: socket.id, username: configs.username }]);
                this.sio.emit('updateRooms', this.roomList);
            });

            socket.on('sendMessage', (message: string) => {
                const room = this.activeRooms.get(socket.id);
                if (room === undefined) {
                    return;
                }
                socket.broadcast.to(room).emit('receiveMessage', MessageType.User, message);
            });

            socket.on('place', (startCoords: string, letters: [string, string][]) => {
                const roomID = this.activeRooms.get(socket.id);
                if (roomID === undefined) {
                    return;
                }
                this.socketEvents.emit('place', socket.id, roomID, startCoords, letters);
            });

            socket.on('exchange', (letters: string) => {
                const roomID = this.activeRooms.get(socket.id);
                if (roomID === undefined) {
                    return;
                }
                this.socketEvents.emit('exchange', socket.id, roomID, letters);
            });

            socket.on('skipTurn', () => {
                const roomId = this.activeRooms.get(socket.id);
                if (roomId !== undefined) {
                    this.socketEvents.emit('skipTurn', roomId);
                }
            });

            socket.on('disconnect', () => {
                this.disconnect(socket);
            });

            socket.on('fetchObjectives', () => {
                const roomId = this.activeRooms.get(socket.id);
                if (roomId === undefined) return;
                this.socketEvents.emit('updateObjectives', socket.id, roomId);
            });

            socket.on('refresh', () => {
                this.highscoreService.getHighscore(GameMode.Log2990).then((highScore) => {
                    this.sio.emit('updateHighscoreLog2990', highScore);
                });
                this.highscoreService.getHighscore(GameMode.Classical).then((highScore) => {
                    this.sio.emit('updateHighscoreClassic', highScore);
                });
            });
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

    updateObjectives(socketID: string, publicObj: [number, boolean][], privateObj: [number, boolean]): void {
        this.sio.to(socketID).emit('updateObjectives', publicObj, privateObj);
    }

    deleteRoom(roomID: string) {
        this.waitingRooms.delete(roomID);
        this.sio.emit('updateRooms', this.roomList);
    }

    sendMessage(roomID: string, type: string, message: string) {
        this.sio.to(roomID).emit('receiveMessage', type, message);
    }

    setConfigs(
        socketID: string,
        self: string,
        opponent: string,
        bonuses: Map<string, string>,
        reserve: string[],
        hand: string[],
        gameMode: number,
        turnState?: boolean,
    ) {
        this.sio.to(socketID).emit('initGame', self, opponent, Array.from(bonuses.entries()), reserve, hand, gameMode, turnState);
    }

    updateTime(roomID: string, time: number) {
        this.sio.to(roomID).emit('updateTime', time);
    }

    updateTurn(socketID: string, turnState: boolean) {
        this.sio.to(socketID).emit('updateTurn', turnState);
    }

    updateBoard(roomID: string, board: Map<string, string>) {
        this.sio.to(roomID).emit('updateBoard', Array.from(board.entries()));
    }

    updateReserve(roomID: string, reserve: string[]) {
        this.sio.to(roomID).emit('updateReserve', reserve);
    }

    updateHands(socketID: string, ownHand: string[], opponentHand: string[]) {
        this.sio.to(socketID).emit('updateHands', ownHand, opponentHand);
    }

    updateScores(socketID: string, ownScore: number, opponentScore: number) {
        this.sio.to(socketID).emit('updateScores', ownScore, opponentScore);
    }

    updateHighscores(collection: Score[], gameMode: number) {
        if (gameMode === GameMode.Log2990) {
            this.sio.emit('updateHighscoreLog2990', collection);
        } else {
            this.sio.emit('updateHighscoreClassic', collection);
        }
    }

    gameEnded(roomId: string, winner: string) {
        this.sio.to(roomId).emit('gameEnded', winner);
    }

    get roomList(): GameInfo[] {
        return Array.from(this.waitingRooms.entries(), ([roomID, configs]) => {
            return { ...configs, roomID };
        });
    }
}
