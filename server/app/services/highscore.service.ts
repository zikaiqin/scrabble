import { Service } from 'typedi';
import { DatabaseService } from '@app/services/database.service';
import { Score } from '@app/classes/highscore';
import { GameMode } from '@app/classes/game-info';

@Service()
export class HighscoreService {
    constructor(private databaseService: DatabaseService) {}

    async updateHighscore(highScore: Score, gameMode: number): Promise<void> {
        if (gameMode === GameMode.Log2990) {
            const lowestScore = await this.databaseService.collectionLog2990.find<Score>({}).sort({ score: 1 }).limit(1).toArray();
            if (highScore.score > lowestScore[0].score) {
                this.databaseService.collectionLog2990.insertOne(highScore);
                /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }]*/
                /* eslint-disable  @typescript-eslint/no-explicit-any */
                this.databaseService.collectionLog2990.deleteOne({ _id: (lowestScore[0] as any)._id });
            }
        } else {
            const lowestScore = await this.databaseService.collectionClassic.find<Score>({}).sort({ score: 1 }).limit(1).toArray();
            if (highScore.score > lowestScore[0].score) {
                this.databaseService.collectionClassic.insertOne(highScore);
                /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }]*/
                /* eslint-disable  @typescript-eslint/no-explicit-any */
                this.databaseService.collectionClassic.deleteOne({ _id: (lowestScore[0] as any)._id });
            }
        }
    }

    async getHighscore(gameMode: number): Promise<Score[]> {
        if (gameMode === GameMode.Log2990) {
            return this.databaseService.collectionLog2990
                .find({})
                .sort({ score: -1 })
                .toArray()
                .then((score: Score[]) => {
                    return score;
                });
        } else {
            return this.databaseService.collectionClassic
                .find({})
                .sort({ score: -1 })
                .toArray()
                .then((score: Score[]) => {
                    return score;
                });
        }
    }
}
