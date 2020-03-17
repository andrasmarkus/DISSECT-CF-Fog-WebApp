import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConfigurableCloudsComponent } from './list-configurable-clouds.component';

describe('ListConfigurableCloudsComponent', () => {
  let component: ListConfigurableCloudsComponent;
  let fixture: ComponentFixture<ListConfigurableCloudsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListConfigurableCloudsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConfigurableCloudsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
