/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  establishmentHeaderMockData,
  paymentDetailsMockData,
  paymentResponseMockData,
  submitPaymentMock,
  gccBankListData,
  gccCountryListData,
  workFlowStatusMockData,
  AuthTokenServiceStub
} from 'testing';
import { PaymentDetails, UpdatePayment, CancelReceiptPayload } from '../models';
import { ContributionPaymentService } from './contribution-payment.service';
import { AuthTokenService, BPMUpdateRequest } from '@gosi-ui/core';

describe('ContributionPaymentService', () => {
  let contributionPaymentService: ContributionPaymentService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AuthTokenService, useClass: AuthTokenServiceStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    contributionPaymentService = TestBed.inject(ContributionPaymentService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    const service: ContributionPaymentService = TestBed.inject(ContributionPaymentService);
    expect(service).toBeTruthy();
  });

  it('should get receipt number', () => {
    contributionPaymentService.receiptNumber = 321; //invokes setter method
    expect(contributionPaymentService.receiptNumber).toBe(321);
  });

  it('should get registration number', () => {
    contributionPaymentService.registrationNumber = 502351249; //invokes setter method
    expect(contributionPaymentService.registrationNumber).toBe(502351249);
  });

  describe('save Payment Details ', () => {
    it('should save the payment details', () => {
      const savePayment = `/api/v1/establishment/${establishmentHeaderMockData.registrationNo}/payment`;
      contributionPaymentService
        .savePaymentDetails(
          establishmentHeaderMockData.registrationNo,
          new PaymentDetails().fromJsonToObject(paymentDetailsMockData),
          false
        )
        .subscribe(response => {
          expect(response).toBeDefined();
        });

      const req = httpMock.expectOne(savePayment);
      expect(req.request.method).toBe('POST');
      req.flush(paymentDetailsMockData);
    });
  });
  describe('submit payment Details', () => {
    it('should update the payment details', () => {
      const receiptNo = 123456;
      const submitPayment = `/api/v1/establishment/${establishmentHeaderMockData.registrationNo}/payment/${receiptNo}`;
      contributionPaymentService
        .submitPaymentDetails(establishmentHeaderMockData.registrationNo, receiptNo, new UpdatePayment(), false)
        .subscribe(response => {
          expect(response).toBeDefined();
        });

      const req = httpMock.expectOne(submitPayment);
      expect(req.request.method).toBe('PATCH');
      req.flush(submitPaymentMock);
    });
  });
  describe('cancel payment', () => {
    it('should cancel payment in csr', () => {
      const receiptNo = 123456;
      const cancelPayment = `/api/v1/establishment/${establishmentHeaderMockData.registrationNo}/payment/${receiptNo}/cancel`;
      contributionPaymentService
        .cancelPayment(establishmentHeaderMockData.registrationNo, receiptNo, new CancelReceiptPayload(), false)
        .subscribe(response => {
          expect(response).toBeDefined();
        });
      const req = httpMock.expectOne(cancelPayment);
      expect(req.request.method).toBe('PUT');
      req.flush(paymentResponseMockData);
    });

    it('should cancel payment in validator edit', () => {
      const receiptNo = 123456;
      const cancelPayment = `/api/v1/establishment/${establishmentHeaderMockData.registrationNo}/payment/${receiptNo}/cancellation-request`;
      contributionPaymentService
        .cancelPayment(establishmentHeaderMockData.registrationNo, receiptNo, new CancelReceiptPayload(), true)
        .subscribe(response => {
          expect(response).toBeDefined();
        });
      const req = httpMock.expectOne(cancelPayment);
      expect(req.request.method).toBe('PUT');
      req.flush(paymentResponseMockData);
    });
  });
  describe('update Payment', () => {
    it('should update the payment', () => {
      const receiptNo = 123456;
      const updatePayment = `/api/v1/establishment/${establishmentHeaderMockData.registrationNo}/payment/${receiptNo}`;
      contributionPaymentService
        .updatePayment(
          establishmentHeaderMockData.registrationNo,
          receiptNo,
          new PaymentDetails().fromJsonToObject(paymentDetailsMockData),
          false
        )
        .subscribe(response => {
          expect(response).toBeDefined();
        });
      const req = httpMock.expectOne(updatePayment);
      expect(req.request.method).toBe('PUT');
      req.flush(paymentResponseMockData);
    });
  });
  describe('receiptDetails', () => {
    it('should get the receipt details', () => {
      const receiptNo = 123456;
      const receiptDetails = `/api/v1/establishment/${establishmentHeaderMockData.registrationNo}/payment/${receiptNo}?receiptType=CHILD`;
      contributionPaymentService
        .getReceiptDetails(establishmentHeaderMockData.registrationNo, receiptNo, false, 'CHILD')
        .subscribe(response => {
          expect(response).toBeDefined();
        });
      const req = httpMock.expectOne(receiptDetails);
      expect(req.request.method).toBe('GET');
      req.flush(paymentDetailsMockData);
    });
  });

  describe('submitAfterEdit', () => {
    it('to submit after editing', () => {
      const taskId = 'cb7914aa-ab60-468b-b576-623eee111c9b';
      const workflowUser = 'mahesh';
      const submitPayment = `/api/process-manager/v1/taskservice/update`;
      contributionPaymentService.submitAfterEdit(taskId, workflowUser).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(submitPayment);
      expect(req.request.method).toBe('POST');
      req.flush('');
    });
  });
  describe(' revertPaymentDetails', () => {
    it('to revert on cancel payment', () => {
      const receiptNo = 123456;
      const registrationNo = 9577225342;
      const revertPayment = `/api/v1/establishment/${registrationNo}/payment/${receiptNo}/revert`;
      contributionPaymentService.revertPaymentDetails(registrationNo, receiptNo, false).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(revertPayment);
      expect(req.request.method).toBe('PUT');
      req.flush('');
    });
  });

  describe('approve payment', () => {
    it('should approve payament', () => {
      const approvePayment = `/api/process-manager/v1/taskservice/update`;
      contributionPaymentService.approvePayment({ user: 'mahesh', taskId: '1234' }).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(approvePayment);
      expect(req.request.method).toBe('POST');
      req.flush('');
    });
  });
  describe('reject Payment', () => {
    it('should reject payment', () => {
      const approvePayment = `/api/process-manager/v1/taskservice/update`;
      contributionPaymentService.rejectPayment({ user: 'mahesh', taskId: '1234' }).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(approvePayment);
      expect(req.request.method).toBe('POST');
      req.flush('');
    });
  });

  describe('return Payment', () => {
    it('should return payment', () => {
      const returnPayment = `/api/process-manager/v1/taskservice/update`;
      contributionPaymentService.returnPayment({ user: 'mahesh', taskId: '1234' }).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(returnPayment);
      expect(req.request.method).toBe('POST');
      req.flush('');
    });
  });

  describe('sortLovlist', () => {
    it('should sort list for bank in english', () => {
      const list = contributionPaymentService.sortLovList(gccBankListData, true, 'en');
      expect(list).toBeDefined();
    });
    it('should sort list for bank in arabic', () => {
      const list = contributionPaymentService.sortLovList(gccBankListData, true, 'ar');
      expect(list).toBeDefined();
    });
    it('should sort non-bank list in english', () => {
      const list = contributionPaymentService.sortLovList(gccCountryListData, false, 'en');
      expect(list).toBeDefined();
    });
    it('should sort non-bank list in arabic', () => {
      const list = contributionPaymentService.sortLovList(gccCountryListData, false, 'ar');
      expect(list).toBeDefined();
    });
  });

  describe('handleWorkflowActions', () => {
    it('to handle workflow actions', () => {
      const data = new BPMUpdateRequest();
      data.taskId = 'cb7914aa-ab60-468b-b576-623eee111c9b';
      data.user = 'mahesh';
      data.outcome = 'Approve';
      const workflow = `/api/process-manager/v1/taskservice/update`;
      contributionPaymentService.handleWorkflowActions(data).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(workflow);
      expect(req.request.method).toBe('POST');
      req.flush('');
    });
  });
  describe(' cancelPaymentDetails', () => {
    it('to cancel payment', () => {
      const receiptNo = 123456;
      const registrationNo = 1;
      const cancelPayment = `/api/v1/paying-establishment/${registrationNo}/payment/${receiptNo}/cancel`;
      contributionPaymentService.cancelPaymentDetails(registrationNo, receiptNo, true).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(cancelPayment);
      expect(req.request.method).toBe('PUT');
      req.flush('');
    });
  });
  describe('getWorkFlowStatus', () => {
    it('should get the rgetWorkFlowStatus', () => {
      const registrationNo = 123456;
      const url = `/api/v1/establishment/${registrationNo}/workflow-status`;
      contributionPaymentService.getWorkFlowStatus(registrationNo).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(workFlowStatusMockData);
    });
  });
});
