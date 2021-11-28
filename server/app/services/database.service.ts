import { Service } from 'typedi';
import { MongoClient, Db, Document } from 'mongodb';
import { HighScore } from '@app/classes/highscore';
import { DATABASE, DEFAULT_HIGH_SCORES } from '@app/classes/config';
import { GameMode } from '@app/classes/game-info';

@Service()
export class DatabaseService {
    private client: MongoClient;

    private highScoreDB: Db;

    async databaseConnect(): Promise<MongoClient | null> {
        try {
            const client = await MongoClient.connect(DATABASE.url);
            this.client = client;
            this.highScoreDB = client.db(DATABASE.highScore.name);
        } catch {
            throw new Error('Database connection error');
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async resetDB() {
        return Promise.all([
            this.highScoreDB.dropCollection(DATABASE.highScore.collections.classical),
            this.highScoreDB.dropCollection(DATABASE.highScore.collections.log2990),
        ]);
    }

    async putDefaultScores(): Promise<void> {
        await Promise.all([
            this.highScoreDB.collection(DATABASE.highScore.collections.classical).insertMany(DEFAULT_HIGH_SCORES.classical),
            this.highScoreDB.collection(DATABASE.highScore.collections.log2990).insertMany(DEFAULT_HIGH_SCORES.log2990),
        ]);
    }

    async postHighScore(highScore: HighScore, gameMode: number): Promise<void> {
        const collection = DATABASE.highScore.collections[gameMode === GameMode.Classical ? 'classical' : 'log2990'];
        const lowestScore = await this.highScoreDB.collection(collection).find({}).sort({ score: 1 }).limit(1).toArray();
        if (highScore.score > lowestScore[0].score) {
            this.highScoreDB.collection(collection).insertOne(highScore);
            // eslint-disable-next-line no-underscore-dangle
            this.highScoreDB.collection(collection).deleteOne({ _id: (lowestScore[0] as Document)._id });
        }
    }

    async getHighScores(gameMode: number): Promise<HighScore[]> {
        return this.highScoreDB
            .collection(DATABASE.highScore.collections[gameMode === GameMode.Classical ? 'classical' : 'log2990'])
            .find({})
            .sort({ score: -1 })
            .toArray()
            .then((score: HighScore[]) => {
                return score;
            });
    }
}
