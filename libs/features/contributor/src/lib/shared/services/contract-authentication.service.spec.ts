/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TransactionFeedback } from '@gosi-ui/core';
import {
  ClausesWrapper,
  ContractParams,
  ContractRequest,
  ContractResponse,
  ContractWrapper,
  ValidateContractResponse
} from '../models';
import { ContractAuthenticationService } from './contract-authentication.service';

describe('ContractAuthenticationService', () => {
  let service: ContractAuthenticationService;
  let httpMock: HttpTestingController;
  const regNo = 210059016;
  const siNo = 371072462;
  const engagementId = 266341800;
  const id = 1560298524;
  const contractId = 1600765;
  const referenceNumber = 'bf93d841';
  const identifier = 1003589783;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContractAuthenticationService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(ContractAuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get contract details', () => {
    const params = new ContractParams(1560298524, 'DRAFT', 1600765, 4, 0);
    const url = `/api/v1/establishment/200085744/contributor/371072462/contract?engagementId=1560298524&contractId=1600765&contractStatus=DRAFT&pageSize=4&pageNo=0`;
    service.getContracts(200085744, 371072462, params).subscribe(res => expect(res).toBeDefined());
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(new ContractWrapper());
  });

  it('should get list of clauses', () => {
    const contractViewUrl = `/api/v1/establishment/${regNo}/contributor/${siNo}/engagement/${engagementId}/contract/${contractId}/clauses`;
    service.getListOfClauses(regNo, siNo, engagementId, contractId).subscribe(res => {
      expect(res).toBeDefined();
    });
    const req = httpMock.expectOne(contractViewUrl);
    expect(req.request.method).toBe('GET');
    req.flush(new ClausesWrapper());
  });

  it('should add contract', () => {
    const addContractUrl = `/api/v1/establishment/${regNo}/contributor/${siNo}/engagement/${id}/contract`;
    service.addContractDetails(regNo, siNo, id, new ContractRequest()).subscribe(response => {
      expect(response).toBeDefined();
    });
    const req = httpMock.expectOne(addContractUrl);
    expect(req.request.method).toBe('POST');
    req.flush('');
  });

  it('should edit contract details', () => {
    const url = `/api/v1/establishment/${regNo}/contributor/${siNo}/engagement/${id}/contract/${contractId}`;
    service.addContractDetails(regNo, siNo, id, new ContractRequest(), contractId, true).subscribe(response => {
      expect(response).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(new ContractResponse());
  });

  it('should submit contract details', () => {
    const url = `/api/v1/establishment/${regNo}/contributor/${siNo}/engagement/${id}/contract/${contractId}/submit`;
    service.addContractDetails(regNo, siNo, id, new ContractRequest(), contractId, false, true).subscribe(response => {
      expect(response).toBeDefined();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(new ContractResponse());
  });

  it('should get unified contract', () => {
    const contractViewUrl = `/api/v1/contract/${referenceNumber}/unified-contract?personIdentifier=${identifier}`;
    service.getUnifiedContract(referenceNumber, identifier).subscribe(res => {
      expect(res).toBeDefined();
    });
    const req = httpMock.expectOne(contractViewUrl);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should get pending contract by reference id', () => {
    const pendingContractUrl = `/api/v1/contract/${referenceNumber}?personIdentifier=${identifier}`;
    service.getPendingContractByRef(referenceNumber, identifier).subscribe(res => {
      expect(res).toBeDefined();
    });
    const req = httpMock.expectOne(pendingContractUrl);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should validate contract', () => {
    const url = `/api/v1/contract/${referenceNumber}/validate?personIdentifier=1222222224`;
    service.validateContract(referenceNumber, 1222222224).subscribe(res => expect(res).toBeDefined());
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(new ValidateContractResponse());
  });

  it('should accept pending contract', () => {
    const url = `/api/v1/contract/${referenceNumber}/activate?personIdentifier=${identifier}`;
    service.acceptPendingContract(referenceNumber, identifier).subscribe(res => expect(res).toBeDefined());
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(' ');
  });

  it('should reject pending contract', () => {
    const url = `/api/v1/contract/${referenceNumber}/reject?personIdentifier=${identifier}`;
    service.rejectPendingContract(referenceNumber, identifier, {}).subscribe(res => expect(res).toBeDefined());
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(' ');
  });

  it('should save clauses', () => {
    const url = `/api/v1/establishment/${regNo}/contributor/${siNo}/engagement/${engagementId}/contract/${contractId}/clauses`;
    service.saveClauseDetails({}, regNo, siNo, engagementId, contractId).subscribe(res => expect(res).toBeDefined());
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(' ');
  });

  it('should cancel pending contract', () => {
    const url = `/api/v1/establishment/${regNo}/contributor/${siNo}/engagement/${engagementId}/contract/${contractId}/cancel`;
    service.cancelPendingContract(regNo, siNo, engagementId, contractId).subscribe(res => expect(res).toBeDefined());
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(new TransactionFeedback());
  });

  it('should getViolationRequest', () => {
    const requestId = 100101;
    const violationUrl = `/api/v1/establishment/${regNo}/violation-request/${requestId}`;
    service.getViolationRequest(regNo, requestId).subscribe(res => {
      expect(res).toBeDefined();
    });
    const req = httpMock.expectOne(violationUrl);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should approveEngagement', () => {
    const requestId = 100101;
    const approveEngUrl = `/api/v1/establishment/${regNo}/violation-request/${requestId}/approve`;
    service.approveEngagement(regNo, requestId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(approveEngUrl);
    expect(req.request.method).toBe('POST');
    req.flush({
      arabic: 'Violation request for the engagement approved successfully.',
      english: 'Violation request for the engagement approved successfully.'
    });
  });

  it('should modifyDate', () => {
    const requestId = 100101;
    const validatorData = {
      leavingReason: {
        arabic: 'string',
        english: 'string'
      },
      modifiedDate: {
        gregorian: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
        hijiri: 'yyyy-MM-dd'
      }
    };
    const modifyDateUrl = `/api/v1/establishment/${regNo}/contributor/${siNo}/engagement/${engagementId}/violation-request/${requestId}`;
    service.modifyDate(regNo, siNo, engagementId, requestId, validatorData).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(modifyDateUrl);
    expect(req.request.method).toBe('PUT');
    req.flush({
      arabic: 'Transaction is successfull',
      english: 'Transaction is successfull'
    });
  });

  it('to revert contract details', () => {
    const registrationNo = 7854123456;
    const socialInsuranceNo = 534553;
    const engagementId = 534543;
    const contractId = 34535435;
    const revertUrl = `/api/v1/establishment/${registrationNo}/contributor/${socialInsuranceNo}/engagement/${engagementId}/contract/${contractId}/revert`;
    service.revertContractDetails(registrationNo, socialInsuranceNo, engagementId, contractId).subscribe(response => {
      expect(response).toBeDefined();
    });
    const req = httpMock.expectOne(revertUrl);
    expect(req.request.method).toBe('PUT');
    req.flush('');
  });

  it('should get contract document', () => {
    const url = `/api/v1/establishment/${regNo}/contributor/${siNo}/engagement/${engagementId}/contract/${contractId}/report`;
    service.printPreview(regNo, siNo, engagementId, contractId).subscribe(res => expect(res).toBeDefined());
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(new Blob());
  });

  it('should get contract document using contract id', () => {
    const url = `/api/v1/contract/${contractId}/report`;
    service.printPreviewByRef(contractId).subscribe(res => expect(res).toBeDefined());
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(new Blob());
  });
});
