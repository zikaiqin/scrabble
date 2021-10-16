import { TestBed } from '@angular/core/testing';
import { PlayerHand } from '@app/classes/player-hand';
import { Reserve } from '@app/classes/reserve';
import { Subject } from 'rxjs';
import { EndGameService } from './end-game.service';
import { GameService } from './game.service';
import { TextboxService } from './textbox.service';
export const EMPTY = 0;
export const TEST_NUMBER = 9;
export const TEST_INCREMENT = 1;
export const PLAYER = 1;
export const OPPONENT = 2;

describe('GameService', () => {
    let service: EndGameService;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let textboxServiceSpy: jasmine.SpyObj<TextboxService>;

    beforeEach(() => {
        gameServiceSpy = jasmine.createSpyObj('GameService', ['']);
        gameServiceSpy.playerHand = new Subject<PlayerHand>();
        gameServiceSpy.playerScore = new Subject<number>();
        gameServiceSpy.opponentHand = new Subject<PlayerHand>();
        gameServiceSpy.opponentScore = new Subject<number>();
        textboxServiceSpy = jasmine.createSpyObj('TextboxService', ['sendMessage']);

        TestBed.configureTestingModule({
            providers: [
                { provide: GameService, useValue: gameServiceSpy },
                { provide: TextboxService, useValue: textboxServiceSpy },
            ],
        });
        service = TestBed.inject(EndGameService);
        gameServiceSpy.reserve = new Reserve();
        service.turnSkipCounter = EMPTY;
        service.playerScore = EMPTY;
        service.opponentScore = EMPTY;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' turnSkipCount increments turnSkipCounter ', () => {
        service.turnSkipCount();
        expect(service.turnSkipCounter).toEqual(TEST_INCREMENT);
    });

    it(' turnSkipCountReset should reset turnSkipCounter to 0', () => {
        service.turnSkipCounter = TEST_NUMBER;
        service.turnSkipCountReset();
        expect(service.turnSkipCounter).toEqual(EMPTY);
    });

    it(' checkIfGameEnd should return true if reserve is empty and one of the hand is empty', () => {
        service.opponentHand.add('a');
        gameServiceSpy.reserve.letters.splice(0, gameServiceSpy.reserve.letters.length);
        gameServiceSpy.reserve.size = EMPTY;
        expect(service.opponentHand.letters).toEqual(['a']);
        expect(service.checkIfGameEnd()).toBe(true);
    });

    it(' checkIfGameEnd should return true if players skipped 6 turns ', () => {
        service.turnSkipCounter = TEST_NUMBER;
        expect(service.checkIfGameEnd()).toBe(true);
    });

    it(' checkIfGameEnd should return false if none of the above is true ', () => {
        service.opponentHand.add('a');
        service.playerHand.add('a');
        gameServiceSpy.reserve.size = EMPTY;
        const result = service.checkIfGameEnd();
        expect(result).toBeFalse();
    });

    it(' deductPoint should deduct point from both player if they have letters left by the value of the letters ', () => {
        const expectedValue1 = -4;
        const expectedValue2 = -10;
        service.opponentHand.add('a');
        service.opponentHand.add('b');
        service.playerHand.add('z');
        expect(service.opponentHand.letters).toEqual(['a', 'b']);
        service.deductPoint();
        expect(service.opponentScore).toEqual(expectedValue1);
        expect(service.playerScore).toEqual(expectedValue2);
    });

    it(' checkWhoEmptiedHand should return the player constant if player emptied his hand ', () => {
        service.opponentHand.add('a');
        expect(service.checkWhoEmptiedHand()).toEqual(PLAYER);
    });

    it(' checkWhoEmptiedHand should return the none constant if both players still have letters ', () => {
        service.playerHand.add('a');
        service.opponentHand.add('a');
        expect(service.checkWhoEmptiedHand()).toEqual(EMPTY);
    });

    it(' addPoint should add points to the score of the player if he emptied his hand by the value of the letters of his opponent ', () => {
        const expectedValue1 = 1;
        service.playerHand.add('a');
        service.opponentScore = EMPTY;
        service.addPoint(service.checkWhoEmptiedHand());
        expect(service.opponentScore).toEqual(expectedValue1);
    });

    it(' addPoint should add points to the score of the opponent if he emptied his hand by the value of the letters of the player ', () => {
        const expectedValue1 = 10;
        service.opponentHand.add('z');
        service.addPoint(service.checkWhoEmptiedHand());
        expect(service.playerScore).toEqual(expectedValue1);
    });

    it(' showLetterLeft should display the letters left of the player and opponent in the textbox ', () => {
        service.playerHand.add('a');
        service.opponentHand.add('c');
        service.showLettersLeft(service.playerHand, service.opponentHand);
        expect(textboxServiceSpy.sendMessage).toHaveBeenCalled();
    });

    it(' endGame should run deductPoint, addPoint and showLettersLeft if checkIfGameEnd return true ', () => {
        const expectedValue1 = -1;
        const expectedValue2 = 1;
        service.turnSkipCounter = TEST_NUMBER;
        service.playerHand.add('a');
        const spy1 = spyOn(service, 'deductPoint').and.callThrough();
        const spy2 = spyOn(service, 'addPoint').and.callThrough();
        const spy3 = spyOn(service, 'showLettersLeft').and.callThrough();
        service.endGame();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
        expect(service.checkIfGameEnd()).toBeTrue();
        expect(service.playerScore).toEqual(expectedValue1);
        expect(service.opponentScore).toEqual(expectedValue2);
    });

    it(' endGame should do nothing is checkIfGameEnd returns false ', () => {
        service.turnSkipCounter = TEST_NUMBER;
        service.endGame();
        expect(service.opponentScore).toEqual(EMPTY);
        expect(service.playerScore).toEqual(EMPTY);
    });
});
