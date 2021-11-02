import { Injectable } from '@angular/core';
import { LetterExchangeService } from '@app/services/letter-exchange.service';
import { LetterPlacingService } from '@app/services/letter-placing.service';
import { TextboxService } from '@app/services/textbox.service';
import { WebsocketService } from '@app/services/websocket.service';
import { MessageType } from '@app/classes/message';

@Injectable({
    providedIn: 'root',
})
export class CommandService {
    debugActive: boolean = false;
    turn: boolean;
    readonly commandLookup: Map<string, (...params: string[]) => boolean>;

    constructor(
        private textboxService: TextboxService,
        private letterPlacingService: LetterPlacingService,
        private letterExchangeService: LetterExchangeService,
        private websocketService: WebsocketService,
    ) {
        this.commandLookup = new Map<string, (...params: string[]) => boolean>([
            [
                '!aide',
                (): boolean => {
                    this.textboxService.displayMessage(
                        MessageType.System,
                        `Voici une liste des commandes : ${Array.from(this.commandLookup.keys()).join(', ')}`,
                    );
                    return false;
                },
            ],
            [
                '!placer',
                (position: string, word: string): boolean => {
                    if (this.letterPlacingService.validateCommand(position, word)) {
                        this.websocketService.placeLetters(this.letterPlacingService.startCoords, this.letterPlacingService.letters);
                        return true;
                    }
                    return false;
                },
            ],
            [
                '!échanger',
                (letters: string): boolean => {
                    if (this.letterExchangeService.validateCommand(letters)) {
                        this.websocketService.exchangeLetters(letters);
                        return true;
                    }
                    return false;
                },
            ],
            [
                '!debug',
                (): boolean => {
                    if (!this.debugActive) {
                        this.textboxService.displayMessage(MessageType.System, 'Affichages de déboguage activés');
                        this.debugActive = true;
                    } else {
                        this.textboxService.displayMessage(MessageType.System, 'Affichages de déboguage désactivés');
                        this.debugActive = false;
                    }
                    return false;
                },
            ],
            [
                '!passer',
                (): boolean => {
                    if (!this.turn) {
                        this.textboxService.displayMessage(MessageType.System, "Ce n'est pas votre tour");
                        return false;
                    }
                    this.textboxService.displayMessage(MessageType.System, 'Votre tour a été passé');
                    this.websocketService.skipturn();
                    return true;
                },
            ],
        ]);

        this.websocketService.gameTurn.asObservable().subscribe((turnState) => {
            this.turn = !!turnState;
        });
    }

    parseCommand(message: string): void {
        const command: string = message.split(' ')[0];
        const params: string[] = message.split(' ').slice(1);

        const exec: ((...args: string[]) => boolean) | undefined = this.commandLookup.get(command);
        if (!exec) {
            this.textboxService.displayMessage(MessageType.System, `La commande ${command} n'existe pas`);
            return;
        }
        if (exec(...params)) {
            this.websocketService.sendMessage(message);
        }
    }
}
