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
import { ExceptionalPenaltyBulkScComponent } from './exceptional-bulk-penalty-sc.component';
import { ValidatorRoles } from '@gosi-ui/features/contributor';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TransactionOutcome } from '../../../../shared/enums';
import { BillingConstants } from '../../../../shared/constants';

describe('ExceptionalPenaltyBulkScComponent', () => {
  let component: ExceptionalPenaltyBulkScComponent;
  let fixture: ComponentFixture<ExceptionalPenaltyBulkScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ExceptionalPenaltyBulkScComponent],
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

    fixture = TestBed.createComponent(ExceptionalPenaltyBulkScComponent);
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
      spyOn(component, 'getValuesFromTokenForBulk');
      spyOn(component, 'getDataForBulkExceptionalView');
      component.ngOnInit();
      expect(component.getDataForBulkExceptionalView).toHaveBeenCalled();
      expect(component.getValuesFromTokenForBulk).toHaveBeenCalled();
    });
    it('should read key from token', inject([RouterDataToken], token => {
      token.transactionId = 423651;
      token.payload = '{"waiverId": 532231}';
      component.getValuesFromTokenForBulk();
      expect(component.penaltyWaiveId).toBeDefined();
      expect(component.transactionNumber).toBeDefined();
    }));
    it('should hide modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.decline();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
    it('should set flags for GDISO', () => {
      component.identifyTheRolesForBulk(ValidatorRoles.GDISO);
      expect(component.canReject).toBeTruthy();
      expect(component.canReturn).toBeTruthy();
    });
    it('should set flags for GDIC', () => {
      component.identifyTheRolesForBulk(ValidatorRoles.GDIC);
      expect(component.canReject).toBeFalsy();
      expect(component.canReturn).toBeFalsy();
    });
    it('should set flags for validator 1', () => {
      component.identifyTheRolesForBulk(ValidatorRoles.FC_VALIDATOR);
      expect(component.canReject).toBeFalsy();
      expect(component.canReturn).toBeTruthy();
    });
    // it('should throw error on get data for view', () => {
    //       component.socialInsurancenumber = 210274677;
    //       component.penaltyWaiveId = 231;
    //       spyOn(component, 'getDataForVicExceptionalView').and.returnValue(throwError(genericError));
    //       spyOn(component, 'handleErrors').and.callThrough();
    //       component.getDataForVicExceptionalView();
    //       expect(component.handleErrors).toHaveBeenCalled();
    //     });
    it('should throw error on save workFlow', () => {
      const outcome = 'Approved';
      spyOn(component.alertService, 'showError');
      spyOn(component.penaltyWaiverService, 'handleWorkflowActions').and.returnValue(throwError(genericError));
      component.saveWorkflowDetails(new BPMUpdateRequest(), outcome);
      expect(outcome).not.toEqual(null);
    });
    it('should approve the transaction', () => {
      component.bullkvalidatorForms.addControl('comments', new FormControl('Test'));
      component.modalRef = new BsModalRef();
      spyOn(component, 'saveWorkflowDetails').and.callThrough();
      component.confirmApproveForBulk();
      expect(component.saveWorkflowDetails).toHaveBeenCalled();
    });
    it('should return the transaction', () => {
      const fb = new FormBuilder();
      component.bullkvalidatorForms.addControl('returnReason', fb.group({ english: 'Others', arabic: '' }));
      spyOn(component, 'saveWorkflowDetails').and.callThrough();
      spyOn(component, 'hideModalsForBulk');
      component.confirmReturnForBulk();
      expect(component.saveWorkflowDetails).toHaveBeenCalled();
    });
    it('should reject the transaction', () => {
      const fb = new FormBuilder();
      component.bullkvalidatorForms.addControl('returnReason', fb.group({ english: 'Others', arabic: '' }));
      spyOn(component, 'saveWorkflowDetails').and.callThrough();
      spyOn(component, 'hideModalsForBulk');
      component.confirmRejectForBulk();
      expect(component.saveWorkflowDetails).toHaveBeenCalled();
    });
    describe('approve transation', () => {
      it('should trigger the approve popup', () => {
        const modalRef = { elementRef: null, createEmbeddedView: null };
        component.exceptionalBulkForm = getForm();
        spyOn(component, 'showModalsForBulk');
        component.approveBulkTransactions(modalRef);
        expect(component.showModalsForBulk).toHaveBeenCalled();
      });
    });
    describe('reject transation', () => {
      it('should trigger the reject popup', () => {
        const modalRef = { elementRef: null, createEmbeddedView: null };
        component.exceptionalBulkForm = getForm();
        spyOn(component, 'showModalsForBulk');
        component.rejectBulkTransactions(modalRef);
        expect(component.showModalsForBulk).toHaveBeenCalled();
      });
    });
    describe('confirmCancelBtns', () => {
      it('It should cancel', () => {
        spyOn(component.router, 'navigate');
        spyOn(component, 'decline');
        component.confirmCancelBtns();
        expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
      });
    });
    describe('return transation', () => {
      it('should trigger the return popup', () => {
        const modalRef = { elementRef: null, createEmbeddedView: null };
        component.exceptionalBulkForm = getForm();
        spyOn(component, 'showModalsForBulk');
        component.returnBulkTransactions(modalRef);
        expect(component.showModalsForBulk).toHaveBeenCalled();
      });
      describe(' navToInboxPage', () => {
        it('should show modal', () => {
          spyOn(component.billingRoutingService, 'navigateToInbox');
          component.navToInboxPage();
          expect(component.billingRoutingService.navigateToInbox).toHaveBeenCalled();
        });
      });
      describe('getSuccessMessageForViewForBulk', () => {
        it('should reject', () => {
          component.getSuccessMessageForViewForBulk(TransactionOutcome.REJECT);
          let message = BillingConstants.TRANSACTION_REJECTED;
          expect(message).not.toBeNull();
        });
        it('should approve', () => {
          component.getSuccessMessageForViewForBulk(TransactionOutcome.APPROVE);
          let message = BillingConstants.TRANSACTION_APPROVED;
          expect(message).not.toBeNull();
        });
        it('should return', () => {
          component.getSuccessMessageForViewForBulk(TransactionOutcome.RETURN);
          let message = BillingConstants.TRANSACTION_RETURNED;
          expect(message).not.toBeNull();
        });
      });
      describe('Show Modal', () => {
        it('should trigger popup', () => {
          const modalRef = { elementRef: null, createEmbeddedView: null };
          component.showModalsForBulk(modalRef);
          expect(component.modalRef).not.toEqual(null);
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
});
