import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { tableau } from './tableau.config';

const CHARCODE_SMALL_A = 97;

const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 500;
const DEFAULT_SCALE = 0.04;

const DEFAULT_NB_CASES = 16;
const STROKE_RANGE = 4;
const DEFAULT_WIDTH_CHEVALET = 385;
const DEFAULT_HEIGHT_CHEVALET = 55;
const NB_CASE_CHEVALET = 7;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    handContext: CanvasRenderingContext2D;
    tuileSize = DEFAULT_WIDTH / DEFAULT_NB_CASES;
    tuileSizeChevalet: number = DEFAULT_HEIGHT_CHEVALET;
    indexChevalet: number = 0;
    canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    startNumberPos: number = DEFAULT_WIDTH / DEFAULT_NB_CASES;
    startLetterPos: number = DEFAULT_HEIGHT / DEFAULT_NB_CASES;
    tuilePosX = DEFAULT_WIDTH / DEFAULT_NB_CASES;
    tuilePosY = DEFAULT_HEIGHT / DEFAULT_NB_CASES;
    scale: number = DEFAULT_SCALE;
    scaleCounter: number = 0;

    drawGrid() {
        this.gridContext.lineWidth = 1;
        this.gridContext.fillStyle = 'black';
        this.gridContext.strokeStyle = 'black';

        // tracer le border
        this.drawBorder();
        // Afficher les coordonnes
        this.drawCoords();
        // Contour noir pour la beaute
        this.drawGridCol();
        this.drawGridLine();

        // Dessiner les grilles(rectangles)
        for (let x = 0; x < DEFAULT_NB_CASES - 1; x++) {
            for (let y = 0; y < DEFAULT_NB_CASES - 1; y++) {
                this.drawBonus(x, y);
                this.tuilePosX += this.tuileSize;
            }
            this.tuilePosY += this.tuileSize;
            this.tuilePosX = DEFAULT_HEIGHT / DEFAULT_NB_CASES;
        }
        this.drawPlayerHand();
        this.tuilePosX = DEFAULT_WIDTH / DEFAULT_NB_CASES;
        this.tuilePosY = DEFAULT_HEIGHT / DEFAULT_NB_CASES;
    }

    drawGridCol() {
        const START_GRID_POS = DEFAULT_WIDTH / DEFAULT_NB_CASES;
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
            const START_GRID_POS = DEFAULT_WIDTH / DEFAULT_NB_CASES;
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
        this.gridContext.moveTo(this.startNumberPos, this.startLetterPos);
        this.gridContext.lineTo(this.startNumberPos, DEFAULT_WIDTH);
        this.gridContext.stroke();
        this.gridContext.beginPath();
        this.gridContext.moveTo(this.startNumberPos, this.startLetterPos);
        this.gridContext.lineTo(DEFAULT_HEIGHT, this.startLetterPos);
        this.gridContext.stroke();
    }

    betterBorder() {
        this.gridContext.fillStyle = 'black';
        this.gridContext.fillRect(this.tuilePosX, this.tuilePosY, this.tuileSize, this.tuileSize);
    }

    drawCoords() {
        for (let i = 1; i < DEFAULT_NB_CASES; i++) {
            this.gridContext.font = '17px serif';

            this.gridContext.fillText(
                i.toString(),
                this.startNumberPos + DEFAULT_WIDTH / (2 * DEFAULT_NB_CASES),
                DEFAULT_HEIGHT / (DEFAULT_NB_CASES * 2),
            );
            this.startNumberPos += DEFAULT_WIDTH / DEFAULT_NB_CASES;
        }
        for (let i = 1; i < DEFAULT_NB_CASES; i++) {
            const alphabet = String.fromCharCode(CHARCODE_SMALL_A - 1 + i);
            this.gridContext.font = '17px serif';

            this.gridContext.fillText(alphabet, DEFAULT_WIDTH / (DEFAULT_NB_CASES * 2), this.startLetterPos + DEFAULT_WIDTH / (2 * DEFAULT_NB_CASES));

            this.startLetterPos += DEFAULT_WIDTH / DEFAULT_NB_CASES;
        }
        // reset les pos pour si jamais reappeler cette methode
        this.startLetterPos = DEFAULT_HEIGHT / DEFAULT_NB_CASES;
        this.startNumberPos = DEFAULT_WIDTH / DEFAULT_NB_CASES;
    }

    drawMx3() {
        this.betterBorder();

        this.gridContext.fillStyle = 'rgb(220, 73, 77)';
        this.gridContext.fillRect(this.tuilePosX + 2, this.tuilePosY + 2, this.tuileSize - STROKE_RANGE, this.tuileSize - STROKE_RANGE);

        this.gridContext.fillStyle = 'white';
        this.gridContext.font = '7px serif';
        this.gridContext.fillText('MOT X3', this.tuilePosX + 2, this.tuilePosY + DEFAULT_HEIGHT / DEFAULT_NB_CASES / 2);
    }

    drawMx2() {
        this.betterBorder();

        this.gridContext.fillStyle = 'rgb(228, 180, 187)';
        this.gridContext.fillRect(this.tuilePosX + 2, this.tuilePosY + 2, this.tuileSize - STROKE_RANGE, this.tuileSize - STROKE_RANGE);

        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '9px sans-serif';
        this.gridContext.fillText('Motx2', this.tuilePosX + 2, this.tuilePosY + DEFAULT_HEIGHT / DEFAULT_NB_CASES / 2);
    }

    drawLx2() {
        this.betterBorder();

        this.gridContext.fillStyle = 'rgb(159, 211, 215)';
        this.gridContext.fillRect(this.tuilePosX + 2, this.tuilePosY + 2, this.tuileSize - STROKE_RANGE, this.tuileSize - STROKE_RANGE);

        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '9px sans-serif';
        this.gridContext.fillText('Let X2', this.tuilePosX + 3, this.tuilePosY + DEFAULT_HEIGHT / DEFAULT_NB_CASES / 2);
    }

    drawLx3() {
        this.betterBorder();

        this.gridContext.fillStyle = 'blue';
        this.gridContext.fillRect(this.tuilePosX + 2, this.tuilePosY + 2, this.tuileSize - STROKE_RANGE, this.tuileSize - STROKE_RANGE);
        this.gridContext.fillStyle = 'white';
        this.gridContext.font = '9px serif';
        this.gridContext.fillText('Let  X3', this.tuilePosX + 2, this.tuilePosY + DEFAULT_HEIGHT / DEFAULT_NB_CASES / 2);
    }

    drawNONE() {
        this.gridContext.fillStyle = 'rgb(255, 221, 189)';
        this.gridContext.fillRect(this.tuilePosX + 2, this.tuilePosY + 2, this.tuileSize - STROKE_RANGE, this.tuileSize - STROKE_RANGE);
    }

    drawBonus(x: number, y: number) {
        if (x < 0 || x >= DEFAULT_NB_CASES || y < 0 || y >= DEFAULT_NB_CASES) {
            return;
        }
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

    drawLetter(letter: string, posX: number, posY: number) {
        letter = letter.toUpperCase();

        if (posY < DEFAULT_NB_CASES - 1 && posX < DEFAULT_NB_CASES - 1 && posX >= 0 && posY >= 0) {
            let tuileX = DEFAULT_WIDTH / DEFAULT_NB_CASES;
            let tuileY = DEFAULT_HEIGHT / DEFAULT_NB_CASES;

            // Deplacer sa position en X
            for (let i = 0; i < posX; i++) {
                tuileX += this.tuileSize;
            }

            // Deplacer sa position en Y
            for (let y = 0; y < posY; y++) {
                tuileY += this.tuileSize;
            }

            // Background de ce tuile
            this.gridContext.fillStyle = 'white';
            this.gridContext.fillRect(tuileX + 2, tuileY + 2, this.tuileSize - STROKE_RANGE, this.tuileSize - STROKE_RANGE);

            // Ecrire la lettre sur le tuile
            this.gridContext.fillStyle = 'black';
            this.gridContext.font = '20px serif';
            this.gridContext.fillText(letter, tuileX + STROKE_RANGE, tuileY + DEFAULT_HEIGHT / DEFAULT_NB_CASES / 2 + STROKE_RANGE);
        }
    }

    // This function convert les strings map de zi kai to real coordonnees
    // so with postions X,Y to call drawLetter
    // it[0]= coord
    // it[1] =lettre
    drawGridLetters(positions: Map<string, string>) {
        let postionX: string;
        let letter;
        for (const it of positions) {
            letter = it[0].charAt(0);
            const positionY = letter.charCodeAt(0) - CHARCODE_SMALL_A;
            postionX = it[0].replace(/[^0-9]/g, '');
            const positionX = parseInt(postionX, 10);
            this.drawLetter(it[1], positionX - 1, positionY);
        }
    }

    drawPlayerHand() {
        this.handContext.shadowColor = '#566D7E';
        this.handContext.shadowBlur = 20;
        this.handContext.lineJoin = 'bevel';
        this.handContext.lineWidth = 10;
        this.handContext.strokeStyle = '#2B3856';
        this.handContext.strokeRect(
            this.tuileSize,
            DEFAULT_HEIGHT + this.tuileSize + STROKE_RANGE, // 500+tuile+petit changement
            DEFAULT_WIDTH_CHEVALET,
            DEFAULT_HEIGHT_CHEVALET,
        );
        for (let i = 0; i < NB_CASE_CHEVALET; i++) {
            this.drawPlayerHandSlots(i + 1);
        }
        this.handContext.shadowBlur = 0;
    }

    drawPlayerHandSlots(i: number) {
        this.handContext.fillStyle = '#E42217';
        // pour draw 7 cases
        i--;
        this.handContext.fillRect(
            this.tuileSize + this.tuileSizeChevalet * i,
            DEFAULT_HEIGHT + this.tuileSize + STROKE_RANGE,
            this.tuileSizeChevalet,
            this.tuileSizeChevalet,
        );
    }

    drawPlayerHandLetters(letters: string[]) {
        this.handContext.font = 'bold 40px serif';
        this.handContext.fillStyle = '#EBDDE2';
        letters.forEach((letter) => {
            this.handContext.fillText(
                letter.toLocaleUpperCase(),
                this.tuileSize + this.tuileSizeChevalet * this.indexChevalet + STROKE_RANGE,
                DEFAULT_HEIGHT + this.tuileSize * 2 + STROKE_RANGE * 3,
            );
            this.indexChevalet++;
        });
        this.indexChevalet = 0;
    }

    clearGrid() {
        this.gridContext.clearRect(0, 0, DEFAULT_WIDTH * 2, DEFAULT_HEIGHT * 2);
    }

    maxGrid() {
        if (this.scaleCounter < NB_CASE_CHEVALET - 1) {
            this.gridContext.scale(1 + this.scale, 1 + this.scale);
            this.scaleCounter++;
        }
        this.drawGrid();
    }

    minGrid() {
        if (this.scaleCounter >= 0) {
            this.gridContext.scale(1 - this.scale, 1 - this.scale);
            this.scaleCounter--;
        }
        this.drawGrid();
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
