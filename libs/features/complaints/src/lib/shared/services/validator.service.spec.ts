/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ValidatorService } from './validator.service';
import { ApplicationTypeToken, CryptoService } from '@gosi-ui/core';
import {
  suggestionListData,
  transactionListData,
  complaintTypeUpdateRequestData,
  customerData,
  CryptoServiceStub
} from 'testing';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryEnum } from '../enums';
import { CustomerSummary } from '../models';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
describe('ValidatorService', () => {
  let service: ValidatorService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: CryptoService,
          useClass: CryptoServiceStub
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    service = TestBed.inject(ValidatorService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('suggestion details', () => [
    it('should get suggestion details', () => {
      const transactionId = 34564566;
      const url = `/api/v1/suggestions/${transactionId}`;
      service.getSuggestionDetails(transactionId).subscribe(() => {
        expect(suggestionListData.items.length).toBeGreaterThan(0);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(suggestionListData);
      httpMock.verify();
    })
  ]);
  it('should throw error', () => {
    const transactionId = 34564566;
    const url = `/api/v1/suggestions/${transactionId}`;
    const errMsg = 'expect 404 error';
    service.getSuggestionDetails(transactionId).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });
  describe('submitPriority', () => [
    it('should get submitPriority', () => {
      const complaintId = 34564566;
      const url = `/api/v1/complaint/${complaintId}`;
      service.updateComplaintType(complaintId, complaintTypeUpdateRequestData).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      httpMock.verify();
    })
  ]);
  it('should throw error', () => {
    const complaintId = 34564566;
    const url = `/api/v1/complaint/${complaintId}`;
    const errMsg = 'expect 404 error';
    service.updateComplaintType(complaintId, complaintTypeUpdateRequestData).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });
  describe('getPersonDetails', () => [
    it('should get getPersonDetails', () => {
      const personId = 34564566;
      const customerSummary = new CustomerSummary();
      customerSummary.contactId = '1234567890';
      customerSummary.customerName.english = 'NAME';
      customerSummary.customerName.arabic = 'NAME';
      customerSummary.emailId = 'abc@gmail.com';
      const url = `/api/v1/person/${personId}`;
      service.getPersonDetails(personId).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(customerData);
      httpMock.verify();
    })
  ]);
  it('should throw error', () => {
    const personId = 34564566;
    const url = `/api/v1/person/${personId}`;
    const errMsg = 'expect 404 error';
    service.getPersonDetails(personId).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });
  describe('txn details', () => {
    it('should get txn details', () => {
      const complaintId = 1051152;
      const requestType = 'complaint';
      const url = `/api/v1/complaint/${complaintId}`;
      service.getTransactionDetails(complaintId).subscribe(() => {
        expect(transactionListData.items.length).toBeGreaterThan(0);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      expect(requestType).toBe(CategoryEnum.COMPLAINT.toLowerCase());
      req.flush(transactionListData);
      httpMock.verify();
    });
    it('should throw error', () => {
      const complaintId = 1051152;
      const url = `/api/v1/complaint/${complaintId}`;
      const errMsg = 'expect 404 error';
      service.getTransactionDetails(complaintId).subscribe(
        () => fail('404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      );
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(errMsg, { status: 404, statusText: 'not found' });
    });
  });
  describe('Simis txn details', () => {
    it('should get  Simis txn details', () => {
      const transactionId = 1051152;
      const url = `/api/v1/transaction/${transactionId}/tracking`;
      service.getSimisTransactionDetails(transactionId).subscribe(() => {
        expect(transactionListData.items.length).toBeGreaterThan(0);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(transactionListData);
      httpMock.verify();
    });
    // it('should throw error', () => {
    //   const transactionId = 1051152;
    //   const url = `/api/v1/transaction/${transactionId}/tracking`;
    //   const errMsg = 'expect 404 error';
    //   service.getSimisTransactionDetails(transactionId).subscribe(
    //     () => fail('404 error'),
    //     (error: HttpErrorResponse) => {
    //       expect(error.status).toBe(404);
    //     }
    //   );
    //   const req = httpMock.expectOne(url);
    //   expect(req.request.method).toBe('GET');
    //   req.flush(errMsg, { status: 404, statusText: 'not found' });
    // });
  });
  describe('Dept details', () => {
    it('should get  Dept details', () => {
      const locationID = 1051152;
      const url = `/api/v1/tamam/departmentmaps?locationID=${locationID}`;
      service.getDepartmentDetails(locationID).subscribe(respose => {
        expect(respose.map(value => value.DepartmentHeadID)).not.toEqual(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      httpMock.verify();
    });
  });
  describe('getEstablishment', () => {
    it('should getEstablishment', () => {
      const registrationNo = 10000602;
      const url = `/api/v1/establishment/${registrationNo}`;
      service.getEstablishment(registrationNo).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      httpMock.verify();
    });
  });
  describe('Clerk details', () => {
    it('should get  clerk details', () => {
      const departmentId = '1051152';
      const url = `/api/v1/tamam/employeedepartment?departmentId=${departmentId}`;
      service.getClerkDetails(departmentId).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      httpMock.verify();
    });
  });
  describe('getTransactionlist', () => {
    it('should getTransactionList', () => {
      const personIdentifier = 10000602;
      const url = `/api/v1/complaint?personIdentifier=${personIdentifier}`;
      service.getTransactionList(personIdentifier).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      httpMock.verify();
    });
  });
});
