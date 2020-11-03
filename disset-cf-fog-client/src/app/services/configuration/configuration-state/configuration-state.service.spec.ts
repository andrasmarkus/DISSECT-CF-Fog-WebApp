import { TestBed } from '@angular/core/testing';

import { ConfigurationStateService } from './configuration-state.service';

describe('ConfigurationStateService', () => {
  let service: ConfigurationStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurationStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
