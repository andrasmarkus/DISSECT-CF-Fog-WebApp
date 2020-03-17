import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurableCloudComponent } from './configurable-cloud.component';

describe('ConfigurableCloudComponent', () => {
  let component: ConfigurableCloudComponent;
  let fixture: ComponentFixture<ConfigurableCloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurableCloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurableCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
