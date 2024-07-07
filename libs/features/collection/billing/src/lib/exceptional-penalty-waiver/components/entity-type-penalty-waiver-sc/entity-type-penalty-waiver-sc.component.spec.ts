/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import {
  AlertServiceStub,
  DocumentServiceStub,
  eventDateDetailsMockData,
  EventDateServiceStub,
  genericError,
  ModalServiceStub,
  PenalityWavierServiceStub,
  PenaltyWaiverForm,
  penaltyWaiveCommentsFormData,
  vicPenalityWavierFormData,
  PenaltyWaiverRequestMockData
} from 'testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  AlertService,
  LanguageToken,
  ApplicationTypeToken,
  DocumentService,
  DocumentItem,
  RouterDataToken,
  RouterData,
  BilingualText,
  Alert,
  bindToForm
} from '@gosi-ui/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BillingConstants } from '../../../shared/constants';
import { EntityTypePenaltyWaiverScComponent } from '..';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup } from '@angular/forms';
import { EventDateService, PenalityWavierService } from '../../../shared/services';
import { ActivatedRoute } from '@angular/router';

describe('EntityTypePenaltyWaiverScComponent', () => {
  let component: EntityTypePenaltyWaiverScComponent;
  let fixture: ComponentFixture<EntityTypePenaltyWaiverScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [EntityTypePenaltyWaiverScComponent],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },

        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: EventDateService,
          useClass: EventDateServiceStub
        },
        { provide: PenalityWavierService, useClass: PenalityWavierServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityTypePenaltyWaiverScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should initialise the components', inject([RouterDataToken], token => {
      token.taskId = 'asdasdasd';
      token.payload = '{"penaltyWaiveId": 200085744, "reqNo": 231, "referenceNumber ": 231}';
      component.inWorkflow = true;
      component.routerDataToken.payload = true;
      component.referenceNumber = 200085744;
      component.penaltyWaiveId = 231;
      component.ngOnInit();
      expect(component.referenceNumber).toBeDefined();
      expect(component.penaltyWaiveId).toBeDefined();
      expect(component.lang).not.toEqual(null);
    }));
  });
  describe('identify mode of txn', () => {
    it('should check for edit mode in est refund', inject([ActivatedRoute], route => {
      route.url = of([{ path: 'cancel-establishment-payment' }, { path: 'edit' }]);
      component.modeOfTransaction();
      expect(component.inWorkflow).toBeTruthy();
    }));
  });
  describe('test suite for getDocuments', () => {
    it('should get documents', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      component.getRequiredDocumentForVic();

      expect(component.documentService.getRequiredDocuments).toHaveBeenCalledWith(
        BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
        BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE
      );
    });
  });
  describe('getVicPenaltyWaiverDetails', () => {
    it('should get vic penalty waiver details', () => {
      expect(component.wavierDetails).not.toEqual(null);
    });
    it('should throw error on refersh documents', () => {
      spyOn(component.documentService, 'refreshDocument').and.returnValue(throwError(genericError));
      spyOn(component, 'showError');
      component.refreshDocumentsForAllSegment(new DocumentItem());
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('getWaiverAmount', () => {
    it('should get waive amount', () => {
      component.getWaiverAmount('05-Sep-2020');
      expect(component.getRequiredDocumentForVic).not.toEqual(null);
    });
  });
  describe('passEligiblePenaltyAmount', () => {
    it('should get the amount', () => {
      component.passEligiblePenaltyAmount(5000);
      expect(component.eligibleWaiveOffAmount).not.toEqual(null);
    });

    it('should get the exception values', () => {
      component.getExtensionValues(52655);
      component.exceptionReason = '4444';
      component.extendedGracePeriod = 4444;
      expect(component.exceptionReason).toBeTruthy();
      expect(component.extendedGracePeriod).toBeTruthy();
    });
  });
  describe('handleWorkflowActions', () => {
    it('should handleWorkflowActions', () => {
      spyOn(component.workflowService, 'updateTaskWorkflow').and.callThrough();
      spyOn(component.routingService, 'navigateToInbox').and.callThrough();
      component.handleWorkflowActions();
      expect(component.workflowService.updateTaskWorkflow).toHaveBeenCalled();
    });
  });
  describe('showErrorMessage', () => {
    it('Should call showErrorMessage', () => {
      spyOn(component.alertService, 'showError');
      component.showError({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('navigateBack', () => {
    it('Should navigate to home', () => {
      spyOn(component.router, 'navigate');
      component.navigateBack();
      expect(component.router.navigate).toHaveBeenCalledWith([BillingConstants.EXCEPTIONAL_HOME]);
    });
  });
  describe('navigateBackToHome', () => {
    it('Should navigate to home', () => {
      spyOn(component.router, 'navigate');
      spyOn(component, 'hideModal');
      component.navigateBackToHome();
      expect(component.hideModal).toHaveBeenCalled();
      expect(component.router.navigate).toHaveBeenCalledWith([BillingConstants.EXCEPTIONAL_HOME]);
    });
  });
  describe('showModal', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef, 'lg');
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('hideModal', () => {
    it('Should hide modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.hideModal();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
  describe('checkDocumentValidity', () => {
    it('should check validity', () => {
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      expect(component.checkDocumentValidity(new FormGroup({}))).toBeTruthy();
    });
  });
  describe('checkDocumentValidity', () => {
    it('should check validity', () => {
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
      expect(component.checkDocumentValidity(new FormGroup({}))).toBeFalsy();
    });
  });
  describe('newEventDateList', () => {
    it('should check validity', () => {
      let date = ['2020-01-01', '2019-01-01'];
      component.newEventDateList(date);
      expect(component.newEventDateDetails).not.toBeNull();
    });
  });

  describe('handleErrors', () => {
    it('should show error messages', () => {
      spyOn(component.alertService, 'showError');
      component.handleErrors(genericError);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('getBulkDocuments', () => {
    it('should get documents', () => {
      component.penaltyWaiveId = 1234;
      component.referenceNumber = 1234;
      spyOn(component.documentService, 'getDocuments').and.callThrough();
      component.getBulkDocuments();
      expect(component.documentService.getDocuments).toHaveBeenCalledWith(
        BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
        BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE,
        component.penaltyWaiveId,
        component.referenceNumber
      );
    });
  });

  describe('getDataForBulkExceptionalView', () => {
    it('should get required data to view transaction.', () => {
      component.penaltyWaiveId = 1234;
      spyOn(component.penaltyWaiverService, 'getExceptionalBulkDetails').and.callThrough();
      component.getDataForBulkExceptionalView();
      expect(component.penaltyWaiverService.getExceptionalBulkDetails).toHaveBeenCalledWith(component.penaltyWaiveId);
    });
  });
  describe('getDataForBulkExceptionalView', () => {
    it('should get required data to view transaction.', () => {
      component.penaltyWaiveId = 1234;
      spyOn(component, 'handleErrors');
      spyOn(component.penaltyWaiverService, 'getExceptionalBulkDetails').and.returnValue(throwError(genericError));
      component.getDataForBulkExceptionalView();
      expect(component.handleErrors).toHaveBeenCalled();
    });
  });
  describe('getBulkPenaltyWaiverAllEntityDetails', () => {
    it('should get  bulk penalty waiver details.', () => {
      component.entitySegmentAll = 'All';
      component.entity = 'test';
      spyOn(component, 'handleErrors');
      spyOn(component.penaltyWavierService, 'getBulkPenaltyWaiverQuoteForAll').and.returnValue(
        of({ establishmentCount: 213, vicCount: 23 })
      );
      component.getBulkPenaltyWaiverAllEntityDetails();
      expect(component.penaltyWaiverService.getBulkPenaltyWaiverQuoteForAll).toHaveBeenCalledWith(
        component.entitySegmentAll,
        component.entity
      );
    });
  });

  describe('onMonthRangeChange', () => {
    it('should get  month details for the period selected.', () => {
      spyOn(component.eventService, 'getEventDetailsByDate').and.returnValue(of(eventDateDetailsMockData));
      component.onMonthRangeChange(['2020-01-01', '2020-010-01']);
      expect(component.eventService.getEventDetailsByDate).toHaveBeenCalled();
    });
  });
  describe('test suite for submitPaymentDetails ', () => {
    it('It should submit the payment details', () => {
      const form = new PenaltyWaiverForm();
      const wavierDetailForm = form.commentForm();
      const percentageForm = form.createWaivePeriodForm();
      bindToForm(wavierDetailForm, penaltyWaiveCommentsFormData);
      bindToForm(percentageForm, vicPenalityWavierFormData);
      component.exceptionalPenalityMainForm.addControl('waiveOffEligible', percentageForm);
      component.exceptionalPenalityMainForm.addControl('wavierDetailForm', wavierDetailForm);
      component.wavierDetailsReq = PenaltyWaiverRequestMockData;
      spyOn(component.router, 'navigate');
      component.onSubmitEntityPenalityDetails();
      expect(component.successMessage).not.toBeNull();
    });
  });

  describe('onInitialVicPenaltyDetailsLoad', () => {
    it('should load intial details', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      component.onInitialVicPenaltyDetailsLoad();
      expect(component.documentService.getRequiredDocuments).toHaveBeenCalledWith(
        BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
        BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE
      );
    });
  });
});
