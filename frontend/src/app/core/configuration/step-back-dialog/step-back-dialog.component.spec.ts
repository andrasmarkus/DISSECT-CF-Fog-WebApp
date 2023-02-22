import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { StepBackDialogComponent } from './step-back-dialog.component';

describe('StepBackDialogComponent', () => {
  let component: StepBackDialogComponent;
  let fixture: ComponentFixture<StepBackDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StepBackDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepBackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
