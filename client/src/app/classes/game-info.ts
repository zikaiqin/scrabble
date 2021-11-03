export interface GameInfo {
    username: string;
    turnLength?: number;
    randomized?: boolean;
    gameMode?: number;
    gameType?: number;
    difficulty?: number;
    roomID?: string;
}

export interface GameInit {
    self: string;
    opponent: string;
    bonuses: [string, string][];
    reserve: string[];
    hand: string[];
    turnState?: boolean;
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
