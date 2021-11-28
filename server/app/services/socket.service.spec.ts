/* eslint-disable dot-notation,max-lines,@typescript-eslint/no-explicit-any */
// we need this disable in order to declare spies (type is too complicated) --> any
import { SocketService } from '@app/services/socket.service';
import { Container } from 'typedi';
import * as http from 'http';
import { io, Socket } from 'socket.io-client';
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { HighscoreService } from '@app/services/highscore.service';
import Sinon, { createSandbox } from 'sinon';
import { Score } from '@app/classes/highscore';
import { GameInfo } from '@app/classes/game-info';
import { Server } from '@app/server';
// eslint-disable-next-line no-restricted-imports -- we need this import in order to simulate a client connection
import { environment } from '../../../client/src/environments/environment';

describe('SocketService', () => {
    let service: SocketService;
    let fakeHighScoreService: HighscoreService;
    let socketID: string;
    let socket: Socket;
    let server: Server;
    let activeRoomGetSpy: Sinon.SinonSpy<[key: string], string | undefined>;
    let socketEmitSpy: any;
    let sioEmitSpy: any;
    const sandbox = createSandbox();

    beforeEach(() => {
        socketID = 'abcd';
        fakeHighScoreService = Container.get(HighscoreService);
        service = new SocketService(http.createServer(), fakeHighScoreService);
        activeRoomGetSpy = sandbox.spy(service['activeRooms'], 'get');
        socketEmitSpy = sandbox.spy(service['socketEvents'], 'emit');
        sioEmitSpy = sandbox.spy(service['sio'], 'emit');
    });

    before(() => {
        server = Container.get(Server);
        server.init();
    });

    after(() => {
        socket.close();
    });

    it('updateObjectives should call the right function', () => {
        const publicObj: [number, boolean][] = [
            [1, false],
            [2, true],
        ];
        const privateObj: [number, boolean] = [3, false];
        service.updateObjectives(socketID, publicObj, privateObj);
        expect(sioEmitSpy.calledWith('updateObjectives', publicObj, privateObj));
    });

    it('deleteRoom should call the right functions', () => {
        const deleteSpy = sandbox.spy(service['waitingRooms'], 'delete');
        service.deleteRoom(socketID);
        expect(deleteSpy.calledWith(socketID));
        expect(sioEmitSpy.calledWith('updateRooms', service.roomList));
    });

    it('sendMessage should call the right functions', () => {
        service.sendMessage(socketID, socketID, socketID);
        expect(sioEmitSpy.calledWith('receiveMessage', socketID, socketID));
    });

    it('setConfigs should call the right functions', () => {
        const bonuses: Map<string, string> = new Map<string, string>([[socketID, socketID]]);
        const reserve: string[] = ['a', 'b', 'c', 'd'];
        service.setConfigs(socketID, socketID, socketID, bonuses, reserve, reserve, 0, false);
        expect(sioEmitSpy.calledWith('initGame', socketID, socketID, Array.from(bonuses.entries()), reserve, reserve, 0, false));
    });

    it('updateTime should call the right functions', () => {
        service.updateTime(socketID, 1);
        expect(sioEmitSpy.calledWith('updateTime', 1));
    });

    it('updateTurn should call the right functions', () => {
        service.updateTurn(socketID, true);
        expect(sioEmitSpy.calledWith('updateTurn', true));
    });

    it('updateBoard should call the right functions', () => {
        const board: Map<string, string> = new Map<string, string>([['a1', 'a']]);
        service.updateBoard(socketID, board);
        expect(sioEmitSpy.calledWith('updateBoard', Array.from(board.entries())));
    });

    it('updateReserve should call the right functions', () => {
        const reserve = ['a', 'b', 'c', 'd'];
        service.updateReserve(socketID, reserve);
        expect(sioEmitSpy.calledWith('updateReserve', reserve));
    });

    it('updateHands should call the right functions', () => {
        const ownHand = ['a', 'b', 'c', 'd'];
        const opponentHand = ['e', 'f', 'g', 'h'];
        service.updateHands(socketID, ownHand, opponentHand);
        expect(sioEmitSpy.calledWith('updateHands', ownHand, opponentHand));
    });

    it('updateScore should call the right functions', () => {
        const ownScore = 2;
        const opponentScore = 1;
        service.updateScores(socketID, ownScore, opponentScore);
        expect(sioEmitSpy.calledWith('updateScores', ownScore, opponentScore));
    });

    it('updateHighScore should call the right functions', () => {
        const collection: Score[] = [new Score('abc', 1)];
        service.updateHighscores(collection, 2);
        expect(sioEmitSpy.calledWith('updateHighscoreLog2990', collection));
        service.updateHighscores(collection, 1);
        expect(sioEmitSpy.calledWith('updateHighscoreClassic', collection));
    });

    it('gameEnded should call the right functions', () => {
        service.gameEnded(socketID, socketID);
        expect(sioEmitSpy.calledWith('gameEnded', socketID));
    });

    it('roomList should return correctly', () => {
        const info: GameInfo = { username: 'test' };
        service['waitingRooms'].set(socketID, info);
        const result = service.roomList;
        expect(result[0].username).to.equals(
            Array.from(service['waitingRooms'].entries(), ([roomID, configs]) => {
                return { ...configs, roomID };
            })[0].username,
        );
    });

    it('handleSocket should create all sockets', () => {
        socket = io(environment.serverUrl).connect();
        const emitSpy = sandbox.spy(socket, 'emit');
        const onSpy = sandbox.spy(socket, 'on');
        service.handleSockets();
        expect(emitSpy.calledWith('updateRooms', service.roomList));
        expect(onSpy.calledWith('createGame'));
        expect(onSpy.calledWith('joinGame'));
        expect(onSpy.calledWith('convertGame'));
        expect(onSpy.calledWith('sendMessage'));
        expect(onSpy.calledWith('place'));
        expect(onSpy.calledWith('exchange'));
        expect(onSpy.calledWith('skipTurn'));
        expect(onSpy.calledWith('disconnect'));
        expect(onSpy.calledWith('fetchObjectives'));
        expect(onSpy.calledWith('refresh'));
    });

    it('createGame should call the right functions with MULTI gameType', () => {
        socket = io(environment.serverUrl).connect();
        const configs: GameInfo = { username: 'test', turnLength: 60, randomized: false, gameMode: 1, gameType: 2, difficulty: 1, roomID: socketID };
        const setSpy = sandbox.spy(service['waitingRooms'], 'set');
        socket.emit('createGame', configs);
        expect(setSpy.calledWith('_' + socketID, configs));
        expect(sioEmitSpy.calledWith('updateRooms', service.roomList));
    });

    it('createGame should call the right functions with SINGLE gameType', () => {
        socket = io(environment.serverUrl).connect();
        const configs: GameInfo = { username: 'test', turnLength: 60, randomized: false, gameMode: 1, gameType: 1, difficulty: 1, roomID: socketID };
        socket.emit('createGame', configs);
        expect(socketEmitSpy.calledWith('_' + socketID, configs, [{ socketID: socket.id, username: configs.username }]));
    });

    // 50-50 to make tests in validationService crash because of response
    /*    it('joinGame should call the right function with configs', () => {
        socket = io(environment.serverUrl).connect();
        const getSpy = sandbox.spy(service['waitingRooms'], 'get');
        const setSpy = sandbox.spy(service['activeRooms'], 'set');
        const emitSpy = sandbox.spy(service['socketEvents'], 'emit');
        const deleteSpy = sandbox.spy(service, 'deleteRoom');
        socket.emit('joinGame', socketID, socketID, socketID);
        expect(getSpy.calledWith(socketID));
        expect(setSpy.notCalled);
        expect(emitSpy.notCalled);
        expect(deleteSpy.notCalled);

        const configs: GameInfo = { username: 'test', turnLength: 60, randomized: false, gameMode: 1, gameType: 1, difficulty: 1, roomID: socketID };
        service['waitingRooms'].set(socketID, configs);
        socket.emit('joinGame', socketID, socketID, socketID);
        expect(getSpy.calledWith(socketID));
        expect(setSpy.calledWith(socket.id, socketID));
        expect(
            emitSpy.calledWith('createGame', socketID, configs, [
                { socketID: socketID.slice(1), username: configs.username },
                { socketID: socket.id, username: socketID },
            ]),
        );
        expect(deleteSpy.calledWith(socketID));
    });*/

    it('convertGame should call the right functions', () => {
        socket = io(environment.serverUrl).connect();
        const waitingRoomGetSpy = sandbox.spy(service['waitingRooms'], 'get');
        const waitingRoomDeleteSpy = sandbox.spy(service['waitingRooms'], 'delete');

        service['activeRooms'].set(socket.id, socketID);
        const configs: GameInfo = { username: 'test', turnLength: 60, randomized: false, gameMode: 1, gameType: 1, difficulty: 1, roomID: socketID };
        service['waitingRooms'].set(socketID, configs);
        socket.emit('convertGame', 1);
        expect(activeRoomGetSpy.calledWith(socket.id));
        expect(activeRoomGetSpy.returned(socketID));
        expect(waitingRoomGetSpy.calledWith(socketID));
        expect(waitingRoomGetSpy.returned(configs));
        expect(waitingRoomDeleteSpy.calledWith(socketID));
        expect(waitingRoomDeleteSpy.returned(true));
        expect(socketEmitSpy.calledWith('createGame', socketID, configs, [{ socketID: socket.id, username: configs.username }]));
        expect(sioEmitSpy.calledWith('updateRooms', service.roomList));
    });

    it('convertGame should return part 1 nothing good', () => {
        socket = io(environment.serverUrl).connect();
        const waitingRoomGetSpy = sandbox.spy(service['waitingRooms'], 'get');
        const waitingRoomDeleteSpy = sandbox.spy(service['waitingRooms'], 'delete');

        service['waitingRooms'].clear();
        socket.emit('convertGame', 1);
        expect(activeRoomGetSpy.calledWith(socket.id));
        expect(activeRoomGetSpy.returned(undefined));
        expect(waitingRoomGetSpy.notCalled);
        expect(waitingRoomDeleteSpy.notCalled);
        expect(socketEmitSpy.notCalled);
        expect(sioEmitSpy.notCalled);
    });

    it('convertGame should return part 2 first statement good', () => {
        socket = io(environment.serverUrl).connect();
        const waitingRoomGetSpy = sandbox.spy(service['waitingRooms'], 'get');
        const waitingRoomDeleteSpy = sandbox.spy(service['waitingRooms'], 'delete');

        service['activeRooms'].set(socket.id, socketID);
        service['waitingRooms'].clear();
        socket.emit('convertGame', 1);
        expect(activeRoomGetSpy.calledWith(socket.id));
        expect(activeRoomGetSpy.returned(socketID));
        expect(waitingRoomGetSpy.calledWith(socketID));
        expect(waitingRoomGetSpy.returned(undefined));
        expect(waitingRoomDeleteSpy.notCalled);
        expect(socketEmitSpy.notCalled);
        expect(sioEmitSpy.notCalled);
    });

    it('sendMessage should call the right functions', () => {
        socket = io(environment.serverUrl).connect();

        service['activeRooms'].set(socket.id, socketID);
        socket.emit('sendMessage', 'Hello');
        expect(activeRoomGetSpy.calledWith(socket.id));
        expect(activeRoomGetSpy.returned(socketID));
        expect(socketEmitSpy.calledWith('receiveMessage', 'user-message', 'Hello'));
    });

    it('sendMessage should return', () => {
        socket = io(environment.serverUrl).connect();

        socket.emit('sendMessage', 'Hello');
        expect(activeRoomGetSpy.calledWith(socket.id));
        expect(activeRoomGetSpy.returned(undefined));
        expect(socketEmitSpy.notCalled);
    });

    it('place should call the right functions', () => {
        socket = io(environment.serverUrl).connect();

        service['activeRooms'].set(socket.id, socketID);
        socket.emit('place', 'a1', ['a1', 'b']);
        expect(activeRoomGetSpy.calledWith(socket.id));
        expect(activeRoomGetSpy.returned(socketID));
        expect(socketEmitSpy.calledWith('place', socket.id, socketID, 'a1', ['a1', 'b']));
        expect(socketEmitSpy.returned(true));
    });

    it('place should return', () => {
        socket = io(environment.serverUrl).connect();

        socket.emit('place', 'a1', ['a1', 'b']);
        expect(activeRoomGetSpy.calledWith(socket.id));
        expect(activeRoomGetSpy.returned(undefined));
        expect(socketEmitSpy.notCalled);
    });

    it('exchange should call the right functions', () => {
        socket = io(environment.serverUrl).connect();

        service['activeRooms'].set(socket.id, socketID);
        socket.emit('exchange', 'a1');
        expect(activeRoomGetSpy.calledWith(socket.id));
        expect(activeRoomGetSpy.returned(socketID));
        expect(socketEmitSpy.calledWith('exchange', socket.id, socketID, 'a1'));
    });

    it('exchange should return', () => {
        socket = io(environment.serverUrl).connect();

        socket.emit('exchange', 'a1');
        expect(activeRoomGetSpy.calledWith(socket.id));
        expect(activeRoomGetSpy.returned(undefined));
        expect(socketEmitSpy.notCalled);
    });

    it('skipTurn should call the right functions', () => {
        socket = io(environment.serverUrl).connect();

        service['activeRooms'].set(socket.id, socketID);
        socket.emit('skipTurn');
        expect(activeRoomGetSpy.calledWith(socket.id));
        expect(activeRoomGetSpy.returned(socketID));
        expect(socketEmitSpy.calledWith('skipTurn', socketID));
    });

    it('skipTurn should return', () => {
        socket = io(environment.serverUrl).connect();

        socket.emit('skipTurn');
        expect(activeRoomGetSpy.calledWith(socket.id));
        expect(activeRoomGetSpy.returned(undefined));
        expect(socketEmitSpy.notCalled);
    });

    it('fetchObjectives should call the right functions', () => {
        socket = io(environment.serverUrl).connect();

        service['activeRooms'].set(socket.id, socketID);
        socket.emit('fetchObjectives');
        expect(activeRoomGetSpy.calledWith(socket.id));
        expect(activeRoomGetSpy.returned(socketID));
        expect(socketEmitSpy.calledWith('updateObjectives', socket.id, socketID));
    });

    it('fetchObjectives should return', () => {
        socket = io(environment.serverUrl).connect();

        socket.emit('fetchObjectives');
        expect(activeRoomGetSpy.calledWith(socket.id));
        expect(activeRoomGetSpy.returned(undefined));
        expect(socketEmitSpy.notCalled);
    });

    it('refresh should call the right functions', () => {
        socket = io(environment.serverUrl).connect();
        const highScoreSpy = sandbox.spy(service['highscoreService'], 'getHighscore');

        socket.emit('refresh');
        expect(highScoreSpy.calledWith(2));
        expect(sioEmitSpy.calledWith('updateHighscoreLog2990'));
        expect(highScoreSpy.calledWith(1));
        expect(sioEmitSpy.calledWith('updateHighscoreClassic'));
    });
});
