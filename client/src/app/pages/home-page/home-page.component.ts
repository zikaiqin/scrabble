import { Component, OnInit } from '@angular/core';

enum Titles {
    Main = 'Scrabble',
    Classical = 'Scrabble Classique',
    Log2990 = 'Scrabble LOG2990',
}

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
    menu: keyof typeof Titles;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor,@typescript-eslint/no-empty-function
    constructor() {}

    ngOnInit(): void {
        this.menu = 'Main';
    }

    getTitle(): string {
        return Titles[this.menu];
    }
}
