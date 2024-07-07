import { TestBed } from '@angular/core/testing';

import { UpdateUserContactService } from './update-user-contact.service';

describe('UpdateUserContactService', () => {
  let service: UpdateUserContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateUserContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
