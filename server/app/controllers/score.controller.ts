import { Service } from 'typedi';
import { Request, Response, Router } from 'express';
import { DatabaseService } from '@app/services/database.service';

@Service()
export class ScoreController {
    router: Router;

    constructor(private dbService: DatabaseService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', (req: Request, res: Response) => {
            const gameMode = Number(req.query.gameMode);
            this.dbService
                .getHighScores(gameMode)
                .then((scores) => {
                    res.json(scores);
                })
                .catch(() => {
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                    res.sendStatus(502);
                });
        });
    }
}
