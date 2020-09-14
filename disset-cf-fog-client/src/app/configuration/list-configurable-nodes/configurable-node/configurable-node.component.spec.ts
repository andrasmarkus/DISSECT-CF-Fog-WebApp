import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurableNodeComponent } from './configurable-node.component';

describe('ConfigurableNodeComponent', () => {
  let component: ConfigurableNodeComponent;
  let fixture: ComponentFixture<ConfigurableNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurableNodeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurableNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
