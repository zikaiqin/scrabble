import { TestBed } from '@angular/core/testing';
import { PlayerHand } from '@app/classes/player-hand';
import { Subject } from 'rxjs';
import { GameService } from './game.service';
// import { GridService } from '@app/services/grid.service';
// import { GameService } from '@app/services/game.service';
import { ExchangeService } from './exchange.service';
// import { PlayerHand } from '@app/classes/player-hand';
// const HAND_SIZE = 7;
describe('LetterExchangeService', () => {
    let service: ExchangeService;
    let gameServiceSpy: jasmine.SpyObj<GameService>;

    beforeEach(() => {
        gameServiceSpy = jasmine.createSpyObj('GameService', ['']);
        gameServiceSpy.playerHand = new Subject<PlayerHand>();
        gameServiceSpy.turnState = new Subject<boolean>();
        TestBed.configureTestingModule({
            providers: [{ provide: GameService, useValue: gameServiceSpy }],
        });
        service = TestBed.inject(ExchangeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should not be validateCommand', () => {
        expect(service.validateCommand('asdasfasf')).toBeFalse();
        expect(service.validateCommand('asSDQaASasf')).toBeFalse();
        service.validateCommand('àèùéâêîôûëïüç');
        expect(service.validateCommand('asSDQaASasf')).toBeFalse();
    });
    it('should be validateCommand', () => {
        expect(service.validateCommand('asd')).toBeFalse();
    });
});
