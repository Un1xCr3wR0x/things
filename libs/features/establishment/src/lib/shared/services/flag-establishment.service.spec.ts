import { TestBed } from '@angular/core/testing';

import { FlagEstablishmentService } from './flag-establishment.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { FlagRequestTestData, flagQueryParamData } from 'testing';

describe('FlagEstablishmentService', () => {
  let service: FlagEstablishmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(FlagEstablishmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get flag', () => {
    it('Should  get flag', () => {
      const regNo = 123456;
      const url = `/api/v1/establishment/${regNo}/flag?isFlagTransaction=true`;
      service.getFlags(regNo).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
    });
  });
  describe('save flag details', () => {
    it('Should  save flag details', () => {
      const regNo = 123456;
      const flagRequest = FlagRequestTestData;
      const url = `/api/v1/establishment/${regNo}/flag`;
      service.saveFlagDetails(regNo, flagRequest).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
    });
  });
  describe('save modified flag details', () => {
    it('Should  save modified flag details', () => {
      const regNo = 123456;
      const flagId = 2323;
      const flagRequest = FlagRequestTestData;
      const url = `/api/v1/establishment/${regNo}/flag/${flagId}`;
      service.saveModifiedFlagDetails(regNo, flagRequest, flagId).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
    });
  });
});
