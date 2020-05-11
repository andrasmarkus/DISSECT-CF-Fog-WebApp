import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepBackDialogComponent } from './step-back-dialog.component';

describe('StepBackDialogComponent', () => {
  let component: StepBackDialogComponent;
  let fixture: ComponentFixture<StepBackDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepBackDialogComponent ]
    })
    .compileComponents();
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
