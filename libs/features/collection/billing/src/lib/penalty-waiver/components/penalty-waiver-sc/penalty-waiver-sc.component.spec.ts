/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import {
  BillEstablishmentServiceStub,
  AlertServiceStub,
  PenalityWavierServiceStub,
  DocumentServiceStub,
  ModalServiceStub,
  genericError,
  StorageServiceStub,
  PenaltyWaiverForm,
  wavierDetailFormData,
  penaltyWaiverDetailsFormData,
  penaltyWaiveCommentsFormData,
  checkBoxFormData
} from 'testing';
import { BehaviorSubject, throwError } from 'rxjs';
import {
  AlertService,
  LanguageToken,
  ApplicationTypeToken,
  DocumentService,
  RouterDataToken,
  RouterData,
  DocumentItem,
  StorageService,
  bindToForm,
  BilingualText,
  Alert,
  RegistrationNoToken,
  RegistrationNumber
} from '@gosi-ui/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { EstablishmentService, PenalityWavierService } from '../../../shared/services';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { PenaltyWaiverScComponent } from './penalty-waiver-sc.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ValidatorRoles } from '@gosi-ui/features/contributor';

describe('PenaltyWaiverScComponent', () => {
  let component: PenaltyWaiverScComponent;
  let fixture: ComponentFixture<PenaltyWaiverScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [PenaltyWaiverScComponent],
      providers: [
        { provide: EstablishmentService, useClass: BillEstablishmentServiceStub },
        { provide: PenalityWavierService, useClass: PenalityWavierServiceStub },

        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: StorageService, useClass: StorageServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: RegistrationNoToken,
          useValue: new RegistrationNumber(1234)
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenaltyWaiverScComponent);
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
    it('should initialize the component', inject([RouterDataToken], (token: RouterData) => {
      token.assignedRole = ValidatorRoles.GDIC;
      token.payload = '{"waiverid": 1245, "registrationNo": 200085744}';

      component.csrFlag = false;
      component.isAppPrivate = true;
      component.routerToken.payload = true;
      component.ngOnInit();
      component.getEstablishmentDetails(24565768);
      component.getDataForValidatorEdit(24565768);
      expect(component.lang).not.toEqual(null);
    }));
  });
  describe('getEstablishmentDetails', () => {
    it('should get establishment details', () => {
      component.getEstablishmentDetails(504096157);
      expect(component.establishmentDetails).not.toEqual(null);
    });
  });
  describe('getPenalityWavierDetails', () => {
    it('should get penality details', () => {
      component.getPenalityAccountDetails();
      expect(component.wavierDetails).not.toEqual(null);
    });
    it('should throw error on refersh documents', () => {
      spyOn(component.documentService, 'refreshDocument').and.returnValue(throwError(genericError));
      spyOn(component, 'showError');
      component.refreshDocuments(new DocumentItem(), true);
      expect(component.showError).toHaveBeenCalled();
    });
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      spyOn(component.router, 'navigate');
      component.showModal(modalRef, 'lg');
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('showErrorMessage', () => {
    it('Should call showErrorMessage', () => {
      spyOn(component.alertService, 'showError');
      component.showError({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('getInstallmentDetails', () => {
    it('Should call getInstallmentDetails', () => {
      spyOn(component.installmentService, 'getInstallmentactive');
      component.getInstallmentDetails(200085744);
      expect(component.installmentService.getInstallmentactive).toHaveBeenCalled();
    });
  });
  describe('submitPenaltyWaiverDetails', () => {
    it('should get submitPenaltyWaiverDetails', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.csrFlag = false;
      component.isValid = true;
      spyOn(component.router, 'navigate');
      component.submitPenaltyWaiverDetails(modalRef, 'lg');
      expect(component.paymentResponse).not.toEqual(null);
      expect(component.successMessage).not.toEqual(null);
    });
  });
  describe('navigateBackToHome', () => {
    it('navigate to home in private screen', () => {
      spyOn(component.router, 'navigate');
      component.isAppPrivate = true;
      spyOn(component.location, 'back');
      component.navigateBackToHome();
      expect(component.location.back).toHaveBeenCalled();
    });
    it('navigate to home in public screen', () => {
      spyOn(component.router, 'navigate');
      component.isAppPrivate = false;
      component.navigateBackToHome();
      expect(component.router.navigate).toHaveBeenCalledWith(['/home/contributor']);
    });
  });
  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      component.modalRef = new BsModalRef();
      component.hideModal();

      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('navigateBack', () => {
    it('navigate to back in private screen', () => {
      component.hideModal();
      expect(component.modalRef).not.toEqual(null);
      spyOn(component.router, 'navigate');
      component.isAppPrivate = true;
      spyOn(component.location, 'back');
      component.navigateBack();
      expect(component.location.back).toHaveBeenCalled();
    });
    it('navigate to back in private screens', () => {
      component.hideModal();
      expect(component.modalRef).not.toEqual(null);
      spyOn(component.router, 'navigate');
      spyOn(component.penalityWavierService, 'penaltyWaiverRevert').and.callThrough();
      component.isAppPrivate = true;
      component.isValidator = true;
      component.navigateBack();
      expect(component.penalityWavierService.penaltyWaiverRevert).toHaveBeenCalled();
    });
    it('navigate to back in public screen', () => {
      component.hideModal();
      spyOn(component.router, 'navigate');
      component.isAppPrivate = false;
      component.navigateBack();
      expect(component.router.navigate).toHaveBeenCalled();
    });
    // it('navigate to back in private screen', () => {
    //   component.hideModal();
    //   expect(component.modalRef).not.toEqual(null);
    //   spyOn(component.router, 'navigate');
    //   spyOn(component.penalityWavierService, 'penaltyWaiverRevert');
    //   component.isAppPrivate = true;
    //   component.isValidator= true;
    //   component.navigateBack();
    //   expect(component.navigateBackToValidator).toHaveBeenCalled();
    // });
  });
  describe('submitPenaltyWaiverDetails', () => {
    it('should submit the penalty waiver details for normal', () => {
      component.csrFlag = true;
      spyOn(component, 'checkFormValidity').and.returnValue(true);
      spyOn(component, 'handleWorkflowActions')();
      spyOn(component, 'navigateBack');
      spyOn(component.router, 'navigate');
      component.submitPenaltyWaiverDetails();
      expect(component.successMessage).toBeTruthy;
    });
  });
  describe('getDataForValidatorEdit', () => {
    it('should getDataForValidatorEdit', () => {
      component.penaltyWaiveId = 2563;
      component.getDataForValidatorEdit(256548888);
      expect(component.wavierDetails).not.toEqual(null);
      expect(component.csrFlag).toBeFalsy();
    });
    it('should throw error on refersh documents', () => {
      spyOn(component.penalityWavierService, 'getWavierPenalityDetailsForView').and.returnValue(
        throwError(genericError)
      );
      spyOn(component.alertService, 'showError').and.callThrough();
      spyOn(component, 'showError').and.callThrough();
      spyOn(component, 'handleError').and.callThrough();
      component.getDataForValidatorEdit(5454565467);
      expect(component.csrFlag).toBeUndefined;
    });
  });
  describe('submitWavierPenalityDetails', () => {
    it('should submit', () => {
      component.csrFlag = true;
      spyOn(component.router, 'navigate');
      spyOn(component, 'createFormData');
      spyOn(component.penalityWavierService, 'submitWavierPenalityDetails').and.returnValue(throwError(genericError));
      component.submitPenaltyWaiverDetails();
      spyOn(component, 'checkFormValidity').and.returnValue(true);
      expect(component.successMessage).toBeUndefined();
      //  expect(component.success).toBeTruthy();
    });
    it('should get grace period extended', () => {
      component.getGracePeriodExtended(52655);
      expect(component.isGracePeriodExtended).toBeTruthy();
    });
  });
  describe('test suite for submitPenaltyWaiverDetails ', () => {
    it('It should submit the penalty waiver details with valid form', () => {
      const form = new PenaltyWaiverForm();
      // component.createFormData();
      const wavierDetailForm = form.createGracePeriodForm();
      bindToForm(wavierDetailForm, wavierDetailFormData);

      component.wavierPenalityMainForm.addControl('wavierDetailForm', wavierDetailForm);
      spyOn(component.router, 'navigate');
      component.submitPenaltyWaiverDetails();
      component.csrFlag = true;
      expect(component.success).toBeFalsy();
    });
  });
  // describe('navigateBackToValidator', () => {
  //   it('navigate navigateBackToValidator', () => {
  //     spyOn(component.router, 'navigate');
  //     component.isAppPrivate = false;
  //     component.navigateBackToValidator();
  //     expect(component.router.navigate).toHaveBeenCalledWith(['home/inbox/todolist']);
  //   });
  //   it('navigate navigateBackToValidator in private', () => {
  //     spyOn(component.router, 'navigate');
  //     spyOn(component.routingService, 'navigateToValidator');
  //     component.isAppPrivate = true;
  //     component.navigateBackToValidator();
  //     expect(component.routingService.navigateToValidator).toHaveBeenCalled();
  //   });
  // });
  describe('create data', () => {
    it('should create form data for penality wavier', () => {
      const form = new PenaltyWaiverForm();
      const wavierDetailForm = form.commentForm();
      const penaltyWaiverDetails = form.createPenaltyWaiverDetailsForm();
      const gracePeriodForm = form.createGracePeriodForm();
      const checkForm = form.createCheckForm();
      component.isAppPrivate = false;
      bindToForm(gracePeriodForm, wavierDetailFormData);
      bindToForm(wavierDetailForm, penaltyWaiveCommentsFormData);
      bindToForm(penaltyWaiverDetails, penaltyWaiverDetailsFormData);
      bindToForm(checkForm, checkBoxFormData);
      component.wavierPenalityMainForm.addControl('penaltyWaiverDetails', penaltyWaiverDetails);
      component.wavierPenalityMainForm.addControl('gracePeriodForm', gracePeriodForm);
      component.wavierPenalityMainForm.addControl('wavierDetailForm', wavierDetailForm);
      component.wavierPenalityMainForm.addControl('checkForm', checkForm);
      component.createFormData();
      expect(component.isValid).toBeTruthy();
    });
  });
  describe('navigateToInbox', () => {
    it('should navigateToInbox', () => {
      spyOn(component.routingService, 'navigateToInbox');
      component.navigateBackToInbox();
      expect(component.routingService.navigateToInbox).toHaveBeenCalled();
    });
  });
  describe('navigateToInbox', () => {
    it('should navigateToInbox', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      spyOn(component.router, 'navigate');
      component.navigateToMyTranscation();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/transactions/list/history']);
    });
  });
  describe('cancelPopup', () => {
    it('navigate to to stay back on login page when cancelling the popup', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      spyOn(component.router, 'navigate');
      component.isAppPrivate = false;
      component.cancelPopup();
      expect(component.router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
  describe('getModalView', () => {
    it('should getModalView', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalService, 'show');
      component.getModalView();
    });
  });
  describe('handleWorkflowActions', () => {
    it('should handleWorkflowActions', () => {
      spyOn(component.workflowService, 'updateTaskWorkflow').and.callThrough();
      component.handleWorkflowActions();
    });
    it('should throw error for handleWorkflow', () => {
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.handleWorkflowActions();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('test suite for submitPaymentDetails ', () => {
    it('It should submit the payment details', () => {
      const form = new PenaltyWaiverForm();
      const wavierDetailForm = form.commentForm();
      const checkForm = form.createCheckForm();
      const penaltyWaiverDetails = form.createPenaltyWaiverDetailsForm();
      bindToForm(wavierDetailForm, penaltyWaiveCommentsFormData);
      bindToForm(penaltyWaiverDetails, penaltyWaiverDetailsFormData);
      bindToForm(checkForm, checkBoxFormData);
      component.wavierPenalityMainForm.addControl('penaltyWaiverDetails', penaltyWaiverDetails);
      component.wavierPenalityMainForm.addControl('wavierDetailForm', wavierDetailForm);
      component.wavierPenalityMainForm.addControl('checkForm', checkForm);
      spyOn(component.router, 'navigate');
      component.submitPenaltyWaiverDetails();

      expect(component.success).toBeTruthy();
    });
    it('It throw error on submit payment details', () => {
      const form = new PenaltyWaiverForm();
      const wavierDetailForm = form.commentForm();
      const checkForm = form.createCheckForm();
      const penaltyWaiverDetails = form.createPenaltyWaiverDetailsForm();
      bindToForm(wavierDetailForm, penaltyWaiveCommentsFormData);
      bindToForm(penaltyWaiverDetails, penaltyWaiverDetailsFormData);
      bindToForm(checkForm, checkBoxFormData);
      component.wavierPenalityMainForm.addControl('penaltyWaiverDetails', penaltyWaiverDetails);
      component.wavierPenalityMainForm.addControl('wavierDetailForm', wavierDetailForm);
      component.wavierPenalityMainForm.addControl('checkForm', checkForm);

      spyOn(component.penalityWavierService, 'submitWavierPenalityDetails').and.returnValue(throwError(genericError));
      spyOn(component.router, 'navigate');
      component.submitPenaltyWaiverDetails();

      expect(component.isError).toBeTruthy();
    });
    it('It should throw error on submit after edit', () => {
      const form = new PenaltyWaiverForm();
      const wavierDetailForm = form.commentForm();
      const checkForm = form.createCheckForm();
      const penaltyWaiverDetails = form.createPenaltyWaiverDetailsForm();
      bindToForm(wavierDetailForm, penaltyWaiveCommentsFormData);
      bindToForm(penaltyWaiverDetails, penaltyWaiverDetailsFormData);
      bindToForm(checkForm, checkBoxFormData);
      component.wavierPenalityMainForm.addControl('penaltyWaiverDetails', penaltyWaiverDetails);
      component.wavierPenalityMainForm.addControl('wavierDetailForm', wavierDetailForm);
      component.wavierPenalityMainForm.addControl('checkForm', checkForm);
      component.csrFlag = true;
      component.isValid = true;
      spyOn(component, 'navigateBackToInbox');
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(throwError(genericError));
      spyOn(component.router, 'navigate');
      component.csrFlag = true;
      component.submitPenaltyWaiverDetails();

      expect(component.navigateBackToInbox).toHaveBeenCalledTimes(0);
    });
  });
});
