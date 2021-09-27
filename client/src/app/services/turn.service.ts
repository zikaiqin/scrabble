import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameService } from './game.service';

@Injectable({
    providedIn: 'root',
})
export class TurnService {
    constructor(private gameService: GameService) {}

    changeTurn(bool: boolean): void {
        this.gameService.turnState.next(bool);
    }

    getState(): Observable<boolean> {
        return this.gameService.turnState.asObservable();
    }
}
