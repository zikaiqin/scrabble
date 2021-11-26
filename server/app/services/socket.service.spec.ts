/* eslint-disable dot-notation */
import { SocketService } from '@app/services/socket.service';
import { Container } from 'typedi';
import * as http from 'http';
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { HighscoreService } from '@app/services/highscore.service';
import { createSandbox } from 'sinon';

/* eslint-disable @typescript-eslint/no-magic-numbers */
describe('SocketService', () => {
    let service: SocketService;
    let fakeHighScoreService: HighscoreService;
    let socketID: string;
    const sandbox = createSandbox();

    beforeEach(() => {
        socketID = 'abcd';
        fakeHighScoreService = Container.get(HighscoreService);

        service = new SocketService(http.createServer(), fakeHighScoreService);
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
});
