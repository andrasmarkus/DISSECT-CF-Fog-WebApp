import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { NodeQuantityFormComponent } from './node-quantity-form.component';

describe('NodeQuantityFormComponent', () => {
  let component: NodeQuantityFormComponent;
  let fixture: ComponentFixture<NodeQuantityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NodeQuantityFormComponent],
      providers: [FormBuilder],
      schemas: [NO_ERRORS_SCHEMA]
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
