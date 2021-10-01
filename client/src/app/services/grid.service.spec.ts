import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { GridService } from '@app/services/grid.service';

describe('GridService', () => {
    let service: GridService;
    let ctxStub: CanvasRenderingContext2D;
    // const CHARCODE_SMALL_A = 97;

    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 500;
    // const DEFAULT_SCALE = 0.04;

    // const DEFAULT_NB_CASES = 16;
    // const STROKE_RANGE = 4;
    // const DEFAULT_WIDTH_CHEVALET = 385;
    // const DEFAULT_HEIGHT_CHEVALET = 55;
    // const NB_CASE_CHEVALET = 7;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridService);
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.gridContext = ctxStub;
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
        service.drawLetter('test');
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it(' drawLetter should not call fillText if word is empty', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service.drawLetter('');
        expect(fillTextSpy).toHaveBeenCalledTimes(0);
    });

    it(' drawLetter should call fillText as many times as letters in a word', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const word = 'test';
        service.drawLetter(word);
        expect(fillTextSpy).toHaveBeenCalledTimes(word.length);
    });

    it(' drawLetter should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.drawLetter('test');
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' drawGrid should call moveTo and lineTo 4 times', () => {
        const expectedCallTimes = 4;
        const moveToSpy = spyOn(service.gridContext, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(service.gridContext, 'lineTo').and.callThrough();
        service.drawGrid();
        expect(moveToSpy).toHaveBeenCalledTimes(expectedCallTimes);
        expect(lineToSpy).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it(' drawGrid should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.drawGrid();
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it('should decrease indexChevalet when maxGrid', () => {
        service.maxGrid();
        expect(service.indexChevalet).toEqual(CANVAS_HEIGHT);
    });
});
