import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { CHARCODE_SMALL_A } from '@app/classes/config';
import { MessageType } from '@app/classes/message';
import { Vec2 } from '@app/classes/vec2';
import { CommandService } from '@app/services/command.service';
import { GridService } from '@app/services/grid.service';
import { TextboxService } from '@app/services/textbox.service';
import { WebsocketService } from '@app/services/websocket.service';

// TODO : Avoir un fichier séparé pour les constantes!
const DEFAULT_WIDTH_ALL = 650; // 525
const DEFAULT_HEIGHT_ALL = 650; // 625
const HAND_MAX_SIZE = 7; // 625
const NUMBER_MAX_COORD = 15; // 625
const PIXEL_SIZE_GAMEBOARD = 560;

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
    @Input() playerHand: string[] = [];
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;

    mousePosition: Vec2 = { x: 0, y: 0 };
    initPosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';
    isVisible: boolean;
    temp: [string, string][] = [];

    isEventReceiver: boolean = false;
    // isDirectionUP: boolean;
    initHand: string[] = [];
    isPlacing: boolean = false;
    placedLetters: Map<string, string> = new Map<string, string>();

    private savePosition: string[] = [];
    private turnState: boolean;
    private gameBoard: Map<string, string> = new Map<string, string>();
    private upperCaseButtonPressed: string;
    private canvasSize = { x: DEFAULT_WIDTH_ALL, y: DEFAULT_HEIGHT_ALL };

    // DON'T REMOVE MY COMMENTS MIGHT USEFUL FOP ME LATER
    constructor(
        private readonly gridService: GridService,
        private commandService: CommandService,
        private eRef: ElementRef,
        private webSocketService: WebsocketService,
        private textboxService: TextboxService,
    ) {
        this.webSocketService.init.subscribe((initPayload) => {
            this.playerHand = initPayload.hand;
            if (initPayload.turnState !== undefined) {
                this.turnState = initPayload.turnState;
            }
        });
        this.webSocketService.hands.subscribe((hands) => {
            this.playerHand = hands.ownHand;
        });
        this.webSocketService.turn.subscribe((turn) => {
            this.turnState = turn;
        });
        this.webSocketService.board.subscribe((gameBoard) => {
            this.gameBoard = new Map(gameBoard);
        });
        this.gridService.mousePositionSubject.asObservable().subscribe((mousePos) => {
            this.mousePosition = mousePos;
        });
    }

    @HostListener('document:click', ['$event'])
    clickout(event: MouseEvent) {
        if (!this.eRef.nativeElement.contains(event.target)) {
            this.isPlacing = false;
            this.removeAll();
            this.isEventReceiver = false;
        }
    }

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;

        if (this.buttonPressed === 'Enter') {
            this.commandPlace();
        }
        if (this.buttonPressed === 'Escape') {
            this.removeAll();
        }
        if (this.buttonPressed === 'Backspace') {
            this.removeOne();
        }
        //if ( this.isPlacing === true) this.placeLetter();
        else if  (this.verifyIsInHand() && !this.gameBoard.has(this.positionString())){
            this.isPlacing = true;
            this.placeLetter();
        }
        else if(this.isPlacing === true && (this.verifyIsInHand() && this.gameBoard.has(this.positionString()))){
            this.savePosition.push(this.positionString());
            // to the next position
            if (!this.gridService.arrowDirection)
                this.gridService.mousePositionSubject.next({ x: this.mousePosition.x + 1, y: this.mousePosition.y });
            else this.gridService.mousePositionSubject.next({ x: this.mousePosition.x, y: this.mousePosition.y + 1 });

            this.placeLetter();
        }
    }

    placeLetter(){
        // if(this.isPlacing === true && this.gameBoard.has(this.positionString())){
        //     if (!this.gridService.arrowDirection) // left
        //         this.mousePosition.x++;
        //     else this.mousePosition.y++;
            
        // }

        if (this.mousePosition.x < NUMBER_MAX_COORD && this.mousePosition.y < NUMBER_MAX_COORD) {
            // this.positionString output a1 for the 1st square

            // updating chevalet
            this.removePlayerHand();

            // updating content '*'
            if (this.buttonPressed === '*') {
                this.buttonPressed = this.upperCaseButtonPressed;
            }
            this.initHand.push(this.buttonPressed);

            // updating content in board
            this.placedLetters.set(this.positionString(), this.buttonPressed);
            this.gameBoard.set(this.positionString(), this.buttonPressed);

            // to the next position
            if (!this.gridService.arrowDirection)
                this.gridService.mousePositionSubject.next({ x: this.mousePosition.x + 1, y: this.mousePosition.y });
            else this.gridService.mousePositionSubject.next({ x: this.mousePosition.x, y: this.mousePosition.y + 1 });

            // convert Map to Array
            this.convertMapToStringArray();
            this.webSocketService.gameBoard.next(this.temp);
        }
    }
    removeInitHand(): void {
        const index = this.initHand.indexOf(this.playerHand[this.playerHand.length - 1]);
        if (index >= 0) {
            this.initHand.splice(index, 1);
        }
    }
    // remove a specified letter from playerHand
    removePlayerHand(): void {
        const index = this.playerHand.indexOf(this.buttonPressed);
        if (index >= 0) {
            this.playerHand.splice(index, 1);
        }
    }
    removeOne(): void {
        if (this.initHand.length > 0) {
            // back to the removing position
            if (!this.gridService.arrowDirection)
                this.gridService.mousePositionSubject.next({ x: this.mousePosition.x - 1, y: this.mousePosition.y });
            else this.gridService.mousePositionSubject.next({ x: this.mousePosition.x, y: this.mousePosition.y - 1 });

            if (this.placedLetters.has(this.positionString())) {
                // updating content in board
                if (this.gameBoard.has(this.positionString())) {
                    this.gameBoard.delete(this.positionString());
                }

                this.placedLetters.delete(this.positionString());
                // updating chevalet
                this.playerHand.push(this.initHand[this.initHand.length - 1]); // addHand
                this.removeInitHand();

                // convert Map to Array
                this.convertMapToStringArray();
                this.webSocketService.gameBoard.next(this.temp);
            }
        }
        if (this.playerHand.length === HAND_MAX_SIZE) {
            this.isPlacing = false;
        }
    }

    removeGameBoardAt() {
        if (this.gameBoard.has(this.positionString())) {
            this.gameBoard.delete(this.positionString());
        }
    }
    removeAll() {
        while (this.initHand.length > 0) {
            // back to the removing position
            if (!this.gridService.arrowDirection)
                this.gridService.mousePositionSubject.next({ x: this.mousePosition.x - 1, y: this.mousePosition.y });
            else this.gridService.mousePositionSubject.next({ x: this.mousePosition.x, y: this.mousePosition.y - 1 });

            // update gameBoard
            if (this.gameBoard.has(this.positionString())) {
                this.gameBoard.delete(this.positionString());
            }
            this.placedLetters.delete(this.positionString());
            this.temp = [];

            this.convertMapToStringArray();
            this.webSocketService.gameBoard.next(this.temp);

            // update playerHand
            if (this.initHand[0] === this.initHand[0].toUpperCase()) this.playerHand.push('*');
            else this.playerHand.push(this.initHand[0]);
            this.initHand.splice(0, 1);
        }
        // this.gameService.gameBoard.next(this.gameBoard);
        // console.log('playerhand');
        // for (let i = 0; i < this.playerHand.length; i++) {
        //     console.log(this.playerHand[i]);
        //     // if(replaceInidHand[i] === '*'){
        //     //     replaceInidHand[i] = this.upperCaseButtonPressed;
        //     // }
        // }
        // console.log('playerhand');

        this.gridService.drawGrid();
        this.isPlacing = false;
    }

    isUpperCase(): boolean {
        this.upperCaseButtonPressed = this.buttonPressed.toUpperCase();
        return this.buttonPressed === this.upperCaseButtonPressed;
    }
    redirectTo(): void {
        this.webSocketService.disconnect();
        window.location.reload();
    }

    openConfirmWindow(): void {
        this.isVisible = true;
    }

    cancel(): void {
        this.isVisible = false;
    }

    verifyIsInHand(): boolean {
        if (this.isUpperCase()) {
            // removes option of typing special char
            if (this.upperCaseButtonPressed === '') return false;
            this.buttonPressed = '*';
        }
        for (const it of this.playerHand) {
            if (it === this.buttonPressed) return true;
        }
        return false;
    }

    mouseHitDetect(event: MouseEvent) {
        if (!this.isPlacing && this.turnState) {
            if (event.button === MouseButton.Left) {
                this.mousePosition = { x: event.offsetX, y: event.offsetY };

                // 0 et 0
                this.mousePosition.x = Math.floor(this.mousePosition.x / (PIXEL_SIZE_GAMEBOARD / NUMBER_MAX_COORD)) - 1; // 600-40 / 15
                this.mousePosition.y = Math.floor(this.mousePosition.y / (PIXEL_SIZE_GAMEBOARD / NUMBER_MAX_COORD)) - 1;
                if (!this.gameBoard.has(this.positionString())) {
                    this.gridService.mousePositionSubject.next({
                        x: this.mousePosition.x,
                        y: this.mousePosition.y,
                    });
                    if (this.initPosition.x === this.mousePosition.x && this.initPosition.y === this.mousePosition.y) {
                        this.gridService.arrowDirection = !this.gridService.arrowDirection;
                    } else this.gridService.arrowDirection = false;
                    // convert pixel into x and y coord
                    // 0 to 14
                    // this.isDirectionUP = this.gridService.selectSquare(this.mousePosition.x, this.mousePosition.y); // 0 to 14
                    this.gridService.selectSquare(this.mousePosition.x, this.mousePosition.y);
                    // this.mousePosition.x++; // cuz it starts at 1
                    this.initPosition = this.mousePosition; // save for command placer for initial positions
                    // this.mousePosition.y++; //1 to 15
                    // .x++; // 1 to 15 to convert in map string string
                }
            }
        }

        // diff position
    }

    removeAccents(): string {
        // const str = 'ÁÉÍÓÚáéíóúâêîôûàèìòùÇç/.,~!@#$%&_-12345';
        return this.buttonPressed.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '');
    }

    // converts integer position into string coord
    // converts x:0,y:1 to a1
    positionString(): string {
        // y et x start at 0 to 14
        let temp = String.fromCharCode(this.mousePosition.y + CHARCODE_SMALL_A); // 1 -> a
        temp += String(this.mousePosition.x + 1);
        return temp;
    }

    convertMapToStringArray() {
        // convert Map to Array
        this.temp = [];
        let i = 0;
        for (const it of this.gameBoard) {
            this.temp[i] = [it[0], it[1]];
            i++;
        }
    }
    commandPlace() {
        // show initHand
        const replaceInidHand = [...this.initHand];
        // remove from the board pour placer des lettres
        this.removeAll();

        const direction = this.gridService.arrowDirection ? 'v' : 'h';

        // convert a string : 1 -> a, 0 -> 1
        const coords = String.fromCharCode(this.initPosition.y + CHARCODE_SMALL_A) + String(this.initPosition.x + 1);

        const command = `!placer ${coords}${direction} ${replaceInidHand.join('')}`;
        this.commandService.parseCommand(command);
        this.textboxService.displayMessage(MessageType.Own, command);
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.handContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.gridService.drawGrid();
        this.gridCanvas.nativeElement.focus();
    }
    maximize(): void {
        this.gridService.clearGrid();
        this.gridService.maxGrid();
        // this.webSocketService.board.next(this.gameBoard);
        // this.gameService.gameBoard.next(this.gameBoard);
    }
    minimize(): void {
        this.gridService.clearGrid();
        this.gridService.minGrid();
        // this.gameService.gameBoard.next(this.gameBoard);
    }
}
