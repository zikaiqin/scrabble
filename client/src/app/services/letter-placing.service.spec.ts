import { TestBed } from '@angular/core/testing';
import { GameBoard } from '@app/classes/game-board';
import { PlayerHand } from '@app/classes/player-hand';
import { Reserve } from '@app/classes/reserve';
import { GameService } from '@app/services/game.service';
import { LetterPlacingService } from '@app/services/letter-placing.service';
import { TextboxService } from '@app/services/textbox.service';
import { ValidationService } from '@app/services/validation.service';
import { Subject } from 'rxjs';

describe('LetterPlacingService', () => {
    let service: LetterPlacingService;
    let gameServiceSpy: jasmine.SpyObj<GameService>;

    beforeEach(() => {
        gameServiceSpy = jasmine.createSpyObj('GameService', ['']);
        gameServiceSpy.playerHand = new Subject<PlayerHand>();
        gameServiceSpy.playerScore = new Subject<number>();
        gameServiceSpy.turnState = new Subject<boolean>();
        gameServiceSpy.gameBoard = new Subject<GameBoard>();
        TestBed.configureTestingModule({
            providers: [{ provide: GameService, useValue: gameServiceSpy }],
        });
        service = TestBed.inject(LetterPlacingService);
        gameServiceSpy.turnState.next(true);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should generate letters correctly', () => {
        service.word = 'stub';
        service.letters = new Map<string, string>();
        service.startCoords = 'a1';
        service.direction = 'h';
        service.generateLetters(service.letters, service.word, service.startCoords, service.direction);
        expect(Array.from(service.letters.entries())).toEqual([
            ['a1', 's'],
            ['a2', 't'],
            ['a3', 'u'],
            ['a4', 'b'],
        ]);

        service.letters.clear();
        service.word = 'flaShY';
        service.startCoords = 'j15';
        service.direction = 'v';
        service.generateLetters(service.letters, service.word, service.startCoords, service.direction);
        expect(Array.from(service.letters.entries())).toEqual([
            ['j15', 'f'],
            ['k15', 'l'],
            ['l15', 'a'],
            ['m15', 'S'],
            ['n15', 'h'],
            ['o15', 'Y'],
        ]);
    });

    it('should re-map special chars', () => {
        const expected = 'aeueaeioueiuc'.split('');
        const actual = 'àèùéâêîôûëïüç'.split('');
        expect(actual.every((letter, index) => service.mapSpecialChars(letter) === expected[index])).toBeTrue();
    });

    it('should not allow placing when not my turn', () => {
        expect(service.isMyTurn(undefined)).toBeFalse();
        expect(service.isMyTurn(false)).toBeFalse();
        expect(service.isMyTurn(true)).toBeTrue();
    });

    it('should reject invalid position params', () => {
        expect(service.isValidParam('a1v', 'stub')).toBeTrue();
        expect(service.isValidParam('o15h', 'stub')).toBeTrue();
        expect(service.isValidParam('a16v', 'stub')).toBeFalse();
        expect(service.isValidParam('p1h', 'stub')).toBeFalse();
        expect(service.isValidParam('top-left', 'stub')).toBeFalse();
        expect(service.isValidParam('', 'stub')).toBeFalse();
    });

    it('should reject invalid word params', () => {
        expect(service.isValidParam('a1v', 'StuB')).toBeTrue();
        expect(service.isValidParam('a1v', 'àèùéâêîôûëïüç')).toBeTrue();
        expect(service.isValidParam('a1v', 'Mild Seven')).toBeFalse();
        expect(service.isValidParam('a1v', "Denny's")).toBeFalse();
        expect(service.isValidParam('a1v', 'hy-phen')).toBeFalse();
        expect(service.isValidParam('a1v', '')).toBeFalse();
    });

    it('should not allow placing out of bounds', () => {
        expect(service.isInBounds('h8', 'v', 'stub')).toBeTrue();
        expect(service.isInBounds('l15', 'v', 'stub')).toBeTrue();
        expect(service.isInBounds('l15', 'h', 'stub')).toBeFalse();
        expect(service.isInBounds('o8', 'v', 'stub')).toBeFalse();
    });

    it('should not allow placing of letters not in hand', () => {
        const fakeHand = {
            get: (letter: string): number => ['s', 't', 'u', 'b', 'l', 'e', '*'].filter((actualLetter) => actualLetter === letter).length,
        };

        service = new LetterPlacingService(
            // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-empty-function --- not worth declaring textBoxService just for this test
            { sendMessage: (type: string, text: string) => {} } as TextboxService,
            gameServiceSpy as unknown as GameService,
            {} as ValidationService,
        );
        let expectedHand = new Map<string, string>([
            ['1', 's'],
            ['2', 't'],
            ['3', 'u'],
            ['4', 'b'],
        ]);
        expect(service.isInHand(expectedHand, fakeHand as PlayerHand)).toBeTrue();

        expectedHand = new Map<string, string>([
            ['1', 's'],
            ['2', 't'],
            ['3', 'u'],
            ['4', 'M'],
            ['5', 'b'],
            ['6', 'l'],
            ['7', 'e'],
        ]);
        expect(service.isInHand(expectedHand, fakeHand as PlayerHand)).toBeTrue();

        expectedHand = new Map<string, string>([
            ['1', 'b'],
            ['2', 'u'],
            ['3', 'B'],
            ['4', 'B'],
            ['5', 'l'],
            ['6', 'e'],
        ]);
        expect(service.isInHand(expectedHand, fakeHand as PlayerHand)).toBeFalse();
    });

    it('should place a letter on H8 on first turn', () => {
        const board = new GameBoard(new Map<string, string>());
        let toPlace = new Map<string, string>([
            ['g8', 's'],
            ['h8', 't'],
            ['i8', 'u'],
            ['j8', 'b'],
        ]);
        expect(service.isAdjacent(board, toPlace, Array.from(toPlace.keys())[0], Array.from(toPlace.keys())[3])).toBeTrue();

        toPlace = new Map<string, string>([
            ['j7', 's'],
            ['j8', 't'],
            ['j9', 'u'],
            ['j10', 'b'],
        ]);
        expect(service.isAdjacent(board, toPlace, Array.from(toPlace.keys())[0], Array.from(toPlace.keys())[3])).toBeFalse();
    });

    it('should not allow placing of conflicting letters', () => {
        const board = new GameBoard(new Map<string, string>());
        let toPlace = new Map<string, string>([
            ['g8', 's'],
            ['h8', 't'],
            ['i8', 'u'],
            ['j8', 'b'],
        ]);
        toPlace.forEach((value, key) => board.placeLetter(key, value));

        toPlace = new Map<string, string>([
            ['h7', 's'],
            ['h8', 't'],
            ['h9', 'u'],
            ['h10', 'b'],
        ]);
        expect(service.isAdjacent(board, toPlace, Array.from(toPlace.keys())[0], Array.from(toPlace.keys())[3])).toBeTrue();

        toPlace = new Map<string, string>([
            ['h7', 's'],
            ['h8', 'l'],
            ['h9', 'a'],
            ['h10', 'b'],
        ]);
        expect(service.isAdjacent(board, toPlace, Array.from(toPlace.keys())[0], Array.from(toPlace.keys())[3])).toBeFalse();
    });

    it('should check for adjacency', () => {
        const board = new GameBoard(new Map<string, string>());
        let toPlace = new Map<string, string>([
            ['g8', 's'],
            ['h8', 't'],
            ['i8', 'u'],
            ['j8', 'b'],
        ]);
        toPlace.forEach((value, key) => board.placeLetter(key, value));

        toPlace = new Map<string, string>([
            ['g9', 't'],
            ['g10', 'u'],
            ['g11', 'b'],
        ]);
        expect(service.isAdjacent(board, toPlace, Array.from(toPlace.keys())[0], Array.from(toPlace.keys())[2])).toBeTrue();

        toPlace = new Map<string, string>([
            ['f9', 's'],
            ['f10', 't'],
            ['f11', 'u'],
            ['f12', 'b'],
        ]);
        expect(service.isAdjacent(board, toPlace, Array.from(toPlace.keys())[0], Array.from(toPlace.keys())[3])).toBeFalse();
    });

    it('should place letters from the hand onto the board', () => {
        service = new LetterPlacingService({} as TextboxService, gameServiceSpy as unknown as GameService, {} as ValidationService);

        const actualHand = ['s', 't', 'u', 'b', 'm', 'l', 'e'];
        const expectedHand = ['m', 'l', 'e'];
        const actualBoard = new Map<string, string>();
        const expectedBoard = new Map<string, string>([
            ['a1', 's'],
            ['a2', 't'],
            ['a3', 'u'],
            ['a4', 'b'],
        ]);
        const fakeHand = {
            remove: (letter: string) => {
                const index = actualHand.indexOf(letter);
                actualHand.splice(index, 1);
            },
        };
        const fakeBoard = {
            placeLetter: (coords: string, letter: string) => {
                actualBoard.set(coords, letter);
            },
        };
        service.placeLetters(expectedBoard, fakeBoard as GameBoard, fakeHand as PlayerHand);

        expect(actualHand).toEqual(expectedHand);
        expect(actualBoard).toEqual(expectedBoard);
    });

    it('should return letters from the board into the hand', () => {
        service = new LetterPlacingService({} as TextboxService, gameServiceSpy as unknown as GameService, {} as ValidationService);

        const actualHand = ['s', 't', 'o'];
        const expectedHand = ['s', 't', 'o', 'm', 'a', 'c', 'h'];
        const actualBoard = new Map<string, string>([
            ['a1', 'm'],
            ['a2', 'a'],
            ['a3', 'c'],
            ['a4', 'h'],
        ]);
        const expectedBoard = new Map<string, string>();
        const fakeHand = {
            add: (letter: string) => {
                actualHand.push(letter);
            },
        };
        const fakeBoard = {
            removeAt: (coords: string) => {
                actualBoard.delete(coords);
            },
        };
        service.returnLetters(actualBoard, fakeBoard as GameBoard, fakeHand as PlayerHand);

        expect(actualHand).toEqual(expectedHand);
        expect(actualBoard).toEqual(expectedBoard);
    });

    it('should fully replenish the hand when letters in reserve are plentiful', () => {
        service = new LetterPlacingService({} as TextboxService, gameServiceSpy as unknown as GameService, {} as ValidationService);

        const actualHand = ['s', 't', 'o'];
        const expectedHand = ['s', 't', 'o', 'm', 'a', 'c', 'h'];
        const actualReserve = ['m', 'a', 'c', 'h', 'i', 'n', 'e'];
        const expectedReserve = ['i', 'n', 'e'];
        const placedLetters = new Map<string, string>([
            ['a1', 'm'],
            ['a2', 'a'],
            ['a3', 'c'],
            ['a4', 'h'],
        ]);
        const fakeHand = {
            add: (letter: string) => {
                actualHand.push(letter);
            },
        };
        const fakeReserve = {
            drawOne: (): string => {
                return actualReserve.splice(0, 1)[0];
            },
        };
        service.replenishHand(placedLetters, fakeReserve as Reserve, fakeHand as PlayerHand);

        expect(actualHand).toEqual(expectedHand);
        expect(actualReserve).toEqual(expectedReserve);
    });

    it('should replenish the hand as much as possible when reserve is running low', () => {
        service = new LetterPlacingService({} as TextboxService, gameServiceSpy as unknown as GameService, {} as ValidationService);

        const actualHand = ['s', 't', 'o'];
        const expectedHand = ['s', 't', 'o', 'm', 'a'];
        const actualReserve = ['m', 'a'];
        const expectedReserve: string[] = [];
        const placedLetters = new Map<string, string>([
            ['a1', 'm'],
            ['a2', 'a'],
            ['a3', 'c'],
            ['a4', 'h'],
        ]);
        const fakeHand = {
            add: (letter: string) => {
                actualHand.push(letter);
            },
        };
        const fakeReserve = {
            drawOne: (): string | undefined => {
                return actualReserve.length > 0 ? actualReserve.splice(0, 1)[0] : undefined;
            },
        };
        service.replenishHand(placedLetters, fakeReserve as Reserve, fakeHand as PlayerHand);

        expect(actualHand).toEqual(expectedHand);
        expect(actualReserve).toEqual(expectedReserve);
    });
});
