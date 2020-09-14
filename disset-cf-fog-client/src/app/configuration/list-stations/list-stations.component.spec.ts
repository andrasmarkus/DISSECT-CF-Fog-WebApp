import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStationsComponent } from './list-stations.component';

describe('ListStationsComponent', () => {
  let component: ListStationsComponent;
  let fixture: ComponentFixture<ListStationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListStationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
