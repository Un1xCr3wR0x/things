/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPreferencesScComponent } from './user-preferences-sc.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  LanguageToken,
  AlertService,
  AdminWrapperDto,
  UserPreferenceResponse,
  UserPreference,
  bindToObject,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  BilingualText,
  Alert,
  AuthTokenService
} from '@gosi-ui/core';
import { BehaviorSubject, throwError, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  AlertServiceStub,
  UserPreferenceForm,
  genericError,
  TransactionFeedbackData,
  ModalServiceStub,
  AuthTokenServiceStub
} from 'testing';
import { ChangePasswordResponse } from '../../../shared';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  AdminTestData,
  UserPreferenceValue,
  UserPreferenceDatas,
  UserPreferenceEnglishValue,
  UserPreferenceArabicValue,
  AdminWrapperDtoTest,
  AdminWrapperDtoTests
} from 'testing/test-data/features/customer-information';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserPreferencesScComponent', () => {
  let component: UserPreferencesScComponent;
  let fixture: ComponentFixture<UserPreferencesScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [UserPreferencesScComponent],
      providers: [
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },

        FormBuilder
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPreferencesScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('should selectApplicationLanguage', () => {
    it('should selectApplicationLanguage', () => {
      const form = new UserPreferenceForm();
      component.userPreferenceForm = form.userPreferenceForm();
      component.userPreferenceForm.get('applicationLanguage.english').setValue('English');
      component.applicationLanguage = AdminTestData[0].userPreferences.commPreferences;
      component.selectApplicationLanguage(component.userPreferenceForm.value);
    });
    it('should selectApplicationLanguage', () => {
      component.userPreferenceForm = component.createUserPreferenceForm();
      component.userPreferenceForm.get('applicationLanguage.english').setValue('Arabic');
      component.selectApplicationLanguage(component.userPreferenceForm.value);
    });
  });
  describe('should selectNotificationLanguage', () => {
    it('should selectNotificationLanguage', () => {
      component.userPreferenceForm = component.createUserPreferenceForm();
      component.userPreferenceForm.get('notificationLanguage.english').setValue('English');
      component.selectNotificationLanguage(component.userPreferenceForm.value);
    });
    it('should selectNotificationLanguage', () => {
      component.userPreferenceForm = component.createUserPreferenceForm();
      component.userPreferenceForm.get('notificationLanguage.english').setValue('Arabic');
      component.selectNotificationLanguage(component.userPreferenceForm.value);
    });
  });
  describe('should getAdminDetails', () => {
    it('should getAdminDetails', () => {
      const token = spyOn(component.authService, 'getAuthToken').and.returnValue(
        'eyJraWQiOiJQcml2YXRlRG9tYWluIiwieDV0IjoiX3l2NHZWc0U2NTlxWkpSejlZOWUwNzY5OXNNIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwOi8vSURNT0hTTFZUMDEuZ29zaS5pbnM6Nzc3OC9vYXV0aDIiLCJhdWQiOlsiUHJpdmF0ZVJTZXJ2ZXIiLCJhYjAiXSwiZXhwIjoxNjU5NzYxODE2LCJqdGkiOiJjeXVRQXlFQjRDRmxXcUVHSHFrUjd3IiwiaWF0IjoxNjI4MjI1ODE2LCJzdWIiOiJuajAyMjk2OSIsInVpZCI6ImUwMDIyOTY5IiwiZ29zaXNjcCI6Ilt7XCJyb2xlXCI6W1wiMTIxXCJdfV0gIiwibG9uZ25hbWVhcmFiaWMiOiLYp9io2LHYp9mH2YrZhSDYqNmGINi52KjYr9in2YTZhNmHINin2YTYutio2KfYsdmKIiwibG9uZ25hbWVlbmdsaXNoIjoiTk9UX0ZPVU5EIiwidXNlcnJlZmVyZW5jZWlkIjoiMjI5NjkiLCJjdXN0b21lQXR0cjEiOiJDdXN0b21WYWx1ZSIsImNsaWVudCI6IkNSTUVzdGFibGlzaG1lbnQxOCIsInNjb3BlIjpbIlByaXZhdGVSU2VydmVyLnJlYWQiXSwiZG9tYWluIjoiUHJpdmF0ZURvbWFpbiJ9.LsKSoVmBS1Qb0CAN2PhbRT3MJ6s7M-ad9YH-nFqq7wyvDzSYi23nxNuKQkIA_kMXw-uqtmXYXH-Wo-UhZMKYWZZVG1ncDMgIVuVSRsTUu51oNx6rZLMB4Ugi6Jy1cH_bsMZcBdwWnIFdCOnqJhwAOpvPb1nuT3zmzoOAAnsP6KwiiT0y2cLVZDQ7Ij_thstcgom5qq85mFHRe4NaK3vXB3HVMvqAwB1VgtYlZosO_8DKZXxEv-ZPksLuuWAIURw1JCcbQ3cHfrNhCbcoPZ5eR6YJxD5v2m2lpWJ6uNGXiE7tXnYek6xoHCaXhnb0l-SAW7weyyQjIAIFswdKwHR4lg'
      );
      spyOn(component.userActivityService, 'getAdminDetails').and.returnValue(
        of(bindToObject(new UserPreference(), UserPreferenceDatas))
      );
      component.getAdminDetails();
      component.userPreferenceForm = component.createUserPreferenceForm();
      component.adminDetails.commPreferences = 'En';
      component.commPreferences = 'English';
      component.userPreferenceForm.get('notificationLanguage').get('english').setValue(component.commPreferences);
      expect(component.userPreferences).not.toEqual(null);
      expect(component.adminDetails).not.toEqual(null);
      expect(component.adminDetails).not.toEqual(null);
      expect(component.adminDetails.commPreferences).toBe('En');
      expect(token).not.toEqual(null);
    });
    it('should getAdminDetails', () => {
      const token = spyOn(component.authService, 'getAuthToken').and.returnValue(
        'eyJraWQiOiJQcml2YXRlRG9tYWluIiwieDV0IjoiX3l2NHZWc0U2NTlxWkpSejlZOWUwNzY5OXNNIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwOi8vSURNT0hTTFZUMDEuZ29zaS5pbnM6Nzc3OC9vYXV0aDIiLCJhdWQiOlsiUHJpdmF0ZVJTZXJ2ZXIiLCJhYjAiXSwiZXhwIjoxNjU5NzYxODE2LCJqdGkiOiJjeXVRQXlFQjRDRmxXcUVHSHFrUjd3IiwiaWF0IjoxNjI4MjI1ODE2LCJzdWIiOiJuajAyMjk2OSIsInVpZCI6ImUwMDIyOTY5IiwiZ29zaXNjcCI6Ilt7XCJyb2xlXCI6W1wiMTIxXCJdfV0gIiwibG9uZ25hbWVhcmFiaWMiOiLYp9io2LHYp9mH2YrZhSDYqNmGINi52KjYr9in2YTZhNmHINin2YTYutio2KfYsdmKIiwibG9uZ25hbWVlbmdsaXNoIjoiTk9UX0ZPVU5EIiwidXNlcnJlZmVyZW5jZWlkIjoiMjI5NjkiLCJjdXN0b21lQXR0cjEiOiJDdXN0b21WYWx1ZSIsImNsaWVudCI6IkNSTUVzdGFibGlzaG1lbnQxOCIsInNjb3BlIjpbIlByaXZhdGVSU2VydmVyLnJlYWQiXSwiZG9tYWluIjoiUHJpdmF0ZURvbWFpbiJ9.LsKSoVmBS1Qb0CAN2PhbRT3MJ6s7M-ad9YH-nFqq7wyvDzSYi23nxNuKQkIA_kMXw-uqtmXYXH-Wo-UhZMKYWZZVG1ncDMgIVuVSRsTUu51oNx6rZLMB4Ugi6Jy1cH_bsMZcBdwWnIFdCOnqJhwAOpvPb1nuT3zmzoOAAnsP6KwiiT0y2cLVZDQ7Ij_thstcgom5qq85mFHRe4NaK3vXB3HVMvqAwB1VgtYlZosO_8DKZXxEv-ZPksLuuWAIURw1JCcbQ3cHfrNhCbcoPZ5eR6YJxD5v2m2lpWJ6uNGXiE7tXnYek6xoHCaXhnb0l-SAW7weyyQjIAIFswdKwHR4lg'
      );
      spyOn(component.userActivityService, 'getAdminDetails').and.returnValue(
        of(bindToObject(new UserPreference(), UserPreferenceDatas))
      );
      component.getAdminDetails();
      component.userPreferenceForm = component.createUserPreferenceForm();
      component.commPreferences = 'Arabic';
      // expect(component.adminDetails.commPreferences).toEqual('Ar');
      component.userPreferenceForm.get('notificationLanguage').get('english').setValue(component.commPreferences);
      expect(component.userPreferenceForm.get('notificationLanguage').get('english').value).toEqual(
        component.commPreferences
      );
      expect(component.adminDetails).not.toEqual(null);
      expect(component.adminDetails).not.toEqual(null);
      // expect(component.adminDetails.commPreferences).toBe('Ar');
      expect(token).not.toEqual(null);
    });
  });
  describe('saveUserPreference', () => {
    it('should saveUserPreference', () => {
      component.adminDetails = UserPreferenceDatas;
      component.userPreferences = UserPreferenceDatas;
      component.userPreferenceResponse = UserPreferenceValue;
      component.applicationLanguage = 'English';
      spyOn(component, 'saveAdminDetails').and.callThrough();
      component.saveUserPreference();
      expect(component.userPreferences).toBeDefined();
      expect(component.userPreferenceResponse?.preferredLanguage).not.toEqual(component.applicationLanguage);
      expect(component.userPreferences.commPreferences).toEqual(component.adminDetails?.commPreferences);
    });
    it('should saveUserPreference', () => {
      component.userPreferenceResponse = UserPreferenceValue;
      component.applicationLanguage = 'Arabic';
      spyOn(component, 'saveAdminDetails').and.callThrough();
      spyOn(component, 'saveApplicationLanguage').and.callThrough();
      component.saveUserPreference();
      expect(component.userPreferences).toBeDefined();
      expect(component.userPreferenceResponse.preferredLanguage).toEqual(component.applicationLanguage);
    });
    it('should saveUserPreference', () => {
      component.userPreferenceResponse = UserPreferenceValue;
      component.applicationLanguage = 'English';
      spyOn(component, 'saveAdminDetails').and.callThrough();
      spyOn(component, 'saveApplicationLanguage').and.callThrough();
      component.saveUserPreference();
      expect(component.userPreferences).toBeDefined();
      expect(component.userPreferenceResponse.preferredLanguage).not.toEqual(component.applicationLanguage);
    });
  });
  describe('getPreferredLanguage', () => {
    it('should getPreferredLanguage', () => {
      spyOn(component.userActivityService, 'getPreferredLanguage').and.returnValue(
        of(bindToObject(new UserPreferenceResponse(), UserPreferenceEnglishValue))
      );
      component.getPreferredLanguage();
      expect(component.userActivityService.getPreferredLanguage).toHaveBeenCalled();
      expect(component.userPreferenceResponse.preferredLanguage).not.toEqual(null);
    });
    it('should getPreferredLanguage', () => {
      spyOn(component.userActivityService, 'getPreferredLanguage').and.returnValue(
        of(bindToObject(new UserPreferenceResponse(), UserPreferenceArabicValue))
      );
      component.getPreferredLanguage();
      expect(component.userActivityService.getPreferredLanguage).toHaveBeenCalled();
      expect(component.userPreferenceResponse.preferredLanguage).not.toEqual(null);
    });
  });
  describe('saveAdminDetails', () => {
    it('should saveAdminDetails', () => {
      component.userPreferences = new UserPreference();
      component.saveAdminDetails();
    });
  });
  describe('onChannelSelect', () => {
    it('should  onChannelSelect', () => {
      const form = new UserPreferenceForm();
      component.invalid = true;
      component.userPreferenceForm = form.userPreferenceForm();
      component.userPreferenceForm.get('channel').get('EMAIL').setValue(true);
      spyOn(component.alertService, 'clearAlerts');
      component.onChannelSelect();
      expect(component.userPreferenceForm).toBeDefined();
      expect(component.userPreferenceForm.getRawValue().channel.EMAIL).toEqual(true);
    });
  });
  describe('saveContactPreference', () => {
    it('should  saveContactPreference', () => {
      component.invalid = true;
      const form = new UserPreferenceForm();
      component.userPreferenceForm = form.userPreferenceForm();
      component.userPreferenceForm.get('channel').get('SMS').setValue(true);
      component.onChannelSelect();
      expect(component.userPreferenceForm).toBeDefined();
    });
  });
  describe('should saveApplicationLanguage', () => {
    it('should saveApplicationLanguage', () => {
      spyOn(component.alertService, 'clearAlerts');
      spyOn(component.userActivityService, 'saveApplicationLanguage').and.returnValue(
        of(bindToObject(new ChangePasswordResponse(), TransactionFeedbackData))
      );
      component.saveApplicationLanguage();
      expect(component.userActivityService.saveApplicationLanguage).toHaveBeenCalled();
    });
    it('should saveApplicationLanguage', () => {
      spyOn(component.alertService, 'clearAlerts');
      spyOn(component.userActivityService, 'saveApplicationLanguage').and.returnValue(throwError(genericError));
      component.saveApplicationLanguage();
    });
  });
  describe('createForm', () => {
    it('should create form', () => {
      expect(component.createUserPreferenceForm()).toBeDefined();
      const fb: FormGroup = component.createUserPreferenceForm();
      fb.get('applicationLanguage').get('english').setValue('Arabic');
      expect(fb.get('applicationLanguage').get('english').value).toEqual('Arabic');
    });
  });
  describe('clear alerts', () => {
    it('should clear alerts', () => {
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      component.clearAlerts();
      expect(component).toBeTruthy();
    });
  });
  describe('show cancel template', () => {
    it('should show cancel template', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.cancel(modalRef);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.decline();
      expect(component).toBeTruthy();
    });
  });
  describe('confirm cancel', () => {
    it('should confirm cancel', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.confirmCancel();
      expect(component).toBeTruthy();
    });
  });
  describe('show error', () => {
    it('should show error', () => {
      component.showError({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component).toBeTruthy();
    });
  });
  describe('set contact preference', () => {
    it('should set contact preference', () => {
      const contactPreference = ['SMS'];
      component.setContactPreference(contactPreference);
      expect(component).toBeTruthy();
    });
    it('should set contact preference', () => {
      const contactPreference = ['EMAIL'];
      component.setContactPreference(contactPreference);
      expect(component).toBeTruthy();
    });
  });
  describe('set application preference', () => {
    it('should set application preference', () => {
      const preference = 'English';
      component.selectApplicationLanguage(preference);
      expect(component).toBeTruthy();
    });
    it('should set contact preference', () => {
      const preference = 'Arabic';
      component.selectApplicationLanguage(preference);
      expect(component).toBeTruthy();
    });
  });
  describe('set notification preference', () => {
    it('should set notification preference', () => {
      const preference = 'English';
      component.selectNotificationLanguage(preference);
      expect(component).toBeTruthy();
    });
    it('should set contact preference', () => {
      const preference = 'Arabic';
      component.selectNotificationLanguage(preference);
      expect(component).toBeTruthy();
    });
  });
  describe('set disabled', () => {
    it('should set disabled', () => {
      component.adminDetails = UserPreferenceDatas;
      component.userPreferences = UserPreferenceDatas;
      component.isDisabled();
      expect(component.userPreferences.commPreferences).toEqual(component.adminDetails?.commPreferences);
    });
    it('should set set disabled', () => {
      component.adminDetails = UserPreferenceDatas;
      component.userPreferences = UserPreferenceDatas;
      component.isDisabled();
      expect(component.userPreferences.commPreferences).toEqual(component.adminDetails.commPreferences);
    });
  });
});
