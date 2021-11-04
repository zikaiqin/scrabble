import { TestBed } from '@angular/core/testing';

import { WebsocketService } from './websocket.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '@app/services/alert.service';
import { TextboxService } from '@app/services/textbox.service';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';

describe('WebsocketService', () => {
    let service: WebsocketService;
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showAlert']);
    const textboxServiceSpy = jasmine.createSpyObj('TextboxService', ['displayMessage']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([{ path: 'game', component: GamePageComponent }])],
            providers: [
                { provide: AlertService, useValue: alertServiceSpy },
                { provide: TextboxService, useValue: textboxServiceSpy },
            ],
        });
        service = TestBed.inject(WebsocketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
