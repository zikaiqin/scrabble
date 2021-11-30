import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPageComponent } from './admin-page.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpService } from '@app/services/http.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HomePageComponent } from '@app/pages/home-page/home-page.component';
import { MatMenuModule } from '@angular/material/menu';

describe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;

    const httpServiceSpy = jasmine.createSpyObj('HttpService', ['getBots', 'addBot', 'deleteBots', 'editBot']);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatDialogModule, MatMenuModule, RouterTestingModule.withRoutes([{ path: 'home', component: HomePageComponent }])],
            declarations: [AdminPageComponent],
            providers: [{ provide: HttpService, useValue: httpServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
