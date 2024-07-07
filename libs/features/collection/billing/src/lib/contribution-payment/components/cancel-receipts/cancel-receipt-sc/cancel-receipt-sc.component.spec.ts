/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  BilingualText,
  bindToObject,
  DocumentItem,
  DocumentService,
  ExchangeRateService,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  BillEstablishmentServiceStub,
  BillingRoutingServiceStub,
  ContributionPaymentServiceStub,
  DocumentServiceStub,
  ExchangeRateServiceStub,
  gccEstablishmentDetailsMockData,
  genericError,
  LookupServiceStub,
  ModalServiceStub,
  WorkflowServiceStub
} from 'testing';
import { EstablishmentDetails } from '../../../../shared/models';
import { BillingRoutingService, ContributionPaymentService, EstablishmentService } from '../../../../shared/services';
import { CancelReceiptScComponent } from './cancel-receipt-sc.component';

describe('CancelReceiptScComponent', () => {
  let component: CancelReceiptScComponent;
  let fixture: ComponentFixture<CancelReceiptScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [CancelReceiptScComponent],
      providers: [
        { provide: ContributionPaymentService, useClass: ContributionPaymentServiceStub },
        { provide: EstablishmentService, useClass: BillEstablishmentServiceStub },
        { provide: ExchangeRateService, useClass: ExchangeRateServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: BillingRoutingService, useClass: BillingRoutingServiceStub },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: RouterDataToken, useValue: new RouterData() },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelReceiptScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {
    component.receiptNumber = 231;
    component.registrationNumber = 200085744;
    spyOn(component, 'setKeysForView');
    spyOn(component, 'getDataForView');
    component.ngOnInit();
    expect(component.getDataForView).toHaveBeenCalled();
  });

  it('should check for edit mode', inject([ActivatedRoute], route => {
    route.url = of([{ path: 'cancel-establishment-payment' }, { path: 'edit' }]);
    component.checkEditMode();
    expect(component.isEditMode).toBeTruthy();
  }));

  it('should read keys from token in edit mode', inject([RouterDataToken], token => {
    token.taskId = 'asdasdasd';
    token.payload = '{"registrationNo": 200085744, "parentReceiptNo": 231}';
    component.isEditMode = true;
    component.setKeysForView();
    expect(component.receiptNumber).toBeDefined();
    expect(component.registrationNumber).toBeDefined();
  }));

  it('should get data for view for non gcc establishment', () => {
    component.registrationNumber = 200085744;
    component.receiptNumber = 231;
    component.getDataForView();
    expect(component.receipt).toBeDefined();
    expect(component.establishment).toBeDefined();
  });

  it('should get data for view for gcc establishment', () => {
    component.registrationNumber = 200085744;
    component.receiptNumber = 231;
    component.isEditMode = true;
    spyOn(component.establishmentService, 'getEstablishment').and.returnValue(
      of(bindToObject(new EstablishmentDetails(), gccEstablishmentDetailsMockData))
    );
    component.getDataForView();
    expect(component.registrationNumber).not.toEqual(null);
    expect(component.receiptNumber).not.toEqual(null);
  });

  it('should throw error on getting data for view', () => {
    component.registrationNumber = 200085744;
    component.receiptNumber = 231;
    spyOn(component.establishmentService, 'getEstablishment').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.getDataForView();
    expect(component.showError).toHaveBeenCalled();
  });
  it('should get data for view', () => {
    component.registrationNumber = 200085744;
    component.receiptNumber = 231;
    component.searchFlag = true;
    spyOn(component.contributionPaymentService, 'getReceiptDetails').and.callThrough();
    component.getDataForView();
    expect(component.contributionPaymentService.getReceiptDetails).toHaveBeenCalled();
  });

  it('should throw error on refersh documents', () => {
    spyOn(component.documentService, 'refreshDocument').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.refreshDocument(new DocumentItem());
    expect(component.showError).toHaveBeenCalled();
  });

  xit('should cancel the receipt for csr', () => {
    component.receiptDetailsForm.get('receiptNo').setValue(231);
    component.receiptDetailsForm.get('reasonForCancellation.english').setValue('Other');
    component.receiptDetailsForm.get('comments').setValue('Test');
    spyOn(component, 'checkValidity').and.returnValue(true);
    spyOn(component, 'handleTransactionSuccess').and.callThrough();
    spyOn(component, 'navigateBack');
    component.cancelReceipt();
    expect(component.handleTransactionSuccess).toHaveBeenCalled();
  });

  xit('should cancel the receipt for edit mode', () => {
    component.receiptDetailsForm.get('receiptNo').setValue(231);
    component.receiptDetailsForm.get('reasonForCancellation.english').setValue('Other');
    component.receiptDetailsForm.get('comments').setValue('Test');
    component.isEditMode = true;
    spyOn(component, 'checkValidity').and.returnValue(true);
    spyOn(component, 'handleTransactionSuccess');
    spyOn(component, 'navigateBack');
    component.cancelReceipt();
    expect(component.handleTransactionSuccess).toHaveBeenCalled();
  });

  it('should thorw error on cancel receipt', () => {
    component.receiptDetailsForm.get('receiptNo').setValue(231);
    component.receiptDetailsForm.get('reasonForCancellation.english').setValue('');
    component.receiptDetailsForm.get('comments').setValue('Test');
    spyOn(component, 'checkValidity').and.returnValue(true);
    component.isEditMode = true;
    spyOn(component.contributionPaymentService, 'cancelPayment').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.cancelReceipt();
    expect(component.showError).toHaveBeenCalled();
  });
  it('should getPenaltyIndicator', () => {
    const indicator = { english: 'yes', arabic: '' };
    component.receiptDetailsForm.get('penaltyIndicator')?.setValue(indicator);
    component.getPenaltyIndicator(indicator);
    expect(component.cancelReceiptPayload.penaltyIndicator).toBe(indicator);
  });
  it('should throw mandatory feild error', () => {
    const flag = component.checkValidity();
    expect(flag).toBeFalsy();
  });

  it('should throw mandatory document error', () => {
    spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
    component.receiptDetailsForm.get('receiptNo').setValue(231);
    component.receiptDetailsForm.get('reasonForCancellation.english').setValue('Other');
    component.receiptDetailsForm.get('comments').setValue('Test');
    const flag = component.checkValidity();
    expect(flag).toBeFalsy();
  });

  it('should navigate back to inbox', () => {
    component.isEditMode = true;
    spyOn(component.routingService, 'navigateToInbox');
    component.navigateBack(true);
    expect(component.routingService.navigateToInbox).toHaveBeenCalled();
  });

  it('should navigate back to validator', () => {
    component.isEditMode = true;
    spyOn(component.routingService, 'navigateToValidator');
    component.navigateBack(false);
    expect(component.routingService.navigateToValidator).toHaveBeenCalled();
  });

  it('should navigate back to receipt screen', () => {
    component.isEditMode = false;
    component.modalRef = new BsModalRef();
    spyOn(component.routingService, 'navigateToReceipt');
    component.navigateBack(undefined);
    expect(component.routingService.navigateToReceipt).toHaveBeenCalled();
  });

  it('should show modal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.showModal(modalRef, 'lg');
    expect(component.modalRef).not.toEqual(null);
  });

  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.hideModal();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('should cancel the receipt for edit mode', () => {
    component.searchReceiptNo(5241);
    component.receiptNumber = 5241;
    component.registrationNumber = 521345678;
    component.searchFlag = true;
    expect(component.receipt).not.toEqual(null);
  });
  it('otherValueSelect', () => {
    const otherfIeld = {
      value: {
        english: 'Other',
        arabic: 'jjj'
      }
    };
    otherfIeld.value.english === 'Other';
    expect(component.otherReasonFlag).toBeFalsy();
  });
  // describe('submit the transaction', () => {
  it('should successfully complete the transaction and show the success message', () => {
    const message: BilingualText = { english: '', arabic: '' };
    spyOn(component.alertService, 'showSuccess');
    component.handleTransactionSuccess(message, true);
    expect(component.alertService.showSuccess).toHaveBeenCalled();
  });
});
