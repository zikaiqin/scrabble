import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { GridService } from '@app/services/grid.service';

describe('GridService', () => {
    let service: GridService;
    let ctxStub: CanvasRenderingContext2D;
    const pointOnMap: Map<string, string> = new Map();
    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 500;
    const DEFAULT_NB_CASES = 16;
    const NEGATIVE_NB = -1;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridService);
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.gridContext = ctxStub;
        service.handContext = ctxStub;
        pointOnMap.set('o11', 'a');
        pointOnMap.set('b11', 'b');
        pointOnMap.set('a2', 'c');
        pointOnMap.set('e1', 'e');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' width should return the width of the grid canvas', () => {
        expect(service.width).toEqual(CANVAS_WIDTH);
    });

    it(' height should return the height of the grid canvas', () => {
        expect(service.width).toEqual(CANVAS_HEIGHT);
    });

    it(' drawLetter should call fillText on the canvas', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();

        service.drawLetter('a', 1, 1);

        expect(fillTextSpy).toHaveBeenCalled();
    });
    it(' drawLetter should not call fillText on the canvas', () => {
        service.drawLetter('a', DEFAULT_NB_CASES, DEFAULT_NB_CASES);

        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();

        expect(fillTextSpy).toHaveBeenCalledTimes(0);
    });
    it(' drawBonus should drawNONE', () => {
        service.drawBonus(1, DEFAULT_NB_CASES);
        const drawNONESpy = spyOn(service, 'drawNONE').and.callThrough();

        expect(drawNONESpy).toHaveBeenCalledTimes(0);
    });
    it(' drawGridLetters should call drawGridLetters', () => {
        const drawGridLettersSpy = spyOn(service, 'drawGridLetters').and.callThrough();

        service.drawGridLetters(pointOnMap);

        expect(drawGridLettersSpy).toHaveBeenCalled();
    });
    it(' drawPlayerHandLetters should call fillText on the canvas', () => {
        const stringTester: string[] = ['a', 'b', 'c'];
        const fillTextSpy = spyOn(service.handContext, 'fillText').and.callThrough();

        service.drawPlayerHandLetters(stringTester);

        expect(fillTextSpy).toHaveBeenCalled();
    });
    it(' clearGrid should call clearRect ', () => {
        const clearRectSpy = spyOn(service.gridContext, 'clearRect').and.callThrough();
        service.clearGrid();
        expect(clearRectSpy).toHaveBeenCalled();
    });
    it(' drawGrid should reset the positions', () => {
        const expectedPostions = CANVAS_WIDTH / DEFAULT_NB_CASES;
        service.drawGrid();
        expect(service.tuilePosX).toBe(expectedPostions);
        expect(service.tuilePosY).toBe(expectedPostions);
    });

    it(' drawGrid should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.drawGrid();
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' drawGrid should increment tuilePosY and tuilePosX', () => {
        service.drawGrid();
    });
    it('should increment scaleCounter when maxGrid', () => {
        service.maxGrid();
        expect(service.scaleCounter).toBe(1);
    });
    it('should not increment scaleCounter when maxGrid', () => {
        service.scaleCounter = 6;

        service.maxGrid();
        expect(service.scaleCounter).toBe(6);
    });
    it('should decrement scaleCounter when minGrid', () => {
        service.minGrid();
        expect(service.scaleCounter).toBe(NEGATIVE_NB);
    });
    it('should not decrement scaleCounter when minGrid', () => {
        service.scaleCounter = NEGATIVE_NB;
        service.minGrid();
        expect(service.scaleCounter).toBe(NEGATIVE_NB);
    });
});
