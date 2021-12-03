import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vec2 } from '@app/classes/vec2';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { WebsocketService } from '@app/services/websocket.service';
import { GridService } from '@app/services/grid.service';
import { Subject } from 'rxjs';
import { GameInit } from '@app/classes/game-info';
import { MatDialogModule } from '@angular/material/dialog';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let mouseEvent: MouseEvent;

    const gameInit = new Subject<GameInit>();
    const gameTurn = new Subject<boolean>();
    const gameReserve = new Subject<string[]>();
    const gameBoard = new Subject<[string, string][]>();
    const gameHands = new Subject<{ ownHand: string[]; opponentHand: string[] }>();
    const mousePos = new Subject<Vec2>();

    const websocketServiceSpy = jasmine.createSpyObj('WebsocketService', [], {
        init: gameInit.asObservable(),
        turn: gameTurn.asObservable(),
        reserve: gameReserve.asObservable(),
        board: gameBoard.asObservable(),
        hands: gameHands.asObservable(),
    });
    const gridServiceSpy = jasmine.createSpyObj('GridService', ['clearGrid', 'drawGrid', 'maxGrid'], {
        mousePositionSubject: mousePos,
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatDialogModule],
            declarations: [PlayAreaComponent],
            providers: [
                { provide: WebsocketService, useValue: websocketServiceSpy },
                { provide: GridService, useValue: gridServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /* eslint-disable @typescript-eslint/no-magic-numbers -- Add reason */
    it('mouseHitDetect should not change the mouse position if it is not a left click', () => {
        const expectedPosition: Vec2 = { x: 0, y: 0 };
        mouseEvent = {
            offsetX: expectedPosition.x + 10,
            offsetY: expectedPosition.y + 10,
            button: 1,
        } as MouseEvent;
        component.mouseHitDetect(mouseEvent);
        expect(component.mousePosition).not.toEqual({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
        expect(component.mousePosition).toEqual(expectedPosition);
    });

    it('buttonDetect should modify the buttonPressed variable', () => {
        const expectedKey = 'a';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        component.buttonDetect(buttonEvent);
        expect(component.buttonPressed).toEqual(expectedKey);
    });
});
