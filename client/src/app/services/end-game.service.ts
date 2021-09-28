import { Injectable } from '@angular/core';
import { GameService } from '@app/services/game.service';

export const DEFAULT_TURN_COUNT = 0;
export const MAX_TURN_SKIP_COUNT = 6;

@Injectable({
    providedIn: 'root',
})
export class EndGame {
    turnSkipCounter: number;
    constructor(private gameService: GameService) {}



    turnSkipCount(): void {
        this.turnSkipCounter++;
    }

    turnSkipCountReset(): void {
        this.turnSkipCounter = DEFAULT_TURN_COUNT;
    }

    checkIfGameEnd(): boolean {
        if (this.gameService.reserve.size === 0) {
            if (this.gameService.playerHand.size === 0 || this.gameService.opponentHand.size === 0) {
                return true;
            }
        }
        if (this.turnSkipCounter === MAX_TURN_SKIP_COUNT){
            return true;
        }
        return false;
    }

    /*endGame(): void {
        if(this.checkIfGameEnd){
            for( const i of this.gameService.playerHand ){
                if( this.)
            }
            
        }
    }*/
    

}
