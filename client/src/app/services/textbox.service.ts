import { Injectable } from '@angular/core';
import { Message } from '@app/classes/message';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TextboxService {
    private subject = new Subject<Message>();

    displayMessage(type: string, text: string) {
        this.subject.next({ type, text });
    }

    displayMapMessage(type: string, map: Map<string, number>): void {
        for (const letter of map) {
            const text: string = letter[0] + ': ' + letter[1];
            this.subject.next({ type, text });
        }
    }

    get messages(): Observable<Message> {
        return this.subject.asObservable();
    }
}
