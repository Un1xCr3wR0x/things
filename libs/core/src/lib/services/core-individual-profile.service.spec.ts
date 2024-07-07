import { TestBed } from '@angular/core/testing';

import { CoreIndividualProfileService } from './core-individual-profile.service';

describe('CoreIndividualProfileService', () => {
  let service: CoreIndividualProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreIndividualProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
