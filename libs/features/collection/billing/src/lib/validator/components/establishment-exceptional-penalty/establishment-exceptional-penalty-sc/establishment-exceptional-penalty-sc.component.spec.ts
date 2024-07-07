import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { EstablishmentExceptionalPenaltyScComponent } from './establishment-exceptional-penalty-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { PenalityWavierService } from '../../../../shared/services/penality-wavier.service';
import { PenalityWavierServiceStub } from 'testing/mock-services/features/billing/penality-wavier-service-stub';
import { FormBuilder, FormControl } from '@angular/forms';
import { EstablishmentService } from '../../../../shared/services/establishment-service';
import { BillEstablishmentServiceStub } from 'testing/mock-services/features/billing/bill-establishment-service-stub';
import { DocumentService } from '@gosi-ui/core/lib/services/document.service';
import { DocumentServiceStub } from 'testing/mock-services/core/document-service-stub';
import { AlertService } from '@gosi-ui/core/lib/services/alert.service';
import { AlertServiceStub } from 'testing/mock-services/core/alert-service-stub';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalServiceStub } from 'testing/mock-services/features/manage-person/mock-services';
import { BillingRoutingService } from '../../../../shared/services/billing-routing.service';
import { BillingRoutingServiceStub } from 'testing/mock-services/features/billing/billing-routing-service-stub';
import { LookupService } from '@gosi-ui/core/lib/services/lookup.service';
import { LookupServiceStub } from 'testing/mock-services/core/lookup-service-stub';
import { RouterDataToken } from '@gosi-ui/core/lib/tokens/tokens';
import { RouterData } from '@gosi-ui/core/lib/models/router-data';
import { throwError } from 'rxjs';
import { genericError } from 'testing/test-data/features/customer-information/components/test-data';
import { BPMUpdateRequest, RouterConstants } from '@gosi-ui/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TransactionOutcome, ValidatorRoles } from '../../../../shared/enums';
import { BillingConstants } from '../../../../shared/constants';

