import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavItemsComponent } from './sidenav-items.component';

describe('SidenavItemsComponent', () => {
  let component: SidenavItemsComponent;
  let fixture: ComponentFixture<SidenavItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidenavItemsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
