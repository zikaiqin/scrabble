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

export interface PlayerInfo {
    socketID: string;
    username: string;
}

export type BotName = {
    _id: string;
    name: string;
};
