import { TestBed } from '@angular/core/testing';
import { PlayerHand } from '@app/classes/player-hand';
import { GameService } from './game.service';
import { GridService } from './grid.service';

describe('GameService', () => {
    let service: GameService;
    let username: string;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let positions: Map<string, string>;

    beforeEach(() => {
        gridServiceSpy = jasmine.createSpyObj('GridService', ['drawPlayerHand', 'drawPlayerHandLetters', 'clearGrid', 'drawGridLetters']);

        TestBed.configureTestingModule({ providers: [{ provide: GridService, useValue: gridServiceSpy }] });
        service = TestBed.inject(GameService);

        username = 'testName';
        service.playerHand = new PlayerHand();
        service.opponentHand = new PlayerHand();
        positions = new Map();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('init should affect values correctly', () => {
        service.init(username);
        expect(service.player).toEqual(username);
        expect(service.isInit).toBeTrue();
        expect(service.isStarted).toBeFalse();
        expect(service.opponent).not.toEqual(username);
    });

    it('start should affect values correctly', () => {
        service.start();
        expect(service.playerScore).toEqual(0);
        expect(service.opponentScore).toEqual(0);
    });

    it('updateHand should call the right functions', () => {
        service.init(username);
        service.updateHand(service.playerHand);
        expect(gridServiceSpy.drawPlayerHand).toHaveBeenCalled();
        expect(gridServiceSpy.drawPlayerHandLetters).toHaveBeenCalled();
    });

    it('updateGame should call the right functions', () => {
        service.init(username);
        service.start();
        service.updateGame(positions);
        expect(gridServiceSpy.clearGrid).toHaveBeenCalled();
        expect(gridServiceSpy.drawGridLetters).toHaveBeenCalled();
    });
});
