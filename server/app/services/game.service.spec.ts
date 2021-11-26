import { GameService } from './game.service';
import { SocketService } from '@app/services/socket.service';
import { BotService } from '@app/services/bot.service';
import { EndGameService } from '@app/services/end-game.service';
import { ExchangeService } from '@app/services/exchange.service';
import { PlacingService } from '@app/services/placing.service';
import { ValidationService } from '@app/services/validation.service';
import { DEFAULT_BONUSES } from '@app/classes/config';
import { Container } from 'typedi';
import EventEmitter from 'events';
import * as http from 'http';
import * as sinon from 'sinon';
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { HighscoreService } from '@app/services/highscore.service';
import { ObjectivesService } from '@app/services/objectives';

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
    let fakeHighScoreService: HighscoreService;

    let fakeSocketEvents: EventEmitter;

    beforeEach(() => {
        fakeHighScoreService = Container.get(HighscoreService);
        fakeSocketService = new SocketService(http.createServer(), fakeHighScoreService);
        fakeBotService = Container.get(BotService);
        fakeEndGameService = Container.get(EndGameService);
        fakeExchangeService = Container.get(ExchangeService);
        fakePlacingService = Container.get(PlacingService);
        fakeValidationService = Container.get(ValidationService);
        fakeObjectivesService = Container.get(ObjectivesService);

        fakeSocketEvents = new EventEmitter();

        service = new GameService(
            fakeSocketService,
            fakeBotService,
            fakeEndGameService,
            fakeExchangeService,
            fakePlacingService,
            fakeValidationService,
            fakeObjectivesService,
            fakeHighScoreService,
        );
        sinon.replace(fakeSocketService, 'socketEvents', fakeSocketEvents);
        service.attachSocketListeners();
    });

    it('should get random bonuses', () => {
        expect(service.getBonuses(false)).to.equals(DEFAULT_BONUSES);
        expect(service.getBonuses(true)).not.to.equals(DEFAULT_BONUSES);
    });
});
