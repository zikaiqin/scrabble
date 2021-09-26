import { Component } from '@angular/core';
import { GameService } from '@app/services/game.service';




@Component({
    selector: 'app-panneau-info',
    templateUrl: './panneau-info.component.html',
    styleUrls: ['./panneau-info.component.scss'],
})
export class PanneauInfoComponent {
   constructor(private gameService: GameService){} 
   /*nomJoueur0: string;
   nomJoueur1: string;
   scoreJoueur0: string;
   scoreJoueur1: string;
   pieceChevalet1: string;
   pieceChevalet2: string;
   pieceReserve: string;*/
   private joueur = new Map();
   //joueur: string[]=[];
   
   

   setJoueurInfo(){
       //this.nomJoueur0 = this.gameService.player0.name;
       //this.nomJoueur1 = this.gameService.player1.name;
       //this.scoreJoueur0 = this.gameService.score0;
       //this.scoreJoueur1 = this.gameService.score1;
       this.joueur.set("Nom0", this.gameService.player)
       .set("Score0", this.gameService.playerScore);
       //.set("Nom1", this.nomJoueur1)
       //.set("Score0", this.scoreJoueur0)
       //.set("Score1", this.scoreJoueur1);
       //this.joueur.push(this.nomJoueur0);
       return this.joueur;
       
   }
   
   afficherNomJoueur(info: string){
       return this.setJoueurInfo().get(info);
       //return this.setJoueurInfo()[info];
   }

   
    
   
   
}
