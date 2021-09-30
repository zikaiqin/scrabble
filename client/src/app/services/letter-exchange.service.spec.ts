import { TestBed } from '@angular/core/testing';

import { LetterExchangeService } from './letter-exchange.service';

describe('LetterExchangeService', () => {
    let service: LetterExchangeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LetterExchangeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
