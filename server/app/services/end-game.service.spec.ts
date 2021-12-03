/* eslint-disable max-classes-per-file */
import { Player } from '@app/classes/player';
import { Reserve } from '@app/classes/reserve';
import { EndGameService } from '@app/services/end-game.service';
import { GameDisplayService } from '@app/services/game-display.service';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

class MockPlayer extends Player {
    name: string;
    hand: string[];
    score: number;

    clearHand(): void {
        this.hand = [];
    }

    setScore(score: number): void {
        this.score = score;
    }
}

class MockReserve extends Reserve {
    letters: string[];

    setLetters(letters: string[]): void {
        this.letters = letters;
    }

    clearReserve(): void {
        this.letters = [];
    }
}

describe('End Game Service', () => {
    let endGameService: EndGameService;
    let fakeGameDisplayService: GameDisplayService;
    let player: MockPlayer;
    let opponent: MockPlayer;
    const randomLetters1: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const randomLetters2: string[] = ['h', 'i', 'j', 'k', 'l', 'm', 'n'];
    let reserve: MockReserve;
    const room1 = 'room1';
    const room2 = 'room2';
    const sandBox = createSandbox();

    beforeEach(() => {
        endGameService = new EndGameService(fakeGameDisplayService);
        /* eslint-disable */
        endGameService.turnSkipMap.set(room1, 3);
        endGameService.turnSkipMap.set(room2, 6);
        /* eslint-enable */
        player = new MockPlayer('John');
        player.addAll(randomLetters1);
        opponent = new MockPlayer('Lao');
        opponent.addAll(randomLetters2);
        reserve = new MockReserve();
        reserve.setLetters(randomLetters2);
    });

    it('should increment the turn skipped counter by 1 to the right room', () => {
        endGameService.incrementTurnSkipCount(room1);
        // eslint-disable-next-line
        expect(endGameService.turnSkipMap.get(room1)).to.equals(4);
    });

    it('should do nothing if the room does not exist', () => {
        const spy = sandBox.spy(endGameService.turnSkipMap, 'set');
        endGameService.incrementTurnSkipCount('room3');
        expect(spy.notCalled);
    });

    it('should do nothing if the room does not exist', () => {
        const spy = sandBox.spy(endGameService.turnSkipMap, 'set');
        endGameService.resetTurnSkipCount('room3');
        expect(spy.notCalled);
    });

    it('should reset the turn skipped counter on the right room', () => {
        endGameService.resetTurnSkipCount(room1);
        // eslint-disable-next-line
        expect(endGameService.turnSkipMap.get(room1)).to.equals(0);
    });

    it('should check if game ended and return true when the reserve and one of the hands are empty', () => {
        player.clearHand();
        reserve.clearReserve();
        expect(endGameService.checkIfGameEnd(reserve, player, opponent, room1)).to.equals(true);
    });

    it('should check if game ended and return true when players skipped 6 consecutive turns', () => {
        expect(endGameService.checkIfGameEnd(reserve, player, opponent, room2)).to.equals(true);
    });

    it('should check if game ended and return false when the reserve is empty but both players still have letters', () => {
        reserve.clearReserve();
        expect(endGameService.checkIfGameEnd(reserve, player, opponent, room1)).to.equals(false);
    });

    it('should deduct points to the player in parameter', () => {
        // eslint-disable-next-line
        player.setScore(100);
        endGameService.deductPoints(player);
        // eslint-disable-next-line
        expect(player.score).to.equals(84);
    });

    it('should ignore the * letter', () => {
        player.setScore(1);
        player.clearHand();
        player.add('*');
        endGameService.deductPoints(player);
        // eslint-disable-next-line
        expect(player.score).to.equals(1);
    });

    it('should add points to the player by the number of letters left in opponent hand', () => {
        endGameService.addPoints(player, opponent.hand);
        // eslint-disable-next-line
        expect(player.score).to.equals(27);
    });

    it('should return the player with empty hand and the hand of the opponent', () => {
        player.clearHand();
        const expectedPlayerAndHand: [Player, string[]] | undefined = [player, opponent.hand];
        const playerAndHand = endGameService.checkWhoEmptiedHand(player, opponent);
        expect(playerAndHand).to.deep.equals(expectedPlayerAndHand);
    });

    it('should return the other player with empty hand and the hand of the opponent', () => {
        opponent.clearHand();
        const expectedPlayerAndHand = [opponent, player.hand];
        const playerAndHand = endGameService.checkWhoEmptiedHand(player, opponent);
        expect(playerAndHand).to.deep.equals(expectedPlayerAndHand);
    });

    it('should return undefined if both players still have letters', () => {
        const expectedPlayerAndHand = undefined;
        const playerAndHand = endGameService.checkWhoEmptiedHand(player, opponent);
        expect(playerAndHand).to.equals(expectedPlayerAndHand);
    });

    it('should return the letters left in each hand', () => {
        const letters = endGameService.showLettersLeft(player, opponent);
        expect(letters[1]).to.equals(`${player.name}:\t${player.hand.join('')}`);
        expect(letters[2]).to.equals(`${opponent.name}:\t${opponent.hand.join('')}`);
    });

    it('should return the name of the player with the highest score', () => {
        /* eslint-disable */
        player.setScore(30);
        opponent.setScore(43);
        /* eslint-enable */
        expect(endGameService.getWinner(player, opponent)).to.equals(opponent.name);
    });

    it('should return the name of the other player with the highest score', () => {
        /* eslint-disable */
        player.setScore(60);
        opponent.setScore(43);
        /* eslint-enable */
        expect(endGameService.getWinner(player, opponent)).to.equals(player.name);
    });

    it('should return the name of both players when they have the same score', () => {
        /* eslint-disable */
        player.setScore(30);
        opponent.setScore(30);
        /* eslint-enable */
        expect(endGameService.getWinner(player, opponent)).to.equals(player.name + ' et ' + opponent.name);
    });

    it('should set the final score of each player', () => {
        player.clearHand();
        /* eslint-disable */
        player.setScore(30);
        opponent.setScore(100);
        /* eslint-enable */
        endGameService.setPoints(player, opponent);
        /* eslint-disable */
        expect(player.score).to.equals(57);
        expect(opponent.score).to.equals(73);
        /* eslint-enable */
    });

    it('should set the final score of each player with no empty hands', () => {
        /* eslint-disable */
        player.setScore(30);
        opponent.setScore(100);
        /* eslint-enable */
        endGameService.setPoints(player, opponent);
        /* eslint-disable */
        expect(player.score).to.equals(14);
        expect(opponent.score).to.equals(73);
        /* eslint-enable */
    });
});
