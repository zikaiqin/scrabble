import { TestBed } from '@angular/core/testing';
import { CommandService } from './command.service';
import { TextboxService } from '@app/services/textbox.service';
import { LetterPlacingService } from './letter-placing.service';
import { LetterExchangeService } from './letter-exchange.service';

describe('CommandService', () => {
    let service: CommandService;
    let textboxServiceSpy: jasmine.SpyObj<TextboxService>;
    let letterPlacingServiceSpy: jasmine.SpyObj<LetterPlacingService>;
    let letterExchangeServiceSpy: jasmine.SpyObj<LetterExchangeService>;

    beforeEach(() => {
        textboxServiceSpy = jasmine.createSpyObj('TextBoxService', ['sendMessage']);
        letterPlacingServiceSpy = jasmine.createSpyObj('letterPlacingService', ['validateCommand']);
        letterExchangeServiceSpy = jasmine.createSpyObj('letterExchangeServiceSpy', ['validateCommand']);

        TestBed.configureTestingModule({
            providers: [
                { provide: TextboxService, useValue: textboxServiceSpy },
                { provide: LetterPlacingService, useValue: letterPlacingServiceSpy },
                { provide: LetterExchangeService, useValue: letterExchangeServiceSpy },
            ],
        });
        service = TestBed.inject(CommandService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should allow the command', () => {
        service.parseCommand('!aide');

        expect(textboxServiceSpy.sendMessage).toHaveBeenCalled();

        service.parseCommand('!échanger a');
        expect(letterExchangeServiceSpy.validateCommand).toHaveBeenCalledTimes(1);

        service.parseCommand('!debug');
        expect(textboxServiceSpy.sendMessage).toHaveBeenCalled();

        service.debugActive = true;
        service.parseCommand('!debug');
        expect(textboxServiceSpy.sendMessage).toHaveBeenCalled();

        service.parseCommand('!placer o15 s');
        expect(letterPlacingServiceSpy.validateCommand).toHaveBeenCalled();

        service.turn = false;
        service.parseCommand('!passer');
        expect(textboxServiceSpy.sendMessage).toHaveBeenCalled();
    });
    it('should allow not the command', () => {
        service.parseCommand('!ass');
        expect(textboxServiceSpy.sendMessage).toHaveBeenCalled();
    });
});
