import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageComponent } from './home-page.component';
import { AlertService } from '@app/services/alert.service';
import { WebsocketService } from '@app/services/websocket.service';
import { Subject } from 'rxjs';

describe('HomePageComponent', () => {
    let component: HomePageComponent;
    let fixture: ComponentFixture<HomePageComponent>;

    const connectionStatus = new Subject<string>();
    const websocketServiceSpy = jasmine.createSpyObj('WebsocketService', [], { status: connectionStatus.asObservable() });
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showAlert']);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HomePageComponent],
            providers: [
                { provide: AlertService, useValue: alertServiceSpy },
                { provide: WebsocketService, useValue: websocketServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HomePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
