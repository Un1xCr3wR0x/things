/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AlertServiceStub,
  DocumentServiceStub,
  genericError,
  ModalServiceStub,
  PenalityWavierServiceStub,
  PenaltyWaiverForm,
  penaltyWaiveCommentsFormData,
  vicPenalityWavierFormData,
  PenaltyWaiverRequestMockData,
  BillEstablishmentServiceStub,
  docList,
  PaymentForm,
  commentFormData
} from 'testing';
import { BehaviorSubject, throwError } from 'rxjs';
import {
  AlertService,
  LanguageToken,
  ApplicationTypeToken,
  DocumentService,
  DocumentItem,
  RouterDataToken,
  RouterData,
  ApplicationTypeEnum,
  BilingualText,
  bindToObject,
  Alert,
  TransactionReferenceData,
  RouterConstants,
  bindToForm
} from '@gosi-ui/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EstablishmentPenaltyWaiverScComponent } from './establishment-penalty-waiver-sc.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BillingConstants } from '../../../shared/constants';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PenalityWavierService } from '../../../shared/services/penality-wavier.service';
import { FormGroup } from '@angular/forms';
import { PenaltyWaiverSegmentRequest, SelectedCriteriaValues } from '../../../shared/models';
import { EstablishmentService } from '../../../shared/services';
import { RouterTestingModule } from '@angular/router/testing';

