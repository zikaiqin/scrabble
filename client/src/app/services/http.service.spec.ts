import { TestBed } from '@angular/core/testing';

import { HttpService } from './http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlertService } from '@app/services/alert.service';

describe('HttpService', () => {
    let service: HttpService;

    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showAlert']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: AlertService, useValue: alertServiceSpy }],
        });
        service = TestBed.inject(HttpService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
