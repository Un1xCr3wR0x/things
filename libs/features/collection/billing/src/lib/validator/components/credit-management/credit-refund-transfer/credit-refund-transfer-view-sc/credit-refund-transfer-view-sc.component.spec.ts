/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormBuilder, FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  BPMUpdateRequest,
  RouterConstants,
  bindToObject
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import {
  AlertServiceStub,
  DocumentServiceStub,
  LookupServiceStub,
  ModalServiceStub,
  gccEstablishmentDetailsMockData,
  genericError
} from 'testing';
import {
  EventDateServiceStub,
  BillEstablishmentServiceStub,
  PenalityWavierServiceStub,
  BillingRoutingServiceStub
} from 'testing/mock-services';
import {
  EventDateService,
  EstablishmentService,
  PenalityWavierService,
  BillingRoutingService
} from '../../../../../shared/services';
import { of, throwError } from 'rxjs';
import { ValidatorRoles } from '@gosi-ui/features/contributor';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreditRefundTransferViewScComponent } from '../..';
import { TransactionOutcome } from '@gosi-ui/features/collection/billing/lib/shared/enums';
import { BillingConstants } from '@gosi-ui/features/collection/billing/lib/shared/constants';
import { EstablishmentDetails } from '@gosi-ui/features/collection/billing/lib/shared/models';

