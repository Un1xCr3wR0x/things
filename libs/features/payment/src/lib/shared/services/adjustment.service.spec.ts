import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdjustmentService } from './adjustment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  ApplicationTypeToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  WorkflowService,
  GosiCalendar,
  DocumentItem,
  Lov,
  BPMUpdateRequest,
  LovList
} from '@gosi-ui/core';
import { BehaviorSubject, of } from 'rxjs';
import { adjustmentModificationById, benefits } from '../test-data/adjustment';
import { adjustmentOtherPaymentDetails } from '../test-data/adjustment-repayment';
import {
  AdjustmentRepayValidatorSetValues,
  RepayItems,
  RepaymentDetails,
  AdjustmentRepaySetValues,
  AdjustmentRepaySetItems,
  AdjustmentRepaymentValidator,
  AdjustmentDetails,
  AdjustmentDetailsFilter
} from '../models';
import { WorkflowServiceStub } from 'testing';

describe('AdjustmentService', () => {
  let service: AdjustmentService;
  let httpMock: HttpTestingController;
  const personId = 1234;
  const adjustmentRepayId = 1234;
  const identifier = 1034681524;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: WorkflowService, useClass: WorkflowServiceStub }
      ]
    });
    service = TestBed.inject(AdjustmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should getAdjustmentsByStatus', () => {
    const status = 'Active';
    const url = `/api/v1/beneficiary/${identifier}/adjustment?status=${status}`;
    service.getAdjustmentsByStatus(identifier, status).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(adjustmentModificationById);
    httpMock.verify();
  });
  it('should getActiveDebitAdjustments', () => {
    const type = 'Debit';
    const status1 = 'Active';
    const status2 = '';
    const url = `/api/v1/beneficiary/${identifier}/adjustment?adjustmentType=${type}&status=${status1}&status=${status2}`;
    service.getActiveDebitAdjustments(identifier, type, status1, status2).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(new AdjustmentDetails());
    httpMock.verify();
  });
  it('should getAdjustmentByStatusAndType', () => {
    const identifier = 1034681524;
    const paramObj = { status: 'Active', benefitType: 'Saned Pension' };
    const urlByParam = `/api/v1/beneficiary/${identifier}/adjustment?status=${paramObj.status}&benefitType=${paramObj.benefitType}`;
    service.getAdjustmentByStatusAndType(identifier, paramObj).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(urlByParam);
    expect(req.request.method).toBe('GET');
    req.flush(adjustmentModificationById);
    httpMock.verify();
  });
  it('should getadjustmentBYId', () => {
    const identifier = 1034681524;
    const adjustmentId = 1001;
    const adjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment/${adjustmentId}`;
    service.getadjustmentBYId(identifier, adjustmentId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(adjustmentUrl);
    expect(req.request.method).toBe('GET');
    req.flush(adjustmentModificationById);
    httpMock.verify();
  });
  it('should adjustmentDetails', () => {
    const identifier = 1034681524;
    const adjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment`;
    service.adjustmentDetails(identifier).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(adjustmentUrl);
    expect(req.request.method).toBe('GET');
    req.flush(adjustmentModificationById);
    httpMock.verify();
  });
  it('should getAdjustByDetail', () => {
    const periodId = 1234;
    const adjustmenturl = `/api/v1/beneficiary/${periodId}/adjustment?status=&adjustmentType=&benefitType=`;
    spyOn(service, 'setAdjustmentStatusParam').and.callThrough();
    spyOn(service, 'setAdjustmentTypeParam').and.callThrough();
    spyOn(service, 'setBenefitTypeParam').and.callThrough();
    spyOn(service, 'setCreateDateParam').and.callThrough();
    spyOn(service, 'setRequestDateParam').and.callThrough();
    spyOn(service, 'setAdjustmentIdParam').and.callThrough();
    spyOn(service, 'setAdjustmentSortParam').and.callThrough();
    spyOn(service, 'setSortTypeParam').and.callThrough();
    service
      .getAdjustByDetail(1234, {
        ...new AdjustmentDetailsFilter(),
        adjustmentStatus: [{ english: '', arabic: '' }],
        adjustmentType: [{ english: '', arabic: '' }],
        benefitType: [{ english: '', arabic: '' }]
      })
      .subscribe(res => {
        expect(res).not.toBeNull();
      });
    const req = httpMock.expectOne(adjustmenturl);
    expect(req.request.method).toBe('GET');
    req.flush(new AdjustmentDetails());
    httpMock.verify();
  });
  it('should hasvalidValue', () => {
    expect(service.hasvalidValue([{ english: '' }])).toEqual(true);
  });
  it('should setAdjustmentStatusParam', () => {
    service.adjustmenturl = '';
    service.paramExists = false;
    service.setAdjustmentStatusParam([{ english: '', arabic: '' }]);
    expect(service.paramExists).toEqual(true);
  });
  it('should setAdjustmentTypeParam', () => {
    service.adjustmenturl = '';
    service.paramExists = false;
    service.setAdjustmentTypeParam([{ english: '', arabic: '' }]);
    expect(service.paramExists).toEqual(true);
  });
  it('should setBenefitTypeParam', () => {
    service.adjustmenturl = '';
    service.paramExists = false;
    service.setBenefitTypeParam([{ english: '', arabic: '' }]);
    expect(service.paramExists).toEqual(true);
  });
  it('should setCreateDateParam', () => {
    service.adjustmenturl = '';
    service.paramExists = false;
    service.setCreateDateParam(new Date(), new Date());
    expect(service.paramExists).toEqual(true);
  });
  it('should setAdjustmentIdParam', () => {
    service.adjustmenturl = '';
    service.paramExists = false;
    service.setAdjustmentIdParam(1234);
    expect(service.paramExists).toEqual(true);
  });
  it('should setAdjustmentSortParam', () => {
    service.adjustmenturl = '';
    service.paramExists = false;
    service.setAdjustmentSortParam('startDate');
    expect(service.paramExists).toEqual(true);
  });
  it('should setSortTypeParam', () => {
    service.adjustmenturl = '';
    service.paramExists = false;
    service.setSortTypeParam('ASC');
    expect(service.paramExists).toEqual(true);
  });
  it('should getBeneficiaryList', () => {
    const identifier = 1034681524;
    const beneficiaryUrl = `/api/v1/beneficiary/${identifier}/benefit`;
    service.getBeneficiaryList(identifier).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(beneficiaryUrl);
    expect(req.request.method).toBe('GET');
    req.flush(benefits);
    httpMock.verify();
  });
  it('should saveAdjustments', () => {
    const identifier = 1034681524;
    const addAdjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification`;
    service.saveAdjustments(identifier, {}).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(addAdjustmentUrl);
    expect(req.request.method).toBe('POST');
    req.flush('');
    httpMock.verify();
  });
  it('should modifyAdjustments', () => {
    const identifier = 1034681524;
    const adjModificationId = 900;
    const addAdjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification/${adjModificationId}`;
    service.modifyAdjustments(identifier, {}, adjModificationId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(addAdjustmentUrl);
    expect(req.request.method).toBe('PUT');
    req.flush('');
    httpMock.verify();
  });
  it('should getAdjustmentByeligible', () => {
    const identifier = 1034681524;
    const eligibleUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification`;
    service.getAdjustmentByeligible(identifier).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(eligibleUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ eligible: true });
    httpMock.verify();
  });
  it('should getAdjustmentByBenefitType', () => {
    const identifier = 1034681524;
    const type = 'Saned Pension';
    const url = `/api/v1/beneficiary/${identifier}/adjustment?benefitType=${type}`;
    service.getAdjustmentByBenefitType(identifier, type).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(adjustmentModificationById);
    httpMock.verify();
  });
  it('should getPerson', () => {
    const personId = 1034681524;
    const personUrl = `/api/v1/person/${personId}`;
    service.getPerson(personId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(personUrl);
    expect(req.request.method).toBe('GET');
    req.flush(adjustmentModificationById.person);
    httpMock.verify();
  });
  it('should adjustmentValidator', () => {
    const personId = 1034681524;
    const adjModificationId = 900;
    const validatorUrl = `/api/v1/beneficiary/${personId}/adjustment-modification/${adjModificationId}`;
    service.adjustmentValidator(personId, adjModificationId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(validatorUrl);
    expect(req.request.method).toBe('GET');
    req.flush(adjustmentModificationById);
    httpMock.verify();
  });
  it('should adjustmentValidatorPayment', () => {
    const personId = 1034681524;
    const adjModificationId = 900;
    const paymentUrl = `/api/v1/beneficiary/${personId}/adjustment-modification/${adjModificationId}/direct-payment`;
    service.adjustmentValidatorPayment(personId, adjModificationId).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(paymentUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ netAmount: 900, directPaymentStatus: true });
    httpMock.verify();
  });
  it('should editDirectPayment', () => {
    const personId = 1034681524;
    const adjModificationId = 900;
    const initiatePayment = true;
    const directPaymentUrl = `/api/v1/beneficiary/${personId}/adjustment-modification/${adjModificationId}/direct-payment?initiate=${initiatePayment}`;
    service.editDirectPayment(personId, adjModificationId, initiatePayment).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(directPaymentUrl);
    expect(req.request.method).toBe('PUT');
    req.flush({});
    httpMock.verify();
  });
  it('should submitAdjustmentDetails', () => {
    const identifier = 1034681524;
    const adjModificationId = 900;
    const referenceNumber = 985745;
    const submitAdjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment-modification/${adjModificationId}`;
    service.submitAdjustmentDetails(identifier, adjModificationId, referenceNumber, 'Submit').subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(submitAdjustmentUrl);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
    httpMock.verify();
  });
  it('should saveAndNextAdjustmentsRepay', () => {
    const identifier = 1234;
    const addAdjustmentUrl = `/api/v1/beneficiary/${identifier}/adjustment-repay`;
    service.saveAndNextAdjustmentsRepay(identifier, {}).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(addAdjustmentUrl);
    expect(req.request.method).toBe('POST');
    req.flush('');
    httpMock.verify();
  });
  it('should setAdjustmentRepayItems', () => {
    service.setAdjustmentRepayItems(new AdjustmentRepaySetItems());
    expect(service.adjustmentRepayValues).not.toEqual(null);
  });
  it('should getAdjustmentRepayItems', () => {
    service.adjustmentRepayValues = new AdjustmentRepaySetItems();
    expect(service.getAdjustmentRepayItems()).not.toEqual(null);
  });
  it('should proceedToPay', () => {
    const sadadPaymentDetails = {
      paymentMethod: { english: '', arabic: '' },
      referenceNo: 1234,
      transactionDate: new GosiCalendar()
    };
    const url = `/api/v1/beneficiary/${personId}/adjustment-repay/${adjustmentRepayId}/generate-bill`;
    service.proceedToPay(personId, adjustmentRepayId, sadadPaymentDetails).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush('');
    httpMock.verify();
  });
  it('should getReqDocsForOtherPayment private', () => {
    const url = '/api/v1/document/req-doc?transactionId=MNT_ADJUSTMENT_REPAYMENT&type=REQUEST_BENEFIT_FO';
    service.getReqDocsForOtherPayment(true).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(of([new DocumentItem()]));
    httpMock.verify();
  });
  it('should getReqDocsForOtherPayment public', () => {
    const url = '/api/v1/document/req-doc?transactionId=MNT_ADJUSTMENT_REPAYMENT&type=REQUEST_BENEFIT_GOL';
    service.getReqDocsForOtherPayment(false).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(of([new DocumentItem()]));
    httpMock.verify();
  });
  it('should getReceiptMode', () => {
    const url = `/api/v1/lov?category=Annuities&domainName=ReceiptMode`;
    service.getReceiptMode().subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(of([new Lov()]));
    httpMock.verify();
  });
  it('should getBankLovList', () => {
    const url = `/api/v1/lov?category=COLLECTION&domainName=SaudiArabiaBank`;
    service.getBankLovList().subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(of([new Lov()]));
    httpMock.verify();
  });
  it('should submitSadadPayment', () => {
    const sadadPaymentDetails = {
      paymentMethod: { english: '', arabic: '' },
      referenceNo: 1234,
      transactionDate: new GosiCalendar()
    };
    const url = `/api/v1/beneficiary/${personId}/adjustment-repay/${adjustmentRepayId}`;
    service.submitSadadPayment(personId, adjustmentRepayId, sadadPaymentDetails).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
    req.flush(of({ adjustmentRepayId: 1234, message: { english: '', arabic: '' }, referenceNo: 1234 }));
    httpMock.verify();
  });
  it('should submitOtherPayment', () => {
    const url = `/api/v1/beneficiary/${personId}/adjustment-repay/${adjustmentRepayId}/payment`;
    service.submitOtherPayment(personId, adjustmentRepayId, adjustmentOtherPaymentDetails).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(of(adjustmentOtherPaymentDetails));
    httpMock.verify();
  });
  it('should revertAdjustmentRepayment', () => {
    const referenceNo = 1234;
    const url = `/api/v1/beneficiary/${personId}/adjustment-repay/${adjustmentRepayId}/revert?referenceNo=${referenceNo}&isSadad=true`;
    service.revertAdjustmentRepayment(personId, adjustmentRepayId, referenceNo, true).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(of({ message: { english: '', arabic: '' } }));
    httpMock.verify();
  });
  it('should validatorModifysubmitOtherPayment', () => {
    const url = `/api/v1/beneficiary/${personId}/adjustment-repay/${adjustmentRepayId}/payment`;
    service
      .validatorModifysubmitOtherPayment(personId, adjustmentRepayId, adjustmentOtherPaymentDetails)
      .subscribe(res => {
        expect(res).not.toBeNull();
      });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(of(adjustmentOtherPaymentDetails));
    httpMock.verify();
  });
  it('should getAdjustmentRepaymentValidator', () => {
    const referenceNo = 1234;
    const url = `/api/v1/beneficiary/${personId}/adjustment-repay/${adjustmentRepayId}?referenceNo=${referenceNo}`;
    service.getAdjustmentRepaymentValidator(adjustmentRepayId, personId, referenceNo).subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(of(new AdjustmentRepaymentValidator()));
    httpMock.verify();
  });
  it('should updateAnnuityWorkflow', () => {
    service.updateAnnuityWorkflow({ ...new BPMUpdateRequest(), outcome: '' });
    expect(service.updateAnnuityWorkflow).toBeDefined();
  });
  it('should updateAnnuityWorkflow if outcome is send for inspection', () => {
    service.updateAnnuityWorkflow({ ...new BPMUpdateRequest(), outcome: 'SENDFORINSPECTION' });
    expect(service.updateAnnuityWorkflow).toBeDefined();
  });
  it('should getRejectReasonList', () => {
    const url = `/api/v1/lov?category=REGISTRATION&domainName=ReasonForRejectionOfBen`;
    service.getRejectReasonList().subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(of(new LovList([new Lov()])));
    httpMock.verify();
  });
  it('should getReturnReasonList', () => {
    const url = `/api/v1/lov?category=REGISTRATION&domainName=TransactionReturnReason`;
    service.getReturnReasonList().subscribe(res => {
      expect(res).not.toBeNull();
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(of(new LovList([new Lov()])));
    httpMock.verify();
  });
  it('should getAdjustmentRepayDetails', () => {
    service.adjustmentRepayDetails = new AdjustmentRepaySetValues(1234, 1234, 1234, 1234);
    expect(service.getAdjustmentRepayDetails()).not.toEqual(null);
  });
  it('should setAdjustmentRepayDetails', () => {
    service.setAdjustmentRepayDetails(new AdjustmentRepaySetValues(1234, 1234, 1234, 1234));
    expect(service.adjustmentRepayDetails).not.toEqual(null);
  });
  it('should getAdjustmentRepaymentValidatorDetails', () => {
    service.adjustmentRepayValidatorDetails = new AdjustmentRepayValidatorSetValues(
      1234,
      [new RepayItems()],
      new RepaymentDetails(),
      1234,
      1234
    );
    expect(service.getAdjustmentRepaymentValidatorDetails()).not.toEqual(null);
  });
  it('should setAdjustmentRepaymentValidatorDetails', () => {
    service.setAdjustmentRepaymentValidatorDetails(
      new AdjustmentRepayValidatorSetValues(1234, [new RepayItems()], new RepaymentDetails(), 1234, 1234)
    );
    expect(service.adjustmentRepayValidatorDetails).not.toEqual(null);
  });
  it('should setPageName', () => {
    service.setPageName('Adjustment');
    expect(service['pageName']).toEqual('Adjustment');
  });
  it('should getPageName', () => {
    service['pageName'] = 'Adjustment';
    expect(service.getPageName()).toEqual('Adjustment');
  });
  it('should set adjModificationId', () => {
    service.adjModificationId = 1034681524;
    expect(service['modifyId']).toEqual(1034681524);
  });
  it('should get adjModificationId', () => {
    service['modifyId'] = 1034681524;
    expect(service.adjModificationId).toEqual(1034681524);
  });
  it('should set personId', () => {
    service.personId = 1034681524;
    expect(service['person']).toEqual(1034681524);
  });
  it('should get personId', () => {
    service['person'] = 1034681524;
    expect(service.personId).toEqual(1034681524);
  });
  it('should set adjustmentId', () => {
    service.adjustmentId = 1034681524;
    expect(service['value']).toEqual(1034681524);
  });
  it('should get adjustmentId', () => {
    service['value'] = 1034681524;
    expect(service.adjustmentId).toEqual(1034681524);
  });
  it('should set referenceNumber', () => {
    service.referenceNumber = 1034681524;
    expect(service['referenceNo']).toEqual(1034681524);
  });
  it('should get referenceNumber', () => {
    service['referenceNo'] = 1034681524;
    expect(service.referenceNumber).toEqual(1034681524);
  });
});
