import { Service } from 'typedi';
import { Request, Response, Router } from 'express';
import { DEFAULT_BOT_NAMES } from '@app/classes/config';
import { GameDifficulty } from '@app/classes/game-info';
import { DatabaseService } from '@app/services/database.service';

@Service()
export class BotController {
    router: Router;

    constructor(private dbService: DatabaseService) {
        this.configureRouter();
    }

    /* eslint-disable @typescript-eslint/no-magic-numbers */
    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', (req: Request, res: Response) => {
            const { difficulty } = req.query;
            if (difficulty === undefined) {
                res.sendStatus(400);
                return;
            }
            const names = (difficulty === String(GameDifficulty.Easy) ? DEFAULT_BOT_NAMES.easy : DEFAULT_BOT_NAMES.hard).map((name, id) => {
                return { id: String(id), name, default: true };
            });
            this.dbService
                .getBots(Number(difficulty))
                .then((dbNames) => {
                    res.json(
                        names.concat(
                            dbNames.map((bot) => {
                                // eslint-disable-next-line no-underscore-dangle
                                return { id: bot._id, name: bot.name, default: false };
                            }),
                        ),
                    );
                })
                .catch(() => res.sendStatus(500));
        });

        this.router.post('/', (req: Request, res: Response) => {
            const { name, difficulty } = req.body;
            if (name === undefined || difficulty === undefined) {
                res.sendStatus(400);
                return;
            }
            this.dbService
                .findBot(name, difficulty)
                .then((found) => {
                    if (found) {
                        res.sendStatus(409);
                    } else {
                        this.dbService
                            .insertBot(name, difficulty)
                            .then(() => res.sendStatus(200))
                            .catch(() => res.sendStatus(500));
                    }
                })
                .catch(() => res.sendStatus(500));
        });

        this.router.put('/', (req: Request, res: Response) => {
            const { id, name, difficulty } = req.body;
            if (id === undefined || name === undefined || difficulty === undefined) {
                res.sendStatus(400);
                return;
            }
            this.dbService
                .editBot(id, name, difficulty)
                .then((updateResult) => {
                    res.sendStatus(updateResult.matchedCount ? 200 : 404);
                })
                .catch(() => res.sendStatus(500));
        });

        this.router.delete('/', (req: Request, res: Response) => {
            const { ids, difficulty } = req.body;
            if (!ids || difficulty === undefined) {
                res.sendStatus(400);
                return;
            }
            this.dbService
                .deleteBots(ids, difficulty)
                .then((deleteResult) => {
                    res.sendStatus(deleteResult.deletedCount > 0 ? 200 : 404);
                })
                .catch(() => res.sendStatus(500));
        });
        /* eslint-enable @typescript-eslint/no-magic-numbers */
    }
}
