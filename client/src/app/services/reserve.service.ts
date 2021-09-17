import { Injectable } from '@angular/core';

type Reserve = {
  letters: string[];
  quantity: number;
};

/*const baseReserve: Reserve = {
  letters: ["a","b","c","d"],
  quantity: 4
};*/

//let currentReserve:Reserve = {letters:[], quantity:0};
//currentReserve = baseReserve;

//let hand: Reserve = {letters:[], quantity:0};

@Injectable({
  providedIn: 'root'
})
export class ReserveService {

  constructor() { }

/*function reinitializeReserve(current: Reserve) {
    current = baseReserve;
    console.log(current);
}*/

  getRandomInt(min:number, max:number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  removeLetterIndex(reserve:Reserve, index:number): string {
    if (index > -1 && index < reserve.letters.length) {
      let removedLetter:string = reserve.letters[index];
      reserve.letters.splice(index, 1);
      reserve.quantity--;
      return removedLetter;
    }
    else
      return "error";
  }

  moveLettersToHand(hand:Reserve, reserve:Reserve, numberOfLetters:number) {
      if (numberOfLetters <= reserve.quantity) {
          for(let i = 0; i < numberOfLetters; i++) {
              let index:number = this.getRandomInt(0, reserve.quantity);
              let removedLetter = this.removeLetterIndex(reserve, index);
              hand.letters.push(removedLetter);
              hand.quantity++;
          }
      }
      else
          console.log("not enough letters left in the reserve");
  }
}
