import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { ChevaletComponent } from './components/chevalet/chevalet.component';
import { EndGameComponent } from './components/end-game/end-game.component';
import { InputbarComponent } from './components/inputbar/inputbar.component';
import { JoueurVirtuelleComponent } from './components/joueur-virtuelle/joueur-virtuelle.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { NewGameMenuComponent } from './components/new-game-menu/new-game-menu.component';
import { PanneauInfoComponent } from './components/panneau-info/panneau-info.component';
import { TextboxComponent } from './components/textbox/textbox.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { GameBrowserComponent } from './components/game-browser/game-browser.component';
import { GameBrowserDialogComponent } from '@app/components/game-browser-dialog/game-browser-dialog.component';
import { WaitingRoomComponent } from './components/waiting-room/waiting-room.component';
import { WaitingRoomDialogComponent } from './components/waiting-room-dialog/waiting-room-dialog.component';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    declarations: [
        AppComponent,
        GamePageComponent,
        JoueurVirtuelleComponent,
        PlayAreaComponent,
        SidebarComponent,
        ChevaletComponent,
        PanneauInfoComponent,
        TextboxComponent,
        InputbarComponent,
        HomePageComponent,
        MainMenuComponent,
        NewGameMenuComponent,
        EndGameComponent,
        GameBrowserComponent,
        GameBrowserDialogComponent,
        WaitingRoomComponent,
        WaitingRoomDialogComponent,
    ],
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        DragDropModule,
        ReactiveFormsModule,
    ],

    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
