import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '@app/services/game.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
    constructor(private router: Router, private gameService: GameService) {}

    ngOnInit(): void {
        if (!this.gameService.isInit) {
            this.router.navigateByUrl('/home');
        }
    }
}
