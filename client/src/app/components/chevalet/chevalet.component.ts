import { Component, Input } from '@angular/core';
import { PlayerHand } from '@app/classes/player-hand';

@Component({
    selector: 'app-chevalet',
    templateUrl: './chevalet.component.html',
    styleUrls: ['./chevalet.component.scss'],
})
export class ChevaletComponent {
    @Input() playerHand: PlayerHand;
}
