import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GameService } from '@app/services/game.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements AfterViewInit, OnInit {
    constructor(private router: Router, private gameService: GameService) {}

    ngOnInit(): void {
        if (!this.gameService.isInit) {
            this.router.navigateByUrl('/home');
        }
    }

    ngAfterViewInit(): void {
        this.gameService.start();
    }
}
