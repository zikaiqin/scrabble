import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class AlertService {
    constructor(private snackBar: MatSnackBar) {}

    showAlert(message: string): void {
        this.snackBar.open(message, 'Fermer');
    }

    showAlertWithCallback(message: string, action: string, duration: number, callback: () => void): void {
        this.snackBar.open(message, action, { duration }).onAction().subscribe(callback);
    }

    showGenericError(): void {
        this.snackBar.open("Une erreur s'est produite", 'Fermer');
    }
}
