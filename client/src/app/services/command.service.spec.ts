import { TestBed } from '@angular/core/testing';
import { CommandService } from './command.service';
import { TextboxService } from '@app/services/textbox.service';

describe('CommandService', () => {
    let service: CommandService;
    let textboxServiceSpy: jasmine.SpyObj<TextboxService>;
    beforeEach(() => {
        textboxServiceSpy = jasmine.createSpyObj('TextBoxService',['sendMessage']);

        TestBed.configureTestingModule({
            providers: [
                { provide : TextboxService, useValue: textboxServiceSpy}
            ],
        });
        service = TestBed.inject(CommandService);
        
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should parseCommand', () => {
        const spy1 = spyOn(textboxServiceSpy, 'sendMessage').and.callThrough();

        service.parseCommand('!ass');
        
        expect(spy1).toHaveBeenCalled();
    });
});
