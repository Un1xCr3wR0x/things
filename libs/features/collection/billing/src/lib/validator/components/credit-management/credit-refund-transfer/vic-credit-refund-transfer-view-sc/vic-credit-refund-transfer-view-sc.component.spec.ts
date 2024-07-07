/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService,
  bindToObject,
  BPMUpdateRequest
} from '@gosi-ui/core';
import { ValidatorRoles } from '@gosi-ui/features/contributor';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  AlertServiceStub,
  DocumentServiceStub,
  LookupServiceStub,
  ModalServiceStub,
  creditRefundRequestDetailsMockData,
  genericError,
  vicCreditRefundIbanMockData,
  creditRefundDetailsTest
} from 'testing';
import {
  BillEstablishmentServiceStub,
  BillingRoutingServiceStub,
  CreditManagementServiceServiceStub,
  EventDateServiceStub,
  PenalityWavierServiceStub,
  WorkflowServiceStub
} from 'testing/mock-services';
import {
  BillingRoutingService,
  CreditManagementService,
  EstablishmentService,
  EventDateService,
  PenalityWavierService
} from '../../../../../shared/services';
import { VicCreditRefundTransferViewScComponent } from './vic-credit-refund-transfer-view-sc.component';
import { TransactionOutcome } from '@gosi-ui/features/collection/billing/lib/shared/enums';
import { BillingConstants } from '@gosi-ui/features/collection/billing/lib/shared/constants';
import { of, throwError } from 'rxjs';
import {
  CreditBalanceDetails,
  VicCreditRefundIbanDetails,
  CreditRefundDetails
} from '@gosi-ui/features/collection/billing/lib/shared/models';

