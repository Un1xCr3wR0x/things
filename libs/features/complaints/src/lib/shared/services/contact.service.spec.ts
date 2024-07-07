/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AlertService } from '@gosi-ui/core';
import { AdminDetailsData, AlertServiceStub, suggestionListData } from 'testing';
import { ContactService } from './contact.service';
import { ComplaintRequest } from '../models';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AlertService, useClass: AlertServiceStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('submit complaints', () => [
    it('should submit complaints', () => {
      const complaintRequest = new ComplaintRequest();
      const url = `/api/v1/complaint`;
      service.submitRequest(complaintRequest).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush(suggestionListData);
      httpMock.verify();
    })
  ]);
  it('should throw error', () => {
    const complaintRequest = new ComplaintRequest();
    const url = `/api/v1/complaint`;
    const errMsg = 'expect 404 error';
    service.submitRequest(complaintRequest).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });
  describe('getEstablishmentAdminDetails', () => [
    it('should getEstablishmentAdminDetails', () => {
      const regNo = '10000602';
      const url = `/api/v1/establishment/${regNo}/admin`;
      service.getEstablishmentAdminDetails(regNo).subscribe();
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(AdminDetailsData);
      httpMock.verify();
    })
  ]);
  it('should throw error', () => {
    const regNo = '10000602';
    const url = `/api/v1/establishment/${regNo}/admin`;
    const errMsg = 'expect 404 error';
    service.getEstablishmentAdminDetails(regNo).subscribe(
      () => fail('404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(errMsg, { status: 404, statusText: 'not found' });
  });
  describe('set success message', () => {
    it('should set success message', () => {
      const message = {
        english: 'request submitted',
        arabic: '--'
      };
      service.setSuccessMessage(message);
      expect(service.message).toEqual(message);
    });
  });
  describe('submit complaint', () => {
    it('should submit complaint', () => {
      const isComplaintSubmitted = true;
      service.setIsComplaintSubmitted(isComplaintSubmitted);
      expect(service.isComplaintSubmitted).toEqual(isComplaintSubmitted);
    });
  });
  describe('get success msg', () => {
    it('should get success message', () => {
      service.getSuccessMessage();
      expect(service).toBeTruthy();
    });
  });
  describe('getIsComplaintSubmitted', () => {
    it('should getIsComplaintSubmitted', () => {
      service.getIsComplaintSubmitted();
      expect(service).toBeTruthy();
    });
  });
});
