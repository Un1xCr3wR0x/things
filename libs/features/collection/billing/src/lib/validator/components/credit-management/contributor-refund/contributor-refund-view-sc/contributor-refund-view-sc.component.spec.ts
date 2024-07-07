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
import { ContributorRefundViewScComponent } from '../..';
import { TransactionOutcome } from '@gosi-ui/features/collection/billing/lib/shared/enums';
import { BillingConstants } from '@gosi-ui/features/collection/billing/lib/shared/constants';
import { EstablishmentDetails } from '@gosi-ui/features/collection/billing/lib/shared/models';

describe('CreditRefundTransferViewScComponent', () => {
  let component: ContributorRefundViewScComponent;
  let fixture: ComponentFixture<ContributorRefundViewScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ContributorRefundViewScComponent],
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

    fixture = TestBed.createComponent(ContributorRefundViewScComponent);
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
      spyOn(component, 'getContributorRefundKeys');
      spyOn(component, 'getData');
      spyOn(component, 'getContributorRefundScreenHeaders');
      component.ngOnInit();
      expect(component.getData).toHaveBeenCalled();
      expect(component.getContributorRefundKeys).toHaveBeenCalled();
      expect(component.getContributorRefundScreenHeaders).toHaveBeenCalled();
    });
    it('should read key from token', inject([RouterDataToken], token => {
      token.transactionId = 423651;
      token.payload = '{"registrationNo": 200085744, "requestId": 532231}';
      component.getContributorRefundKeys();
      expect(component.registrationNumber).toBeDefined();
      expect(component.requestNo).toBeDefined();
      expect(component.transactionNumber).toBeDefined();
    }));
    // it('should get data for view for establishment', () => {
    //   spyOn(component.creditManagementService, 'getContirbutorDetails').and.returnValue(of(gccEstablishmentDetailsMockData));

    //   component.getContributorDet(5632555);
    //   expect(component.establishmentDetails).toBeDefined();
    // });
    it('should get data for view for establishment', () => {
      component.registrationNumber = 200085744;
      component.requestNo = 542231;
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(
        of(bindToObject(new EstablishmentDetails(), gccEstablishmentDetailsMockData))
      );

      component.getData();
      expect(component.establishmentDetails).not.toEqual(null);
      spyOn(component.alertService, 'showError');
    });
    it('should throw error for view for establishment', () => {
      spyOn(component.establishmentService, 'getBranchDetails').and.returnValue(throwError(genericError));
      component.getData();
      spyOn(component.alertService, 'showError');
    });
    it('should set flags for validator 1', () => {
      component.identifyContributorRefundActions(ValidatorRoles.VALIDATOR_ONE);
      component.isGOL = false;
      expect(component.canReject).toBeTruthy();
      expect(component.canReturn).toBeFalsy();
    });
    it('should set flags for validator 1s', () => {
      component.identifyContributorRefundActions(ValidatorRoles.FC_VALIDATOR);
      expect(component.canReturn).toBeTruthy();
    });
    it('should set flags for GDIC ', () => {
      component.identifyContributorRefundActions(ValidatorRoles.VALIDATOR_TWO);
      expect(component.canReturn).toBeTruthy();
    });
  });
  it('should throw error on save workFlow', () => {
    const outcome = 'Approved';
    spyOn(component.alertService, 'showError');
    spyOn(component.penalityWavierService, 'handleWorkflowActions').and.returnValue(throwError(genericError));
    component.saveWorkflowForContributorRefund(new BPMUpdateRequest(), outcome);
  });
  it('should set the datas for workflow actions', () => {
    component.setWorkFlowDataForContributorRefund('Reject');
    const data: BPMUpdateRequest = new BPMUpdateRequest();
    expect(data.taskId).not.toBeNull();
    expect(data.user).not.toBeNull();
    expect(data.outcome).not.toBeNull();
  });
  it('should save the workflow details', () => {
    component.validatorFormDet.addControl('comments', new FormControl('Test'));
    component.modalRef = new BsModalRef();
    spyOn(component, 'saveWorkflowForContributorRefund').and.callThrough();
    component.confirmContributorRefundApprove();
    expect(component.saveWorkflowForContributorRefund).toHaveBeenCalled();
  });
  it('should return the workflow details', () => {
    component.validatorFormDet.addControl('comments', new FormControl('Test'));
    component.modalRef = new BsModalRef();
    spyOn(component, 'saveWorkflowForContributorRefund').and.callThrough();
    component.confirmContributorRefundReturn();
    expect(component.saveWorkflowForContributorRefund).toHaveBeenCalled();
  });
  it('should reject the transaction', () => {
    const fb = new FormBuilder();
    component.validatorFormDet.addControl('rejectionReason', fb.group({ english: 'Others', arabic: '' }));
    spyOn(component, 'saveWorkflowForContributorRefund').and.callThrough();
    spyOn(component, 'hideModalDetails');
    component.confirmContributorRefundReject();
    expect(component.saveWorkflowForContributorRefund).toHaveBeenCalled();
  });
  describe('approve transation', () => {
    it('should trigger the approve popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.contributorRefundForm = getForm();
      spyOn(component, 'showModals');
      component.approveContributorRefundTransaction(modalRef);
      expect(component.showModals).toHaveBeenCalled();
    });
  });
  describe('reject transation', () => {
    it('should trigger the reject popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.contributorRefundForm = getForm();
      spyOn(component, 'showModals');
      component.rejectContributorRefundTransaction(modalRef);
      expect(component.showModals).toHaveBeenCalled();
    });
  });

  describe('return transation', () => {
    it('should trigger the return popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.contributorRefundForm = getForm();
      spyOn(component, 'showModals');
      component.returnContributorRefundTransaction(modalRef);
      expect(component.showModals).toHaveBeenCalled();
    });
  });
  describe('handleErrorForVic', () => {
    it('should show error messages', () => {
      spyOn(component.alertService, 'showError').and.callThrough();
      component.handleErrors(genericError);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('generateStatement', () => {
    it('should show modal', () => {
      spyOn(component.billingRoutingService, 'navigateToInbox');
      component.navigateToInbox();
      expect(component.billingRoutingService.navigateToInbox).toHaveBeenCalled();
    });
  });
  describe('getSuccessMessageForContributorRefund', () => {
    it('should reject', () => {
      component.getSuccessMessageForContributorRefund(TransactionOutcome.REJECT);
      let message = BillingConstants.TRANSACTION_REJECTED;
      expect(message).not.toBeNull();
    });
    it('should approve', () => {
      component.getSuccessMessageForContributorRefund(TransactionOutcome.APPROVE);
      let message = BillingConstants.TRANSACTION_APPROVED;
      expect(message).not.toBeNull();
    });
    it('should return', () => {
      component.getSuccessMessageForContributorRefund(TransactionOutcome.RETURN);
      let message = BillingConstants.TRANSACTION_RETURNED;
      expect(message).not.toBeNull();
    });
  });

  describe('getContributorDetails', () => {
    it('should getContributorDetails', () => {
      component.getContributorDetails('504096157');
      expect(component.ibanNumber).not.toEqual(null);
    });
  });

  describe('getContributorDet', () => {
    it('should getContributorDet error', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.creditManagementService, 'getContirbutorDetails').and.returnValue(throwError(genericError));
      component.getContributorDet(504096157);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('getBackdatedTerminationValues', () => {
    it('should getBackdatedTerminationValues error', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.creditManagementService, 'getBackdatedTerminationDetails').and.returnValue(
        throwError(genericError)
      );
      component.getBackdatedTerminationValues();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('getContributorPersonalDetails', () => {
    it('should getContributorPersonalDetails', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.creditManagementService, 'searchContributor').and.returnValue(throwError(genericError));
      component.getContributorPersonalDetails();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('confirmCancel', () => {
    it('It should cancel', () => {
      spyOn(component.router, 'navigate');
      spyOn(component, 'declineModal');
      component.confirmContributorRefundCancel();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
    it('should navigate to edit', () => {
      spyOn(component.billingRoutingService, 'navigateToEdit');
      component.navigateToCsrPage();
      expect(component.billingRoutingService.navigateToEdit).toHaveBeenCalled();
    });
    it('should hide modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.declineModal();
      expect(component.modalRef.hide).toHaveBeenCalled();
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