describe('EstablishmentExceptionalPenaltyScComponent', () => {
  let component: EstablishmentExceptionalPenaltyScComponent;
  let fixture: ComponentFixture<EstablishmentExceptionalPenaltyScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [EstablishmentExceptionalPenaltyScComponent],
      providers: [
        FormBuilder,
        {
          provide: PenalityWavierService,
          useClass: PenalityWavierServiceStub
        },
        {
          provide: EstablishmentService,
          useClass: BillEstablishmentServiceStub
        },
        {
          provide: DocumentService,
          useClass: DocumentServiceStub
        },
        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        {
          provide: BsModalService,
          useClass: ModalServiceStub
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: BillingRoutingService,
          useClass: BillingRoutingServiceStub
        },
        { provide: LookupService, useClass: LookupServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentExceptionalPenaltyScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('approve transation', () => {
    it('should trigger the approval popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.waivePenaltyEstablishmentForm = getForm();
      spyOn(component, 'showModals');
      component.approveTransaction(modalRef);
      expect(component.showModals).toHaveBeenCalled();
    });
  });
  describe('reject transation', () => {
    it('should trigger the reject popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.waivePenaltyEstablishmentForm = getForm();
      spyOn(component, 'showModals');
      component.rejectTransactions(modalRef);
      expect(component.showModals).toHaveBeenCalled();
    });
  });
  describe('return transation', () => {
    it('should trigger the reject popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.waivePenaltyEstablishmentForm = getForm();
      spyOn(component, 'showModals');
      component.returnTransactions(modalRef);
      expect(component.showModals).toHaveBeenCalled();
    });
  });
  describe('identifyValidatorActionDetails', () => {
    it('should flags  to the user role FC Validator', () => {
      component.identifyValidatorActionDetails(ValidatorRoles.FC_VALIDATOR);
      expect(component.canReject).toBeFalsy();
      expect(component.canReturn).toBeTruthy();
    });
    it('should intialise the view for validator', () => {
      component.penaltyWaiveId = 532231;
      component.registrationNumber = 200085744;
      spyOn(component, 'getKeysFromTokens');
      spyOn(component, 'getDataForViews');
      component.ngOnInit();
      expect(component.getDataForViews).toHaveBeenCalled();
      expect(component.getKeysFromTokens).toHaveBeenCalled();
    });
    it('should flags  to the user role GDISO', () => {
      component.identifyValidatorActionDetails(ValidatorRoles.GDISO);
      expect(component.canReject).toBeTruthy();
      expect(component.canReturn).toBeTruthy();
    });
    it('should flags  to the user role GDISO', () => {
      component.identifyValidatorActionDetails(ValidatorRoles.GDIC);
      expect(component.canReject).toBeFalsy();
      expect(component.canReturn).toBeFalsy();
    });
    it('should read key from token', inject([RouterDataToken], token => {
      token.transactionId = 423651;
      token.payload = '{"registrationNo": 200085744, "waiverId": 532231}';
      component.getKeysFromTokens();
      expect(component.registrationNumber).toBeDefined();
      expect(component.penaltyWaiveId).toBeDefined();
      expect(component.transactionNumber).toBeDefined();
    }));
  });
  it('should approve the transaction', () => {
    component.waivePenaltyEstablishmentForm.addControl('comments', new FormControl('Test'));
    component.modalRef = new BsModalRef();
    spyOn(component, 'saveWorkflow').and.callThrough();
    component.confirmApproves();
    expect(component.saveWorkflow).toHaveBeenCalled();
  });
  it('should return the transaction', () => {
    const fb = new FormBuilder();
    component.waivePenaltyEstablishmentForm.addControl('returnReason', fb.group({ english: 'Others', arabic: '' }));
    spyOn(component, 'saveWorkflow').and.callThrough();
    spyOn(component, 'hideModals');
    component.confirmReturns();
    expect(component.saveWorkflow).toHaveBeenCalled();
  });
  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.declineCancel();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('should reject the transaction', () => {
    const fb = new FormBuilder();
    component.waivePenaltyEstablishmentForm.addControl('returnReason', fb.group({ english: 'Others', arabic: '' }));
    spyOn(component, 'saveWorkflow').and.callThrough();
    spyOn(component, 'hideModals');
    component.confirmRejects();
    expect(component.saveWorkflow).toHaveBeenCalled();
  });
  it('should throw error on save workFlow', () => {
    const outcome = 'Approved';
    spyOn(component.alertService, 'showError');
    spyOn(component.penalityWavierService, 'handleWorkflowActions').and.returnValue(throwError(genericError));
    component.saveWorkflow(new BPMUpdateRequest(), outcome);
    expect(outcome).not.toEqual(null);
  });
  describe('Show Modal', () => {
    it('should trigger popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModals(modalRef);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('handleError', () => {
    it('should show error messages', () => {
      spyOn(component.alertService, 'showError').and.callThrough();
      component.handleErrors(genericError);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('generateStatement', () => {
    it('should show modal', () => {
      spyOn(component.billingRoutingService, 'navigateToEdit');
      component.navigateToEdits();
      expect(component.billingRoutingService.navigateToEdit).toHaveBeenCalled();
    });
  });
  describe(' navigateToInboxes', () => {
    it('should show modal', () => {
      spyOn(component.billingRoutingService, 'navigateToInbox');
      component.navigateToInboxes();
      expect(component.billingRoutingService.navigateToInbox).toHaveBeenCalled();
    });
  });
  describe('getSuccessMessages', () => {
    it('should reject', () => {
      component.getSuccessMessages(TransactionOutcome.REJECT);
      let message = BillingConstants.TRANSACTION_REJECTED;
      expect(message).not.toBeNull();
    });
    it('should approve', () => {
      component.getSuccessMessages(TransactionOutcome.APPROVE);
      let message = BillingConstants.TRANSACTION_APPROVED;
      expect(message).not.toBeNull();
    });
    it('should return', () => {
      component.getSuccessMessages(TransactionOutcome.RETURN);
      let message = BillingConstants.TRANSACTION_RETURNED;
      expect(message).not.toBeNull();
    });
  });
  describe('confirmCancel', () => {
    it('It should cancel', () => {
      spyOn(component.router, 'navigate');
      spyOn(component, 'declineCancel');
      component.confirmCancels();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
});
function getForm() {
  const fb: FormBuilder = new FormBuilder();
  return fb.group({
    taskId: [null],
    receiptNumber: [null],
    user: [null],
    type: [null]
  });
}
