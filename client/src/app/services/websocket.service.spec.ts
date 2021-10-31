import { TestBed } from '@angular/core/testing';

import { WebsocketService } from './websocket.service';
import { AlertService } from '@app/services/alert.service';

describe('WebsocketService', () => {
    let service: WebsocketService;
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showAlert']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: AlertService, useValue: alertServiceSpy }],
        });
        service = TestBed.inject(WebsocketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
