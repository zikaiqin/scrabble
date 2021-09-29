import { GameService } from '@app/services/game.service';
import { PlayerHand } from '@app/classes/player-hand';
import { Injectable } from '@angular/core';
import { TextboxService } from '@app/services/textbox.service';
import { MessageType } from '@app/classes/message';
const WILDCARD = '*';
@Injectable({
    providedIn: 'root',
})

export class Exchange {
    private word: string;
    private letters: Map<string, string>;
    private turnState: boolean;

    constructor(private textboxService: TextboxService, private gameService: GameService) {
        
        this.gameService.turnState.subscribe({
            next: (turn: boolean) => (this.turnState = turn),
        });

    }

    validateCommand( word :string) : boolean{
        this.word = word;

        //conditions d'une commande valide

        // Doit etre entre 1 et 7
        if(word.length < 0 || word.length >7){
            this.textboxService.sendMessage(MessageType.System, 'Doit etre entre 1 et 7');
            return false;
        }
        // Verifie si ils sont tous en mimuscule
        if (word != word.toLowerCase()){
            this.textboxService.sendMessage(MessageType.System, 'Doit etre en miniscule');
            return false;
        }
        // Seulement a mon tour
        if (!this.isMyTurn()){
            return false;
        }
        // contient dans la main

        // au moins 7 lettres dans la reserve
        this.letters = new Map<string, string>();
        const canPlace = this.constainsInHand() && this.capacityReserve();
        if(canPlace){
            this.exchangeLetter();
            this.gameService.turnState.next(!this.turnState);
        }
        
        return canPlace;
    }
    exchangeLetter():void{
        this.afficherBox();
        this.removeFromHand();
        for(let i = 0 ; i < this.word.length; i++){
            this.gameService.reserve.drawOne();
        }
    }
    
    //manque le nom de joueur
    afficherBox():void{
        this.textboxService.sendMessage(MessageType.User, `La commande: échanger ${this.word} a été lancée `);
        
    }
    removeFromHand():void{
            Array.from(this.letters.entries()).forEach((entry) => {
                this.gameService.playerHand.remove(entry[1]);
                this.gameService.reserve.receiveOne(entry[1]);
            });
                //this.gridService.drawEmpty();
    }
    capacityReserve():boolean{
        if(this.gameService.reserve.getSize() < 7 ) {
            return false;
        }
        return true;
    }
    constainsInHand(): boolean {
        const wildCard = /[A-Z]/;
        const letters = Array.from(this.letters.values());
        const testHand: PlayerHand = new PlayerHand();
        letters.forEach((letter) => testHand.add(wildCard.test(letter) ? WILDCARD : letter));

        // using unique set of letters in word as key, compare to amount of letters in hand
        const isInHand: boolean = [...new Set<string>(letters)].every((letter) => {
            const amountRequired = testHand.get(letter);
            const amountInHand = this.gameService.playerHand.get(letter);
            return amountRequired !== undefined && amountInHand !== undefined ? amountRequired <= amountInHand : false;
        });
        if (!isInHand) {
            this.textboxService.sendMessage(
                MessageType.System,
                'Les lettres ne peuvent pas être exchange car il contient des lettres qui ne sont pas dans votre main',
            );
        }
        return isInHand;
    }

    isMyTurn(): boolean {
        if (!this.turnState) {
            this.textboxService.sendMessage(MessageType.System, 'La commande !échanger peut seulement être utilisé lors de votre tour');
        }
        return this.turnState;
    }


}