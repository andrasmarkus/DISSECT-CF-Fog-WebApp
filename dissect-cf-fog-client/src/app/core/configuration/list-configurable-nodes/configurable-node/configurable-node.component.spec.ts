import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { ComputingNode } from 'src/app/models/computing-node';
import { QuantityCounterService } from 'src/app/services/configuration/quantity-counter/quantity-counter.service';
import { PanelService } from 'src/app/services/panel/panel.service';
import { WindowSizeService } from 'src/app/services/window-size/window-size.service';

import { ConfigurableNodeComponent } from './configurable-node.component';

describe('ConfigurableNodeComponent', () => {
  let component: ConfigurableNodeComponent;
  let fixture: ComponentFixture<ConfigurableNodeComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurableNodeComponent],
      imports: [BrowserAnimationsModule, AngularMaterialModule],
      providers: [
        FormBuilder,
        { provide: WindowSizeService, useValue: {} },
        { provide: PanelService, useValue: {} },
        { provide: QuantityCounterService, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurableNodeComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    component.nodeCardForm = formBuilder.group({
      numOfApplications: new FormControl({
        value: ['mock'],
        disabled: true
      })
    });
    component.node = {} as ComputingNode;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
