import { TestBed } from '@angular/core/testing';

import { StepBackServiceService } from './step-back-service.service';

describe('StepBackServiceService', () => {
  let service: StepBackServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StepBackServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
