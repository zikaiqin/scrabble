import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectivesComponent } from './objectives.component';
import { WebsocketService } from '@app/services/websocket.service';
import { Subject } from 'rxjs';
import { GameInit } from '@app/classes/game-info';

describe('ObjectivesComponent', () => {
    let component: ObjectivesComponent;
    let fixture: ComponentFixture<ObjectivesComponent>;

    const gameInit = new Subject<GameInit>();
    const objectives = new Subject<{ publicObj: [number, boolean][]; privateObj: [number, boolean] }>();

    const websocketServiceSpy = jasmine.createSpyObj('WebsocketService', [], {
        init: gameInit.asObservable(),
        objective: objectives.asObservable(),
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ObjectivesComponent],
            providers: [{ provide: WebsocketService, useValue: websocketServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ObjectivesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
