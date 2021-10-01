import { Injectable } from '@angular/core';
import { PlayerHand } from '@app/classes/player-hand';
const DEFAULT_WIDTH_CHEVALET = 385;

const DEFAULT_HEIGHT_CHEVALET = 55;
const DEFAULT_NB_CASES = 16;
const DEFAULT_WIDTH = 500;
const STROKE_RANGE = 4;
const DEFAULT_HEIGHT = 500;
const NB_CASE_CHEVALET = 7;

@Injectable({
    providedIn: 'root',
})

export class handService {

    handContext: CanvasRenderingContext2D;
    private indexChevalet: number = 0;
    private tuileSizeChevalet: number = DEFAULT_HEIGHT_CHEVALET;
    private tuileSize = DEFAULT_WIDTH / DEFAULT_NB_CASES;

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
            this.handContext.fillStyle = 'white';
            this.handContext.fillRect(tuileX + 2, tuileY + 2, this.tuileSize - STROKE_RANGE, this.tuileSize - STROKE_RANGE);

            // Ecrire la lettre sur le tuile
            this.handContext.fillStyle = 'black';
            this.handContext.font = '20px serif';
            this.handContext.fillText(letter, tuileX + STROKE_RANGE, tuileY + DEFAULT_HEIGHT / DEFAULT_NB_CASES / 2 + STROKE_RANGE);
        }
    }
    eraseLetter() {

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
    
    drawPlayerHandSlots(i?: number) {
        this.handContext.fillStyle = '#E42217';
        // pour draw 7 cases
        if (i) {
            i--;
            this.handContext.fillRect(
                this.tuileSize + this.tuileSizeChevalet * i,
                DEFAULT_HEIGHT + this.tuileSize + STROKE_RANGE,
                this.tuileSizeChevalet,
                this.tuileSizeChevalet,
            );
        }
        // pour empty le dernier case
        else {
            this.indexChevalet--;
            this.handContext.fillRect(
                this.tuileSize + this.tuileSizeChevalet * this.indexChevalet,
                DEFAULT_HEIGHT + this.tuileSize + STROKE_RANGE,
                this.tuileSizeChevalet,
                this.tuileSizeChevalet,
            );
        }
    }

    drawPlayerHandLetters(playerHand: PlayerHand) {
        this.handContext.font = 'bold 40px serif';
        this.handContext.fillStyle = '#EBDDE2';
        for (const it of playerHand.letters) {
            this.handContext.fillText(
                it[0].toLocaleUpperCase(),
                this.tuileSize + this.tuileSizeChevalet * this.indexChevalet + STROKE_RANGE,
                DEFAULT_HEIGHT + this.tuileSize * 2 + STROKE_RANGE * 3,
            );
            this.indexChevalet++;
        }
        this.indexChevalet = 0;
    }

}