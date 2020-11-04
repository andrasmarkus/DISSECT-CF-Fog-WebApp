import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ListConfigurableNodesComponent } from './list-configurable-nodes.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ListConfigurableNodesComponent', () => {
  let component: ListConfigurableNodesComponent;
  let fixture: ComponentFixture<ListConfigurableNodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListConfigurableNodesComponent],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
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