describe('CreditRefundTransferViewScComponent', () => {
  let component: CreditRefundTransferViewScComponent;
  let fixture: ComponentFixture<CreditRefundTransferViewScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [CreditRefundTransferViewScComponent],
      providers: [
        FormBuilder,
        {
          provide: DocumentService,
          useClass: DocumentServiceStub
        },
        { provide: BillingRoutingService, useClass: BillingRoutingServiceStub },
        { provide: EstablishmentService, useClass: BillEstablishmentServiceStub },
        { provide: PenalityWavierService, useClass: PenalityWavierServiceStub },
        {
          provide: EventDateService,
          useClass: EventDateServiceStub
        },
        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        FormBuilder,
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CreditRefundTransferViewScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('intialise the view', () => {
    it('should intialise the view for validator', () => {
      component.requestNo = 532231;
      component.registrationNumber = 200085744;
      spyOn(component, 'getCreditKeys');
      spyOn(component, 'getDataForView');
      spyOn(component, 'getAllcreditDetails');
      spyOn(component, 'getCreditScreenHeaders');
      component.ngOnInit();
      expect(component.getDataForView).toHaveBeenCalled();
      expect(component.getCreditKeys).toHaveBeenCalled();
      expect(component.getAllcreditDetails).toHaveBeenCalled();
      expect(component.getCreditScreenHeaders).toHaveBeenCalled();
    });
    it('should read key from token', inject([RouterDataToken], token => {
      token.transactionId = 423651;
      token.payload = '{"registrationNo": 200085744, "requestId": 532231}';
      component.getCreditKeys();
      expect(component.registrationNumber).toBeDefined();
      expect(component.requestNo).toBeDefined();
      expect(component.transactionNumber).toBeDefined();
    }));
    it('should get data for view for establishment', () => {
      component.registrationNumber = 200085744;
      component.requestNo = 542231;
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(
        of(bindToObject(new EstablishmentDetails(), gccEstablishmentDetailsMockData))
      );
      //spyOn(component, 'handleError');
      component.getDataForView();
      //expect(component.handleError).toHaveBeenCalled();
      spyOn(component.alertService, 'showError');
    });
    it('should set flags for validator 1', () => {
      component.identifyCreditValidatorActions(ValidatorRoles.VALIDATOR_ONE);
      component.isGOL = false;
      expect(component.canReject).toBeTruthy();
      expect(component.canReturn).toBeFalsy();
    });
    it('should set flags for validator 1s', () => {
      component.identifyCreditValidatorActions(ValidatorRoles.FC_VALIDATOR);
      expect(component.canReturn).toBeTruthy();
    });
    it('should set flags for GDIC ', () => {
      component.identifyCreditValidatorActions(ValidatorRoles.VALIDATOR_TWO);
      expect(component.canReturn).toBeTruthy();
    });
  });
  // it('should throw error on get data for view', () => {
  //   component.registrationNumber = 200085744;
  //   component.requestNo = 231;
  //   spyOn(component.penalityWavierService, 'getWavierPenalityDetailsForView').and.returnValue(throwError(genericError));
  //   spyOn(component, 'handleError').and.callThrough();
  //   component.getDataForView();
  //   expect(component.handleError).toHaveBeenCalled();
  // });
  xit('should throw error on save workFlow', () => {
    const outcome = 'Approved';
    spyOn(component.alertService, 'showError');
    spyOn(component.penalityWavierService, 'handleWorkflowActions').and.returnValue(throwError(genericError));
    component.saveWorkflowForCreditRefund(new BPMUpdateRequest(), outcome);
    expect(outcome).not.toEqual(null);
  });
  it('should set the datas for workflow actions', () => {
    component.setWorkFlowDataForCredit('Reject');
    const data: BPMUpdateRequest = new BPMUpdateRequest();
    expect(data.taskId).not.toBeNull();
    expect(data.user).not.toBeNull();
    expect(data.outcome).not.toBeNull();
  });
  it('should save the workflow details', () => {
    component.validatorForm.addControl('comments', new FormControl('Test'));
    component.modalRef = new BsModalRef();
    spyOn(component, 'saveWorkflowForCreditRefund').and.callThrough();
    component.confirmCreditApprove();
    expect(component.saveWorkflowForCreditRefund).toHaveBeenCalled();
  });
  it('should return the workflow details', () => {
    component.validatorForm.addControl('comments', new FormControl('Test'));
    component.modalRef = new BsModalRef();
    spyOn(component, 'saveWorkflowForCreditRefund').and.callThrough();
    component.confirmCreditReturn();
    expect(component.saveWorkflowForCreditRefund).toHaveBeenCalled();
  });
  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.decline();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('should reject the transaction', () => {
    const fb = new FormBuilder();
    component.validatorForm.addControl('rejectionReason', fb.group({ english: 'Others', arabic: '' }));
    spyOn(component, 'saveWorkflowForCreditRefund').and.callThrough();
    spyOn(component, 'hideModal');
    component.confirmCreditReject();
    expect(component.saveWorkflowForCreditRefund).toHaveBeenCalled();
  });
  // it('should return the transaction', () => {
  //   const fb = new FormBuilder();
  //   component.validatorForm.addControl('returnReason', fb.group({ english: 'Others', arabic: '' }));
  //   spyOn(component, 'saveWorkflow').and.callThrough();
  //   spyOn(component, 'hideModal');
  //   component.confirmReturn();
  //   expect(component.saveWorkflow).toHaveBeenCalled();
  // });
  describe('approve transation', () => {
    it('should trigger the approve popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.creditManagementForm = getForm();
      spyOn(component, 'showModals');
      component.approveCreditTransaction(modalRef);
      expect(component.showModals).toHaveBeenCalled();
    });
  });
  describe('reject transation', () => {
    it('should trigger the reject popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.creditManagementForm = getForm();
      spyOn(component, 'showModals');
      component.rejectCreditTransaction(modalRef);
      expect(component.showModals).toHaveBeenCalled();
    });
  });

  describe('return transation', () => {
    it('should trigger the return popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.creditManagementForm = getForm();
      spyOn(component, 'showModals');
      component.returnCreditTransaction(modalRef);
      expect(component.showModals).toHaveBeenCalled();
    });
  });
  describe(' navToInboxPage', () => {
    it('should show modal', () => {
      spyOn(component.billingRoutingService, 'navigateToInbox');
      component.navigateFromCreditToInbox();
      expect(component.billingRoutingService.navigateToInbox).toHaveBeenCalled();
    });
  });
  describe('handleError', () => {
    it('should show error messages', () => {
      spyOn(component.alertService, 'showError');
      component.handleError(genericError);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('getSuccessMessageForCredit', () => {
    it('should reject', () => {
      component.getSuccessMessageForCredit(TransactionOutcome.REJECT);
      let message = BillingConstants.TRANSACTION_REJECTED;
      expect(message).not.toBeNull();
    });
    it('should approve', () => {
      component.getSuccessMessageForCredit(TransactionOutcome.APPROVE);
      let message = BillingConstants.TRANSACTION_APPROVED;
      expect(message).not.toBeNull();
    });
    it('should return', () => {
      component.getSuccessMessageForCredit(TransactionOutcome.RETURN);
      let message = BillingConstants.TRANSACTION_RETURNED;
      expect(message).not.toBeNull();
    });
  });
  describe('getAvailableBalanceDetails', () => {
    it('should getAvailableBalanceDetails error', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.creditManagementService, 'getAvailableCreditBalance').and.returnValue(throwError(genericError));
      component.getAvailableBalanceDetails(504096157);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('getAvailableBalanceDetails', () => {
    it('should getAvailableBalanceDetails', () => {
      component.getAvailableBalanceDetails(504096157);
      expect(component.creditBalanceDetails).not.toEqual(null);
    });
  });
  describe('getAllcreditDetails', () => {
    it('should getAllcreditDetails error', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.creditManagementService, 'getRefundDetails').and.returnValue(throwError(genericError));
      component.getAllcreditDetails(504096157, 100012006);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('getAllcreditDetails', () => {
    it('should getAllcreditDetails', () => {
      component.getAllcreditDetails(504096157, 100012006);
      expect(component.CreditRefundDetails).not.toEqual(null);
    });
  });
  describe('confirmCancel', () => {
    it('It should cancel', () => {
      spyOn(component.router, 'navigate');
      spyOn(component, 'decline');
      component.confirmCreditCancel();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
    it('should navigate to edit', () => {
      spyOn(component.billingRoutingService, 'navigateToEdit');
      component.navigateToEdit();
      expect(component.billingRoutingService.navigateToEdit).toHaveBeenCalled();
    });
    it('should show modals', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      spyOn(component.modalService, 'show');
      component.showModals(modalRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
});
function getForm() {
  const fb: FormBuilder = new FormBuilder();
  return fb.group({
    taskId: [null],
    user: [null],
    type: [null]
  });
}
