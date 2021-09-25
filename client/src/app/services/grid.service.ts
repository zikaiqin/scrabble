import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { tableau } from './tableau.config';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 500;
export const DEFAULT_HEIGHT = 500;
export const DEFAULT_NB_CASES = 16;
export const STROKE_RANGE = 4;

@Injectable({
    providedIn: 'root',
})
export class GridService {

    gridContext: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    START_NUMBER_POS: number = DEFAULT_WIDTH / DEFAULT_NB_CASES;
    START_LETTER_POS: number = DEFAULT_HEIGHT / DEFAULT_NB_CASES;
    readonly TUILE_SIZE = DEFAULT_WIDTH / DEFAULT_NB_CASES;
    TUILE_POSX = DEFAULT_WIDTH / DEFAULT_NB_CASES;
    TUILE_POSY = DEFAULT_HEIGHT / DEFAULT_NB_CASES;

    drawGridCol() {
        let START_GRID_POS = DEFAULT_WIDTH / DEFAULT_NB_CASES;
        for (let i = 1; i < DEFAULT_NB_CASES + 1; i++) {
            this.gridContext.lineWidth = 3;
            this.gridContext.beginPath();
            this.gridContext.moveTo(START_GRID_POS * i, START_GRID_POS);
            this.gridContext.lineTo(START_GRID_POS * i, DEFAULT_HEIGHT);
            this.gridContext.closePath();
            this.gridContext.stroke();
        }
    }
    drawGridLine() {
        for (let i = 1; i < DEFAULT_NB_CASES + 1; i++) {
            let START_GRID_POS = DEFAULT_WIDTH / DEFAULT_NB_CASES;
            this.gridContext.lineWidth = 3;
            this.gridContext.beginPath();
            this.gridContext.moveTo(START_GRID_POS, START_GRID_POS * i);
            this.gridContext.lineTo(DEFAULT_HEIGHT, START_GRID_POS * i);
            this.gridContext.closePath();
            this.gridContext.stroke();
        }
    }
    drawBorder() {
        this.gridContext.beginPath();
        this.gridContext.moveTo(this.START_NUMBER_POS, this.START_LETTER_POS);
        this.gridContext.lineTo(this.START_NUMBER_POS, DEFAULT_WIDTH);
        this.gridContext.stroke();
        this.gridContext.beginPath();
        this.gridContext.moveTo(this.START_NUMBER_POS, this.START_LETTER_POS);
        this.gridContext.lineTo(DEFAULT_HEIGHT, this.START_LETTER_POS);
        this.gridContext.stroke();
    }
    BetterBorder(){
        this.gridContext.fillStyle = 'black';
        this.gridContext.fillRect(this.TUILE_POSX, this.TUILE_POSY, this.TUILE_SIZE, this.TUILE_SIZE);

    }
    drawcoord() {
        for (let i = 1; i < DEFAULT_NB_CASES + 1; i++) {
            this.gridContext.font = '17px serif';

            this.gridContext.fillText(
                i.toString(),
                this.START_NUMBER_POS + DEFAULT_WIDTH / (2 * DEFAULT_NB_CASES),
                DEFAULT_HEIGHT / (DEFAULT_NB_CASES * 2),
            );
            this.START_NUMBER_POS += DEFAULT_WIDTH / DEFAULT_NB_CASES;
        }
        for (let i = 1; i < DEFAULT_NB_CASES + 1; i++) {
            const alphabet = String.fromCharCode(96 + i);
            this.gridContext.font = '17px serif';

            this.gridContext.fillText(
                alphabet,
                DEFAULT_WIDTH / (DEFAULT_NB_CASES * 2),
                this.START_LETTER_POS + DEFAULT_WIDTH / (2 * DEFAULT_NB_CASES),
            );

            this.START_LETTER_POS += DEFAULT_WIDTH / DEFAULT_NB_CASES;
        }
    }

