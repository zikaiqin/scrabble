import { TestBed } from '@angular/core/testing';

import { LetterPlacingService } from './letter-placing.service';

describe('LetterPlacingService', () => {
    let service: LetterPlacingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LetterPlacingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
