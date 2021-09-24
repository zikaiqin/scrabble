import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TurnService {
    private subject = new Subject<boolean>();

    changeTurn(bool: boolean): void {
        this.subject.next(bool);
    }

    getState(): Observable<boolean> {
        return this.subject.asObservable();
    }
}
