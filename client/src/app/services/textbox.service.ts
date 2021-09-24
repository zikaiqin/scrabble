import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum MessageType {
    System = 'system-message',
    User = 'user-message',
}

@Injectable({ providedIn: 'root' })
export class TextboxService {
    private subject = new Subject<any>();

    sendMessage(type: string, message: string) {
        this.subject.next({ style: type, text: message });
    }
    clearMessages() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
