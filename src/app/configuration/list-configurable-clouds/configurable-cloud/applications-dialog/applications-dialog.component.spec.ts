import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsDialogComponent } from './applications-dialog.component';

describe('ApplicationsDialogComponent', () => {
  let component: ApplicationsDialogComponent;
  let fixture: ComponentFixture<ApplicationsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
