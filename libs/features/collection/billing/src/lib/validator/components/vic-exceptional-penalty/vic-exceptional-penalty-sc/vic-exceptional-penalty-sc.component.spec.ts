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
  RouterConstants
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { AlertServiceStub, DocumentServiceStub, LookupServiceStub, ModalServiceStub, genericError } from 'testing';
import {
  BillEstablishmentServiceStub,
  PenalityWavierServiceStub,
  BillingRoutingServiceStub
} from 'testing/mock-services';
import { EstablishmentService, PenalityWavierService, BillingRoutingService } from '../../../../shared/services';
import { throwError } from 'rxjs';
import { VicExceptionalPenaltyScComponent } from './vic-exceptional-penalty-sc.component';
import { ValidatorRoles } from '@gosi-ui/features/contributor';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TransactionOutcome } from '../../../../shared/enums';
import { BillingConstants } from '../../../../shared/constants';

describe('VicExceptionalPenaltyScComponent', () => {
  let component: VicExceptionalPenaltyScComponent;
  let fixture: ComponentFixture<VicExceptionalPenaltyScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [VicExceptionalPenaltyScComponent],
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
          provide: AlertService,
          useClass: AlertServiceStub
        },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        { provide: BsModalService, useClass: ModalServiceStub },

        {
          provide: RouterDataToken,
          useValue: new RouterData()
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(VicExceptionalPenaltyScComponent);
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
      component.penaltyWaiveId = 532231;
      component.socialInsuranceno = 200085744;
      spyOn(component, 'getValuesFromToken');
      spyOn(component, 'getDataForVicExceptionalView');
      component.ngOnInit();
      expect(component.getDataForVicExceptionalView).toHaveBeenCalled();
      expect(component.getValuesFromToken).toHaveBeenCalled();
    });
    it('should read key from token', inject([RouterDataToken], token => {
      token.transactionId = 423651;
      token.payload = '{"registrationNo": 200085744, "waiverId": 532231}';
      component.getValuesFromToken();
      expect(component.socialInsuranceno).toBeDefined();
      expect(component.penaltyWaiveId).toBeDefined();
      expect(component.transactionNumber).toBeDefined();
    }));
    it('should set flags for GDISO', () => {
      component.identifyTheRoles(ValidatorRoles.GDISO);
      expect(component.canReject).toBeTruthy();
      expect(component.canReturn).toBeTruthy();
    });
    it('should set flags for fc validator', () => {
      component.identifyTheRoles(ValidatorRoles.FC_VALIDATOR);
      expect(component.canReject).toBeFalsy();
      expect(component.canReturn).toBeTruthy();
    });
    it('should set flags for gdic ', () => {
      component.identifyTheRoles(ValidatorRoles.GDIC);
      expect(component.canReject).toBeFalsy();
      expect(component.canReturn).toBeFalsy();
    });
    it('should throw error on save workFlow', () => {
      const outcome = 'Approved';
      spyOn(component.alertService, 'showError');
      spyOn(component.penaltyWaiverService, 'handleWorkflowActions').and.returnValue(throwError(genericError));
      component.saveWorkflowDetails(new BPMUpdateRequest(), outcome);
      expect(outcome).not.toEqual(null);
    });
    it('should approve the transaction', () => {
      component.validatorForms.addControl('comments', new FormControl('Test'));
      component.modalRef = new BsModalRef();
      spyOn(component, 'saveWorkflowDetails').and.callThrough();
      component.confirmApproveForVic();
      expect(component.saveWorkflowDetails).toHaveBeenCalled();
    });
    it('should return the transaction', () => {
      const fb = new FormBuilder();
      component.validatorForms.addControl('returnReason', fb.group({ english: 'Others', arabic: '' }));
      spyOn(component, 'saveWorkflowDetails').and.callThrough();
      spyOn(component, 'hideModals');
      component.confirmReturnForVic();
      expect(component.saveWorkflowDetails).toHaveBeenCalled();
    });
    describe('Show Modal', () => {
      it('should trigger popup', () => {
        const modalRef = { elementRef: null, createEmbeddedView: null };
        component.showModals(modalRef);
        expect(component.modalRef).not.toEqual(null);
      });
    });
    it('should reject the transaction', () => {
      const fb = new FormBuilder();
      component.validatorForms.addControl('returnReason', fb.group({ english: 'Others', arabic: '' }));
      spyOn(component, 'saveWorkflowDetails').and.callThrough();
      spyOn(component, 'hideModals');
      component.confirmRejectForVic();
      expect(component.saveWorkflowDetails).toHaveBeenCalled();
    });
    describe('approve transation', () => {
      it('should trigger the approve popup', () => {
        const modalRef = { elementRef: null, createEmbeddedView: null };
        component.exceptionalVicForm = getForm();
        spyOn(component, 'showModals');
        component.approveVicTransactions(modalRef);
        expect(component.showModals).toHaveBeenCalled();
      });
    });
    describe('reject transation', () => {
      it('should trigger the reject popup', () => {
        const modalRef = { elementRef: null, createEmbeddedView: null };
        component.exceptionalVicForm = getForm();
        spyOn(component, 'showModals');
        component.rejectVicTransactions(modalRef);
        expect(component.showModals).toHaveBeenCalled();
      });
    });

    describe('return transation', () => {
      it('should trigger the return popup', () => {
        const modalRef = { elementRef: null, createEmbeddedView: null };
        component.exceptionalVicForm = getForm();
        spyOn(component, 'showModals');
        component.returnVicTransactions(modalRef);
        expect(component.showModals).toHaveBeenCalled();
      });
    });
    describe('handleErrors', () => {
      it('should show error messages', () => {
        spyOn(component.alertService, 'showError');
        component.handleErrors(genericError);
        expect(component.alertService.showError).toHaveBeenCalled();
      });
    });
    describe('decline', () => {
      it('should decline', () => {
        component.modalRef = new BsModalRef();
        spyOn(component.modalRef, 'hide');
        component.decline();
        expect(component.modalRef.hide).toHaveBeenCalled();
      });
    });
    describe(' navToInbox', () => {
      it('should navToInbox', () => {
        spyOn(component.billingRoutingService, 'navigateToInbox');
        component.navToInbox();
        expect(component.billingRoutingService.navigateToInbox).toHaveBeenCalled();
      });
    });
    describe('getSuccessMessageForView', () => {
      it('should reject', () => {
        component.getSuccessMessageForView(TransactionOutcome.REJECT);
        let message = BillingConstants.TRANSACTION_REJECTED;
        expect(message).not.toBeNull();
      });
      it('should approve', () => {
        component.getSuccessMessageForView(TransactionOutcome.APPROVE);
        let message = BillingConstants.TRANSACTION_APPROVED;
        expect(message).not.toBeNull();
      });
      it('should return', () => {
        component.getSuccessMessageForView(TransactionOutcome.RETURN);
        let message = BillingConstants.TRANSACTION_RETURNED;
        expect(message).not.toBeNull();
      });
    });
    describe('getVicDocuments', () => {
      it('should get documents', () => {
        component.socialInsuranceno = 1234;
        component.referenceNumber = 1234;
        spyOn(component.documentService, 'getDocuments').and.callThrough();
        component.getVicDocuments();
        expect(component.documentService.getDocuments).toHaveBeenCalledWith(
          BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
          BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE,
          component.socialInsuranceno,
          component.referenceNumber
        );
      });
    });
    describe('confirmCancel', () => {
      it('It should cancel', () => {
        spyOn(component.router, 'navigate');
        spyOn(component, 'decline');
        component.confirmCancelBtn();
        expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
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
});
