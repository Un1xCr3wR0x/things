import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  ApplicationTypeToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  BPMUpdateRequest,
  WorkflowService,
  DocumentItem
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { PaymentService } from './payment.service';
import { DatePipe } from '@angular/common';
import { paymentDetail } from '../test-data/payment';
import { PatchPaymentResponse } from '../models';
import { adjustmentModificationById } from '../test-data/adjustment';
import { WorkflowServiceStub } from 'testing';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpMock: HttpTestingController;
  const adjustFilter = {
    adjustmentId: 1614,
    adjustmentSortParam: 'BENEFIT_REQUEST_DATE',
    adjustmentStatus: [{ arabic: 'جديد', english: 'New' }],
    adjustmentType: [
      {
        arabic: 'مدين',
        english: 'Debit'
      }
    ],
    benefitRequestStartDate: new Date('Thu Jul 01 2021 13:34:35 GMT+0300 (Arabian Standard Time)'),
    benefitRequestStopDate: new Date('Sat Jul 03 2021 13:34:35 GMT+0300 (Arabian Standard Time)'),
    benefitType: [
      {
        arabic: 'معاش تقاعد',
        english: 'Old Age-Normal Retirement Pension'
      },
      {
        arabic: 'معاش التعطل عن العمل',
        english: 'Saned Pension'
      }
    ],
    identifier: 1034681524,
    sortType: 'ASCENDING',
    startDate: new Date('Thu Jul 01 2021 13:34:35 GMT+0300 (Arabian Standard Time)'),
    stopDate: new Date('Sat Jul 03 2021 13:34:35 GMT+0300 (Arabian Standard Time)')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        DatePipe
      ]
    });
    service = TestBed.inject(PaymentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should fetchPaymentdetails', () => {
    const identifier = 1034681524;
    const paymentUrl = `/api/v1/beneficiary/${identifier}/miscellaneous-payment`;
    service.fetchPaymentdetails(identifier, 1234).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(paymentUrl);
    expect(req.request.method).toBe('GET');
    req.flush(paymentDetail);
  });
  it('should submitPaymentDetails', () => {
    const identifier = 1034681524;
    const paymentUrl = `/api/v1/beneficiary/${identifier}/miscellaneous-payment`;
    service.submitPaymentDetails({}, identifier, 1234).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(paymentUrl);
    expect(req.request.method).toBe('POST');
    req.flush(paymentDetail);
  });
  it('should editPaymentDetails', () => {
    const identifier = 1034681524;
    const miscPaymentId = 101;
    const paymentPutUrl = `/api/v1/beneficiary/${identifier}/miscellaneous-payment/${miscPaymentId}`;
    service.editPaymentDetails({}, identifier, miscPaymentId, 1234).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(paymentPutUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(new PatchPaymentResponse());
  });
  it('should patchPaymentDetails', () => {
    const identifier = 1034681524;
    const miscPaymentId = 101;
    const paymentPatchUrl = `/api/v1/beneficiary/${identifier}/miscellaneous-payment/${miscPaymentId}`;
    service.patchPaymentDetails(identifier, miscPaymentId, 987456, 'Approve', 1234).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(paymentPatchUrl);
    expect(req.request.method).toBe('PATCH');
    req.flush(new PatchPaymentResponse());
  });
  it('should validatorDetails', () => {
    const identifier = 1034681524;
    const miscPaymentId = 101;
    const val = `/api/v1/beneficiary/${identifier}/miscellaneous-payment/${miscPaymentId}`;
    service.validatorDetails(identifier, miscPaymentId, 1234).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(val);
    expect(req.request.method).toBe('GET');
    req.flush(paymentDetail);
  });
  it('should hasvalidValue 1', () => {
    expect(service.hasvalidValue([{}])).toEqual(true);
  });
  it('should hasvalidValue 0', () => {
    expect(service.hasvalidValue([])).toEqual(false);
  });
  it('should getAdjustByDetail', () => {
    const periodId = 1034681524;
    const adjustmenturl = `/api/v1/party/${periodId}/adjustment`;
    service.getAdjustByDetail(periodId, adjustFilter).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(service.adjustmenturl);
    expect(req.request.method).toBe('GET');
    req.flush(adjustmentModificationById);
  });
  it('should setAdjustmentStatusParam', () => {
    service.adjustmenturl = '';
    spyOn(service, 'hasvalidValue').and.returnValue(true);
    service.setAdjustmentStatusParam(adjustFilter.adjustmentStatus);
    expect(service.adjustmenturl).not.toEqual(null);
  });
  it('should setAdjustmentTypeParam', () => {
    service.adjustmenturl = '';
    spyOn(service, 'hasvalidValue').and.returnValue(true);
    service.setAdjustmentTypeParam(adjustFilter.adjustmentType);
    expect(service.adjustmenturl).not.toEqual(null);
  });
  it('should setBenefitTypeParam', () => {
    service.adjustmenturl = '';
    spyOn(service, 'hasvalidValue').and.returnValue(true);
    service.setBenefitTypeParam(adjustFilter.benefitType);
    expect(service.adjustmenturl).not.toEqual(null);
  });
  it('should setCreateDateParam', () => {
    service.adjustmenturl = '';
    service.setCreateDateParam(adjustFilter.startDate, adjustFilter.stopDate);
    expect(service.adjustmenturl).not.toEqual(null);
  });
  it('should setRequestDateParam', () => {
    service.adjustmenturl = '';
    service.setRequestDateParam(adjustFilter.benefitRequestStartDate, adjustFilter.benefitRequestStopDate);
    expect(service.adjustmenturl).not.toEqual(null);
  });
  it('should setAdjustmentIdParam', () => {
    service.adjustmenturl = '';
    service.setAdjustmentIdParam(adjustFilter.adjustmentId);
    expect(service.adjustmenturl).not.toEqual(null);
  });
  it('should setAdjustmentSortParam', () => {
    service.adjustmenturl = '';
    service.setAdjustmentSortParam(adjustFilter.adjustmentSortParam);
    expect(service.adjustmenturl).not.toEqual(null);
  });
  it('should setSortTypeParam', () => {
    service.adjustmenturl = '';
    service.setSortTypeParam(adjustFilter.sortType);
    expect(service.adjustmenturl).not.toEqual(null);
  });
  it('should handleAnnuityWorkflowActions', () => {
    service.handleAnnuityWorkflowActions(new BPMUpdateRequest());
  });
  it('should getDocuments', () => {
    const referenceNo = 985475;
    const docUrl = `/api/v1/document/scanned-documents?referenceNo=${referenceNo}`;
    service.getDocuments(referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(docUrl);
    expect(req.request.method).toBe('GET');
    req.flush(new DocumentItem());
  });
  it('should set bankDetails', () => {
    service.bankDetails = {};
    expect(service['bankInfo']).toEqual({});
  });
  it('should get bankDetails', () => {
    service['bankInfo'] = {};
    expect(service.bankDetails).toEqual({});
  });
});
