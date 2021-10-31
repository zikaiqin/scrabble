import { TestBed } from '@angular/core/testing';
import { PlayerHand } from '@app/classes/player-hand';
import { Subject } from 'rxjs';
import { GameService } from './game.service';
import { GridService } from './grid.service';

describe('GameService', () => {
    let service: GameService;
    let username: string;
    let gridServiceSpy: jasmine.SpyObj<GridService>;

    beforeEach(() => {
        gridServiceSpy = jasmine.createSpyObj('GridService', ['drawPlayerHand', 'drawPlayerHandLetters', 'clearGrid', 'drawGridLetters']);

        TestBed.configureTestingModule({ providers: [{ provide: GridService, useValue: gridServiceSpy }] });
        service = TestBed.inject(GameService);

        username = 'testName';
        service.playerHand = new Subject<PlayerHand>();
        service.opponentHand = new Subject<PlayerHand>();
        service.playerScore = new Subject<number>();
        service.opponentScore = new Subject<number>();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('init should affect values correctly', () => {
        service.init({ username });
        expect(service.player).toEqual(username);
        expect(service.isInit).toBeTrue();
        expect(service.isStarted).toBeFalse();
        expect(service.opponent).not.toEqual(username);
    });

    it('start should affect values correctly', () => {
        const spyNextPlayer = spyOn(service.playerScore, 'next').and.callThrough();
        const spyNextOpponent = spyOn(service.opponentScore, 'next').and.callThrough();
        service.start();
        expect(spyNextPlayer).toHaveBeenCalledWith(0);
        expect(spyNextOpponent).toHaveBeenCalledWith(0);
    });
});
