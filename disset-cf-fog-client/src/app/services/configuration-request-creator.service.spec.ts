import { TestBed } from '@angular/core/testing';

import { ConfigurationRequestCreatorService } from './configuration-request-creator.service';

describe('ConfigurationRequestCreatorService', () => {
  let service: ConfigurationRequestCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurationRequestCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
