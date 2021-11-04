import { TestBed } from '@angular/core/testing';

import { TextboxService } from './textbox.service';
import { Message } from '@app/classes/message';
import { Subject } from 'rxjs';

describe('TextboxService', () => {
    let service: TextboxService;
    let subjectSpy: jasmine.SpyObj<Subject<Message>>;

    beforeEach(() => {
        subjectSpy = jasmine.createSpyObj('Subject<Message>', ['next', 'asObservable']);
        TestBed.configureTestingModule({
            providers: [{ provide: Subject, useValue: subjectSpy }],
        });
        service = TestBed.inject(TextboxService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    /* it(' sendMessage should call next ', () => {
        // const spy = spyOn(subjectSpy, 'next').and.callThrough();
        service.sendMessage(MessageType.System, 'op');
        expect(subjectSpy.next).toHaveBeenCalled();
    });

    it(' getMessage should call asObservable ', () => {
        service.sendMessage(MessageType.System, 'op');
        expect(service.getMessage()).toContain(MessageType.System);
    });*/
});
