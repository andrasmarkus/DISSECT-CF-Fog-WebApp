import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConfigurableNodesComponent } from './list-configurable-nodes.component';

describe('ListConfigurableNodesComponent', () => {
  let component: ListConfigurableNodesComponent;
  let fixture: ComponentFixture<ListConfigurableNodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListConfigurableNodesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConfigurableNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
