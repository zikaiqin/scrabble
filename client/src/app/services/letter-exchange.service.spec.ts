import { TestBed } from '@angular/core/testing';
import { LetterExchangeService } from '@app/services/letter-exchange.service';
import { WebsocketService } from '@app/services/websocket.service';

describe('LetterExchangeService', () => {
    let service: LetterExchangeService;
    let websocketService: jasmine.SpyObj<WebsocketService>;

    beforeEach(() => {
        websocketService = jasmine.createSpyObj('GameService', ['']);
        TestBed.configureTestingModule({
            providers: [{ provide: WebsocketService, useValue: websocketService }],
        });
        service = TestBed.inject(LetterExchangeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
