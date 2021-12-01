/* eslint-disable dot-notation,max-lines,@typescript-eslint/no-explicit-any,@typescript-eslint/no-magic-numbers */
// we need this disable in order to declare spies (type is too complicated) --> any
import { Container } from 'typedi';
import { io, Socket } from 'socket.io-client';
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { GameInfo, GameMode, GameType } from '@app/classes/game-info';
import { Server } from '@app/server';
import { MessageType } from '@app/classes/message';
import { createSandbox } from 'sinon';
import { SocketService } from '@app/services/socket.service';

describe('SocketService', () => {
    let service: SocketService;
    let clientSocket: Socket;
    let clientSocket2: Socket;
    let server: Server;
    let configs: GameInfo;
    const sandbox = createSandbox();
    let counter: number;
    const url = 'http://localhost:3000';

    beforeEach(() => {
        service = server['socketService'];
        configs = { username: 'test', turnLength: 60, randomized: false, gameMode: GameMode.Log2990, gameType: GameType.Single, difficulty: 1 };
        counter = 0;
    });

    before(() => {
        server = Container.get(Server);
        server.init();
        clientSocket = io(url);
        clientSocket.connect();
        clientSocket2 = io(url);
        clientSocket2.connect();
    });

    after(() => {
        clientSocket.close();
        clientSocket2.close();
    });

    it('updateObjectives should return valid objectives', (done) => {
        let publicObjContainer: [number, boolean][];
        let privateObjContainer: [number, boolean];
        clientSocket.on('updateObjectives', (publicObjective: [number, boolean][], privateObjective: [number, boolean]) => {
            publicObjContainer = publicObjective;
            privateObjContainer = privateObjective;
            counter++;
        });
        setTimeout(() => {
            clientSocket.emit('createGame', configs);
        }, 100);
        setTimeout(() => {
            clientSocket.emit('fetchObjectives');
        }, 200);

        setTimeout(() => {
            expect(publicObjContainer[0][0]).greaterThan(0);
            expect(publicObjContainer[1][0]).greaterThan(0);
            expect(privateObjContainer[0]).greaterThan(0);
            expect(counter).greaterThan(0);
            done();
        }, 300);
    });

    it('convertGame should call the right functions', (done) => {
        configs.gameType = GameType.Multi;
        clientSocket.emit('createGame', configs);
        const spy = sandbox.spy(service['waitingRooms'], 'delete');
        clientSocket.emit('convertGame', 1);
        setTimeout(() => {
            expect(spy.called).to.equals(true);
            done();
        }, 500);
    });

    it('sendMessage should send properly the message', (done) => {
        configs.gameType = GameType.Multi;
        let typeContainer: string;
        let messageContainer: string;
        clientSocket2.on('receiveMessage', (type: string, message: string) => {
            typeContainer = type;
            messageContainer = message;
            counter++;
        });
        setTimeout(() => {
            clientSocket.emit('createGame', configs);
        }, 100);
        setTimeout(() => {
            clientSocket2.emit('joinGame', 'test2', '_' + clientSocket.id, (response: { status: string }) => {
                void [response];
            });
        }, 200);
        setTimeout(() => {
            clientSocket.emit('sendMessage', 'Hello World');
        }, 300);
        setTimeout(() => {
            expect(typeContainer).to.equals(MessageType.User);
            expect(messageContainer).to.equals('Hello World');
            expect(counter).greaterThan(0);
            done();
        }, 400);
    });

    it('place should call the right functions', (done) => {
        let boardContainer: [string, string][];
        clientSocket.on('updateBoard', (board: [string, string][]) => {
            boardContainer = board;
        });
        clientSocket.on('updateHands', () => {
            counter++;
        });
        clientSocket.emit('createGame', configs);
        clientSocket.emit('place', 'h8', [
            ['h8', 'l'],
            ['h9', 'e'],
        ]);
        setTimeout(() => {
            expect(boardContainer.length).greaterThan(0);
            expect(counter).greaterThan(0);
            done();
        }, 200);
    });
});
