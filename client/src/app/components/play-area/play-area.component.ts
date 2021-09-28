import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from '@app/services/grid.service';
// import { GridChevalet } from '@app/services/chevalet.service';
// TODO : Avoir un fichier séparé pour les constantes!
export const DEFAULT_WIDTH_ALL = 650; // 525
export const DEFAULT_HEIGHT_ALL = 750; // 625
export const HAND_WIDTH = 385;
export const HAND_HEIGHT = 55;

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

    // @ViewChild('canvasChevalet', { static: false }) private gridChevalet_lol : ElementRef<HTMLCanvasElement>;

    // private ChevaletSize = {ChevaletX:HAND_WIDTH,ChevaletY:HAND_HEIGHT };
    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';

    private canvasSize = { x: DEFAULT_WIDTH_ALL, y: DEFAULT_HEIGHT_ALL };

    constructor(private readonly gridService: GridService) {}

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }
    maximize(): void {
        this.gridService.clearGrid();
        this.gridService.maxGrid();
    }
    minimize(): void {
        this.gridService.clearGrid();
        this.gridService.minGrid();
    }

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.handContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.gridService.drawGrid();
        this.gridCanvas.nativeElement.focus();

        // this.gridServiceChevalet.gridHand = this.gridChevalet_lol.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        // this.gridServiceChevalet.drawSomethign();
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
