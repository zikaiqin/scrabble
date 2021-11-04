import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanneauInfoComponent } from './panneau-info.component';
import { CommandService } from '@app/services/command.service';
import { TextboxService } from '@app/services/textbox.service';
import { WebsocketService } from '@app/services/websocket.service';
import { GameInit } from '@app/classes/game-info';
import { Subject } from 'rxjs';

describe('PanneauInfoComponent', () => {
    let component: PanneauInfoComponent;
    let fixture: ComponentFixture<PanneauInfoComponent>;

    const gameInit = new Subject<GameInit>();
    const gameTime = new Subject<number>();
    const gameTurn = new Subject<boolean>();
    const gameReserve = new Subject<string[]>();
    const gameHands = new Subject<{ ownHand: string[]; opponentHand: string[] }>();
    const gameScores = new Subject<{ ownScore: number; opponentScore: number }>();
    const gameEnded = new Subject<string>();

    const websocketServiceSpy = jasmine.createSpyObj('WebsocketService', [], {
        init: gameInit.asObservable(),
        time: gameTime.asObservable(),
        turn: gameTurn.asObservable(),
        reserve: gameReserve.asObservable(),
        hands: gameHands.asObservable(),
        scores: gameScores.asObservable(),
        endGame: gameEnded.asObservable(),
    });

    const textboxServiceSpy = jasmine.createSpyObj('TextboxService', ['displayMessage']);

    const commandServiceSpy = jasmine.createSpyObj('CommandService', ['parseCommand']);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PanneauInfoComponent],
            providers: [
                { provide: WebsocketService, useValue: websocketServiceSpy },
                { provide: TextboxService, useValue: textboxServiceSpy },
                { provide: CommandService, useValue: commandServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PanneauInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
