/* eslint-disable dot-notation */
import { SocketService } from '@app/services/socket.service';
import { Container } from 'typedi';
import * as http from 'http';
import { io, Socket } from 'socket.io-client';
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { HighscoreService } from '@app/services/highscore.service';
import { createSandbox } from 'sinon';
import { Score } from '@app/classes/highscore';
import { GameInfo } from '@app/classes/game-info';
import { Server } from '@app/server';
import { environment } from '../../../client/src/environments/environment';

/* eslint-disable @typescript-eslint/no-magic-numbers */
describe('SocketService', () => {
    let service: SocketService;
    let fakeHighScoreService: HighscoreService;
    let socketID: string;
    let socket: Socket;
    let server: Server;
    const sandbox = createSandbox();

    beforeEach(() => {
        socketID = 'abcd';
        fakeHighScoreService = Container.get(HighscoreService);

        service = new SocketService(http.createServer(), fakeHighScoreService);
    });

    before(() => {
        server = Container.get(Server);
        server.init();
    });

    it('updateObjectives should call the right function', () => {
        const publicObj: [number, boolean][] = [
            [1, false],
            [2, true],
        ];
        const privateObj: [number, boolean] = [3, false];
        const spy = sandbox.spy(service['sio'], 'emit');
        service.updateObjectives(socketID, publicObj, privateObj);
        expect(spy.calledWith('updateObjectives', publicObj, privateObj));
    });

    it('deleteRoom should call the right functions', () => {
        const deleteSpy = sandbox.spy(service['waitingRooms'], 'delete');
        const emitSpy = sandbox.spy(service['sio'], 'emit');
        service.deleteRoom(socketID);
        expect(deleteSpy.calledWith(socketID));
        expect(emitSpy.calledWith('updateRooms', service.roomList));
    });

    it('sendMessage should call the right functions', () => {
        const spy = sandbox.spy(service['sio'], 'emit');
        service.sendMessage(socketID, socketID, socketID);
        expect(spy.calledWith('receiveMessage', socketID, socketID));
    });

    it('setConfigs should call the right functions', () => {
        const bonuses: Map<string, string> = new Map<string, string>([[socketID, socketID]]);
        const reserve: string[] = ['a', 'b', 'c', 'd'];
        const spy = sandbox.spy(service['sio'], 'emit');
        service.setConfigs(socketID, socketID, socketID, bonuses, reserve, reserve, 0, false);
        expect(spy.calledWith('initGame', socketID, socketID, Array.from(bonuses.entries()), reserve, reserve, 0, false));
    });

    it('updateTime should call the right functions', () => {
        const spy = sandbox.spy(service['sio'], 'emit');
        service.updateTime(socketID, 1);
        expect(spy.calledWith('updateTime', 1));
    });

    it('updateTurn should call the right functions', () => {
        const spy = sandbox.spy(service['sio'], 'emit');
        service.updateTurn(socketID, true);
        expect(spy.calledWith('updateTurn', true));
    });

    it('updateBoard should call the right functions', () => {
        const board: Map<string, string> = new Map<string, string>([['a1', 'a']]);
        const spy = sandbox.spy(service['sio'], 'emit');
        service.updateBoard(socketID, board);
        expect(spy.calledWith('updateBoard', Array.from(board.entries())));
    });

    it('updateReserve should call the right functions', () => {
        const reserve = ['a', 'b', 'c', 'd'];
        const spy = sandbox.spy(service['sio'], 'emit');
        service.updateReserve(socketID, reserve);
        expect(spy.calledWith('updateReserve', reserve));
    });

    it('updateHands should call the right functions', () => {
        const ownHand = ['a', 'b', 'c', 'd'];
        const opponentHand = ['e', 'f', 'g', 'h'];
        const spy = sandbox.spy(service['sio'], 'emit');
        service.updateHands(socketID, ownHand, opponentHand);
        expect(spy.calledWith('updateHands', ownHand, opponentHand));
    });

    it('updateScore should call the right functions', () => {
        const ownScore = 2;
        const opponentScore = 1;
        const spy = sandbox.spy(service['sio'], 'emit');
        service.updateScores(socketID, ownScore, opponentScore);
        expect(spy.calledWith('updateScores', ownScore, opponentScore));
    });

    it('updateHighScore should call the right functions', () => {
        const collection: Score[] = [new Score('abc', 1)];
        const spy = sandbox.spy(service['sio'], 'emit');
        service.updateHighscores(collection, 2);
        expect(spy.calledWith('updateHighscoreLog2990', collection));
        service.updateHighscores(collection, 1);
        expect(spy.calledWith('updateHighscoreClassic', collection));
    });

    it('gameEnded should call the right functions', () => {
        const spy = sandbox.spy(service['sio'], 'emit');
        service.gameEnded(socketID, socketID);
        expect(spy.calledWith('gameEnded', socketID));
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
    });
});
