import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurableStationComponent } from './configurable-station.component';

describe('ConfigurableStationComponent', () => {
  let component: ConfigurableStationComponent;
  let fixture: ComponentFixture<ConfigurableStationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurableStationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurableStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
