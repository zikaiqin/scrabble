import { Service } from 'typedi';
import { MongoClient, Db, Document, ObjectId } from 'mongodb';
import { HighScore } from '@app/classes/highscore';
import { DATABASE, DEFAULT_HIGH_SCORES } from '@app/classes/config';
import { BotName, GameDifficulty, GameMode } from '@app/classes/game-info';

@Service()
export class DatabaseService {
    private client: MongoClient;

    private highScoreDB: Db;
    private botDB: Db;

    async databaseConnect(): Promise<MongoClient | null> {
        try {
            const client = await MongoClient.connect(DATABASE.url);
            this.client = client;
            this.highScoreDB = client.db(DATABASE.highScore.name);
            this.botDB = client.db(DATABASE.bot.name);
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
            this.botDB.dropCollection(DATABASE.bot.collections.easy),
            this.botDB.dropCollection(DATABASE.bot.collections.hard),
            this.highScoreDB.dropCollection(DATABASE.highScore.collections.classical),
            this.highScoreDB.dropCollection(DATABASE.highScore.collections.log2990),
        ]);
    }

    async insertDefaultScores(): Promise<void> {
        await Promise.all([
            this.highScoreDB.collection(DATABASE.highScore.collections.classical).insertMany(DEFAULT_HIGH_SCORES.classical),
            this.highScoreDB.collection(DATABASE.highScore.collections.log2990).insertMany(DEFAULT_HIGH_SCORES.log2990),
        ]);
    }

    async updateHighScore(highScore: HighScore, gameMode: number): Promise<void> {
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

    async getBots(difficulty: number): Promise<BotName[]> {
        return this.botDB
            .collection(DATABASE.bot.collections[difficulty === GameDifficulty.Easy ? 'easy' : 'hard'])
            .find({})
            .toArray();
    }

    async findBot(name: string, difficulty: number): Promise<Document | undefined> {
        return this.botDB.collection(DATABASE.bot.collections[difficulty === GameDifficulty.Easy ? 'easy' : 'hard']).findOne({ name });
    }

    async insertBot(name: string, difficulty: number) {
        return this.botDB.collection(DATABASE.bot.collections[difficulty === GameDifficulty.Easy ? 'easy' : 'hard']).insertOne({ name });
    }

    async editBot(id: string, name: string, difficulty: number) {
        return this.botDB
            .collection(DATABASE.bot.collections[difficulty === GameDifficulty.Easy ? 'easy' : 'hard'])
            .updateOne({ _id: new ObjectId(id) }, { $set: { name } });
    }

    async deleteBots(ids: string[], difficulty: number) {
        return this.botDB
            .collection(DATABASE.bot.collections[difficulty === GameDifficulty.Easy ? 'easy' : 'hard'])
            .deleteMany({ _id: { $in: ids.map((id) => new ObjectId(id)) } });
    }
}
