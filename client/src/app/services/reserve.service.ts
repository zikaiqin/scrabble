import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReserveService {

  constructor() { }

  readonly baseReserve: string[] =
  ["a", "a", "a", "a", "a", "a", "a", "a", "a", 
  "b", "b",
  "c", "c",
  "d", "d", "d",
  "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e",
  "f", "f",
  "g", "g",
  "h", "h",
  "i", "i", "i", "i", "i", "i", "i", "i",
  "j",
  "k",
  "l", "l", "l", "l", "l",
  "m", "m", "m",
  "n", "n", "n", "n", "n", "n",
  "o", "o", "o", "o", "o", "o",
  "p", "p",
  "q",
  "r", "r", "r", "r", "r", "r",
  "s", "s", "s", "s", "s", "s",
  "t", "t", "t", "t", "t", "t",
  "u", "u", "u", "u", "u", "u",
  "v", "v",
  "w",
  "x",
  "y",
  "z",
  "*", "*"];

  currentReserve  = Object.assign([], this.baseReserve);

  hand:string[] = [];

  reinitializeReserve() {
    this.currentReserve  = Object.assign([], this.baseReserve);
  }

  getRandomInt(min:number, max:number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  removeLetterIndex(reserve:string[], index:number): string {
    if (index > -1 && index < reserve.length) {
      let removedLetter:string = reserve[index];
      reserve.splice(index, 1);
      return removedLetter;
    }
    else
      return "error";
  }

  moveLettersToHand(hand:string[], reserve:string[], numberOfLetters:number) {
      if (numberOfLetters <= reserve.length) {
          for(let i = 0; i < numberOfLetters; i++) {
              let index:number = this.getRandomInt(0, reserve.length);
              let removedLetter = this.removeLetterIndex(reserve, index);
              hand.push(removedLetter);
          }
      }
      else
          console.log("not enough letters left in the reserve");
  }

  exchangeLetters(hand:string[], lettersToBeRemoved:string[], reserve:string[]):number {
    if (reserve.length < 7)
      return -1;
    else {
      for(let i = 0; i < lettersToBeRemoved.length; i++) {
        hand.splice(hand.indexOf(lettersToBeRemoved[i]), 1);
      }
      this.moveLettersToHand(hand, reserve, lettersToBeRemoved.length);
      reserve.push(...lettersToBeRemoved);
      return 1;
    }
  }
}