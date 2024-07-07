import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApplicationTypeToken } from '@gosi-ui/core';
import {
  cancelViolationDetails,
  modifyViolationDetails,
  PenaltyInfoDetails
} from 'testing/mock-components/features/violations';
import { DocumentTransactionType } from '..';
import { ViolationsValidatorService } from './violations-validator.service';

describe('ViolationsValidatorService', () => {
  let service: ViolationsValidatorService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: 'PRIVATE'
        }
      ]
    });
    service = TestBed.inject(ViolationsValidatorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should fetch Person Details', () => {
    let identificationNo = 1234;
    let regNo = 1234;
    const url = `/api/v1/establishment/${regNo}/violation/${identificationNo}`;
    service.getTransactionDetails(identificationNo, regNo).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
  });
  it('should fetch change violation validator view Data', () => {
    let violationId = 1234;
    let transactionId = 1234;
    const url = `/api/v1/violation/${violationId}/transaction/${transactionId}`;
    service.getValidatorViewDetails(violationId, transactionId).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
  });
  xit('should violation class details', () => {
    let identificationNo = 1234;
    const url = `/api/v1/violation/${identificationNo}/class-details`;
    service.getViolationClassDetails(identificationNo, true).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
  });
  it('should submitPenaltyCalculations', () => {
    let violationId = 1234;
    const url = `/api/v1/violation/${violationId}/penalty-calculation`;
    service.submitPenaltyCalculations(violationId, PenaltyInfoDetails).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
  });
  it('should submit comments', () => {
    let transactionId = 1234;
    let transactionTraceId = 1234;
    let comments = '1234';
    let editMode = true;
    const url = `/api/v1/violation/${transactionId}/submit?isEditFlow=${editMode}&transactionTraceId=${transactionTraceId}`;
    service
      .submitChangeViolation(
        transactionId,
        transactionTraceId,
        comments,
        DocumentTransactionType.CANCEL_TRANSACTION_TYPE,
        editMode
      )
      .subscribe(res => {
        expect(res).not.toBeNull;
      });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
  });
  it('should submitModifyViolations', () => {
    let violationId = 1234;
    const url = `/api/v1/violation/${violationId}/modify`;
    service.submitModifyViolations(violationId, modifyViolationDetails).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
  });
  it('should submitCancelViolations', () => {
    let violationId = 1234;
    const url = `/api/v1/violation/${violationId}/cancel`;
    service.submitCancelViolations(violationId, cancelViolationDetails).subscribe(res => {
      expect(res).not.toBeNull;
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
  });
});
