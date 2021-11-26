import { Component, Output, EventEmitter } from '@angular/core';
import { WebsocketService } from '@app/services/websocket.service';
import { Score } from '@app/classes/highscore';

@Component({
    selector: 'app-scoreboard',
    templateUrl: './scoreboard.component.html',
    styleUrls: ['./scoreboard.component.scss', '../../styles.scss'],
})
export class ScoreboardComponent {
    @Output() readonly buttonClick = new EventEmitter<string>();
    highscoreClassic: Score[];
    highscoreLog2990: Score[];
    displayedColumns: string[] = ['position', 'name', 'score'];

    constructor(private websocketService: WebsocketService) {
        this.websocketService.highscoreC.subscribe((highscoreC) => {
            this.highscoreClassic = highscoreC;
        });
        this.websocketService.highscoreL.subscribe((highscoreL) => {
            this.highscoreLog2990 = highscoreL;
        });
    }
}
