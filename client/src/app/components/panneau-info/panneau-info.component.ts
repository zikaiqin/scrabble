import { Component } from '@angular/core';
export const WIDTHPANEAU = 380; //350
export const HEIGHTPANEAU = 800;
@Component({
    selector: 'app-panneau-info',
    templateUrl: './panneau-info.component.html',
    styleUrls: ['./panneau-info.component.scss'],
})
export class PanneauInfoComponent {
    width = WIDTHPANEAU;
    height = HEIGHTPANEAU;
}
