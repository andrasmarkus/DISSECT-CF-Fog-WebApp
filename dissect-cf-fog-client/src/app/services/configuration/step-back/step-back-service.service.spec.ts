import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';

import { StepBackServiceService } from './step-back-service.service';

describe('StepBackServiceService', () => {
  let service: StepBackServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AngularMaterialModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(StepBackServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
