import { Injectable } from '@angular/core';

/*const baseReserve: string[] =
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

  let currentReserve  = Object.assign([], baseReserve);

  let hand:string[] = [];*/

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

/*
function getHandCombinations(hand:string[]):string[] {
  let result:string[] = [];
  let f = function(prefix:string, chars:string[]) {
    for (let i = 0; i < chars.length; i++) {
      result.push(prefix + chars[i]);
      f(prefix + chars[i], chars.slice(i + 1));
    }
  }
  f('', hand);
  return result;
} //fonction inspire de https://codereview.stackexchange.com/questions/7001/generating-all-combinations-of-an-array

function permute(permutation:string[]):string[][] {
  let length = permutation.length,
      result = [permutation.slice()],
      c = new Array(length).fill(0),
      i = 1, k, p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      result.push(permutation.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
} //fonction inspire de https://stackoverflow.com/questions/9960908/permutations-in-javascript

function getHandPermutationsOfCombinations(combinations:string[]):string[][] {
    let combinationsArray:string[][] = []; //separer chaque lettre d'une combinaison
    for(let i = 0; i < combinations.length; i++){
        combinationsArray.push(combinations[i].split(''));
    }
    let result:string[][] = [];
    for(let i = 0; i < combinationsArray.length; i++){
        let temp = (permute(combinationsArray[i]));
        for(let i = 0; i < temp.length; i++){
            result.push(temp[i]);
        }
    }
    return result;
}

let res = getHandCombinations(["a","b","c"]);
console.log(getHandPermutationsOfCombinations(res));
*/

/*
case[key:position, state, pointage]

checkerdroite(case, possibilites) {
  pour chaque possibilite
    pour chaque lettre de la possibilite
      si case libre
        creer nouvelle copie de la case et set attributes
        push(copie + [copie de la case]) dans resultat
        creer copie de ce quon vient de push
        deplacer case a droite
      si case occupe
        push(copie + [la case]) dans resultat
        creer copie de ce quon vient de push
        deplacer case a droite
    temp:case[]
    while(la case a une lettre)
      temp.push(la case)
      deplacer case a droite
    si temp!=[]
      push(copie + temp) dans resultat
  return result
}

get tous les combinaisons de main
pour chaque case valide
  tableau.push(checker gauche/droite/haut/bas)
pour chaque element du tableau
  eliminer les moins de 2 lettres
  eliminer les absents dans le dictionnaire
  si calculerpoints <= 6
    placer dans tableau6
  si calculerpoints entre 7 et 12
    placer dans tableau 712
  si calculerpoints entre 13 et 18
    placer dans tableau 1318
*/