import { Component} from '@angular/core';

@Component({
  selector: 'app-panneau-info',
  templateUrl: './panneau-info.component.html',
  styleUrls: ['./panneau-info.component.scss']
})
export class PanneauInfoComponent {
  width = 240;
  height = 500;

  constructor() { }

  ngOnInit(): void {
  }

}
