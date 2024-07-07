/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  bindToForm,
  bindToObject,
  DocumentService,
  LanguageToken,
  LookupService,
  Person
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  bankDetailsReponse,
  beneficiaryErrorMockData,
  beneficiaryMockData,
  bilingualWrapperResponse,
  ChangePersonServiceMock,
  DocumentServiceStub,
  genericError,
  LookupServiceStub,
  ManagePersonFeatureServiceStub,
  ManagePersonForms,
  ManagePersonRoutingServiceStub,
  ModalServiceStub,
  personResponse,
  updateEduReponse
} from 'testing';
import {
  ChangePersonService,
  ManagePersonConstants,
  ManagePersonRoutingService,
  ManagePersonService,
  PersonBankDetails
} from '../../../shared';
import { getEducationForm } from './change-person-form';
import { ChangePersonScComponent } from './change-person-sc.component';

describe('ChangePersonsScComponent', () => {
  let component: ChangePersonScComponent;
  let fixture: ComponentFixture<ChangePersonScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [ChangePersonScComponent],
      providers: [
        { provide: ChangePersonService, useClass: ChangePersonServiceMock },
        {
          provide: ManagePersonRoutingService,
          useClass: ManagePersonRoutingServiceStub
        },
        {
          provide: ManagePersonService,
          useClass: ManagePersonFeatureServiceStub
        },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ApplicationTypeToken, useValue: 'private' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePersonScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Show Education Modal', () => {
    it('should trigger popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.person = bindToObject(new Person(), personResponse);
      spyOn(component, 'showModal');
      component.showEducationModal(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('Show the contact Modal', () => {
    it('should trigger popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component.modalService, 'show');
      component.showContactModal(modalRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('Show Bank Details Modal', () => {
    it('should trigger popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component.changePersonService, 'getBeneficiaryDetails').and.returnValue(of(beneficiaryMockData));
      component.showBankDetailsModal(modalRef);
      expect(component.commonModalRef).not.toBeNull();
    });
    it('should throw error', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component.changePersonService, 'getBeneficiaryDetails').and.returnValue(of(beneficiaryErrorMockData));
      component.showBankDetailsModal(modalRef);
      component.goToTop();
      expect(component.commonModalRef).not.toBeNull();
    });
  });

  describe('Save Education', () => {
    it('should save the education details', () => {
      const personRes = bindToModel(new Person(), personResponse);
      component.commonModalRef = new BsModalRef();
      component.educationForm = getEducationForm();
      bindToForm(component.educationForm, personRes);
      spyOn(component.changePersonService, 'patchPersonEducationDetails').and.returnValue(of(updateEduReponse));
      component.saveEducation();
      expect(component.person).not.toBe(null);
    });
    it('should throw an error', () => {
      const personRes = bindToModel(new Person(), personResponse);
      component.commonModalRef = new BsModalRef();
      bindToForm(component.educationForm, personRes);
      spyOn(component.changePersonService, 'patchPersonEducationDetails').and.returnValue(throwError(genericError));
      spyOn(component, 'showErrorMessage');
      component.saveEducation();
      expect(component.showErrorMessage).toHaveBeenCalled();
    });
  });

  describe('Verify OTP', () => {
    it('should verify the OTP through the number registered with absher', () => {
      const forms = new ManagePersonForms();
      component.contactForm = forms.getContactMockForm();
      component.commonModalRef = new BsModalRef();
      spyOn(component.changePersonService, 'patchPersonContactDetails').and.returnValue(of(bilingualWrapperResponse));
      component.verifyOtp();
      expect(component.absherVerified).toBe(false);
    });
    it('should throw error to enter the otp ', () => {
      const forms = new ManagePersonForms();
      component.contactForm = forms.getContactMockForm();
      component.otpControl.setValue(null);
      component.commonModalRef = new BsModalRef();
      spyOn(component.changePersonService, 'patchPersonContactDetails').and.returnValue(of(bilingualWrapperResponse));
      component.verifyOtp();
      expect(component.isOtpValid).toBe(false);
      expect(component.absherVerified).toBe(false);
    });
    it('should throw error to enter the otp ', () => {
      const forms = new ManagePersonForms();
      component.contactForm = forms.getContactMockForm();
      component.otpControl.setValue('');
      component.commonModalRef = new BsModalRef();
      spyOn(component.changePersonService, 'patchPersonContactDetails').and.returnValue(of(bilingualWrapperResponse));
      component.verifyOtp();
      expect(component.person).not.toBe(null);
    });
    it('should verify otp success', () => {
      //TODO to get the otp values from service and check for validity
      const forms = new ManagePersonForms();
      component.contactForm = forms.getContactMockForm();
      component.otpControl.setValue('654321');
      component.verifyOtp();
      expect(component.mobileVerifiedPage).toBe(true);
    });
    it('should throw error to enter valid otp', () => {
      const forms = new ManagePersonForms();
      component.contactForm = forms.getContactMockForm();
      component.otpControl.setValue(undefined);
      spyOn(component, 'setError');
      component.verifyOtp();
      expect(component.setError).toHaveBeenCalled();
    });
  });

  describe('Save Contact Details', () => {
    it('should save contact', () => {
      const forms = new ManagePersonForms();
      component.contactForm = forms.getContactMockForm();
      component.commonModalRef = new BsModalRef();
      spyOn(component.changePersonService, 'patchPersonContactDetails').and.returnValue(of(updateEduReponse));
      component.person = bindToModel(new Person(), personResponse);
      component.contactForm
        .get('contactDetail')
        .get('mobileNo')
        .get('primary')
        .setValue(personResponse.contactDetail.mobileNo.primary);
      component.saveContact();
      expect(component.person.contactDetail.mobileNo.primary).toBe(personResponse.contactDetail.mobileNo.primary);
    });
    it('should throw error', () => {
      const forms = new ManagePersonForms();
      component.contactForm = forms.getContactMockForm();
      component.commonModalRef = new BsModalRef();
      spyOn(component.changePersonService, 'patchPersonContactDetails').and.returnValue(throwError(genericError));
      component.contactForm
        .get('contactDetail')
        .get('mobileNo')
        .get('primary')
        .setValue(personResponse.contactDetail.mobileNo.primary);
      spyOn(component.alertService, 'showError');
      component.saveContact();
      expect(component.alertService.showError).toHaveBeenCalled();
    });

    it('should throw form invalid', () => {
      const forms = new ManagePersonForms();
      component.commonModalRef = new BsModalRef();
      component.contactForm = forms.getContactMockForm();
      component.contactForm.get('contactDetail').setErrors({ valid: true });

      component.saveContact();
      expect(component.contactForm.valid).toBe(false);
    });
  });
  describe('Show OTP Screen', () => {
    it('should go to next screen', () => {
      const forms = new ManagePersonForms();
      component.contactForm = forms.getContactMockForm();
      component.noOfIncorrectOtp = ManagePersonConstants.NO_OF_OTP_RETRIES;
      component.showOtpScreen();
      expect(component.isResend).toBeTruthy();
    });
    it('should show the OTP screen', () => {
      component.commonModalRef = new BsModalRef();
      const forms = new ManagePersonForms();

      component.contactForm = forms.getContactMockForm();
      spyOn(component.changePersonService, 'patchPersonContactDetails').and.returnValue(of(bilingualWrapperResponse));
      component.showOtpScreen();
      expect(component.person).not.toBe(null);
    });
  });

  describe('show the next otp screen', () => {
    it('should go to next screen', () => {
      component.showEditScreen();
      expect(component.showOtp).toBe(false);
    });
  });

  describe('show the next otp screen', () => {
    it('should go to next screen', () => {
      component.showEditScreen();
      expect(component.showOtp).toBe(false);
    });
  });
  describe('resend otp', () => {
    it('should resend the otp', () => {
      component.isOtpValid = false;
      component.noOfIncorrectOtp = ManagePersonConstants.NO_OF_OTP_RETRIES;
      component.reSendOtp();
      expect(component.isOtpValid).toBe(true);
    });
    it('should resend the otp', () => {
      component.isResend = false;
      component.noOfIncorrectOtp = 1;
      component.reSendOtp();
      expect(component).toBeTruthy();
    });
  });

  describe('Bind to bank Form', () => {
    it('should bind the child form to parent form', () => {
      component.bindToBankForm(new FormGroup({}));
      expect(component.bankParentForm.getRawValue()).toBeDefined();
    });
  });
  describe('Save bank details', () => {
    it('should save the bank details', () => {
      component.commonModalRef = new BsModalRef();
      const forms = new ManagePersonForms();
      spyOn(component.changePersonService, 'patchPersonBankDetails').and.returnValue(of(updateEduReponse));
      spyOn(component, 'modalScroll').and.returnValue();
      component.bankParentForm = forms.getBankMockForm();
      component.saveBankDetails();
      expect(component.bankDetails).toBeDefined();
    });
    it('should throw err', () => {
      component.commonModalRef = new BsModalRef();
      const forms = new ManagePersonForms();
      component.bankParentForm = forms.getBankMockForm();
      spyOn(component.changePersonService, 'patchPersonBankDetails').and.returnValue(throwError(genericError));
      spyOn(component, 'modalScroll').and.returnValue();
      spyOn(component.alertService, 'showError');
      component.saveBankDetails();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should throw form invalid', () => {
      component.commonModalRef = new BsModalRef();
      const forms = new ManagePersonForms();
      component.bankParentForm = forms.getBankMockForm();
      component.bankParentForm.get('bankForm').get('bankAddress').setErrors({ valid: true });
      spyOn(component, 'modalScroll').and.returnValue();
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.saveBankDetails();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });
  describe('Check Identity', () => {
    it('should check identity', () => {
      component.person.identity = bindToModel(new Person(), personResponse).identity;
      component.checkIdentity();
      expect(component.isIdentity).toBeFalsy();
    });
  });
  describe('Get Active Status and Bank Details', () => {
    it('should get the active status and the bank details', () => {
      component.person = new Person();
      component.person.personId = 135345132;
      const personRes = bindToModel(new Person(), personResponse);
      const bankRes = bindToModel(new PersonBankDetails(), bankDetailsReponse);
      spyOn(component.changePersonService, 'getActiveStatus').and.returnValue(of(personRes));
      spyOn(component.changePersonService, 'getBankDetails').and.returnValue(of(bankRes));
      component.getActiveStatusAndBankDetails();
      expect(component.isContributor).toBe(true);
    });
  });
  describe('hide modal', () => {
    it('should hide modal', () => {
      component.noOfIncorrectOtp = 0;
      component.hideContactModal();
      expect(component.noOfIncorrectOtp).toEqual(0);
    });
  });
  describe('navigate to address', () => {
    it('should navigate to address', () => {
      spyOn(component.manageRoutingService, 'navigateToUpdateAddress').and.callThrough();
      component.navigateToAddress();
      expect(component).toBeTruthy();
    });
  });
  describe('navigate back', () => {
    it('should navigate back', () => {
      component.showOtp = false;
      component.back();
      expect(component.showOtp).toEqual(false);
    });
  });
  describe('hasRetriesExceeded', () => {
    it('should hasRetriesExceeded', () => {
      component.noOfIncorrectOtp = 3;
      component.hasRetriesExceeded();
      expect(component.noOfIncorrectOtp).toEqual(3);
    });
  });
  describe('bind form', () => {
    it('should bind form', () => {
      const childForm = new FormGroup({});
      component.contactForm = childForm;
      component.bindToContactForm(childForm);
      expect(component.contactForm).toBeDefined();
    });
  });
});
export function bindToModel(model, cast) {
  Object.keys(model).forEach(key => {
    model[key] = cast[key];
  });
  return cast;
}
