import { GameService } from './game.service';
import { DatabaseService } from '@app/services/database.service';
import { SocketService } from '@app/services/socket.service';
import { BotService } from '@app/services/bot.service';
import { EndGameService } from '@app/services/end-game.service';
import { ExchangeService } from '@app/services/exchange.service';
import { PlacingService } from '@app/services/placing.service';
import { ValidationService } from '@app/services/validation.service';
import { ObjectivesService } from '@app/services/objectives';
import { DEFAULT_BONUSES } from '@app/classes/config';
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
    let fakeObjectivesService: ObjectivesService;
    let fakeDatabaseService: DatabaseService;

    let fakeSocketEvents: EventEmitter;

    beforeEach(() => {
        fakeDatabaseService = Container.get(DatabaseService);
        fakeBotService = Container.get(BotService);
        fakeEndGameService = Container.get(EndGameService);
        fakeExchangeService = Container.get(ExchangeService);
        fakePlacingService = Container.get(PlacingService);
        fakeValidationService = Container.get(ValidationService);
        fakeObjectivesService = Container.get(ObjectivesService);
        fakeSocketService = new SocketService(http.createServer(), fakeDatabaseService, fakeValidationService);

        fakeSocketEvents = new EventEmitter();

        service = new GameService(
            fakeSocketService,
            fakeBotService,
            fakeEndGameService,
            fakeExchangeService,
            fakePlacingService,
            fakeValidationService,
            fakeObjectivesService,
            fakeDatabaseService,
        );
        sinon.replace(fakeSocketService, 'socketEvents', fakeSocketEvents);
        service.attachSocketListeners();
    });

    it('should get random bonuses', () => {
        expect(service.getBonuses(false)).to.equals(DEFAULT_BONUSES);
        expect(service.getBonuses(true)).not.to.equals(DEFAULT_BONUSES);
    });
});