    drawMx3() {

        this.BetterBorder();

        this.gridContext.fillStyle = 'rgb(220, 73, 77)';
        this.gridContext.fillRect(
            this.TUILE_POSX + 2, 
            this.TUILE_POSY + 2, 
            this.TUILE_SIZE - STROKE_RANGE, 
            this.TUILE_SIZE - STROKE_RANGE);

        this.gridContext.fillStyle = 'white';
        this.gridContext.font = '7px serif';
        this.gridContext.fillText('MOT X3', 
        this.TUILE_POSX + 2, 
        this.TUILE_POSY + DEFAULT_HEIGHT / DEFAULT_NB_CASES / 2);
    }
    drawMx2(){

        this.BetterBorder();

        this.gridContext.fillStyle = 'rgb(228, 180, 187)';
        this.gridContext.fillRect(
            this.TUILE_POSX + 2,
            this.TUILE_POSY + 2,
            this.TUILE_SIZE - STROKE_RANGE,
            this.TUILE_SIZE - STROKE_RANGE,
        );

        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '9px sans-serif';
        this.gridContext.fillText('Motx2', this.TUILE_POSX + 2, this.TUILE_POSY + DEFAULT_HEIGHT / DEFAULT_NB_CASES / 2);
   
    }
    drawLx2(){

        this.BetterBorder();

        this.gridContext.fillStyle = 'rgb(159, 211, 215)';
        this.gridContext.fillRect(
            this.TUILE_POSX + 2,
            this.TUILE_POSY + 2,
            this.TUILE_SIZE - STROKE_RANGE,
            this.TUILE_SIZE - STROKE_RANGE,
        );

        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '9px sans-serif';
        this.gridContext.fillText('Let X2', 
        this.TUILE_POSX + 3, 
        this.TUILE_POSY + DEFAULT_HEIGHT / DEFAULT_NB_CASES / 2
        );
    
    }
    drawLx3(){

        this.BetterBorder();

        this.gridContext.fillStyle = 'blue';
        this.gridContext.fillRect(
            this.TUILE_POSX + 2,
            this.TUILE_POSY + 2,
            this.TUILE_SIZE - STROKE_RANGE,
            this.TUILE_SIZE - STROKE_RANGE,
        )
        this.gridContext.fillStyle = 'white';
        this.gridContext.font = '9px serif';
        this.gridContext.fillText('Let  X3', 
        this.TUILE_POSX + 2, 
        this.TUILE_POSY + DEFAULT_HEIGHT / DEFAULT_NB_CASES / 2
        );
    }
    drawNONE(){

        this.gridContext.fillStyle = 'rgb(255, 221, 189)';
        this.gridContext.fillRect(
            this.TUILE_POSX + 2,
            this.TUILE_POSY + 2,
            this.TUILE_SIZE - STROKE_RANGE,
            this.TUILE_SIZE - STROKE_RANGE,
        );
    }
    drawBonus(x:number,y:number){

        // CASE MOT X 3
        if (tableau[x][y] === 'Wx3') {
            this.drawMx3();
        }
        // CASE MOT X 2
        else if (tableau[x][y] === 'Wx2') {
            this.drawMx2();
        }
        // CASE LETTRE X 2
        else if (tableau[x][y] === 'Lx2') {
            this.drawLx2();
        }
        // CASE LETTRE X 3
        else if (tableau[x][y] === 'Lx3') {
                this.drawLx3();
        }

        // case NONE
        else if (tableau[x][y] === 'VIDE') {
            this.drawNONE();
        }
    }
    drawGrid() {

        this.gridContext.lineWidth = 1;
        this.gridContext.fillStyle = 'black';
        this.gridContext.strokeStyle = 'black';

        //tracer le border
        this.drawBorder();
        // Afficher les coordonnes
        this.drawcoord();
        //Contour noir pour la beaute
        this.drawGridCol();
        this.drawGridLine();

        // Dessiner les grilles(rectangles)
        for (let x = 0; x < DEFAULT_NB_CASES - 1; x++) {
            for (let y = 0; y < DEFAULT_NB_CASES - 1; y++) {
                this.drawBonus(x,y);
                this.TUILE_POSX += this.TUILE_SIZE;
            }

            this.TUILE_POSY += this.TUILE_SIZE;
            this.TUILE_POSX = DEFAULT_HEIGHT / DEFAULT_NB_CASES;
        }
        this.drawWord('A',5,1);
    }

    drawWord(letter: string, posX: number, posY: number) {

        letter = letter.toUpperCase();

        if(posY <= 15 && posX <=15 && posX >= 0 && posY >= 0){
            
            let tuileX = DEFAULT_WIDTH/DEFAULT_NB_CASES;
            let tuileY = DEFAULT_HEIGHT/DEFAULT_NB_CASES;
        
            // Deplacer sa position en X
            for(let i = 0; i < posX-1; i++){
                tuileX+=this.TUILE_SIZE;
            }

            // Deplacer sa position en Y
            for(let y = 0; y < posY-1; y++){
                tuileY+=this.TUILE_SIZE; 
            }

            // Background de ce tuile
            this.gridContext.fillStyle = 'white';
            this.gridContext.fillRect(
                tuileX + 2, 
                tuileY + 2, 
                this.TUILE_SIZE - STROKE_RANGE, 
                this.TUILE_SIZE - STROKE_RANGE);

            // Ecrire la lettre sur le tuile
            this.gridContext.fillStyle = 'black';
            this.gridContext.font = '20px serif';
            this.gridContext.fillText(
                letter, tuileX + STROKE_RANGE, 
                tuileY + DEFAULT_HEIGHT / DEFAULT_NB_CASES/2 + STROKE_RANGE 
            );

        }
        
        
    }
    //REMOVEGRID
    //DRAWCHEVALET
    //REMOVEWORDCHEVALET
    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
