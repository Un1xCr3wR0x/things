import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { contactRegistrationNo, contractSocialInsuranceNo, contractTestData } from 'testing';
import { ManageDocumentService } from './manage-document.service';

describe('ManageDocumentService', () => {
  let httpMock: HttpTestingController;
  let service: ManageDocumentService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ManageDocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get contracts', () => {
    it('should fetch the contracts of the contributor', () => {
      const url = `/api/v1/establishment/${contactRegistrationNo}/contributor/${contractSocialInsuranceNo}/contracts`;
      service.getContracts(contactRegistrationNo, contractSocialInsuranceNo).subscribe(res => {
        expect(res[0].establishmentRegNo).toBe(Number(contactRegistrationNo));
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush([contractTestData]);
    });
  });
});
