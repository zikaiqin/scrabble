import { Application } from '@app/app';
import * as http from 'http';
import { AddressInfo } from 'net';
import { Service } from 'typedi';
import { GameService } from './services/game.service';
import { SocketService } from '@app/services/socket.service';
import { ExchangeService } from '@app/services/exchange.service';
import { PlacingService } from '@app/services/placing.service';
import { ValidationService } from '@app/services/validation.service';
import { EndGameService } from '@app/services/end-game.service';

@Service()
export class Server {
    private static readonly appPort: string | number | boolean = Server.normalizePort(process.env.PORT || '3000');
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    private static readonly baseDix: number = 10;
    private server: http.Server;
    private websocketService: SocketService;
    private gameService: GameService;

    constructor(
        private readonly application: Application,
        private exchangeService: ExchangeService,
        private placingService: PlacingService,
        private validationService: ValidationService,
        private endGameService: EndGameService,
    ) {}

    private static normalizePort(val: number | string): number | string | boolean {
        const port: number = typeof val === 'string' ? parseInt(val, this.baseDix) : val;
        if (isNaN(port)) {
            return val;
        } else if (port >= 0) {
            return port;
        } else {
            return false;
        }
    }
    init(): void {
        this.application.app.set('port', Server.appPort);

        this.server = http.createServer(this.application.app);

        this.websocketService = new SocketService(this.server);
        this.websocketService.handleSockets();

        this.endGameService = new EndGameService(this.websocketService);

        this.gameService = new GameService(this.websocketService, this.exchangeService, this.placingService, this.validationService, this.endGameService);
        this.gameService.attachListeners();

        this.server.listen(Server.appPort);
        this.server.on('error', (error: NodeJS.ErrnoException) => this.onError(error));
        this.server.on('listening', () => this.onListening());
    }

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const bind: string = typeof Server.appPort === 'string' ? 'Pipe ' + Server.appPort : 'Port ' + Server.appPort;
        switch (error.code) {
            case 'EACCES':
                // eslint-disable-next-line no-console
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                // eslint-disable-next-line no-console
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Se produit lorsque le serveur se met à écouter sur le port.
     */
    private onListening(): void {
        const addr = this.server.address() as AddressInfo;
        const bind: string = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
        // eslint-disable-next-line no-console
        console.log(`Listening on ${bind}`);
    }
}