const documentListItemArray = docList.map(doc => bindToObject(new DocumentItem(), doc));
describe('EstablishmentPenaltyWaiverScComponent', () => {
  let component: EstablishmentPenaltyWaiverScComponent;
  let fixture: ComponentFixture<EstablishmentPenaltyWaiverScComponent>;
  const payloadData = {
    waiverId: 1001,
    referenceNo: 100,
    registrationNo: 110000103,
    assignedRole: 'Validator 1',
    resource: RouterConstants.TRANSACTION_EXCEPTIONAL_ESTABLISHMENT_PENALTY
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [EstablishmentPenaltyWaiverScComponent],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },

        {
          provide: RouterDataToken,
          useValue: {
            ...bindToObject(new RouterData(), { comments: [new TransactionReferenceData()] }),
            payload: JSON.stringify(payloadData)
          }
        },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: EstablishmentService, useClass: BillEstablishmentServiceStub },
        { provide: PenalityWavierService, useClass: PenalityWavierServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EstablishmentPenaltyWaiverScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should initialize the component', () => {
      component.appToken == ApplicationTypeEnum.PRIVATE;
      component.ngOnInit();
      expect(component.isAppPrivate).toBeTruthy();
      expect(component.referenceNumber).not.toEqual(null);
      expect(component.penaltyWaiveId).not.toEqual(null);
      expect(component.idNumber).not.toEqual(null);
      expect(component.searchOption).not.toEqual(null);
    });
  });
  describe('ngOnInit', () => {
    it('should initialize the component', () => {
      spyOn(component, 'getEstablishmentDetails');
      component.isAppPrivate = true;
      component.inWorkflow = true;
      component.ngOnInit();
      expect(component.lang).not.toEqual(null);
    });
  });
  describe('test suite for identifyModeOfTransaction', () => {
    it('It should get the transaction mode ', () => {
      component.identifyModeOfTransaction();
      expect(component.inWorkflow).not.toEqual(null);
    });
  });
  describe('test suite for getInstallmentDetails', () => {
    it('It should get the installment details ', () => {
      component.getInstallmentDetails(10000025);
      expect(component.previousInstallment).not.toEqual(null);
    });
  });
  // describe('ngOnInit', () => {
  //   it('should read keys from token in edit mode for segmentation', inject([RouterDataToken], token => {
  //     token.payload =
  //       '{"referenceNo":"986807","resource":"bulk-penalty-waiver-est","channel":"field-office","id":"169","waiverId":"169"}';
  //     component.inWorkflow = true;
  //     spyOn(component, 'getDataForView').and.callThrough();
  //     component.ngOnInit();
  //     expect(component.getDataForView).toHaveBeenCalled();
  //   }));
  // });
  // describe('ngOnInit', () => {
  //   it('should read keys from token in edit mode for registration', inject([RouterDataToken], token => {
  //     token.payload =
  //       '{"referenceNo":"986807","resource":"spcl-penalty-waiver-est","channel":"field-office","id":"169","waiverId":"169"}';
  //     component.inWorkflow = true;
  //     spyOn(component, 'getDataForView').and.callThrough();
  //     component.ngOnInit();
  //     expect(component.getDataForView).toHaveBeenCalled();
  //   }));
  // });
  // describe('test suite for getDocuments', () => {
  //   it('should get documents', () => {
  //     spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
  //     component.getRequiredDocuments();

  //     expect(component.documentService.getRequiredDocuments).toHaveBeenCalledWith(
  //       BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID,
  //       BillingConstants.PENALTY_WAVIER_SPCL_DOC_TRANSACTION_TYPE
  //     );
  //   });
  // });
  describe('handleWorkflowActions', () => {
    it('should handleWorkflowActions', () => {
      spyOn(component.workflowService, 'updateTaskWorkflow').and.callThrough();
      spyOn(component.routingService, 'navigateToInbox').and.callThrough();
      component.handleWorkflowAction();
      expect(component.workflowService.updateTaskWorkflow).toHaveBeenCalled();
    });
    it('should throw error for handleWorkflowActions', () => {
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.handleWorkflowAction();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('getVicPenaltyWaiverDetails', () => {
    it('should get penalty waiver details', () => {
      component.getPenalityAccountDetailsForEstablishment();
      expect(component.wavierDetails).not.toEqual(null);
    });
    it('should throw error on refersh documents', () => {
      spyOn(component.documentService, 'refreshDocument').and.returnValue(throwError(genericError));
      spyOn(component, 'showError').and.callThrough();
      component.refreshDocuments(new DocumentItem());
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('getestablishmentDetails', () => {
    it('should get establishment details', () => {
      spyOn(component.establishmentService, 'getEstablishment').and.callThrough();
      component.getEstablishmentDetails();
      expect(component.establishmentService.getEstablishment).toHaveBeenCalled();
    });
  });
  describe('getWaiverAmount', () => {
    it('should get waive amount', () => {
      component.getWaiverAmount('05-Sep-2020');
      expect(component.getRequiredDocuments).not.toEqual(null);
    });
  });
  describe('passEligiblePenaltyAmount', () => {
    it('should get the amount', () => {
      component.passEligiblePenaltyAmount(5000);
      expect(component.eligibleWaiveOffAmount).not.toEqual(null);
    });
  });

  // describe('getPaymentValue', () => {
  //   it('should get the payment value', () => {
  //     component.getPaymentValue(true);
  //     expect(component.paymentRequired).not.toEqual(null);
  //   });
  // });

  // describe('getPaymentValue', () => {
  //   it('should get the payment value', () => {
  //     component.getPaymentValue(false);
  //     expect(component.paymentRequired).not.toEqual(null);
  //   });
  // });
  describe('getEstablishmentDetails', () => {
    it('should get establishment details', () => {
      component.getEstablishmentDetails();
      expect(component.establishmentDetails).not.toEqual(null);
    });
  });
  describe('getEstablishmentDetails', () => {
    it('should navigate back', () => {
      spyOn(component.router, 'navigate');
      component.modalRef = new BsModalRef();
      component.navigateBack();
      expect(component.router.navigate).toHaveBeenCalledWith(['/home/billing/establishment-service/verify']);
    });
  });
  describe('getPenalityAccountDetailsForEstablishment', () => {
    it('should get penality details', () => {
      spyOn(component.penalityWavierService, 'getWavierPenalityDetails').and.callThrough();
      component.getPenalityAccountDetailsForEstablishment();
      expect(component.wavierDetails).not.toEqual(null);
    });
    it('should getEstablishmentDetails', () => {
      spyOn(component.establishmentService, 'getEstablishment').and.callThrough();
      spyOn(component, 'getPenalityAccountDetailsForEstablishment').and.callThrough();
      component.getEstablishmentDetails();
      expect(component.establishmentDetails).not.toEqual(null);
      //  expect(component.getPenalityAccountDetailsForEstablishment).toHaveBeenCalled();
    });
    it('should get grace period extended', () => {
      component.getExtensionValuesData(52655);
      component.exceptionReason = '4444';
      component.extendedGracePeriod = 4444;
      expect(component.exceptionReason).toBeTruthy();
      expect(component.extendedGracePeriod).toBeTruthy();
    });
  });
  it('should throw error on refersh documents', () => {
    spyOn(component.documentService, 'refreshDocument').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.refreshDocuments(new DocumentItem());
    expect(component.showError).toHaveBeenCalled();
  });
  describe('test suite for submitPaymentDetails ', () => {
    it('It should submit the payment details', () => {
      const form = new PenaltyWaiverForm();
      const wavierDetailForm = form.commentForm();
      const percentageForm = form.createWaivePeriodForm();
      bindToForm(wavierDetailForm, penaltyWaiveCommentsFormData);
      bindToForm(percentageForm, vicPenalityWavierFormData);
      component.wavierPenalityMainForm.addControl('percentageForm', percentageForm);
      component.wavierPenalityMainForm.addControl('wavierDetailForm', wavierDetailForm);
      component.wavierDetailsReq = PenaltyWaiverRequestMockData;
      spyOn(component.paymentResponses, 'fromJsonToObject');
      component.inWorkflow = false;
      spyOn(component.router, 'navigate');
      component.saveSegmentDetails();
      expect(component.successMessage).not.toBeNull();
    });
    it('It should submit the payment details', () => {
      const form = new PenaltyWaiverForm();
      const wavierDetailForm = form.commentForm();
      const percentageForm = form.createWaivePeriodForm();
      bindToForm(wavierDetailForm, penaltyWaiveCommentsFormData);
      bindToForm(percentageForm, vicPenalityWavierFormData);
      component.wavierPenalityMainForm.addControl('percentageForm', percentageForm);
      component.wavierPenalityMainForm.addControl('wavierDetailForm', wavierDetailForm);
      component.wavierDetailsReq = PenaltyWaiverRequestMockData;
      spyOn(component.paymentResponses, 'fromJsonToObject');
      component.inWorkflow = true;
      spyOn(component.router, 'navigate');
      component.saveSegmentDetails();
      expect(component.successMessage).not.toBeNull();
    });
  });
  xdescribe('test suite for submitPaymentDetails ', () => {
    it('It should submit the payment details', () => {
      const form = new PenaltyWaiverForm();
      const wavierDetailForm = form.commentForm();
      const percentageForm = form.createWaivePeriodForm();
      bindToForm(wavierDetailForm, penaltyWaiveCommentsFormData);
      bindToForm(percentageForm, vicPenalityWavierFormData);
      component.wavierPenalityMainForm.addControl('percentageForm', percentageForm);
      component.wavierPenalityMainForm.addControl('wavierDetailForm', wavierDetailForm);
      component.searchOption = 'registration';
      component.inWorkflow = false;
      component.wavierDetailsReq = PenaltyWaiverRequestMockData;
      spyOn(component.paymentResponses, 'fromJsonToObject');
      spyOn(component.router, 'navigate');
      component.onSubmitEstPenality();
      expect(component.successMessage).not.toBeNull();
    });
    it('It should submit the payment details', () => {
      const form = new PenaltyWaiverForm();
      const wavierDetailForm = form.commentForm();
      const percentageForm = form.createWaivePeriodForm();
      bindToForm(wavierDetailForm, penaltyWaiveCommentsFormData);
      bindToForm(percentageForm, vicPenalityWavierFormData);
      component.wavierPenalityMainForm.addControl('percentageForm', percentageForm);
      component.wavierPenalityMainForm.addControl('wavierDetailForm', wavierDetailForm);
      component.searchOption = 'registration';
      component.inWorkflow = true;
      component.wavierDetailsReq = PenaltyWaiverRequestMockData;
      spyOn(component.paymentResponses, 'fromJsonToObject');
      spyOn(component.router, 'navigate');
      component.onSubmitEstPenality();
      expect(component.successMessage).not.toBeNull();
    });
    it('It should submit the payment details for search param other than sin', () => {
      const form = new PenaltyWaiverForm();
      const wavierDetailForm = form.commentForm();
      const percentageForm = form.createWaivePeriodForm();
      bindToForm(wavierDetailForm, penaltyWaiveCommentsFormData);
      bindToForm(percentageForm, vicPenalityWavierFormData);
      component.wavierPenalityMainForm.addControl('percentageForm', percentageForm);
      component.wavierPenalityMainForm.addControl('wavierDetailForm', wavierDetailForm);
      component.searchOption !== 'registration';
      component.wavierDetailsReq = PenaltyWaiverRequestMockData;
      spyOn(component.paymentResponses, 'fromJsonToObject');
      spyOn(component.router, 'navigate');
      component.onSubmitEstPenality();
      expect(component.successMessage).not.toBeNull();
    });
  });
  describe('showModal', () => {
    it('should show modals', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      spyOn(component.router, 'navigate');
      component.showModal(modalRef, 'lg');
      expect(component.modalRef).not.toEqual(null);
    });
    it('should hide modal detail', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.hideModal();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });

  describe('test suite for submitVicPaymentDetails ', () => {
    it('It should submit the vic payment details', () => {
      const form = new PenaltyWaiverForm();
      spyOn(component, 'checkDocumentValidity').and.returnValue(true);
      const wavierDetailForm = form.commentForm();
      const percentageForm = form.createWaivePeriodForm();
      bindToForm(wavierDetailForm, penaltyWaiveCommentsFormData);
      bindToForm(percentageForm, vicPenalityWavierFormData);
      component.wavierDetails.terms.gracePeriod = 7;
      component.wavierPenalityMainForm.addControl('percentageForm', percentageForm);
      component.wavierPenalityMainForm.addControl('wavierDetailForm', wavierDetailForm);
      component.searchOption !== 'registration';
      component.wavierDetailsReq = PenaltyWaiverRequestMockData;
      spyOn(component.router, 'navigate');
      component.onSubmitEstPenality();
      expect(component.successMessage).not.toBeNull();
    });
    it('It should submit the payment details for search param other than sin', () => {
      component.searchOption === 'registration';
      const form = new PenaltyWaiverForm();
      spyOn(component, 'checkDocumentValidity').and.returnValue(true);
      const wavierDetailForm = form.commentForm();
      const percentageForm = form.createWaivePeriodForm();
      bindToForm(wavierDetailForm, penaltyWaiveCommentsFormData);
      bindToForm(percentageForm, vicPenalityWavierFormData);
      component.wavierDetails.terms.gracePeriod = 7;
      component.wavierPenalityMainForm.addControl('percentageForm', percentageForm);
      component.wavierPenalityMainForm.addControl('wavierDetailForm', wavierDetailForm);
      component.searchOption === 'registration';
      component.wavierDetailsReq = PenaltyWaiverRequestMockData;
      spyOn(component.router, 'navigate');
      component.onSubmitEstPenality();
      expect(component.successMessage).not.toBeNull();
    });
  });
  describe('checkDocumentValidity', () => {
    it('should check validity', () => {
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      expect(component.checkDocumentValidity(new FormGroup({}))).toBeTruthy();
    });
  });
  describe('navigateBackToHome', () => {
    it('should navigate to home screen', () => {
      spyOn(component.router, 'navigate');
      component.navigateBackToHome();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('establishment-penality-wavier-base-sc', () => {
    it('should getDataForView', () => {
      component.searchOption = 'registration';
      component.getDataForView();
      expect(component.waiverDetailsOnEdit).not.toBeNull();
    });
    xit('should getDataForView if search option is not registration', () => {
      component.searchOption = '';
      component.waiverDetailsOn = bindToObject(new PenaltyWaiverSegmentRequest(), {
        selectedCriteria: bindToObject(new SelectedCriteriaValues(), { registrationNo: [110000103] })
      });
      component.getDataForView();
      expect(component.waiverDetailsOn).not.toBeNull();
    });
    it('should getEstablishmentDetails', () => {
      component.idNumber = 12345;
      component.fromDate = 2019;
      component.toDate = 2022;
      component.getEstablishmentDetails();
      expect(component.establishmentDetails).not.toBeNull();
    });
    // it('should getRequiredDocuments', () => {
    //   component.getRequiredDocuments();
    //   expect(component.documents).not.toBeNull();
    // });
    it('should refreshDocuments', () => {
      component.searchOption = 'registration';
      component.idNumber = 12345;
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      component.refreshDocuments(document);
      expect(component.documents).not.toBeNull();
    });
    it('should showError', () => {
      spyOn(component, 'showError').and.callThrough();
      component.showError({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.showError).toHaveBeenCalled();
    });
    xit('should getBulkPenaltyWaiverQuoteEstDetails', () => {
      component.getBulkPenaltyWaiverQuoteEstDetails('test', [{ english: 'test', arabic: 'test' }], 'test');
      expect(component.bulkpenaltyCount).not.toBeNull();
    });
    describe('test suite for submitPenaltyDetails ', () => {
      it('It should submit payment details after edit', () => {
        const form = new PaymentForm();
        const commentsForm = form.commentForm();
        bindToForm(commentsForm, commentFormData);
        component.wavierPenalityMainForm.addControl('comments', commentsForm);
        spyOn(component.router, 'navigate');
        spyOn(component.workflowService, 'updateTaskWorkflow').and.callThrough();
        spyOn(component.routingService, 'navigateToInbox');
        expect(component.routingService.navigateToInbox).toHaveBeenCalledTimes(0);
      });
    });

    describe('navigateBackToHome', () => {
      it('It should navigate to navigateBackToHome', () => {
        spyOn(component.router, 'navigate');
        component.navigateBackToHome();
        expect(['/home/billing/establishment-service/verify']).toHaveBeenCalled;
      });
    });
  });
});
