import { TestBed } from '@angular/core/testing';
import { GameBoard } from '@app/classes/game-board';
import { DEFAULT_BONUSES } from '@app/classes/game-config';
import { ASCII_SMALL_A, ValidationService } from './validation.service';

const INDEX_TEST_VALUE = 10;

describe('ValidationService', () => {
    let service: ValidationService;
    let coords: string;
    let startCoord: string;
    let expectedWord: string;
    let map: Map<string, string>;
    let hNewWordValues: Map<string, string>;
    let vNewWordValues: Map<string, string>;
    let singleNewWordValues: Map<string, string>;
    let validDictSearch: string[];
    let invalidDictSearch: string[];

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ValidationService);

        coords = 'a2';
        startCoord = 'a1';
        map = new Map([['h8', 'abaca']]);
        hNewWordValues = new Map([
            ['a2', 'a'],
            ['a3', 'a'],
            ['a4', 's'],
        ]);
        vNewWordValues = new Map([
            ['b1', 'a'],
            ['c1', 'a'],
            ['d1', 's'],
        ]);
        expectedWord = 'aas';
        singleNewWordValues = new Map([['a1', 'a']]);
        validDictSearch = ['abaca', 'aas', 'abacule'];
        invalidDictSearch = ['aaa', 'aasss', 'xfdjk'];

        service.gameBoard = new GameBoard(DEFAULT_BONUSES);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('init should affect correct values', () => {
        const expectedCoordValue = { x: ASCII_SMALL_A, y: 2 };
        service.init(coords, map);

        expect(service.startCoord).toEqual(expectedCoordValue);
        expect(service.newWord).toEqual(map);
        expect(service.coordContainer).toBeTruthy();
    });

    it('findWord should return true', () => {
        expect(service.findWord(validDictSearch)).toBeTrue();
    });

    it('findWord should return false', () => {
        expect(service.findWord(invalidDictSearch)).toBeFalse();
    });

    it('variableReset should affect correct value', () => {
        service.index = INDEX_TEST_VALUE;
        expect(service.index).toEqual(INDEX_TEST_VALUE);
        service.resetVariable();
        expect(service.index).toEqual(1);
    });

    it('fetchWord horizontal', () => {
        for (const i of hNewWordValues) service.gameBoard.placeLetter(i[0], i[1]);
        const spyHCheck = spyOn(service, 'checkHorizontal').and.callThrough();
        service.init(startCoord, hNewWordValues);
        const returnValue = service.fetchWords();
        const expectedString: string = hNewWordValues.keys().next().value;

        expect(spyHCheck).toHaveBeenCalledWith(expectedString);
        expect(returnValue[0]).toEqual(expectedWord);
    });

    it('fetchWord vertical', () => {
        startCoord = 'b1';
        for (const i of vNewWordValues) service.gameBoard.placeLetter(i[0], i[1]);
        const spyVCheck = spyOn(service, 'checkVertival').and.callThrough();
        service.init(startCoord, vNewWordValues);
        const returnValue = service.fetchWords();
        const expectedString: string = vNewWordValues.keys().next().value;

        expect(spyVCheck).toHaveBeenCalledWith(expectedString);
        expect(returnValue[0]).toEqual(expectedWord);
    });

    it('fetchWord single letter placed', () => {
        const spyVCheck = spyOn(service, 'checkVertival').and.callThrough();
        const spyHCheck = spyOn(service, 'checkHorizontal').and.callThrough();
        service.init(startCoord, singleNewWordValues);
        service.fetchWords();
        const expectedString: string = singleNewWordValues.keys().next().value;

        expect(spyHCheck).toHaveBeenCalledWith(expectedString);
        expect(spyVCheck).toHaveBeenCalledWith(expectedString);
    });

    it('calcPoints Wx2 should return correct values', () => {
        startCoord = 'h8';
        const expectedPoints = 6;
        const word = new Map([
            ['h8', 'a'],
            ['h9', 'a'],
            ['h10', 's'],
        ]);
        for (const i of word) service.gameBoard.placeLetter(i[0], i[1]);
        service.init(startCoord, word);
        service.fetchWords();
        const returnValue = service.calcPoints();

        expect(returnValue).toEqual(expectedPoints);
    });

    it('calcPoints Wx3 should return correct values', () => {
        startCoord = 'a1';
        const expectedPoints = 9;
        const word = new Map([
            ['a1', 'a'],
            ['a2', 'a'],
            ['a3', 's'],
        ]);
        for (const i of word) service.gameBoard.placeLetter(i[0], i[1]);
        service.init(startCoord, word);
        service.fetchWords();
        const returnValue = service.calcPoints();

        expect(returnValue).toEqual(expectedPoints);
    });

    it('calcPoints Lx2 should return correct values', () => {
        startCoord = 'd1';
        const expectedPoints = 10;
        const word = new Map([
            ['d1', 'v'],
            ['d2', 'u'],
            ['d3', 'e'],
        ]);
        for (const i of word) service.gameBoard.placeLetter(i[0], i[1]);
        service.init(startCoord, word);
        service.fetchWords();
        const returnValue = service.calcPoints();

        expect(returnValue).toEqual(expectedPoints);
    });

    it('calcPoints Lx3 should return correct values', () => {
        startCoord = 'f2';
        const expectedPoints = 14;
        const word = new Map([
            ['f2', 'v'],
            ['g2', 'u'],
            ['h2', 'e'],
        ]);
        for (const i of word) service.gameBoard.placeLetter(i[0], i[1]);
        service.init(startCoord, word);
        service.fetchWords();
        const returnValue = service.calcPoints();

        expect(returnValue).toEqual(expectedPoints);
    });
});
