import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { WebsocketService } from '@app/services/websocket.service';

const CHARCODE_SMALL_A = 97;

const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 500;
const DEFAULT_SCALE = 0.04;

const DEFAULT_NB_CASES = 16;
const STROKE_RANGE = 4;
const NB_CASE_CHEVALET = 7;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    handContext: CanvasRenderingContext2D;
    private tuileSize = DEFAULT_WIDTH / DEFAULT_NB_CASES;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    private startNumberPos: number = DEFAULT_WIDTH / DEFAULT_NB_CASES;
    private startLetterPos: number = DEFAULT_HEIGHT / DEFAULT_NB_CASES;
    private tuilePosX = DEFAULT_WIDTH / DEFAULT_NB_CASES;
    private tuilePosY = DEFAULT_HEIGHT / DEFAULT_NB_CASES;
    private scale: number = DEFAULT_SCALE;
    private scaleCounter: number = 0;
    private counter: number = 0;

    private bonuses = new Map<string, string>();
    private letters = new Map<string, string>();

    constructor(private websocketService: WebsocketService) {
        this.websocketService.init.subscribe((init) => {
            this.bonuses = new Map<string, string>(init.bonuses);
        });
        this.websocketService.board.subscribe((letters) => {
            this.letters = new Map<string, string>(letters);
            if (this.counter > 0) this.drawGrid();
        });
    }
    /**
     * @description Wrapper function to draw the entirety of the board
     */
    drawGrid() {
        this.clearGrid();
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
        this.tuilePosX = DEFAULT_WIDTH / DEFAULT_NB_CASES;
        this.tuilePosY = DEFAULT_HEIGHT / DEFAULT_NB_CASES;

        this.drawGridLetters(this.letters);
        this.counter++;
    }
    /**
     * @description Function to draw the columns for the board
     */
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
    /**
     * @description Function to draw the lines for the board
     */
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
    /**
     * @description Function to draw the borders of the board
     */
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
    /**
     * @description Function to make the borders more visible
     */
    betterBorder() {
        this.gridContext.fillStyle = 'black';
        this.gridContext.fillRect(this.tuilePosX, this.tuilePosY, this.tuileSize, this.tuileSize);
    }
    /**
     * @description Function that draw the coordinates listed on the side
     */
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
    /**
     * @description Function to draw the bonus Motx3 on the board
     */
    drawMx3() {
        this.betterBorder();

        this.gridContext.fillStyle = 'rgb(220, 73, 77)';
        this.gridContext.fillRect(this.tuilePosX + 2, this.tuilePosY + 2, this.tuileSize - STROKE_RANGE, this.tuileSize - STROKE_RANGE);

        this.gridContext.fillStyle = 'white';
        this.gridContext.font = '7px serif';
        this.gridContext.fillText('MOT X3', this.tuilePosX + 2, this.tuilePosY + DEFAULT_HEIGHT / DEFAULT_NB_CASES / 2);
    }
    /**
     * @description Function to draw the bonus Motx2 on the board
     */
    drawMx2() {
        this.betterBorder();

        this.gridContext.fillStyle = 'rgb(228, 180, 187)';
        this.gridContext.fillRect(this.tuilePosX + 2, this.tuilePosY + 2, this.tuileSize - STROKE_RANGE, this.tuileSize - STROKE_RANGE);

        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '9px sans-serif';
        this.gridContext.fillText('Motx2', this.tuilePosX + 2, this.tuilePosY + DEFAULT_HEIGHT / DEFAULT_NB_CASES / 2);
    }
    /**
     * @description Function to draw the bonus Lettrex2 on the board
     */
    drawLx2() {
        this.betterBorder();

        this.gridContext.fillStyle = 'rgb(159, 211, 215)';
        this.gridContext.fillRect(this.tuilePosX + 2, this.tuilePosY + 2, this.tuileSize - STROKE_RANGE, this.tuileSize - STROKE_RANGE);

        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '9px sans-serif';
        this.gridContext.fillText('Let X2', this.tuilePosX + 3, this.tuilePosY + DEFAULT_HEIGHT / DEFAULT_NB_CASES / 2);
    }
    /**
     * @description Function to draw the bonus Lettrex3 on the board
     */
    drawLx3() {
        this.betterBorder();

        this.gridContext.fillStyle = 'blue';
        this.gridContext.fillRect(this.tuilePosX + 2, this.tuilePosY + 2, this.tuileSize - STROKE_RANGE, this.tuileSize - STROKE_RANGE);
        this.gridContext.fillStyle = 'white';
        this.gridContext.font = '9px serif';
        this.gridContext.fillText('Let  X3', this.tuilePosX + 2, this.tuilePosY + DEFAULT_HEIGHT / DEFAULT_NB_CASES / 2);
    }
    /**
     * @description Function that fills the slots that doesn't contain a bonus
     */
    drawNONE() {
        this.gridContext.fillStyle = 'rgb(255, 221, 189)';
        this.gridContext.fillRect(this.tuilePosX + 2, this.tuilePosY + 2, this.tuileSize - STROKE_RANGE, this.tuileSize - STROKE_RANGE);
    }
    /**
     * @description Wrapper function to fill the slots of the board
     * @param x the X position in the gameBoard container
     * @param y the Y position in the gameBoard container
     * @returns nothing just in case the indexes are out of bound
     */
    drawBonus(x: number, y: number) {
        const bonus = this.bonuses.get(String.fromCharCode(CHARCODE_SMALL_A + x) + String(y + 1));
        switch (bonus) {
            case 'Lx2': {
                this.drawLx2();
                break;
            }
            case 'Lx3': {
                this.drawLx3();
                break;
            }
            case 'Wx2': {
                this.drawMx2();
                break;
            }
            case 'Wx3': {
                this.drawMx3();
                break;
            }
            default: {
                this.drawNONE();
                break;
            }
        }
    }
    /**
     * @description Function to draw a letter on the board
     * @param letter the letter to be draw (i.e.: 'b','a')
     * @param posX the X position in the gameBoard container
     * @param posY the Y position in the gameBoard container
     */
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
    /**
     * @description Function the converts the string map to coordinates
     * @param positions map that contains the data to be converted
     */
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
    /**
     * @description Function to wipe the board (nothing is left behind)
     */
    clearGrid() {
        this.gridContext.clearRect(0, 0, DEFAULT_WIDTH * 2, DEFAULT_HEIGHT * 2);
    }
    /**
     * @description Function that makes the grid bigger
     */
    maxGrid() {
        if (this.scaleCounter < NB_CASE_CHEVALET - 1) {
            this.gridContext.scale(1 + this.scale, 1 + this.scale);
            this.scaleCounter++;
        }
        // this.indexChevalet--;
        this.drawGrid();
    }
    /**
     * @description Function that makes the grid smaller
     */
    minGrid() {
        if (this.scaleCounter >= 0) {
            this.gridContext.scale(1 - this.scale, 1 - this.scale);
            this.scaleCounter--;
        }
        // this.indexChevalet--;
        this.drawGrid();
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
