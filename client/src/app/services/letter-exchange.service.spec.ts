import { TestBed } from '@angular/core/testing';
import { PlayerHand } from '@app/classes/player-hand';
import { Subject } from 'rxjs';
import { GameService } from './game.service';
import { LetterExchangeService } from './letter-exchange.service';

describe('LetterExchangeService', () => {
    let service: LetterExchangeService;
    let gameServiceSpy: jasmine.SpyObj<GameService>;

    beforeEach(() => {
        gameServiceSpy = jasmine.createSpyObj('GameService', ['']);
        gameServiceSpy.playerHand = new Subject<PlayerHand>();
        gameServiceSpy.turnState = new Subject<boolean>();
        TestBed.configureTestingModule({
            providers: [{ provide: GameService, useValue: gameServiceSpy }],
        });
        service = TestBed.inject(LetterExchangeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
