import { TestBed } from '@angular/core/testing';

import { WebsocketService } from './websocket.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '@app/services/alert.service';
import { TextboxService } from '@app/services/textbox.service';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import EventEmitter from 'events';
import { GameInfo } from '@app/classes/game-info';

describe('WebsocketService', () => {
    let service: WebsocketService;
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showAlert']);
    const textboxServiceSpy = jasmine.createSpyObj('TextboxService', ['displayMessage']);
    let mockSocket: EventEmitter;
    let mockGameInfo: GameInfo;
    const mockLetters = new Map<string, string>();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([{ path: 'game', component: GamePageComponent }])],
            providers: [
                { provide: AlertService, useValue: alertServiceSpy },
                { provide: TextboxService, useValue: textboxServiceSpy },
            ],
        });
        service = TestBed.inject(WebsocketService);
        mockSocket = new EventEmitter();
        // eslint-disable-next-line
        service.connect(mockSocket as any);
        service.attachListeners();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should emit createRoom', () => {
        // eslint-disable-next-line
        const spy = spyOn(service['socket'], 'emit');
        service.createGame(mockGameInfo);
        expect(spy).toHaveBeenCalled();
    });

    it('should emit joinRoom', () => {
        mockGameInfo = { username: 'JoBro', roomID: 'Hell' };
        // eslint-disable-next-line
        const spy = spyOn(service['socket'], 'emit');
        service.joinGame(mockGameInfo);
        expect(spy).toHaveBeenCalled();
    });

    it('should emit sendMessage', () => {
        // eslint-disable-next-line
        const spy = spyOn(service['socket'], 'emit');
        service.sendMessage('Hello');
        expect(spy).toHaveBeenCalled();
    });

    it('should emit place', () => {
        // eslint-disable-next-line
        const spy = spyOn(service['socket'], 'emit');
        service.placeLetters('a8', mockLetters);
        expect(spy).toHaveBeenCalled();
    });

    it('should emit exchange', () => {
        // eslint-disable-next-line
        const spy = spyOn(service['socket'], 'emit');
        service.exchangeLetters('a');
        expect(spy).toHaveBeenCalled();
    });

    it('should emit skipTurn', () => {
        // eslint-disable-next-line
        const spy = spyOn(service['socket'], 'emit');
        service.skipTurn();
        expect(spy).toHaveBeenCalled();
    });

    it('should attach to listeneners', () => {
        const spy = spyOn(service, 'attachListeners');
        // eslint-disable-next-line
        service.connect(service['socket']);
        expect(spy).toHaveBeenCalled();
    });

    it('should disconnect', () => {
        const spy = spyOn(service, 'disconnect');
        service.disconnect();
        expect(spy).toHaveBeenCalled();
    });
});
