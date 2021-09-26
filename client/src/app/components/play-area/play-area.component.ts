import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from '@app/services/grid.service';
//import { GridChevalet } from '@app/services/chevalet.service';
// TODO : Avoir un fichier séparé pour les constantes!
export const DEFAULT_WIDTH = 525;
export const DEFAULT_HEIGHT = 625;
export const HAND_WIDTH:number = 385;
export const HAND_HEIGHT:number = 55;

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;

    //@ViewChild('canvasChevalet', { static: false }) private gridChevalet_lol : ElementRef<HTMLCanvasElement>;

    //private ChevaletSize = {ChevaletX:HAND_WIDTH,ChevaletY:HAND_HEIGHT };

    private canvasSize = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';
    

    constructor(private readonly gridService: GridService) {}

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.handContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.gridService.drawGrid();
        this.gridCanvas.nativeElement.focus();

        //this.gridServiceChevalet.gridHand = this.gridChevalet_lol.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        //this.gridServiceChevalet.drawSomethign();

    }

    AfficherMot(array: string[]) {
        for (let i = 0; i < array.length; i++) {
            if (i == -1) {
                this.gridService.drawWord('A', 3, 4);
            }
        }
    }
    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
    // get Chevaletwidth(): number {
    //     return this.ChevaletSize.ChevaletX;
    // }

    // get Chevaletheight(): number {
    //     return this.ChevaletSize.ChevaletY;
    // }
    // TODO : déplacer ceci dans un service de gestion de la souris!
    mouseHitDetect(event: MouseEvent) {
        if (event.button === MouseButton.Left) {
            this.mousePosition = { x: event.offsetX, y: event.offsetY };
        }
    }
}
