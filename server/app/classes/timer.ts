import EventEmitter from 'events';

export class Timer {
    timerEvents = new EventEmitter();

    // Locking mechanism to prevent modification during turn transition
    private locked = false;

    private readonly turnLength: number;
    private turnState: boolean;
    private timer: NodeJS.Timeout;

    constructor(roomID: string, turnLength: number) {
        this.turnLength = turnLength;
        this.turnState = Boolean(Math.floor(Math.random() * 2));
    }

    startTimer(): void {
        this.unlock();
        let currentTime = this.turnLength;
        const callback = (): void => {
            this.timerEvents.emit('updateTime', currentTime);
            if (currentTime > 0) {
                currentTime--;
            } else {
                this.changeTurn();
            }
        };
        callback();
        this.timer = setInterval(callback, SECOND);
    }

    clearTimer(): void {
        clearInterval(this.timer);
        this.timerEvents.emit('updateTime', 0);
    }

    changeTurn(): void {
        if (this.locked) {
            return;
        }
        this.lock();
        this.clearTimer();
        this.turnState = !this.turnState;
        this.timerEvents.emit('updateTurn', this.turnState);
    }

    private lock(): void {
        this.locked = true;
    }

    private unlock(): void {
        this.locked = false;
    }
}

const SECOND = 1000;
