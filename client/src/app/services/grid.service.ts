import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { tableau } from './tableau.config';
import { TuileType } from './tuile-type.enum';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 500;
export const DEFAULT_HEIGHT = 500;
export const DEFAULT_NB_CASES = 16;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    drawGrid() {
        
        this.gridContext.lineWidth = 1;
        this.gridContext.fillStyle = 'black';
        this.gridContext.strokeStyle = 'black'; 
        let START_NUMBER_POS=DEFAULT_WIDTH/DEFAULT_NB_CASES;
        let START_LETTER_POS=DEFAULT_HEIGHT/DEFAULT_NB_CASES;

        //Tracer le boarder du game
        this.gridContext.beginPath();
        this.gridContext.moveTo(START_NUMBER_POS,START_LETTER_POS);
        this.gridContext.lineTo(START_NUMBER_POS,DEFAULT_WIDTH);
        this.gridContext.stroke();
        this.gridContext.beginPath();
        this.gridContext.moveTo(START_NUMBER_POS,START_LETTER_POS);
        this.gridContext.lineTo(DEFAULT_HEIGHT,START_LETTER_POS);
        this.gridContext.stroke();
        
        //Afficher les coordonnes
        for(let i = 1; i<DEFAULT_NB_CASES+1; i ++){
            this.gridContext.fillText(i.toString(),START_NUMBER_POS+DEFAULT_WIDTH/(2*DEFAULT_NB_CASES),DEFAULT_HEIGHT/(DEFAULT_NB_CASES*2));
            START_NUMBER_POS += DEFAULT_WIDTH/(DEFAULT_NB_CASES);
        }
        for(let i = 1; i<DEFAULT_NB_CASES+1; i ++){
            let alphabet = String.fromCharCode(96 + i);
            this.gridContext.fillText(alphabet,DEFAULT_WIDTH/(DEFAULT_NB_CASES*2) ,START_LETTER_POS+DEFAULT_WIDTH/(2*DEFAULT_NB_CASES));
            START_LETTER_POS += DEFAULT_WIDTH/(DEFAULT_NB_CASES);
        }

        //Dessiner les grilles(rectangles)
        
        let TUILE_SIZE =DEFAULT_WIDTH/DEFAULT_NB_CASES;
        let TUILE_POSX=DEFAULT_WIDTH/DEFAULT_NB_CASES;
        let TUILE_POSY=DEFAULT_HEIGHT/DEFAULT_NB_CASES;

        //return value is bonue point
        //NEED TO MODIFY LATER
        function getDisplayBonus (type: string) :number {
            switch (type) {
                case TuileType.Wx3:
                    return 3;
                case TuileType.VIDE:
                    return 0;
                case TuileType.Lx2:
                    return 3;
                case TuileType.Lx3:
                    return 3;
                case TuileType.Wx2:
                    return 2;
                default:{
                    return -1;
                    }
            }
        }

        let tableauMap = new Map();
        for(let x = 0;x < DEFAULT_NB_CASES-1;x++){
            for(let y = 0; y<DEFAULT_NB_CASES-1;y++){
                tableauMap.set(tableau[x][y], getDisplayBonus(tableau[x][y]));

            }
        }
        //Map<coord,bonus>
        //const iterator1 = tableauMap[Symbol.iterator]();
        
        // tableauMap.forEach((value: boolean, key: string) => {
        //     if(key == 'Wx3'){
        //             this.gridContext.strokeStyle="white";
        //             this.gridContext.fillStyle =  'rgb(220, 73, 77)';
        //             this.gridContext.fillRect(TUILE_POSX,TUILE_POSY,TUILE_SIZE,TUILE_SIZE);
        //             this.gridContext.fillStyle= "black";
        //             this.gridContext.font = '7px serif';
        //             this.gridContext.fillText("MOT X3",TUILE_POSX,(TUILE_POSY+(DEFAULT_HEIGHT/DEFAULT_NB_CASES/2)));
        //     }
        //     //CASE MOT X 2
        //     else if(key == 'Wx2'){
        //         this.gridContext.strokeStyle="white";
        //         this.gridContext.fillStyle =  'rgb(228, 180, 187)';
        //         this.gridContext.fillRect(TUILE_POSX,TUILE_POSY,TUILE_SIZE,TUILE_SIZE);
        //     }
        //     //CASE LETTRE X 2
        //     else if(key == 'Lx2'){
        //         this.gridContext.strokeStyle="white";
        //         this.gridContext.fillStyle =  'rgb(159, 211, 215)';
        //         this.gridContext.fillRect(TUILE_POSX,TUILE_POSY,TUILE_SIZE,TUILE_SIZE);
        //     }
        //     //CASE LETTRE X 3
        //     else if(key == 'Lx3'){
        //         this.gridContext.strokeStyle="white";
        //         this.gridContext.fillStyle =  'blue';
        //         this.gridContext.fillRect(TUILE_POSX,TUILE_POSY,TUILE_SIZE,TUILE_SIZE);
        //     }
                
        //     //case NONE
        //     else if (key == 'VIDE'){
        //         this.gridContext.strokeStyle="white";
        //         this.gridContext.fillStyle =  'rgb(255, 221, 189)';
        //         this.gridContext.fillRect(TUILE_POSX,TUILE_POSY,TUILE_SIZE,TUILE_SIZE);
        //     }
        //         TUILE_POSX += TUILE_SIZE;
            
        //         TUILE_POSY+=TUILE_SIZE;
        //         TUILE_POSX=DEFAULT_HEIGHT/DEFAULT_NB_CASES;
        // });  


        for(let x = 0;x < DEFAULT_NB_CASES-1;x++){
            
            for(let y = 0; y<DEFAULT_NB_CASES-1;y++){
                

                //case MOT X3
                if(tableau[x][y] == "Wx3"){
                    this.gridContext.strokeStyle="white";
                    this.gridContext.fillStyle =  'rgb(220, 73, 77)';
                    this.gridContext.fillRect(TUILE_POSX,TUILE_POSY,TUILE_SIZE,TUILE_SIZE);
                    this.gridContext.fillStyle= "black";
                    this.gridContext.font = '7px serif';
                    this.gridContext.fillText("MOT X3",TUILE_POSX,(TUILE_POSY+(DEFAULT_HEIGHT/DEFAULT_NB_CASES/2)));
                }
                //CASE MOT X 2
                else if(tableau[x][y] == "Wx2"){

                    this.gridContext.strokeStyle="white";
                    this.gridContext.fillStyle =  'rgb(228, 180, 187)';
                    this.gridContext.fillRect(TUILE_POSX,TUILE_POSY,TUILE_SIZE,TUILE_SIZE);
                    this.gridContext.fillStyle= "black";
                    this.gridContext.font = '7px serif';
                    this.gridContext.fillText("MOT X2",TUILE_POSX,(TUILE_POSY+(DEFAULT_HEIGHT/DEFAULT_NB_CASES/2)));
                }
                //CASE LETTRE X 2
                else if(tableau[x][y] == "Lx2"){

                    this.gridContext.strokeStyle="white";
                    this.gridContext.fillStyle =  'rgb(159, 211, 215)';
                    this.gridContext.fillRect(TUILE_POSX,TUILE_POSY,TUILE_SIZE,TUILE_SIZE);
                    this.gridContext.fillStyle= "black";
                    this.gridContext.font = '7px serif';
                    this.gridContext.fillText("LET X2",TUILE_POSX,(TUILE_POSY+(DEFAULT_HEIGHT/DEFAULT_NB_CASES/2)));
                }
                //CASE LETTRE X 3
                else if(tableau[x][y] == "Lx3"){
                
                    this.gridContext.strokeStyle="white";
                    this.gridContext.fillStyle =  'blue';
                    this.gridContext.fillRect(TUILE_POSX,TUILE_POSY,TUILE_SIZE,TUILE_SIZE);
                    this.gridContext.fillStyle= "black";
                    this.gridContext.font = '7px serif';
                    this.gridContext.fillText("LET X3",TUILE_POSX,(TUILE_POSY+(DEFAULT_HEIGHT/DEFAULT_NB_CASES/2)));
                }
                
                //case NONE
                else if(tableau[x][y] == "VIDE"){

                    this.gridContext.strokeStyle="white";
                    this.gridContext.fillStyle =  'rgb(255, 221, 189)';
                    this.gridContext.fillRect(TUILE_POSX,TUILE_POSY,TUILE_SIZE,TUILE_SIZE);
                }
                    TUILE_POSX += TUILE_SIZE;
                }

                TUILE_POSY+=TUILE_SIZE;
                TUILE_POSX=DEFAULT_HEIGHT/DEFAULT_NB_CASES;
        }
    
    }

    drawWord(word: string) {

    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
