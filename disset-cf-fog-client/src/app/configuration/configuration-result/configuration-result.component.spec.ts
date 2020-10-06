import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationResultComponent } from './configuration-result.component';

describe('ConfigurationResultComponent', () => {
  let component: ConfigurationResultComponent;
  let fixture: ComponentFixture<ConfigurationResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
