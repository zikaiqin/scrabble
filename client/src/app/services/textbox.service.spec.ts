import { TestBed } from '@angular/core/testing';
import { TextboxService } from './textbox.service';

describe('CommandService', () => {
    let service: TextboxService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TextboxService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
