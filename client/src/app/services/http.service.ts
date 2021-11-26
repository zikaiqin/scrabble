import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, timeout } from 'rxjs/operators';
import { DEFAULT_TIMEOUT } from '@app/classes/config';
import { EMPTY, throwError, TimeoutError } from 'rxjs';
import { AlertService } from '@app/services/alert.service';
import { GameDifficulty } from '@app/classes/game-info';

const basePath = `${environment.serverUrl}/api`;

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(private alertService: AlertService, private http: HttpClient) {}

    getBots(difficulty: number) {
        return this.http.get(`${basePath}/bot`, { params: { difficulty }, responseType: 'json' }).pipe(
            timeout(DEFAULT_TIMEOUT),
            catchError((err) => this.catchAnyHttpError(err)),
            catchError((err) => this.catchTimeoutError(err)),
            catchError((err) => this.catchUnexpectedError(err, HttpErrorResponse, TimeoutError)),
        );
    }

    addBot(name: string, difficulty: number) {
        return this.http.post(`${basePath}/bot`, { name, difficulty }, { responseType: 'text' }).pipe(
            timeout(DEFAULT_TIMEOUT),
            catchError((err) =>
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                this.catchHttpErrorWithStatus(err, 409, (e) => {
                    const error = JSON.parse(e.error);
                    this.alertService.showAlert(
                        `Un joueur virtuel ${error.difficulty === GameDifficulty.Easy ? 'novice' : 'expert'} avec le nom ${error.name} existe déjà`,
                    );
                }),
            ),
            catchError((err) => this.catchAnyHttpError(err, true)),
            catchError((err) => this.catchTimeoutError(err, true)),
            catchError((err) => this.catchUnexpectedError(err, HttpErrorResponse, TimeoutError)),
        );
    }

    deleteBots(ids: string[]) {
        return this.http.delete(`${basePath}/bot`, { body: ids, responseType: 'text' }).pipe(
            timeout(DEFAULT_TIMEOUT),
            catchError((err) =>
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                this.catchHttpErrorWithStatus(err, 404, () => {
                    this.alertService.showAlert("Le joueur virtuel que vous voulez supprimer n'existe pas");
                }),
            ),
            catchError((err) => this.catchAnyHttpError(err, true)),
            catchError((err) => this.catchTimeoutError(err, true)),
            catchError((err) => this.catchUnexpectedError(err, HttpErrorResponse, TimeoutError)),
        );
    }

    editBot(id: string, name: string) {
        return this.http.put(`${basePath}/bot`, { id, name }, { responseType: 'text' }).pipe(
            timeout(DEFAULT_TIMEOUT),
            catchError((err) =>
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                this.catchHttpErrorWithStatus(err, 404, () => {
                    this.alertService.showAlert("Le joueur virtuel que vous voulez modifier n'existe pas");
                }),
            ),
            catchError((err) => this.catchAnyHttpError(err, true)),
            catchError((err) => this.catchTimeoutError(err, true)),
            catchError((err) => this.catchUnexpectedError(err, HttpErrorResponse, TimeoutError)),
        );
    }

    catchHttpErrorWithStatus(err: Error, status: number, callback?: (err: HttpErrorResponse) => void) {
        if (!(err instanceof HttpErrorResponse) || err.status !== status) {
            return throwError(err);
        }
        if (callback) callback(err);
        return EMPTY;
    }

    catchAnyHttpError(err: Error, propagate: boolean = false) {
        if (!(err instanceof HttpErrorResponse)) {
            return throwError(err);
        }
        this.alertService.showAlert('Le serveur est présentement inaccessible');
        return propagate ? throwError(err) : EMPTY;
    }

    catchTimeoutError(err: Error, propagate: boolean = false) {
        if (!(err instanceof TimeoutError)) {
            return throwError(err);
        }
        this.alertService.showAlert('Le serveur est présentement inaccessible');
        return propagate ? throwError(err) : EMPTY;
    }

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    catchUnexpectedError(err: Error, ...expectedTypes: any[]) {
        if (expectedTypes.some((expectedType) => err instanceof expectedType)) {
            return throwError(err);
        }
        this.alertService.showAlert("Une erreur s'est produite");
        return EMPTY;
    }
}
