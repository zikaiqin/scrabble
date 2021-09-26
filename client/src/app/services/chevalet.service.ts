import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

export const DEFAULT_WIDTH_CHEVALET = 385;
export const DEFAULT_HEIGHT_CHEVALET = 55;

@Injectable({
    providedIn: 'root',
})

export class GridChevalet {
    gridHand: CanvasRenderingContext2D;
    private ChevaletSize: Vec2 = { x: DEFAULT_WIDTH_CHEVALET, y: DEFAULT_HEIGHT_CHEVALET };

    drawSomethign(){
        this.gridHand.fillStyle = 'black';
        this.gridHand.fillRect(0,0,202,120);

    }
    get width(): number {
        return this.ChevaletSize.x;
    }

    get height(): number {
        return this.ChevaletSize.y;
    }
}
