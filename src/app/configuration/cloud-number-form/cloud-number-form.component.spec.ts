import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudNumberFormComponent } from './cloud-number-form.component';

describe('CloudNumberFormComponent', () => {
  let component: CloudNumberFormComponent;
  let fixture: ComponentFixture<CloudNumberFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CloudNumberFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudNumberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
