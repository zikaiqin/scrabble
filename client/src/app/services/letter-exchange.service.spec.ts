import { TestBed } from '@angular/core/testing';
import { GridService } from '@app/services/grid.service';
import { GameService } from '@app/services/game.service';
import { LetterExchangeService } from './letter-exchange.service';
import { PlayerHand } from '@app/classes/player-hand';
//const HAND_SIZE = 7;
describe('LetterExchangeService', () => {
    let service: LetterExchangeService;
    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
            ],
        });
        service = TestBed.inject(LetterExchangeService);   
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    
    it('should not allow exchanging of letters not in hand', () => {
        const gameService = new GameService(new GridService());
        const fakeHand = {
            get: (letter: string): number => ['s', 't', 'u', 'b', 'l', 'e', '*'].filter((actualLetter) => actualLetter === letter).length,
        };

        gameService.turnState.next(true);

        let expectedHand :string = 'asd';
        expect(service.isInHand(expectedHand, fakeHand as PlayerHand)).toBeFalse();

        expect(service.isInHand('ééasd^à', fakeHand as PlayerHand)).toBeFalse();
        expectedHand =  't';
        expect(service.isInHand(expectedHand, fakeHand as PlayerHand)).toBeTrue();
     });


    it('should display message if not my turn', () => {
        service.turnState = false;
        expect(service.isMyTurn()).toBeFalse();

        service.turnState = true;
        expect(service.isMyTurn()).toBeTrue();
    });
    it(' should exchangeLetter'), () => {
        service.letters = 'asd';
        const removeFromHandspy = spyOn(service, 'removeFromHand');
        service.exchangeLetter();
        expect(removeFromHandspy).toHaveBeenCalled();
    }
    it(' should not be validateCommand'),() => {
        expect(service.validateCommand('asdasfasf')).toBeFalse();
        expect(service.validateCommand('asSDQaASasf')).toBeFalse();
        service.validateCommand('àèùéâêîôûëïüç');
        expect(service.validateCommand('asSDQaASasf')).toBeFalse();
    }
    it(' should be validateCommand'),() => {
        expect(service.validateCommand('asd')).toBeTrue();

    }
});
