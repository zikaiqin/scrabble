import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputbarComponent } from './inputbar.component';
import { CommandService } from '@app/services/command.service';
import { WebsocketService } from '@app/services/websocket.service';
import { TextboxService } from '@app/services/textbox.service';

describe('InputbarComponent', () => {
    let component: InputbarComponent;
    let fixture: ComponentFixture<InputbarComponent>;

    let commandServiceSpy: jasmine.SpyObj<CommandService>;
    let textboxServiceSpy: jasmine.SpyObj<TextboxService>;
    let websocketServiceSpy: jasmine.SpyObj<WebsocketService>;

    beforeEach(async () => {
        commandServiceSpy = jasmine.createSpyObj('WebsocketService', ['parseCommand']);
        textboxServiceSpy = jasmine.createSpyObj('TextboxService', ['displayMessage']);
        websocketServiceSpy = jasmine.createSpyObj('CommandService', ['sendMessage']);

        await TestBed.configureTestingModule({
            declarations: [InputbarComponent],
            providers: [
                { provide: CommandService, useValue: commandServiceSpy },
                { provide: TextboxService, useValue: textboxServiceSpy },
                { provide: WebsocketService, useValue: websocketServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InputbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
