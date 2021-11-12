import { GameService } from './game.service';
import { SocketService } from '@app/services/socket.service';
import { BotService } from '@app/services/bot.service';
import { EndGameService } from '@app/services/end-game.service';
import { ExchangeService } from '@app/services/exchange.service';
import { PlacingService } from '@app/services/placing.service';
import { ValidationService } from '@app/services/validation.service';
import { GameInfo, GameType } from '@app/classes/game-info';
import { DEFAULT_BONUSES } from '@app/classes/game-config';
import { Container } from 'typedi';
import EventEmitter from 'events';
import * as http from 'http';
import * as sinon from 'sinon';
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';

/* eslint-disable @typescript-eslint/no-magic-numbers */
describe('GameService', () => {
    let service: GameService;
    let fakeSocketService: SocketService;
    let fakeBotService: BotService;
    let fakeEndGameService: EndGameService;
    let fakeExchangeService: ExchangeService;
    let fakePlacingService: PlacingService;
    let fakeValidationService: ValidationService;

    let fakeSocketEvents: EventEmitter;

    beforeEach(() => {
        fakeSocketService = new SocketService(http.createServer());
        fakeBotService = Container.get(BotService);
        fakeEndGameService = Container.get(EndGameService);
        fakeExchangeService = Container.get(ExchangeService);
        fakePlacingService = Container.get(PlacingService);
        fakeValidationService = Container.get(ValidationService);

        fakeSocketEvents = new EventEmitter();

        service = new GameService(
            fakeSocketService,
            fakeBotService,
            fakeEndGameService,
            fakeExchangeService,
            fakePlacingService,
            fakeValidationService,
        );
        sinon.replace(fakeSocketService, 'socketEvents', fakeSocketEvents);
        service.attachSocketListeners();
    });

    it('should call createGame', () => {
        const args = (type: number) => [
            'roomID',
            { gameType: type } as GameInfo,
            type === GameType.Single ? { socketID: '_', username: '_' } : Array(2).fill({ socketID: '_', username: '_' }),
        ];
        const spySP = sinon.spy(service, 'createGameSP');
        const spyMP = sinon.spy(service, 'createGameMP');

        fakeSocketEvents.emit('createGame', ...args(GameType.Single));
        fakeSocketEvents.emit('createGame', ...args(GameType.Multi));
        sinon.assert.calledWithExactly(spySP, 'roomID', { gameType: GameType.Single } as GameInfo, { socketID: '_', username: '_' });
        sinon.assert.calledWithExactly(spyMP, 'roomID', { gameType: GameType.Multi } as GameInfo, Array(2).fill({ socketID: '_', username: '_' }));
    });

    it('should get random bonuses', () => {
        expect(service.getBonuses(false)).to.equals(DEFAULT_BONUSES);
        expect(service.getBonuses(true)).not.to.equals(DEFAULT_BONUSES);
    });
});
