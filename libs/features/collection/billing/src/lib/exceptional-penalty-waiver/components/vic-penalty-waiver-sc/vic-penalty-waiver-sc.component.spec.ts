/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Alert,
  AlertService,
  ApplicationTypeToken,
  BilingualText,
  bindToForm,
  bindToObject,
  DocumentItem,
  DocumentService,
  LanguageToken,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionReferenceData
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  BillingRoutingServiceStub,
  DocumentServiceStub,
  genericError,
  ModalServiceStub,
  PenalityWavierServiceStub,
  penaltyWaiveCommentsFormData,
  PenaltyWaiverForm,
  PenaltyWaiverRequestMockData,
  vicPenalityWavierFormData
} from 'testing';
import { BillingConstants } from '../../../shared/constants';
import { PenalityWavier, PenaltyWaiverSegmentRequest, SelectedCriteriaValues } from '../../../shared/models';
import { BillingRoutingService } from '../../../shared/services/billing-routing.service';
import { PenalityWavierService } from '../../../shared/services/penality-wavier.service';
import { VicPenaltyWaiverScComponent } from './vic-penalty-waiver-sc.component';

describe('VicPenaltyWaiverScComponent', () => {
  let component: VicPenaltyWaiverScComponent;
  let fixture: ComponentFixture<VicPenaltyWaiverScComponent>;
  const payloadData = {
    waiverId: 1001,
    referenceNo: 100,
    id: 125,
    sin: 110000103,
    assignedRole: 'Validator 1',
    resource: RouterConstants.TRANSACTION_VIC_EXCEPTIONAL_ESTABLISHMENT_PENALTY
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [VicPenaltyWaiverScComponent],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: PenalityWavierService, useClass: PenalityWavierServiceStub },
        {
          provide: RouterDataToken,
          useValue: {
            ...bindToObject(new RouterData(), { comments: [new TransactionReferenceData()] }),
            payload: JSON.stringify(payloadData)
          }
        },
        { provide: BillingRoutingService, useClass: BillingRoutingServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VicPenaltyWaiverScComponent);
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
    it('should initialize the component', () => {
      component.ngOnInit();
      component.isAppPrivate = true;
      expect(component.lang).not.toEqual(null);
    });
    it('should initialize the component', () => {
      component.ngOnInit();
      component.isAppPrivate = true;
      component.isEditFlag = true;
      expect(component.lang).not.toEqual(null);
    });
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
  describe('test suite for getDocumentsOnValidatorEdit', () => {
    it('should getDocumentsOnValidatorEdit', () => {
      component.getDocumentsOnValidatorEdit();
      expect(component.documents).not.toEqual(null);
    });
  });
  describe('handleWorkflow', () => {
    it('should handleWorkflow', () => {
      spyOn(component.workflowService, 'updateTaskWorkflow').and.callThrough();
      component.handleWorkflow();
      expect(component.workflowService.updateTaskWorkflow).toHaveBeenCalled();
    });
    it('should throw error for handleWorkflow', () => {
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.handleWorkflow();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('getVicPenaltyWaiverDetails', () => {
    it('should get vic penalty waiver details', () => {
      component.getVicPenaltyWaiverDetails();
      expect(component.wavierDetails).not.toEqual(null);
    });
    it('should throw error on refersh documents', () => {
      spyOn(component.documentService, 'refreshDocument').and.returnValue(throwError(genericError));
      spyOn(component, 'showError').and.callThrough();
      component.refreshDocumentsForVic(new DocumentItem());
      expect(component.showError).toHaveBeenCalled();
    });
    it('should throw error on refersh documents', () => {
      spyOn(component.documentService, 'refreshDocument').and.returnValue(throwError(genericError));
      spyOn(component, 'showError');
      component.refreshDocumentsForVic(new DocumentItem());
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('getWaiverAmount', () => {
    const period = [new Date('05-Sep-2020'), new Date('05-Oct-2020')];
    it('should get waive amount', () => {
      spyOn(component, 'getVicPenaltyWaiverDetails');
      component.searchOption = 'SIN';
      component.getWaiverAmount(period);
      expect(component.fromDate).not.toEqual(null);
      expect(component.toDate).not.toEqual(null);
      expect(component.getVicPenaltyWaiverDetails).toHaveBeenCalled();
    });
  });

  describe('document scan', () => {
    it('should throw error on refersh documents', () => {
      spyOn(component.documentService, 'refreshDocument').and.returnValue(throwError(genericError));
      spyOn(component, 'showError');
      component.refreshDocumentsForVic(new DocumentItem());
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('passEligiblePenaltyAmount', () => {
    it('should get the amount', () => {
      component.passEligiblePenaltyAmount(5000);
      expect(component.eligibleWaiveOffAmount).not.toEqual(null);
    });
    it('should get payment value', () => {
      component.getPaymentValue(52655);
      component.paymentRequired = true;
      expect(component.paymentRequired).toBeTruthy();
    });
    it('should get the exception values', () => {
      component.getExtensionValues(52655);
      component.exceptionReason = '4444';
      component.extendedGracePeriod = 4444;
      expect(component.exceptionReason).toBeTruthy();
      expect(component.extendedGracePeriod).toBeTruthy();
    });
    it('should get onInitialVicPenaltyDetailsLoad', () => {
      spyOn(component, 'getVicPenaltyWaiverDetails').and.callThrough();
      spyOn(component.router, 'navigate');
      spyOn(component, 'getRequiredDocumentForVic').and.callThrough();
      component.wavierDetails.contributorNumber = undefined;
      component.wavierDetails.contributorNumber = null;
      component.onInitialVicPenaltyDetailsLoad();
      expect(component.wavierDetails).not.toEqual(null);
    });
  });
  xdescribe('test suite for submitPaymentDetails ', () => {
    it('It should submit the payment details', () => {
      const form = new PenaltyWaiverForm();
      const wavierDetailForm = form.commentForm();
      const percentageForm = form.createWaivePeriodForm();
      bindToForm(wavierDetailForm, penaltyWaiveCommentsFormData);
      bindToForm(percentageForm, vicPenalityWavierFormData);
      component.exceptionalPenalityMainForm.addControl('percentageForm', percentageForm);
      component.exceptionalPenalityMainForm.addControl('wavierDetailForm', wavierDetailForm);
      component.searchOption = 'SIN';
      component.isEditFlag = false;
      component.wavierDetailsRequest = PenaltyWaiverRequestMockData;
      spyOn(component.paymentResponses, 'fromJsonToObject');
      spyOn(component.router, 'navigate');
      component.onSubmitVicPenalityDetails();
      expect(component.successMessage).not.toBeNull();
    });
    it('It should submit the payment details', () => {
      const form = new PenaltyWaiverForm();
      const wavierDetailForm = form.commentForm();
      const percentageForm = form.createWaivePeriodForm();
      bindToForm(wavierDetailForm, penaltyWaiveCommentsFormData);
      bindToForm(percentageForm, vicPenalityWavierFormData);
      component.exceptionalPenalityMainForm.addControl('percentageForm', percentageForm);
      component.exceptionalPenalityMainForm.addControl('wavierDetailForm', wavierDetailForm);
      component.searchOption = 'SIN';
      component.isEditFlag = true;
      component.wavierDetailsRequest = PenaltyWaiverRequestMockData;
      spyOn(component.paymentResponses, 'fromJsonToObject');
      spyOn(component.router, 'navigate');
      component.onSubmitVicPenalityDetails();
      expect(component.successMessage).not.toBeNull();
    });
    it('It should submit the payment details for search param other than sin', () => {
      const form = new PenaltyWaiverForm();
      const wavierDetailForm = form.commentForm();
      const percentageForm = form.createWaivePeriodForm();
      bindToForm(wavierDetailForm, penaltyWaiveCommentsFormData);
      bindToForm(percentageForm, vicPenalityWavierFormData);
      component.exceptionalPenalityMainForm.addControl('percentageForm', percentageForm);
      component.exceptionalPenalityMainForm.addControl('wavierDetailForm', wavierDetailForm);
      component.searchOption !== 'SIN';
      component.isEditFlag = false;
      component.wavierDetailsRequest = PenaltyWaiverRequestMockData;
      spyOn(component.paymentResponses, 'fromJsonToObject');
      spyOn(component.router, 'navigate');
      component.onSubmitVicPenalityDetails();
      expect(component.successMessage).not.toBeNull();
    });
    it('It should submit the payment details for search param other than sin', () => {
      const form = new PenaltyWaiverForm();
      const wavierDetailForm = form.commentForm();
      const percentageForm = form.createWaivePeriodForm();
      bindToForm(wavierDetailForm, penaltyWaiveCommentsFormData);
      bindToForm(percentageForm, vicPenalityWavierFormData);
      component.exceptionalPenalityMainForm.addControl('percentageForm', percentageForm);
      component.exceptionalPenalityMainForm.addControl('wavierDetailForm', wavierDetailForm);
      component.searchOption !== 'SIN';
      component.isEditFlag = true;
      component.wavierDetailsRequest = PenaltyWaiverRequestMockData;
      spyOn(component.paymentResponses, 'fromJsonToObject');
      spyOn(component.router, 'navigate');
      component.onSubmitVicPenalityDetails();
      expect(component.successMessage).not.toBeNull();
    });
  });
  describe('getVicSegmentEditDetails', () => {
    it('should check screen is opened properly in edit mode', inject(
      [ActivatedRoute, RouterDataToken],
      (route: ActivatedRoute, token: RouterData) => {
        route.queryParams = of({ mof: 'true' });
        token.taskId = 'wkne';
        token.payload = '{}';
        spyOn(component, 'getDataForBulkExceptionalVicEdit');
        component.getVicSegmentEditDetails();
        expect(component.getDataForBulkExceptionalVicEdit).toHaveBeenCalled();
      }
    ));
  });
  describe('showModal', () => {
    it('should show modal popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      spyOn(component.router, 'navigate');
      component.showModal(modalRef, 'lg');
      expect(component.modalRef).not.toEqual(null);
    });

    it('should hide modal popup', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.hideModal();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
  describe('navigate back', () => {
    it('should navigate back to first screen', () => {
      spyOn(component.router, 'navigate');
      component.navigateBackHome();
      expect(component.router.navigate).toHaveBeenCalledWith(['/home/billing/establishment-service/verify']);
    });
  });
  describe('navigate back to home', () => {
    it('should navigate back to first screen1', () => {
      component.searchOption = '';
      component.modalRef = new BsModalRef();
      spyOn(component.router, 'navigate');
      component.navigateBackToHome();
      expect(component.router.navigate).toHaveBeenCalledWith(['/home/billing/establishment-service/verify']);
    });
  });
  describe('getDataForBulkExceptionalVicEdit', () => {
    it('should getDataForBulkExceptionalVicEdit', () => {
      component.segmentDetailsOnEdit = {
        ...new PenaltyWaiverSegmentRequest(),
        selectedCriteria: { ...new SelectedCriteriaValues(), sin: [366600043] }
      };
      component.getDataForBulkExceptionalVicEdit(12345);
      expect(component.segmentDetailsOnEdit).not.toEqual(null);
    });
  });
  describe('getDataForVicExceptionalEdit', () => {
    it('should getDataForVicExceptionalEdit', () => {
      component.wavierDetailsOnEdit = new PenalityWavier();
      component.getDataForVicExceptionalEdit(368858587, 1234);
      expect(component.wavierDetailsOnEdit).not.toEqual(null);
    });
    it('should getDataForVicExceptionalEdit on error', () => {
      spyOn(component.penaltyWavierService, 'getExceptionalBulkDetails').and.returnValue(throwError(genericError));
      component.wavierDetailsOnEdit = new PenalityWavier();
      component.getDataForVicExceptionalEdit(368858587, 1234);
    });
  });
  describe('showErrorMessage', () => {
    it('Should call showErrorMessage', () => {
      spyOn(component.alertService, 'showError');
      component.showError({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('checkValidity', () => {
    it('should checkValidity', () => {
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      component.checkValidity(null);
      expect(component.documentService.checkMandatoryDocuments).toHaveBeenCalled();
    });
    it('should checkValidity', () => {
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      component.checkValidity(new FormGroup({ test: new FormControl() }));
      expect(component.documentService.checkMandatoryDocuments).toHaveBeenCalled();
    });
  });
  describe('getBulkPenaltyWaiverQuoteDetails', () => {
    it('should getBulkPenaltyWaiverQuoteDetails', () => {
      component.getBulkPenaltyWaiverQuoteDetails('test', [new BilingualText()], 'test');
      expect(component.vicSegmentMultiSelectValues).not.toEqual(null);
    });
  });
});
