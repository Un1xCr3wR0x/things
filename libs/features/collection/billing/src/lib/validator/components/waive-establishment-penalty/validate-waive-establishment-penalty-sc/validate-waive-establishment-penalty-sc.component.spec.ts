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
  genericError,
  genericEstablishmentResponse
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
} from '../../../../shared/services';
import { ValidateWaiveEstablishmentPenaltyScComponent } from '..';
import { of, throwError } from 'rxjs';
import { ValidatorRoles } from '@gosi-ui/features/contributor';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TransactionOutcome } from '../../../../shared/enums';
import { BillingConstants } from '../../../../shared/constants';
import { EstablishmentDetails } from '../../../../shared/models';

describe('ValidateWaiveEstablishmentPenaltyScComponent', () => {
  let component: ValidateWaiveEstablishmentPenaltyScComponent;
  let fixture: ComponentFixture<ValidateWaiveEstablishmentPenaltyScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ValidateWaiveEstablishmentPenaltyScComponent],
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

        {
          provide: RouterDataToken,
          useValue: new RouterData()
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ValidateWaiveEstablishmentPenaltyScComponent);
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
      component.registrationNumber = 200085744;
      spyOn(component, 'getKeysFromToken');
      spyOn(component, 'getDataForView');
      component.ngOnInit();
      expect(component.getDataForView).toHaveBeenCalled();
      expect(component.getKeysFromToken).toHaveBeenCalled();
    });
    it('should read key from token', inject([RouterDataToken], token => {
      token.transactionId = 423651;
      token.payload = '{"registrationNo": 200085744, "waiverId": 532231}';
      component.getKeysFromToken();
      expect(component.registrationNumber).toBeDefined();
      expect(component.penaltyWaiveId).toBeDefined();
      expect(component.transactionNumber).toBeDefined();
    }));
    it('should get data for view for establishment', () => {
      component.registrationNumber = 200085744;
      component.penaltyWaiveId = 542231;
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(
        of(bindToObject(new EstablishmentDetails(), gccEstablishmentDetailsMockData))
      );
      component.getDataForView();
      spyOn(component.alertService, 'showError');
    });
    it('should set flags for validator 1', () => {
      component.identifyValidatorActions(ValidatorRoles.VALIDATOR_ONE);
      component.isGOL = false;
      expect(component.canReject).toBeTruthy();
      expect(component.canReturn).toBeFalsy();
    });
    it('should set flags for validator 1s for gol', () => {
      component.identifyValidatorActions(ValidatorRoles.VALIDATOR_ONE);
      component.isGOL = true;
      expect(component.canReturn).toBeFalsy();
    });
    // it('should set flags for validator 1s', () => {
    //   component.identifyValidatorActions(ValidatorRoles.VALIDATOR_ONE);
    //   component.isGOL=true;
    //   expect(component.canReturn).toBeFalsy();
    //   expect(component.editFlag).toBeTruthy();
    // });
    it('should set flags for GDIC ', () => {
      component.identifyValidatorActions(ValidatorRoles.GDIC);
      expect(component.canReject).toBeFalsy();
      // expect(component.canReturn).toBeTruthy();
      // expect(component.editFlag).toBeFalsy();
    });
    it('should set flags for validator 2', () => {
      component.identifyValidatorActions(ValidatorRoles.VALIDATOR_TWO);
      expect(component.editFlag).toBeFalsy();
      expect(component.canReturn).toBeTruthy();
    });
    it('should flags  to the user role FC Validator', () => {
      component.identifyValidatorActions(ValidatorRoles.FC_VALIDATOR);
      expect(component.canReject).toBeFalsy();
      expect(component.canReturn).toBeTruthy();
      expect(component.editFlag).toBeFalsy();
    });
  });
  it('should throw error on get data for view', () => {
    component.registrationNumber = 200085744;
    component.penaltyWaiveId = 231;
    spyOn(component.penalityWavierService, 'getWavierPenalityDetailsForView').and.returnValue(throwError(genericError));
    spyOn(component, 'handleError').and.callThrough();
    component.getDataForView();
    expect(component.handleError).toHaveBeenCalled();
  });
  it('should throw error on save workFlow', () => {
    const outcome = 'Approved';
    spyOn(component.alertService, 'showError');
    spyOn(component.penalityWavierService, 'handleWorkflowActions').and.returnValue(throwError(genericError));
    component.saveWorkflowDetails(new BPMUpdateRequest(), outcome);
    expect(outcome).not.toEqual(null);
  });
  it('should set the datas for workflow actions', () => {
    component.setWorkFlowData('Reject');
    const data: BPMUpdateRequest = new BPMUpdateRequest();
    expect(data.taskId).not.toBeNull();
    expect(data.user).not.toBeNull();
    expect(data.outcome).not.toBeNull();
  });
  it('should save the workflow details', () => {
    component.validatorForm.addControl('comments', new FormControl('Test'));
    component.modalRef = new BsModalRef();
    spyOn(component, 'saveWorkflowDetails').and.callThrough();
    component.confirmApprove();
    expect(component.saveWorkflowDetails).toHaveBeenCalled();
  });
  it('should return the workflow details', () => {
    component.validatorForm.addControl('comments', new FormControl('Test'));
    component.modalRef = new BsModalRef();
    spyOn(component, 'saveWorkflowDetails').and.callThrough();
    component.confirmReturn();
    expect(component.saveWorkflowDetails).toHaveBeenCalled();
  });
  it('should show modal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.showPopup(modalRef);
    expect(component.modalRef).not.toEqual(null);
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
    spyOn(component, 'saveWorkflowDetails').and.callThrough();
    spyOn(component, 'hidePopup');
    component.confirmReject();
    expect(component.saveWorkflowDetails).toHaveBeenCalled();
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
      component.waivePenaltyEstablishmentForm = getForm();
      spyOn(component, 'showPopup');
      component.approveTransaction(modalRef);
      expect(component.showPopup).toHaveBeenCalled();
    });
  });
  describe('reject transation', () => {
    it('should trigger the reject popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.waivePenaltyEstablishmentForm = getForm();
      spyOn(component, 'showPopup');
      component.rejectTransaction(modalRef);
      expect(component.showPopup).toHaveBeenCalled();
    });
  });

  describe('return transation', () => {
    it('should trigger the return popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.waivePenaltyEstablishmentForm = getForm();
      spyOn(component, 'showPopup');
      component.returnTransaction(modalRef);
      expect(component.showPopup).toHaveBeenCalled();
    });
  });
  describe('navigateToEdit', () => {
    it('should show modal', () => {
      spyOn(component.billingRoutingService, 'navigateToInbox');
      component.navigateBacktoInbox();
      expect(component.billingRoutingService.navigateToInbox).toHaveBeenCalled();
    });
  });
  describe('navigateToInbox', () => {
    it('should show modal', () => {
      spyOn(component.billingRoutingService, 'navigateToEdit');
      component.navigateToEdit();
      expect(component.billingRoutingService.navigateToEdit).toHaveBeenCalled();
    });
  });
  describe('getSuccessMessage', () => {
    it('should reject', () => {
      component.getSuccessMessage(TransactionOutcome.REJECT);
      let message = BillingConstants.TRANSACTION_REJECTED;
      expect(message).not.toBeNull();
    });
    it('should approve', () => {
      component.getSuccessMessage(TransactionOutcome.APPROVE);
      let message = BillingConstants.TRANSACTION_APPROVED;
      expect(message).not.toBeNull();
    });
    it('should return', () => {
      component.getSuccessMessage(TransactionOutcome.RETURN);
      let message = BillingConstants.TRANSACTION_RETURNED;
      expect(message).not.toBeNull();
    });
  });
  describe('confirmCancel', () => {
    it('It should cancel', () => {
      spyOn(component.router, 'navigate');
      spyOn(component, 'decline');
      component.confirmCancel();
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
