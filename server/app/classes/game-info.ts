export interface GameInfo {
    username: string;
    turnLength?: number;
    randomized?: boolean;
    gameMode?: number;
    gameType?: number;
    difficulty?: number;
    roomID?: string;
}

export enum GameMode {
    None,
    Classical,
    Log2990,
}

export enum GameType {
    None,
    Single,
    Multi,
}

export enum GameDifficulty {
    Easy,
    Hard,
}