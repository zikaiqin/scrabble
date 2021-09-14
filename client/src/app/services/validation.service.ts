import { Injectable } from '@angular/core';
import * as data from 'src/assets/dictionnary.json';

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    private dictionnary = JSON.parse(JSON.stringify(data));

    findWord(word: string): boolean {
        if (word.length >= 2 && (word.includes('-') || word.includes("'"))) {
            for (const val of this.dictionnary.words) {
                if (word === val) return true;
            }
        }
        return false;
    }
}
