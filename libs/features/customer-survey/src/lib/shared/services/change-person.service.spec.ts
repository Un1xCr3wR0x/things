/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentToken } from '@gosi-ui/core';
import { educationPatchData, personResponse, BankPatchData, contactPatchData } from 'testing';
import { ChangePersonService } from './change-person.service';

describe('ChangePersonService', () => {
  let httpMock: HttpTestingController;
  let service: ChangePersonService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        }
      ]
    });
    service = TestBed.inject(ChangePersonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Get Engagement Status', () => [
    it('should return status of engagement', () => {
      const testUrl = `/api/v1/contributor?personId=${personResponse.personId}`;
      service.getActiveStatus(personResponse.personId).subscribe();
      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('GET');
    })
  ]);
  describe('Get Bank Details Status', () => [
    it('should return bank details', () => {
      const testUrl = `/api/v1/person/${personResponse.personId}/bank`;
      service.getBankDetails(personResponse.personId).subscribe();
      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('GET');
    })
  ]);

  describe('Get Beneficiary Details', () => [
    it('should return beneficiary details', () => {
      const testUrl = `/api/v1/common/benefitciaryDetail/${personResponse.personId}`;
      service.getBeneficiaryDetails(personResponse.personId).subscribe();
      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('GET');
    })
  ]);

  describe('Patch the Educational  Details', () => {
    it('should patch the form data', () => {
      const testUrl = `/api/v1/person/${personResponse.personId}/education`;
      service.patchPersonEducationDetails(personResponse.personId, educationPatchData).subscribe();
      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('PATCH');
    });
  });
  describe('Patch the contact  Details', () => {
    it('should patch the form data', () => {
      const testUrl = `/api/v1/person/${personResponse.personId}/contact`;
      service.patchPersonContactDetails(personResponse.personId, contactPatchData).subscribe();
      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('PATCH');
    });
  });
  describe('Patch the bank  Details', () => {
    it('should patch the form data', () => {
      const testUrl = `/api/v1/person/${personResponse.personId}/bank`;
      service.patchPersonBankDetails(personResponse.personId, BankPatchData).subscribe();
      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('PATCH');
    });
  });
});
