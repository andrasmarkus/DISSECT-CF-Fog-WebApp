import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationComparisonComponent } from './simulation-comparison.component';

describe('SimulationComparisonComponent', () => {
  let component: SimulationComparisonComponent;
  let fixture: ComponentFixture<SimulationComparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationComparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
