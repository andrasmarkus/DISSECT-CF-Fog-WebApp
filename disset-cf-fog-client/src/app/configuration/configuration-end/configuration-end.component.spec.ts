import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationEndComponent } from './configuration-end.component';

describe('ConfigurationEndComponent', () => {
  let component: ConfigurationEndComponent;
  let fixture: ComponentFixture<ConfigurationEndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurationEndComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
