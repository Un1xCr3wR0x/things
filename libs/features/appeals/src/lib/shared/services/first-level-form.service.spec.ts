import { TestBed } from '@angular/core/testing';

import { FirstLevelFormService } from './first-level-form.service';

describe('FirstLevelFormService', () => {
  let service: FirstLevelFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirstLevelFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
