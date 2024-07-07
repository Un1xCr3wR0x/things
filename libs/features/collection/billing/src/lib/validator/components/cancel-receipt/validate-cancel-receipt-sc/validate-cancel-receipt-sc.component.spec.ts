/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  bindToObject,
  BPMUpdateRequest,
  DocumentService,
  Establishment,
  ExchangeRateService,
  LookupService,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { ValidatorRoles } from '@gosi-ui/features/contributor';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  BilingualTextPipeMock,
  BillEstablishmentServiceStub,
  BillingRoutingServiceStub,
  ContributionPaymentServiceStub,
  DocumentServiceStub,
  establishmentTestData,
  ExchangeRateServiceStub,
  gccEstablishmentDetailsMockData,
  genericError,
  LookupServiceStub,
  ModalServiceStub
} from 'testing';
import { BillingRoutingService, ContributionPaymentService, EstablishmentService } from '../../../../shared/services';
import { ValidateCancelReceiptScComponent } from './validate-cancel-receipt-sc.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TransactionOutcome } from '../../../../shared/enums';
import { BillingConstants } from '../../../../shared/constants';
import { EstablishmentDetails } from '../../../../shared/models';

describe('ValidateCancelReceiptScComponent', () => {
  let component: ValidateCancelReceiptScComponent;
  let fixture: ComponentFixture<ValidateCancelReceiptScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ValidateCancelReceiptScComponent],
      providers: [
        { provide: EstablishmentService, useClass: BillEstablishmentServiceStub },
        { provide: ContributionPaymentService, useClass: ContributionPaymentServiceStub },
        { provide: ExchangeRateService, useClass: ExchangeRateServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: BillingRoutingService, useClass: BillingRoutingServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateCancelReceiptScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {
    component.receiptNumber = 231;
    component.registrationNumber = 200085744;
    spyOn(component, 'getDataForView');
    component.ngOnInit();
    expect(component.getDataForView).toHaveBeenCalled();
  });

  it('should read key from token', inject([RouterDataToken], token => {
    token.transactionId = 423651;
    token.payload = '{"registrationNo": 200085744, "parentReceiptNo": 231}';
    component.getKeysFromToken();
    expect(component.registrationNumber).toBeDefined();
    expect(component.receiptNumber).toBeDefined();
  }));

  it('should set flags for validator 1', () => {
    component.identifyValidatorActions(ValidatorRoles.VALIDATOR_ONE);
    expect(component.canReject).toBeTruthy();
    expect(component.canReturn).toBeFalsy();
  });

  it('should set flags for validator 2', () => {
    component.identifyValidatorActions(ValidatorRoles.VALIDATOR_TWO);
    expect(component.canReject).toBeTruthy();
    expect(component.canReturn).toBeTruthy();
  });

  it('should get data for view for non gcc establishment', () => {
    component.registrationNumber = 200085744;
    component.receiptNumber = 231;
    component.getDataForView();
    expect(component.establishment).not.toEqual(null);
    spyOn(component.alertService, 'showErrorByKey');
  });

  it('should get data for view for gcc establishment', () => {
    component.registrationNumber = 200085744;
    component.receiptNumber = 231;
    spyOn(component.establishmentService, 'getEstablishment').and.returnValue(
      of(bindToObject(new EstablishmentDetails(), gccEstablishmentDetailsMockData))
    );
    component.getDataForView();
    expect(component.establishment).not.toEqual(null);
    spyOn(component.alertService, 'showError');
  });

  it('should throw error on get data for view', () => {
    component.registrationNumber = 200085744;
    component.receiptNumber = 231;
    spyOn(component.contributionPaymentService, 'getReceiptDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'handleError').and.callThrough();
    component.getDataForView();
    expect(component.handleError).toHaveBeenCalled();
  });

  it('should approve the transaction', () => {
    component.validatorForm.addControl('comments', new FormControl('Test'));
    component.modalRef = new BsModalRef();
    spyOn(component, 'saveWorkflow').and.callThrough();
    component.confirmApprove();
    expect(component.saveWorkflow).toHaveBeenCalled();
  });

  it('should reject the transaction', () => {
    const fb = new FormBuilder();
    component.validatorForm.addControl('rejectionReason', fb.group({ english: 'Others', arabic: '' }));
    spyOn(component, 'saveWorkflow').and.callThrough();
    spyOn(component, 'hideModal');
    component.confirmReject();
    expect(component.saveWorkflow).toHaveBeenCalled();
  });

  it('should return the transaction', () => {
    const fb = new FormBuilder();
    component.validatorForm.addControl('returnReason', fb.group({ english: 'Others', arabic: '' }));
    spyOn(component, 'saveWorkflow').and.callThrough();
    spyOn(component, 'hideModal');
    component.confirmReturn();
    expect(component.saveWorkflow).toHaveBeenCalled();
  });

  it('should throw error on save workFlow', () => {
    const outcome = 'Approved';
    spyOn(component.alertService, 'showError');
    spyOn(component.contributionPaymentService, 'handleWorkflowActions').and.returnValue(throwError(genericError));
    component.saveWorkflow(new BPMUpdateRequest(), outcome);
    expect(outcome).not.toEqual(null);
  });

  it('should show modal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    spyOn(component.modalService, 'show');
    component.showModal(modalRef);
    expect(component.modalService.show).toHaveBeenCalled();
  });

  it('should navigate to edit', () => {
    spyOn(component.routingService, 'navigateToEdit');
    component.navigateToEditScreen();
    expect(component.routingService.navigateToEdit).toHaveBeenCalled();
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
});
