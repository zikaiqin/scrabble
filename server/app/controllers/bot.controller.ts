import { Service } from 'typedi';
import { Request, Response, Router } from 'express';
import { DEFAULT_BOT_NAMES } from '@app/classes/config';
import { GameDifficulty } from '@app/classes/game-info';

@Service()
export class BotController {
    router: Router;

    constructor() {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', (req: Request, res: Response) => {
            const names = req.query.difficulty === String(GameDifficulty.Easy) ? DEFAULT_BOT_NAMES.easy : DEFAULT_BOT_NAMES.hard;
            res.json(
                names
                    .map((name, id) => {
                        return { id, name, default: true };
                    })
                    .concat([
                        { id: -1, name: 'oort cloud', default: false },
                        { id: -2, name: '1984531616486535', default: false },
                    ]),
            );
        });

        /* eslint-disable @typescript-eslint/no-magic-numbers */
        this.router.post('/', (req: Request, res: Response) => {
            console.log(req.body);
            const success = () => Boolean(Math.floor(Math.random() * 2));
            if (success()) {
                res.sendStatus(200);
                return;
            }
            if (success()) {
                res.status(409).send(req.body);
                return;
            }
            res.sendStatus(502);
        });

        this.router.put('/', (req: Request, res: Response) => {
            console.log(req.body);
            const success = () => Boolean(Math.floor(Math.random() * 2));
            res.sendStatus(success() ? 200 : success() ? 404 : 502);
        });

        this.router.delete('/', (req: Request, res: Response) => {
            console.log(req.body);
            const success = () => Boolean(Math.floor(Math.random() * 2));
            res.sendStatus(success() ? 200 : success() ? 404 : 502);
        });
        /* eslint-enable @typescript-eslint/no-magic-numbers */
    }
}
