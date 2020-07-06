import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeQuantityFormComponent } from './node-quantity-form.component';

describe('NodeQuantityFormComponent', () => {
  let component: NodeQuantityFormComponent;
  let fixture: ComponentFixture<NodeQuantityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NodeQuantityFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeQuantityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
