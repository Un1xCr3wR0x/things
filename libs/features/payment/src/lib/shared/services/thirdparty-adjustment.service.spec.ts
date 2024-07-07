import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  ApplicationTypeToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  DocumentService,
  DocumentItem,
  DocumentResponseItem
} from '@gosi-ui/core';
import { BehaviorSubject, of } from 'rxjs';
import { ThirdpartyAdjustmentService } from '.';
import { eligibilityMockData } from '../test-data/adjustment';
import { HttpParams } from '@angular/common/http';
import {
  PayeeQueryParams,
  PayeeDetailsWrapper,
  AdjustmentQueryParams,
  AdjustmentDetails,
  Messages,
  CreateTpaRequest,
  SaveAdjustmentResponse,
  PayeeDetails,
  MonthlyDeductionEligibility,
  Payment,
  BeneficiaryList
} from '../models';
import { DocumentServiceStub } from 'testing';
import { contributor } from '../test-data/adjustment-repayment';

describe('ThirdpartyAdjustmentService', () => {
  let service: ThirdpartyAdjustmentService;
  let httpMock: HttpTestingController;
  const identifier = 1234;
  const adjModificationId = 1234;
  const referenceNo = 1234;
  const personId = 1234;
  const adjustmentId = 1234;
  const documentScannedUrl = '/api/v1/document/scanned-documents';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: DocumentService, useClass: DocumentServiceStub }
      ]
    });
    service = TestBed.inject(ThirdpartyAdjustmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should getParams', () => {
    expect(
      service.getParams(
        '',
        [
          { a: '', b: '' },
          { a: '', b: '' }
        ],
        new HttpParams()
      )
    ).not.toEqual(null);
  });
  it('should getPayeeDetails', () => {
    const url = `/api/v1/party/third-party-details`;
    spyOn(service, 'getParams').and.callThrough();
    service.getPayeeDetails(new PayeeQueryParams()).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(of(new PayeeDetailsWrapper()));
    httpMock.verify();
  });
  it('should getTpaEligibility', () => {
    const identifier = 1034681524;
    const url = `/api/v1/beneficiary/${identifier}/adjustment/eligibility`;
    service.getTpaEligibility(identifier).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(of(eligibilityMockData));
    httpMock.verify();
  });
  it('should getTpaAdjustmentsDetails', () => {
    const adjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment?isTpa=true`;
    service.getTpaAdjustmentsDetails(1234, new AdjustmentQueryParams()).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(adjustmentUrl);
    expect(req.request.method).toBe('GET');
    req.flush(of(new AdjustmentDetails()));
    httpMock.verify();
  });
  it('should mapMessagesToAlert', () => {
    expect(service.mapMessagesToAlert({ ...new Messages(), details: [{ english: '', arabic: '' }] })).not.toEqual(null);
  });
  it('should saveThirdPartyAdjustment', () => {
    const isModify = true;
    const tpaUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification?isModify=${isModify}`;
    service.saveThirdPartyAdjustment(1234, new CreateTpaRequest(), isModify).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(tpaUrl);
    expect(req.request.method).toBe('POST');
    req.flush(of(new SaveAdjustmentResponse()));
    httpMock.verify();
  });
  it('should getValidatorPayeeDetails', () => {
    const payeeId = 1234;
    const payeeUrl = `/api/v1/party/third-party-details/${payeeId}`;
    service.getValidatorPayeeDetails(1234).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(payeeUrl);
    expect(req.request.method).toBe('GET');
    req.flush(of(new PayeeDetails()));
    httpMock.verify();
  });
  it('should submitAdjustmentDetails', () => {
    const submitAdjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification/${adjModificationId}`;
    service.submitAdjustmentDetails(identifier, adjModificationId, referenceNo, '').subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(submitAdjustmentUrl);
    expect(req.request.method).toBe('PATCH');
    req.flush(of({}));
    httpMock.verify();
  });
  it('should getThirdPartyAdjustmentValidatorDetails', () => {
    const isTpa = true;
    const validatorUrl = `/api/v1/beneficiary/${personId}/adjustment-modification/${adjModificationId}?isTpa=${isTpa}`;
    service.getThirdPartyAdjustmentValidatorDetails(personId, adjModificationId, isTpa).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(validatorUrl);
    expect(req.request.method).toBe('GET');
    req.flush(of(new AdjustmentDetails()));
    httpMock.verify();
  });
  it('should getAdjustmentMonthlyDeductionEligibilty', () => {
    const url = `/api/v1/beneficiary/${personId}/adjustment-modification/monthly-deduction`;
    service.getAdjustmentMonthlyDeductionEligibilty(personId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(of(new MonthlyDeductionEligibility()));
    httpMock.verify();
  });
  it('should saveValidatorAdjustmentEdit', () => {
    const tpaUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification/${adjModificationId}`;
    service.saveValidatorAdjustmentEdit(identifier, new CreateTpaRequest(), adjModificationId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(tpaUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(of(new SaveAdjustmentResponse()));
    httpMock.verify();
  });
  it('should revertTransaction', () => {
    const uuid = '1234';
    const tpaUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification/revert?adjModificationId=${adjModificationId}&referenceNo=${referenceNo}&uuid=${uuid}`;
    service.revertTransaction(identifier, adjModificationId, referenceNo, uuid).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(tpaUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(of({}));
    httpMock.verify();
  });
  it('should getPaymentDetails', () => {
    const url = `/api/v1/beneficiary/${personId}/adjustment/${adjustmentId}/payment-details`;
    service.getPaymentDetails(personId, adjustmentId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(of([new Payment()]));
    httpMock.verify();
  });
  it('should getAllDocuments', () => {
    service.getAllDocuments(identifier, '', '', referenceNo);
  });
  it('should getOldDocumentContentId', () => {
    let url = `${documentScannedUrl}?transactionId=${identifier}&businessTransaction=a&businessTransactionType=b&referenceNo=${referenceNo}`;
    service.getOldDocumentContentId(identifier, 'a', 'b', referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(of([new DocumentItem()]));
    httpMock.verify();
  });
  it('should getDocumentContent', () => {
    service.getDocumentContent('');
  });
  it('should setContentToDocument', () => {
    service.setContentToDocument(new DocumentItem(), new DocumentResponseItem());
  });
  it('should getPersonById', () => {
    const url = `/api/v1/contributor?personId=${personId}`;
    service.getPersonById(personId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(of(contributor));
    httpMock.verify();
  });
  it('should getBeneficiaryDetails', () => {
    const beneficiaryUrl = `/api/v1/beneficiary/${identifier}/benefit?isTpa=true`;
    service.getBeneficiaryDetails(identifier).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(beneficiaryUrl);
    expect(req.request.method).toBe('GET');
    req.flush(of(new BeneficiaryList()));
    httpMock.verify();
  });
});
