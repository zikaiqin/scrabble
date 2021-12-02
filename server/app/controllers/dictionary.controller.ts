import { Service } from 'typedi';
import { Request, Response, Router } from 'express';
import { DatabaseService } from '@app/services/database.service';
import { DEFAULT_DICTIONARY } from '@app/classes/config';

@Service()
export class DictionaryController {
    router: Router;

    constructor(private dbService: DatabaseService) {
        this.configureRouter();
    }

    /* eslint-disable @typescript-eslint/no-magic-numbers */
    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', (req: Request, res: Response) => {
            // eslint-disable-next-line no-underscore-dangle
            const dictionaries = [{ id: DEFAULT_DICTIONARY._id, name: DEFAULT_DICTIONARY.name, description: DEFAULT_DICTIONARY.description }];
            this.dbService
                .getDictionaryDescriptions()
                .then((customDictionaries) => {
                    res.json(
                        dictionaries.concat(
                            customDictionaries.map((dictionary) => {
                                return {
                                    // eslint-disable-next-line no-underscore-dangle
                                    id: dictionary._id as string,
                                    name: dictionary.name as string,
                                    description: dictionary.description as string,
                                };
                            }),
                        ),
                    );
                })
                .catch(() => res.sendStatus(500));
        });

        this.router.post('/', (req: Request, res: Response) => {
            const { name, description, words } = req.body;
            if (!name || !description || !words) {
                res.sendStatus(400);
                return;
            }
            this.dbService
                .countDictionaries(name)
                .then((count) => {
                    if (count > 0) {
                        res.sendStatus(409);
                        return;
                    }
                    this.dbService
                        .insertDictionary(name, description, words)
                        .then(() => res.sendStatus(200))
                        .catch(() => res.sendStatus(500));
                })
                .catch(() => res.sendStatus(500));
        });

        this.router.put('/', (req: Request, res: Response) => {
            const { id, name, description } = req.body;
            if (!name || !description || !id) {
                res.sendStatus(400);
                return;
            }
            this.dbService
                .countDictionaries(name)
                .then((count) => {
                    if (count > 0) {
                        res.sendStatus(409);
                        return;
                    }
                    this.dbService
                        .editDictionary(id, name, description)
                        .then((updateResult) => {
                            res.sendStatus(updateResult.matchedCount ? 200 : 404);
                        })
                        .catch(() => res.sendStatus(500));
                })
                .catch(() => res.sendStatus(500));
        });

        this.router.delete('/', (req: Request, res: Response) => {
            const { ids } = req.body;
            if (!ids) {
                res.sendStatus(400);
                return;
            }
            this.dbService
                .deleteDictionaries(ids)
                .then((deleteResult) => {
                    res.sendStatus(deleteResult.deletedCount ? 200 : 404);
                })
                .catch(() => res.sendStatus(500));
        });

        this.router.get('/download', (req: Request, res: Response) => {
            const { id } = req.query;
            if (id === undefined) {
                res.sendStatus(400);
                return;
            }
            // eslint-disable-next-line no-underscore-dangle
            if (id === DEFAULT_DICTIONARY._id) {
                res.json({
                    name: DEFAULT_DICTIONARY.name,
                    description: DEFAULT_DICTIONARY.description,
                    words: DEFAULT_DICTIONARY.words,
                });
                return;
            }
            this.dbService
                .getDictionary(id as string)
                .then((dictionary) => {
                    if (!dictionary) {
                        res.sendStatus(404);
                        return;
                    }
                    const { name, description, words } = dictionary;
                    res.json({
                        name,
                        description,
                        words,
                    });
                })
                .catch(() => res.sendStatus(500));
        });
    }
}
