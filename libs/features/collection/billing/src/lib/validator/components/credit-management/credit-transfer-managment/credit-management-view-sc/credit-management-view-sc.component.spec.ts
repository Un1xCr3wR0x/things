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
import { of, throwError } from 'rxjs';
import { ValidatorRoles } from '@gosi-ui/features/contributor';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreditManagementViewScComponent } from './credit-management-view-sc.component';
import { BillingRoutingService } from '@gosi-ui/features/collection/billing/lib/shared/services/billing-routing.service';

import { PenalityWavierService } from '@gosi-ui/features/collection/billing/lib/shared/services/penality-wavier.service';
import { EventDateService } from '@gosi-ui/features/collection/billing/lib/shared/services/event-date.service';
import { EstablishmentService } from '@gosi-ui/features/collection/billing/lib/shared/services';
import { BillingConstants } from '@gosi-ui/features/collection/billing/lib/shared/constants';
import { TransactionOutcome } from '@gosi-ui/features/collection/billing/lib/shared/enums';
import { EstablishmentDetails } from '@gosi-ui/features/collection/billing/lib/shared/models';

describe('CreditManagementViewScComponent', () => {
  let component: CreditManagementViewScComponent;
  let fixture: ComponentFixture<CreditManagementViewScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [CreditManagementViewScComponent],
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

    fixture = TestBed.createComponent(CreditManagementViewScComponent);
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
      spyOn(component, 'getCreditTransferKeys');
      spyOn(component, 'getDataForCreditTransferView');
      component.ngOnInit();
      expect(component.getDataForCreditTransferView).toHaveBeenCalled();
      expect(component.getCreditTransferKeys).toHaveBeenCalled();
    });
    it('should read key from token', inject([RouterDataToken], token => {
      token.transactionId = 423651;
      token.payload = '{"registrationNo": 200085744, "requestId": 532231}';
      component.getCreditTransferKeys();
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
      component.getDataForCreditTransferView();
      spyOn(component.alertService, 'showError');
    });
    it('should throw error for view for est', () => {
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(throwError(genericError));
      component.getDataForCreditTransferView();
      expect(component.establishmentDetails).toBeUndefined();
    });
    it('should set flags for validator 1', () => {
      component.identifyCreditValidatorActions(ValidatorRoles.VALIDATOR_ONE);
      component.isGOL = false;
      expect(component.canReject).toBeTruthy();
      expect(component.canReturn).toBeFalsy();
    });
    it('should set flags for validator 1s', () => {
      component.identifyCreditValidatorActions(ValidatorRoles.VALIDATOR_ONE);
      component.isGOL = true;
      expect(component.canReject).toBeTruthy();
      expect(component.canReturn).toBeFalsy();
      expect(component.editFlag).toBeTruthy();
    });
    it('should set flags for GDIC ', () => {
      component.identifyCreditValidatorActions(ValidatorRoles.GDIC);
      expect(component.canReject).toBeFalsy();
    });
    it('should set flags for validator 2', () => {
      component.identifyCreditValidatorActions(ValidatorRoles.VALIDATOR_TWO);
      expect(component.canReturn).toBeTruthy();
    });
    it('should flags  to the user role FC Validator', () => {
      component.identifyCreditValidatorActions(ValidatorRoles.FC_VALIDATOR);
      expect(component.canReturn).toBeTruthy();
    });
  });
  it('should throw error on save workFlow', () => {
    const outcome = 'Approved';
    spyOn(component.alertService, 'showError');
    spyOn(component.penalityWavierService, 'handleWorkflowActions').and.returnValue(throwError(genericError));
    component.saveWorkflowForCreditTransfer(new BPMUpdateRequest(), outcome);
    expect(outcome).not.toEqual(null);
  });
  it('should set the datas for workflow actions', () => {
    component.setWorkFlowDataForCreditTransfer('Reject');
    const data: BPMUpdateRequest = new BPMUpdateRequest();
    expect(data.taskId).not.toBeNull();
    expect(data.user).not.toBeNull();
    expect(data.outcome).not.toBeNull();
  });
  it('should save the workflow details', () => {
    component.validatorCreditTransferForm.addControl('comments', new FormControl('Test'));
    component.modalRef = new BsModalRef();
    spyOn(component, 'saveWorkflowForCreditTransfer').and.callThrough();
    component.confirmCreditTransferApprove();
    expect(component.saveWorkflowForCreditTransfer).toHaveBeenCalled();
  });
  it('should return the workflow details', () => {
    component.validatorCreditTransferForm.addControl('comments', new FormControl('Test'));
    component.modalRef = new BsModalRef();
    spyOn(component, 'saveWorkflowForCreditTransfer').and.callThrough();
    component.confirmCreditTransferReturn();
    expect(component.saveWorkflowForCreditTransfer).toHaveBeenCalled();
  });
  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.decline();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('should reject the transaction', () => {
    const fb = new FormBuilder();
    component.validatorCreditTransferForm.addControl('rejectionReason', fb.group({ english: 'Others', arabic: '' }));
    spyOn(component, 'saveWorkflowForCreditTransfer').and.callThrough();
    spyOn(component, 'hideModal');
    component.confirmCreditTransferReject();
    expect(component.saveWorkflowForCreditTransfer).toHaveBeenCalled();
  });
  describe('approve transation', () => {
    it('should trigger the approve popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.creditManagementForm = getForm();
      spyOn(component, 'showModals');
      component.approveCreditTransferTransaction(modalRef);
      expect(component.showModals).toHaveBeenCalled();
    });
  });
  describe('reject transation', () => {
    it('should trigger the reject popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.creditManagementForm = getForm();
      spyOn(component, 'showModals');
      component.rejectCreditTransferTransaction(modalRef);
      expect(component.showModals).toHaveBeenCalled();
    });
  });

  describe('return transation', () => {
    it('should trigger the return popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.creditManagementForm = getForm();
      spyOn(component, 'showModals');
      component.returnCreditTransferTransaction(modalRef);
      expect(component.showModals).toHaveBeenCalled();
    });
  });
  describe('confirmCancel', () => {
    it('It should cancel', () => {
      spyOn(component.router, 'navigate');
      spyOn(component, 'decline');
      component.confirmCreditTransferCancel();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('getAllcreditDetails', () => {
    it('It should getAllcreditDetails', () => {
      component.registrationNumber = 200085744;
      component.requestNo = 542231;
      component.getAllcreditDetails(200085744, 542231);
      expect(component.currentBalanceList).not.toBeNull();
    });
    it('should show modal popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      spyOn(component.modalService, 'show');
      component.showModals(modalRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
    it('should throw error on getting DataForCreditTransferView', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(throwError(genericError));
      component.getDataForCreditTransferView();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should navigate to edit', () => {
      spyOn(component.billingRoutingService, 'navigateToEdit');
      component.navigateToEditTransfer();
      expect(component.billingRoutingService.navigateToEdit).toHaveBeenCalled();
    });
    it('should read keys from token in edit mode in contributor refund', inject([RouterDataToken], token => {
      token.taskId = 'asdasdasd';
      token.payload = '{"referenceNumber": 200085744, "requestNo": 231, "registrationNumber": 23441';
      expect(component.referenceNumber).toBeUndefined();
      expect(component.requestNo).toBeUndefined();
      expect(component.registrationNumber).toBeUndefined();
    }));
  });
  describe('generateStatement', () => {
    it('should show modal', () => {
      spyOn(component.billingRoutingService, 'navigateToInbox');
      component.navigateToInbox();
      expect(component.billingRoutingService.navigateToInbox).toHaveBeenCalled();
    });
  });
  describe('getCreditTransferAvailableBalanceDetails', () => {
    it('should get CreditTransferAvailableBalance details', () => {
      component.getCreditTransferAvailableBalanceDetails(34564566);
      expect(component.creditBalanceDetails).not.toEqual(null);
    });
  });
  describe('getCreditTransferAvailableBalanceDetails', () => {
    it('should get establishment details error', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.creditManagementService, 'getAvailableCreditBalance').and.returnValue(throwError(genericError));
      component.getCreditTransferAvailableBalanceDetails(34564566);
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
  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      component.modalRef = new BsModalRef();
      component.hideModal();

      expect(component.modalRef).not.toEqual(null);
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
