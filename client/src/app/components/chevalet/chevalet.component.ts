import { Component } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-chevalet',
  templateUrl: './chevalet.component.html',
  styleUrls: ['./chevalet.component.scss']
})
export class ChevaletComponent {
  lettres = [
    'Lettre A exemple',
    'Lettre B exemple',
    'Lettre C exemple',
    'Lettre D exemple',
    'Lettre E exemple',
    'Lettre G exemple',
    'Lettre F exemple',
  ];
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.lettres, event.previousIndex, event.currentIndex);
  }

}
