import { EventEmitter } from 'events';

export class Timer extends EventEmitter {
    static readonly events = {
        updateTurn: 'updateTurn',
        updateTime: 'updateTime',
        timeElapsed: 'timeElapsed',
    };

    // Locking mechanism to prevent modification during turn transition
    private locked = false;

    private readonly turnLength: number;
    private turnState: boolean;
    private timer: NodeJS.Timeout;

    constructor(roomID: string, turnLength: number) {
        super();
        this.turnLength = turnLength;
        this.turnState = Boolean(Math.floor(Math.random() * 2));
    }

    startTimer(): void {
        this.unlock();
        let currentTime = this.turnLength;
        const callback = (): void => {
            this.emit(Timer.events.updateTime, currentTime);
            if (currentTime > 0) {
                currentTime--;
            } else {
                this.emit(Timer.events.timeElapsed);
                this.changeTurn();
            }
        };
        callback();
        this.timer = setInterval(callback, SECOND);
    }

    clearTimer(): void {
        clearInterval(this.timer);
        this.emit(Timer.events.updateTime, 0);
    }

    changeTurn(): void {
        if (this.locked) {
            return;
        }
        this.lock();
        this.clearTimer();
        this.turnState = !this.turnState;
        this.emit(Timer.events.updateTurn, this.turnState);
    }

    lock(): void {
        this.locked = true;
    }

    private unlock(): void {
        this.locked = false;
    }

    get isLocked(): boolean {
        return this.locked;
    }
}

const SECOND = 1000;
