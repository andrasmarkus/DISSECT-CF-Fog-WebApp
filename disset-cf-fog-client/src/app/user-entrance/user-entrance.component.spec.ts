import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEntranceComponent } from './user-entrance.component';

describe('RegisterComponent', () => {
  let component: UserEntranceComponent;
  let fixture: ComponentFixture<UserEntranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserEntranceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEntranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
