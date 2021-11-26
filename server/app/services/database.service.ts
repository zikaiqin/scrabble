import { Service } from 'typedi';
import { MongoClient, Db, Collection } from 'mongodb';
import { Score } from '@app/classes/highscore';
import { EMPTYSCORE } from '@app/classes/config';

const DATABASE_URL = 'mongodb+srv://equipe105:giornogiovanna@cluster0.9flzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const DATABASE_NAME = 'HighScore';
const DATABASE_COLLECTION_LOG2990 = 'ScoreLog2990';
const DATABASE_COLLECTION_CLASSIC = 'ScoreClassic';

@Service()
export class DatabaseService {
    private highScoreDatabase: Db;
    private client: MongoClient;

    async databaseConnect(): Promise<MongoClient | null> {
        try {
            const client = await MongoClient.connect(DATABASE_URL);
            this.client = client;
            this.highScoreDatabase = client.db(DATABASE_NAME);
        } catch {
            throw new Error('Database connection error');
        }

        if ((await this.highScoreDatabase.collection(DATABASE_COLLECTION_LOG2990).countDocuments()) === 0) {
            await this.setDefaultScoresLog2990();
        }

        if ((await this.highScoreDatabase.collection(DATABASE_COLLECTION_CLASSIC).countDocuments()) === 0) {
            await this.setDefaultScoresClassic();
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async setDefaultScoresLog2990(): Promise<void> {
        for (const score of EMPTYSCORE) {
            await this.highScoreDatabase.collection(DATABASE_COLLECTION_LOG2990).insertOne(score);
        }
    }

    async setDefaultScoresClassic(): Promise<void> {
        for (const score of EMPTYSCORE) {
            await this.highScoreDatabase.collection(DATABASE_COLLECTION_CLASSIC).insertOne(score);
        }
    }

    get collectionClassic(): Collection<Score> {
        return this.highScoreDatabase.collection(DATABASE_COLLECTION_CLASSIC);
    }

    get collectionLog2990(): Collection<Score> {
        return this.highScoreDatabase.collection(DATABASE_COLLECTION_LOG2990);
    }
}