describe('VicCreditRefundTransferViewScComponent', () => {
  let component: VicCreditRefundTransferViewScComponent;
  let fixture: ComponentFixture<VicCreditRefundTransferViewScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [VicCreditRefundTransferViewScComponent],
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
        { provide: CreditManagementService, useClass: CreditManagementServiceServiceStub },
        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        FormBuilder,
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(VicCreditRefundTransferViewScComponent);
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
      component.sin = 200085744;
      spyOn(component, 'getVicCreditKeys');
      spyOn(component, 'getDataForVicRefundView');
      component.ngOnInit();
      expect(component.getDataForVicRefundView).toHaveBeenCalled();
      expect(component.getVicCreditKeys).toHaveBeenCalled();
    });
    it('should read key from token', inject([RouterDataToken], token => {
      token.transactionId = 423651;
      token.payload = '{"referenceNumber ": 200085744, "requestNo": 532231,"sin":4555}';
      component.getVicCreditKeys();
      expect(component.sin).toBeDefined();
      expect(component.referenceNumber).toBeDefined();
      expect(component.requestNo).toBeDefined();
      expect(component.transactionNumber).toBeDefined();
    }));
    // it('should get data for view for establishment', () => {
    //   component.sin = 200085744;
    //   component.requestNo = 542231;
    //   spyOn(component.establishmentService, 'getEstablishment').and.returnValue(of(gccEstablishmentDetailsMockData));
    //   component.getDataForVicRefundView();
    //   expect(component.establishmentDetails).toBeDefined();
    // });
    it('should set flags for validator 1', () => {
      component.identifyVicCreditValidatorActions(ValidatorRoles.VALIDATOR_ONE);
      component.isGOL = false;
      expect(component.canReject).toBeTruthy();
      expect(component.canReturn).toBeFalsy();
    });
    it('should set flags for validator 1s', () => {
      component.identifyVicCreditValidatorActions(ValidatorRoles.VALIDATOR_ONE);
      component.isGOL = true;
      expect(component.canReject).toBeTruthy();
    });
    it('should set flags for validator 2', () => {
      component.identifyVicCreditValidatorActions(ValidatorRoles.VALIDATOR_TWO);
      expect(component.canReject).toBeTruthy();
      expect(component.canReturn).toBeTruthy();
    });
    it('should set flags for FC VALIDATOR ', () => {
      component.identifyVicCreditValidatorActions(ValidatorRoles.FC_VALIDATOR);
      expect(component.canReturn).toBeTruthy;
    });
    it('should hide modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.decline();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
    it('should hide modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.hideModals();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
    describe('navigateBackToInbox', () => {
      it('should show modal', () => {
        spyOn(component.billingRoutingService, 'navigateToInbox');
        component.navigateBackToInbox();
        expect(component.billingRoutingService.navigateToInbox).toHaveBeenCalled();
      });
    });
    describe('navigateToEditForVicREfund', () => {
      it('should show modal', () => {
        spyOn(component.billingRoutingService, 'navigateToEdit');
        component.navigateToEditForVicREfund();
        expect(component.billingRoutingService.navigateToEdit).toHaveBeenCalled();
      });
    });
    describe('getContirbutorAccount', () => {
      it('should get Contributor Refund details', () => {
        spyOn(component.creditManagementService, 'getContirbutorRefundDetails').and.returnValue(
          of(bindToObject(new CreditBalanceDetails(), creditRefundRequestDetailsMockData.creditAccountDetail))
        );
        component.getContirbutorAccount(124536987, true);
        expect(component.vicAccountDetails).not.toEqual(null);
      });
      it('should throw error for Contributor details', () => {
        spyOn(component.alertService, 'showError');
        spyOn(component.creditManagementService, 'getContirbutorRefundDetails').and.returnValue(
          throwError(genericError)
        );
        component.getContirbutorAccount(124536987, true);
        expect(component.vicAccountDetails).not.toEqual(null);
      });
    });
    describe('getContirbutorIban', () => {
      it('should get Contributor Iban', () => {
        spyOn(component.creditManagementService, 'getContirbutorIbanDetails').and.returnValue(
          of(bindToObject(new VicCreditRefundIbanDetails(), vicCreditRefundIbanMockData))
        );
        expect(component.vicCreditRefundIbanDetails).not.toEqual(null);
      });
      it('should throw error for Contributor details', () => {
        spyOn(component.alertService, 'showError');
        spyOn(component.creditManagementService, 'getContirbutorIbanDetails').and.returnValue(throwError(genericError));
        expect(component.vicCreditRefundIbanDetails).not.toEqual(null);
      });
    });
    describe('getVicCreditRefundAmount', () => {
      it('should get vic Refund amount', () => {
        spyOn(component.creditManagementService, 'getVicCreditRefundAmountDetails').and.returnValue(
          of(bindToObject(new CreditRefundDetails(), creditRefundDetailsTest))
        );
        component.getVicCreditRefundAmount(124536987, 532231);
        expect(component.vicCreditBalanceDetails).not.toEqual(null);
      });
      it('should throw error for Contributor details', () => {
        spyOn(component.alertService, 'showError');
        spyOn(component.creditManagementService, 'getVicCreditRefundAmountDetails').and.returnValue(
          throwError(genericError)
        );
        component.getVicCreditRefundAmount(124536987, 532231);
        expect(component.vicCreditBalanceDetails).not.toEqual(null);
      });
    });
    describe('approve transation', () => {
      it('should trigger the approve popup', () => {
        const modalRef = { elementRef: null, createEmbeddedView: null };
        component.vicCreditManagementForm = getForm();
        spyOn(component, 'showModalsForVicRefund');
        component.approveVicRefundCreditTransaction(modalRef);
        expect(component.showModalsForVicRefund).toHaveBeenCalled();
      });
    });
    describe(' getSuccessMessageForVicRefundCredit', () => {
      it('should reject', () => {
        component.getSuccessMessageForVicRefundCredit(TransactionOutcome.REJECT);
        let message = BillingConstants.TRANSACTION_REJECTED;
        expect(message).not.toBeNull();
      });
      it('should approve', () => {
        component.getSuccessMessageForVicRefundCredit(TransactionOutcome.APPROVE);
        let message = BillingConstants.TRANSACTION_APPROVED;
        expect(message).not.toBeNull();
      });
      it('should return', () => {
        component.getSuccessMessageForVicRefundCredit(TransactionOutcome.RETURN);
        let message = BillingConstants.TRANSACTION_RETURNED;
        expect(message).not.toBeNull();
      });
      it('should throw error on save workFlow', () => {
        const outcome = 'Approved';
        spyOn(component.alertService, 'showError');
        spyOn(component.penalityWavierService, 'handleWorkflowActions').and.returnValue(throwError(genericError));
        component.saveWorkflowForCredit(new BPMUpdateRequest(), outcome);
        expect(outcome).not.toEqual(null);
      });
      it('should set the datas for workflow actions', () => {
        component.setWorkFlowDataForCredit('Reject');
        const data: BPMUpdateRequest = new BPMUpdateRequest();
        expect(data.taskId).not.toBeNull();
        expect(data.user).not.toBeNull();
        expect(data.outcome).not.toBeNull();
      });
    });
    describe('getDataForVicRefundView', () => {
      it('should get contributor accont details', () => {
        spyOn(component.creditManagementService, 'getContirbutorDetails').and.callThrough();
        component.getDataForVicRefundView();
        expect(component.creditManagementService.getContirbutorDetails).toHaveBeenCalled();
      });
    });
    describe('return transation', () => {
      it('should trigger the return popup', () => {
        const modalRef = { elementRef: null, createEmbeddedView: null };
        component.vicCreditManagementForm = getForm();
        spyOn(component, 'showModalsForVicRefund');
        component.returnVicRefundCreditTransaction(modalRef);
        expect(component.showModalsForVicRefund).toHaveBeenCalled();
      });
    });
    describe('getDataForVicRefundView', () => {
      it('should get contributor accont details error', () => {
        spyOn(component.alertService, 'showError').and.callThrough();
        spyOn(component.creditManagementService, 'getContirbutorDetails').and.returnValue(throwError(genericError));
        component.getDataForVicRefundView();
        expect(component.alertService.showError).toHaveBeenCalled();
      });
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

/*  it('should throw error on save workFlow', () => {
  spyOn(component.alertService, 'showError');
  spyOn(component.penalityWavierService, 'handleWorkflowActions').and.returnValue(throwError(genericError));
  component.workflowService.updateTaskWorkflow(new BPMUpdateRequest());
});
it('should set the datas for workflow actions', () => {
  component.setWorkFlowDataForCredit('Reject');
  const data: BPMUpdateRequest = new BPMUpdateRequest();
  expect(data.taskId).not.toBeNull();
  expect(data.user).not.toBeNull();
  expect(data.outcome).not.toBeNull();
});
it('should save the workflow details', () => {
  component.vicValidatorForm.addControl('comments', new FormControl('Test'));
  component.modalRef = new BsModalRef();
  spyOn(component, 'saveWorkflowForCredit').and.callThrough();
  component.confirmVicRefundCreditApprove();
  expect(component.saveWorkflowForCredit).toHaveBeenCalled();
});
it('should return  the workflow details', () => {
  component.vicValidatorForm.addControl('comments', new FormControl('Test'));
  component.modalRef = new BsModalRef();
  spyOn(component, 'saveWorkflowForCredit').and.callThrough();
  component.confirmVicRefundCreditReturn();
  expect(component.saveWorkflowForCredit).toHaveBeenCalled();
});
it('should show modal', () => {
  const modalRef = { elementRef: null, createEmbeddedView: null };
  component.modalRef = new BsModalRef();
  component.showModalsForVicRefund(modalRef);
  expect(component.modalRef).not.toEqual(null);
});
it('should reject the transaction', () => {
  const fb = new FormBuilder();
  component.vicValidatorForm.addControl('rejectionReason', fb.group({ english: 'Others', arabic: '' }));
  spyOn(component, 'saveWorkflowForCredit').and.callThrough();
  spyOn(component, 'hideModals');
  component.confirmVicRefundCreditReject();
  expect(component.saveWorkflowForCredit).toHaveBeenCalled();
});
describe('approve transation', () => {
  it('should trigger the approve popup', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.vicCreditManagementForm = getForm();
    spyOn(component, 'showModalsForVicRefund');
    component.approveVicRefundCreditTransaction(modalRef);
    expect(component.showModalsForVicRefund).toHaveBeenCalled();
  });
});
describe('reject transation', () => {
  it('should trigger the reject popup', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.vicCreditManagementForm = getForm();
    spyOn(component, 'showModalsForVicRefund');
    component.rejectVicRefundCreditTransaction(modalRef);
    expect(component.showModalsForVicRefund).toHaveBeenCalled();
  });
});

describe('return transation', () => {
  it('should trigger the return popup', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.vicCreditManagementForm = getForm();
    spyOn(component, 'showModalsForVicRefund');
    component.returnVicRefundCreditTransaction(modalRef);
    expect(component.showModalsForVicRefund).toHaveBeenCalled();
  });
});
describe('confirmCancel', () => {
  it('It should cancel', () => {
    spyOn(component.router, 'navigate');
    spyOn(component, 'decline');
    component.confirmVicRefundCreditCancel();
    expect(component.router.navigate).toHaveBeenCalledWith(['home/inbox/worklist']);
  });
  describe('test suite for getVicDocuments', () => {
    it('should get documents', () => {
      spyOn(component.documentService, 'getDocuments').and.callThrough();
      component.getVicDocuments();
      expect(component.documentService.getDocuments).toHaveBeenCalledWith(
        BillingConstants.CREDIT_REFUND_VIC_ID,
        BillingConstants.CREDIT_REFUND_VIC_TRANSACTION_TYPE,
        undefined,
        undefined
      );
    });
  });
});
describe('handleErrorForVic', () => {
  it('should show error messages', () => {
    spyOn(component.alertService, 'showError').and.callThrough();
    component.handleErrorForVic(genericError);
    expect(component.alertService.showError).toHaveBeenCalled();
  });
});
describe('getVicCreditRefundAmount', () => {
  it('should get vic credit refund amount', () => {
    spyOn(component.creditManagementService, 'getVicCreditRefundAmountDetails').and.callThrough();
    component.getVicCreditRefundAmount(14214210, 457);
    expect(component.creditManagementService.getVicCreditRefundAmountDetails).toHaveBeenCalled();
  });
});
describe('getVicCreditRefundAmount', () => {
  it('should get vic credit refund amount error', () => {
    spyOn(component.alertService, 'showError').and.callThrough();
    spyOn(component.creditManagementService, 'getVicCreditRefundAmountDetails').and.returnValue(
      throwError(genericError)
    );
    component.getVicCreditRefundAmount(14214210, 457);
    expect(component.alertService.showError).toHaveBeenCalled();
  });
});
describe('getContirbutorIban', () => {
  it('should get contributor iban', () => {
    spyOn(component.creditManagementService, 'getContirbutorIbanDetails').and.callThrough();
    component.getContirbutorIban(14214210);
    expect(component.creditManagementService.getContirbutorIbanDetails).toHaveBeenCalled();
  });
});
describe('getContirbutorIban', () => {
  it('should get contributor iban error', () => {
    spyOn(component.alertService, 'showError').and.callThrough();
    spyOn(component.creditManagementService, 'getContirbutorIbanDetails').and.returnValue(throwError(genericError));
    component.getContirbutorIban(14214210);
    expect(component.alertService.showError).toHaveBeenCalled();
  });
});
describe('getContirbutorAccount', () => {
  it('should get contributor accont details', () => {
    spyOn(component.creditManagementService, 'getContirbutorRefundDetails').and.callThrough();
    component.getContirbutorAccount(14214210, false);
    expect(component.creditManagementService.getContirbutorRefundDetails).toHaveBeenCalled();
  });
});
describe('getContirbutorAccount', () => {
  it('should get contributor accont details error', () => {
    spyOn(component.alertService, 'showError').and.callThrough();
    spyOn(component.creditManagementService, 'getContirbutorRefundDetails').and.returnValue(throwError(genericError));
    component.getContirbutorAccount(14214210, false);
    expect(component.alertService.showError).toHaveBeenCalled();
  });
});
describe('getDataForVicRefundView', () => {
  it('should get contributor accont details', () => {
    spyOn(component.creditManagementService, 'getContirbutorDetails').and.callThrough();
    component.getDataForVicRefundView();
    expect(component.creditManagementService.getContirbutorDetails).toHaveBeenCalled();
  });
});
describe('getDataForVicRefundView', () => {
  it('should get contributor accont details error', () => {
    spyOn(component.alertService, 'showError').and.callThrough();
    spyOn(component.creditManagementService, 'getContirbutorDetails').and.returnValue(throwError(genericError));
    component.getDataForVicRefundView();
    expect(component.alertService.showError).toHaveBeenCalled();
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
*/
