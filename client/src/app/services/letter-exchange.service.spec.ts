import { TestBed } from '@angular/core/testing';

import { LetterExchangeService } from '@app/services/letter-exchange.service';
import { WebsocketService } from '@app/services/websocket.service';
import { GameInit } from '@app/classes/game-info';
import { Subject } from 'rxjs';

describe('LetterExchangeService', () => {
    let service: LetterExchangeService;
    let websocketServiceSpy: jasmine.SpyObj<WebsocketService>;

    const gameInit = new Subject<GameInit>();
    const gameTurn = new Subject<boolean>();
    const gameReserve = new Subject<string[]>();
    const gameHands = new Subject<{ ownHand: string[]; opponentHand: string[] }>();

    beforeEach(() => {
        websocketServiceSpy = jasmine.createSpyObj('WebsocketService', [], {
            init: gameInit.asObservable(),
            turn: gameTurn.asObservable(),
            reserve: gameReserve.asObservable(),
            hands: gameHands.asObservable(),
        });

        TestBed.configureTestingModule({
            providers: [{ provide: WebsocketService, useValue: websocketServiceSpy }],
        });
        service = TestBed.inject(LetterExchangeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
