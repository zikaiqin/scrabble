import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { Subject } from 'rxjs';
import { GameInit } from '@app/classes/game-info';
import { WebsocketService } from '@app/services/websocket.service';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;

    const gameInit = new Subject<GameInit>();
    const gameHands = new Subject<{ ownHand: string[]; opponentHand: string[] }>();

    const websocketServiceSpy = jasmine.createSpyObj('WebsocketService', [], {
        init: gameInit.asObservable(),
        hands: gameHands.asObservable(),
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [{ provide: WebsocketService, useValue: websocketServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
