import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { UserConfigurationService } from 'src/app/services/configuration/user-configuration/user-configuration.service';

import { ConnectionComponent } from './connection.component';

describe('ConnectionComponent', () => {
  let component: ConnectionComponent;
  let fixture: ComponentFixture<ConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectionComponent],
      imports: [ReactiveFormsModule, CommonModule, BrowserAnimationsModule, AngularMaterialModule],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
        { provide: UserConfigurationService, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
