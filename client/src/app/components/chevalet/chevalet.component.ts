import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-chevalet',
    templateUrl: './chevalet.component.html',
    styleUrls: ['./chevalet.component.scss'],
})
export class ChevaletComponent {
    @Input() playerHand: string[] = [];
}
