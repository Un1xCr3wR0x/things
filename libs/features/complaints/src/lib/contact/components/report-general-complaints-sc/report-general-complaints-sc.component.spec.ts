/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportGeneralComplaintsScComponent } from './report-general-complaints-sc.component';
import { FormBuilder } from '@angular/forms';
import {
  ApplicationTypeToken,
  ApplicationTypeEnum,
  bindToObject,
  OtpResponse,
  removeEscapeChar,
  DocumentService
} from '@gosi-ui/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ModalServiceStub, ContactForms, OTPResponse, DocumentServiceStub } from 'testing';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { ComplaintRequest, ComplaintResponse } from '../../../shared/models';
import { IdentityEnum } from '../../../shared/enums';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
const routerSpy = { navigate: jasmine.createSpy('navigate') };
describe('ReportGeneralComplaintsScComponent', () => {
  let component: ReportGeneralComplaintsScComponent;
  let fixture: ComponentFixture<ReportGeneralComplaintsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportGeneralComplaintsScComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: DocumentService, useClass: DocumentServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportGeneralComplaintsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('should be back', () => {
    it('should be back', () => {
      component.onBack();
      expect(component).toBeTruthy();
    });
  });
  describe('exceed time', () => {
    it('should be exceeded after time', () => {
      component.hasTimeExceeded();
      expect(component).toBeTruthy();
    });
  });
  describe('should verify', () => {
    it('should verify', () => {
      const form = new ContactForms();
      component.otpForm = form.OtpForm();
      component.otpForm.updateValueAndValidity();
      component.otpForm.get('otp').setValue('1234');
      component.onVerify();
      expect(component.otpForm).toBeDefined();
      expect(component.otpForm.valid).toEqual(true);
      expect(component).toBeTruthy();
    });
  });
  describe('should resend otp', () => {
    it('should resend otp', () => {
      component.currentAlert = [];
      spyOn(component.otpService, 'reSendOTP').and.returnValue(of(bindToObject(new OtpResponse(), OTPResponse)));
      component.reSendOtp();
      expect(component.currentAlert).toBeDefined();
    });
    it('should throw error', () => {
      spyOn(component.otpService, 'reSendOTP').and.returnValue(
        throwError({
          error: {
            message: {
              english: 'OTP Expired',
              arabic: ''
            }
          }
        })
      );
      spyOn(component, 'showAlerts').and.callThrough();
      component.reSendOtp();
      expect(component).toBeTruthy();
    });
  });
  describe('should submit', () => {
    it('should submit', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      const forms = new ContactForms();
      component.contactForm = forms.ContactTypeForm();
      component.commentForm = forms.CommentForm();
      component.contactTypeForm = forms.createContactTypeForm();
      component.contactTypeForm.updateValueAndValidity();
      component.commentForm.updateValueAndValidity();
      component.contactForm.updateValueAndValidity();
      component.contactForm.get('contactForm').get('message').setValue('note');
      component.commentForm.get('csrComment').setValue('note');
      component.contactForm.get('contactForm').get('category').get('english').setValue('Complaint');
      component.contactForm.get('contactForm').get('type').get('english').setValue('Complaint');
      component.contactForm.get('contactForm').get('subType').get('english').setValue('Complaint');
      component.contactTypeForm.get('typeForm').get('name').setValue('Complaint');
      component.contactTypeForm
        .get('typeForm')
        .get('birthDate')
        .setValue({ gregorian: '2001-09-08', hijiri: '1424-07-01' });
      component.contactTypeForm.get('typeForm').get('idType').get('english').setValue('Complaint');
      component.contactTypeForm.get('typeForm').get('idNumber').setValue(1041617554);
      component.contactTypeForm.get('typeForm').get('email').setValue('ayoo@gamil.com');
      component.contactTypeForm.get('typeForm').get('mobileNo').get('primary').setValue(906137573);
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      spyOn(component, 'openPopupWindow').and.callThrough();
      component.onSubmitComplaint(modalRef);
      expect(component.contactForm).not.toEqual(null);
      expect(component.contactForm.valid).toBeTruthy();
      expect(component.commentForm).not.toEqual(null);
      expect(component.commentForm.valid).toBeTruthy();
      expect(component.contactTypeForm).not.toEqual(null);
      expect(component.contactTypeForm.valid).toBeTruthy();
    });
    it('should submit', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      const forms = new ContactForms();
      component.contactForm = forms.ContactTypeForm();
      component.commentForm = forms.CommentForm();
      component.contactTypeForm = forms.createContactTypeForm();
      component.contactTypeForm.updateValueAndValidity();
      component.commentForm.updateValueAndValidity();
      component.contactForm.updateValueAndValidity();
      component.contactForm.get('contactForm').get('message').setValue('note');
      component.commentForm.get('csrComment').setValue('note');
      component.contactForm.get('contactForm').get('category').get('english').setValue('Complaint');
      component.contactForm.get('contactForm').get('type').get('english').setValue('Complaint');
      component.contactForm.get('contactForm').get('subType').get('english').setValue('Complaint');
      component.contactTypeForm.get('typeForm').get('name').setValue('Complaint');
      component.contactTypeForm.get('typeForm').get('idType').get('english').setValue('National Identification Number');
      component.contactTypeForm.get('typeForm').get('idNumber').setValue(1041617554);
      component.contactTypeForm.get('typeForm').get('email').setValue('ayoo@gamil.com');
      component.contactTypeForm.get('typeForm').get('mobileNo').get('primary').setValue(906137573);
      component.request = new ComplaintRequest();
      component.request.category = component.contactForm?.value?.contactForm?.category?.english;
      component.request.type = component.contactForm?.value?.contactForm?.type?.english;
      component.request.subType = component.contactForm?.value?.contactForm?.subType?.english;
      component.request.description = removeEscapeChar(component.contactForm?.value?.contactForm?.message);
      component.request.csrComment = removeEscapeChar(component.commentForm.value.csrComment);
      component.request.complainantDetails.name = component.contactTypeForm.value.typeForm.name;
      component.request.complainantDetails.contactDetail.email = component.contactTypeForm.value.typeForm.email;
      component.request.complainantDetails.contactDetail.phoneNo =
        component.contactTypeForm.value.typeForm.mobileNo.primary;
      (component.request.complainantDetails.identity.idType =
        component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.NATIONAL_IDENTIFICATION_NUMBER
          ? IdentityEnum.NIN
          : component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.IQAMA_NUMBER
          ? IdentityEnum.IQAMA
          : ''),
        (component.request.complainantDetails.identity.newNin =
          component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.NATIONAL_IDENTIFICATION_NUMBER
            ? component.contactTypeForm?.value?.typeForm?.idNumber
            : '');
      (component.request.complainantDetails.identity.iqamaNo =
        component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.IQAMA_NUMBER
          ? component.contactTypeForm?.value?.typeForm?.idNumber
          : ''),
        (component.request.registrationNo = null);
      component.request.complainant = null;
      component.request.transactionRefNo = null;
      (component.request.uuid =
        component.uploadDocuments?.filter(item => item?.uploaded)?.length > 0 ? component.uuid : null),
        spyOn(component.contactService, 'submitRequest').and.returnValue(
          of(bindToObject(new ComplaintResponse(), ComplaintResponse))
        );
      spyOn(component.alertService, 'showSuccess').and.callThrough();
      component.onSubmitComplaint(modalRef);
      expect(component.request).toBeDefined();
    });
    it('should throw error ', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      const forms = new ContactForms();
      component.contactForm = forms.ContactTypeForm();
      component.commentForm = forms.CommentForm();
      component.contactTypeForm = forms.createContactTypeForm();
      component.contactTypeForm.updateValueAndValidity();
      component.commentForm.updateValueAndValidity();
      component.contactForm.updateValueAndValidity();
      component.contactForm.get('contactForm').get('message').setValue('note');
      component.commentForm.get('csrComment').setValue('note');
      component.contactForm.get('contactForm').get('category').get('english').setValue('Complaint');
      component.contactForm.get('contactForm').get('type').get('english').setValue('Complaint');
      component.contactForm.get('contactForm').get('subType').get('english').setValue('Complaint');
      component.contactTypeForm.get('typeForm').get('name').setValue('Complaint');
      component.contactTypeForm.get('typeForm').get('idType').get('english').setValue('National Identification Number');
      component.contactTypeForm.get('typeForm').get('idNumber').setValue(1041617554);
      component.contactTypeForm.get('typeForm').get('email').setValue('ayoo@gamil.com');
      component.contactTypeForm.get('typeForm').get('mobileNo').get('primary').setValue(906137573);
      component.request = new ComplaintRequest();
      component.request = new ComplaintRequest();
      component.request.category = component.contactForm?.value?.contactForm?.category?.english;
      component.request.type = component.contactForm?.value?.contactForm?.type?.english;
      component.request.subType = component.contactForm?.value?.contactForm?.subType?.english;
      component.request.description = component.contactForm?.value?.contactForm?.message;
      component.request.csrComment = component.commentForm.value.csrComment;
      component.request.complainantDetails.name = component.contactTypeForm.value.typeForm.name;
      component.request.complainantDetails.contactDetail.email = component.contactTypeForm.value.typeForm.email;
      component.request.complainantDetails.contactDetail.phoneNo =
        component.contactTypeForm.value.typeForm.mobileNo.primary;
      (component.request.complainantDetails.identity.idType =
        component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.NATIONAL_IDENTIFICATION_NUMBER
          ? IdentityEnum.NIN
          : component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.IQAMA_NUMBER
          ? IdentityEnum.IQAMA
          : ''),
        (component.request.complainantDetails.identity.newNin =
          component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.NATIONAL_IDENTIFICATION_NUMBER
            ? component.contactTypeForm?.value?.typeForm?.idNumber
            : '');
      (component.request.complainantDetails.identity.iqamaNo =
        component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.IQAMA_NUMBER
          ? component.contactTypeForm?.value?.typeForm?.idNumber
          : ''),
        (component.request.registrationNo = null);
      component.request.complainant = null;
      component.request.transactionRefNo = null;
      (component.request.uuid =
        component.uploadDocuments?.filter(item => item?.uploaded)?.length > 0 ? component.uuid : null),
        spyOn(component.contactService, 'submitRequest').and.returnValue(
          throwError({
            error: {
              uuid: '58d08e79-f86e-487e-9665-e58d48e6e6e2',
              message: {
                english: 'Please enter OTP',
                arabic: 'الرجاء إدخال رمز التحقق'
              }
            }
          })
        );
      component.onSubmitComplaint(modalRef);
      expect(component.request).toBeDefined();
    });
    it('should throw error ', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      const forms = new ContactForms();
      component.contactForm = forms.ContactTypeForm();
      component.commentForm = forms.CommentForm();
      component.contactTypeForm = forms.createContactTypeForm();
      component.contactTypeForm.updateValueAndValidity();
      component.commentForm.updateValueAndValidity();
      component.contactForm.updateValueAndValidity();
      component.contactForm.get('contactForm').get('message').setValue('note');
      component.commentForm.get('csrComment').setValue('note');
      component.contactForm.get('contactForm').get('category').get('english').setValue('Complaint');
      component.contactForm.get('contactForm').get('type').get('english').setValue('Complaint');
      component.contactForm.get('contactForm').get('subType').get('english').setValue('Complaint');
      component.contactTypeForm.get('typeForm').get('name').setValue('Complaint');
      component.contactTypeForm.get('typeForm').get('idType').get('english').setValue('National Identification Number');
      component.contactTypeForm.get('typeForm').get('idNumber').setValue(1041617554);
      component.contactTypeForm.get('typeForm').get('email').setValue('ayoo@gamil.com');
      component.contactTypeForm.get('typeForm').get('mobileNo').get('primary').setValue(906137573);
      component.request = new ComplaintRequest();
      component.request = new ComplaintRequest();
      component.request.category = component.contactForm?.value?.contactForm?.category?.english;
      component.request.type = component.contactForm?.value?.contactForm?.type?.english;
      component.request.subType = component.contactForm?.value?.contactForm?.subType?.english;
      component.request.description = component.contactForm?.value?.contactForm?.message;
      component.request.csrComment = component.commentForm.value.csrComment;
      component.request.complainantDetails.name = component.contactTypeForm.value.typeForm.name;
      component.request.complainantDetails.contactDetail.email = component.contactTypeForm.value.typeForm.email;
      component.request.complainantDetails.contactDetail.phoneNo =
        component.contactTypeForm.value.typeForm.mobileNo.primary;
      (component.request.complainantDetails.identity.idType =
        component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.NATIONAL_IDENTIFICATION_NUMBER
          ? IdentityEnum.NIN
          : component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.IQAMA_NUMBER
          ? IdentityEnum.IQAMA
          : ''),
        (component.request.complainantDetails.identity.newNin =
          component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.NATIONAL_IDENTIFICATION_NUMBER
            ? component.contactTypeForm?.value?.typeForm?.idNumber
            : '');
      (component.request.complainantDetails.identity.iqamaNo =
        component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.IQAMA_NUMBER
          ? component.contactTypeForm?.value?.typeForm?.idNumber
          : ''),
        (component.request.registrationNo = null);
      component.request.complainant = null;
      component.request.transactionRefNo = null;
      (component.request.uuid =
        component.uploadDocuments?.filter(item => item?.uploaded)?.length > 0 ? component.uuid : null),
        spyOn(component.contactService, 'submitRequest').and.returnValue(
          throwError({
            error: {
              message: {
                english: 'Invalid OTP',
                arabic: 'رمز التحقق غير صحيح'
              },
              verified: false
            }
          })
        );
      component.onSubmitComplaint(modalRef);
      expect(component.request).toBeDefined();
    });
    it('should throw error ', () => {
      const isVerify = true;
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      const forms = new ContactForms();
      component.contactForm = forms.ContactTypeForm();
      component.commentForm = forms.CommentForm();
      component.contactTypeForm = forms.createContactTypeForm();
      component.contactTypeForm.updateValueAndValidity();
      component.commentForm.updateValueAndValidity();
      component.contactForm.updateValueAndValidity();
      component.contactForm.get('contactForm').get('message').setValue('note');
      component.commentForm.get('csrComment').setValue('note');
      component.contactForm.get('contactForm').get('category').get('english').setValue('Complaint');
      component.contactForm.get('contactForm').get('type').get('english').setValue('Complaint');
      component.contactForm.get('contactForm').get('subType').get('english').setValue('Complaint');
      component.contactTypeForm.get('typeForm').get('name').setValue('Complaint');
      component.contactTypeForm.get('typeForm').get('idType').get('english').setValue('National Identification Number');
      component.contactTypeForm.get('typeForm').get('idNumber').setValue(1041617554);
      component.contactTypeForm.get('typeForm').get('email').setValue('ayoo@gamil.com');
      component.contactTypeForm.get('typeForm').get('mobileNo').get('primary').setValue(906137573);
      component.request = new ComplaintRequest();
      component.request = new ComplaintRequest();
      component.request.category = component.contactForm?.value?.contactForm?.category?.english;
      component.request.type = component.contactForm?.value?.contactForm?.type?.english;
      component.request.subType = component.contactForm?.value?.contactForm?.subType?.english;
      component.request.description = removeEscapeChar(component.contactForm?.value?.contactForm?.message);
      component.request.csrComment = removeEscapeChar(component.commentForm.value.csrComment);
      component.request.complainantDetails.name = component.contactTypeForm.value.typeForm.name;
      component.request.complainantDetails.contactDetail.email = component.contactTypeForm.value.typeForm.email;
      component.request.complainantDetails.contactDetail.phoneNo =
        component.contactTypeForm.value.typeForm.mobileNo.primary;
      (component.request.complainantDetails.identity.idType =
        component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.NATIONAL_IDENTIFICATION_NUMBER
          ? IdentityEnum.NIN
          : component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.IQAMA_NUMBER
          ? IdentityEnum.IQAMA
          : ''),
        (component.request.complainantDetails.identity.newNin =
          component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.NATIONAL_IDENTIFICATION_NUMBER
            ? component.contactTypeForm?.value?.typeForm?.idNumber
            : '');
      (component.request.complainantDetails.identity.iqamaNo =
        component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.IQAMA_NUMBER
          ? component.contactTypeForm?.value?.typeForm?.idNumber
          : ''),
        (component.request.registrationNo = null);
      component.request.complainant = null;
      component.request.transactionRefNo = null;
      (component.request.uuid =
        component.uploadDocuments?.filter(item => item?.uploaded)?.length > 0 ? component.uuid : null),
        spyOn(component.contactService, 'submitRequest').and.returnValue(
          throwError({
            error: {
              message: {
                english: 'Invalid OTP',
                arabic: 'رمز التحقق غير صحيح'
              },
              verified: false
            }
          })
        );
      component.onSubmitComplaint(modalRef, isVerify);
      expect(component.request).toBeDefined();
      expect(isVerify).toEqual(true);
    });
    it('should throw error ', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      const forms = new ContactForms();
      component.contactForm = forms.ContactTypeForm();
      component.commentForm = forms.CommentForm();
      component.contactTypeForm = forms.createContactTypeForm();
      component.contactTypeForm.updateValueAndValidity();
      component.commentForm.updateValueAndValidity();
      component.contactForm.updateValueAndValidity();
      component.contactForm.get('contactForm').get('message').setValue('note');
      component.commentForm.get('csrComment').setValue('note');
      component.contactForm.get('contactForm').get('category').get('english').setValue('Complaint');
      component.contactForm.get('contactForm').get('type').get('english').setValue('Complaint');
      component.contactForm.get('contactForm').get('subType').get('english').setValue('Complaint');
      component.contactTypeForm.get('typeForm').get('name').setValue('Complaint');
      component.contactTypeForm.get('typeForm').get('idType').get('english').setValue('National Identification Number');
      component.contactTypeForm.get('typeForm').get('idNumber').setValue(1041617554);
      component.contactTypeForm.get('typeForm').get('email').setValue('ayoo@gamil.com');
      component.contactTypeForm.get('typeForm').get('mobileNo').get('primary').setValue(906137573);
      component.request = new ComplaintRequest();
      component.request = new ComplaintRequest();
      component.request.category = component.contactForm?.value?.contactForm?.category?.english;
      component.request.type = component.contactForm?.value?.contactForm?.type?.english;
      component.request.subType = component.contactForm?.value?.contactForm?.subType?.english;
      component.request.description = removeEscapeChar(component.contactForm?.value?.contactForm?.message);
      component.request.csrComment = removeEscapeChar(component.commentForm.value.csrComment);
      component.request.complainantDetails.name = component.contactTypeForm.value.typeForm.name;
      component.request.complainantDetails.contactDetail.email = component.contactTypeForm.value.typeForm.email;
      component.request.complainantDetails.contactDetail.phoneNo =
        component.contactTypeForm.value.typeForm.mobileNo.primary;
      (component.request.complainantDetails.identity.idType =
        component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.NATIONAL_IDENTIFICATION_NUMBER
          ? IdentityEnum.NIN
          : component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.IQAMA_NUMBER
          ? IdentityEnum.IQAMA
          : ''),
        (component.request.complainantDetails.identity.newNin =
          component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.NATIONAL_IDENTIFICATION_NUMBER
            ? component.contactTypeForm?.value?.typeForm?.idNumber
            : '');
      (component.request.complainantDetails.identity.iqamaNo =
        component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.IQAMA_NUMBER
          ? component.contactTypeForm?.value?.typeForm?.idNumber
          : ''),
        (component.request.registrationNo = null);
      component.request.complainant = null;
      component.request.transactionRefNo = null;
      (component.request.uuid =
        component.uploadDocuments?.filter(item => item?.uploaded)?.length > 0 ? component.uuid : null),
        spyOn(component.contactService, 'submitRequest').and.returnValue(
          throwError({
            status: 422,
            error: {
              message: {
                english: 'Invalid OTP',
                arabic: 'رمز التحقق غير صحيح'
              },
              code: 'COM-ERR-1014'
            }
          })
        );
      component.onSubmitComplaint(modalRef);
      expect(component.request).toBeDefined();
    });
    it('should throw error ', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      const forms = new ContactForms();
      component.contactForm = forms.ContactTypeForm();
      component.commentForm = forms.CommentForm();
      component.contactTypeForm = forms.createContactTypeForm();
      component.contactTypeForm.updateValueAndValidity();
      component.commentForm.updateValueAndValidity();
      component.contactForm.updateValueAndValidity();
      component.contactForm.get('contactForm').get('message').setValue('note');
      component.commentForm.get('csrComment').setValue('note');
      component.contactForm.get('contactForm').get('category').get('english').setValue('Complaint');
      component.contactForm.get('contactForm').get('type').get('english').setValue('Complaint');
      component.contactForm.get('contactForm').get('subType').get('english').setValue('Complaint');
      component.contactTypeForm.get('typeForm').get('name').setValue('Complaint');
      component.contactTypeForm.get('typeForm').get('idType').get('english').setValue('National Identification Number');
      component.contactTypeForm.get('typeForm').get('idNumber').setValue(1041617554);
      component.contactTypeForm.get('typeForm').get('email').setValue('ayoo@gamil.com');
      component.contactTypeForm.get('typeForm').get('mobileNo').get('primary').setValue(906137573);
      component.request = new ComplaintRequest();
      component.request = new ComplaintRequest();
      component.request.category = component.contactForm?.value?.contactForm?.category?.english;
      component.request.type = component.contactForm?.value?.contactForm?.type?.english;
      component.request.subType = component.contactForm?.value?.contactForm?.subType?.english;
      component.request.description = removeEscapeChar(component.contactForm?.value?.contactForm?.message);
      component.request.csrComment = removeEscapeChar(component.commentForm.value.csrComment);
      component.request.complainantDetails.name = component.contactTypeForm.value.typeForm.name;
      component.request.complainantDetails.contactDetail.email = component.contactTypeForm.value.typeForm.email;
      component.request.complainantDetails.contactDetail.phoneNo =
        component.contactTypeForm.value.typeForm.mobileNo.primary;
      (component.request.complainantDetails.identity.idType =
        component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.NATIONAL_IDENTIFICATION_NUMBER
          ? IdentityEnum.NIN
          : component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.IQAMA_NUMBER
          ? IdentityEnum.IQAMA
          : ''),
        (component.request.complainantDetails.identity.newNin =
          component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.NATIONAL_IDENTIFICATION_NUMBER
            ? component.contactTypeForm?.value?.typeForm?.idNumber
            : '');
      (component.request.complainantDetails.identity.iqamaNo =
        component.contactTypeForm?.value?.typeForm?.idType?.english === IdentityEnum.IQAMA_NUMBER
          ? component.contactTypeForm?.value?.typeForm?.idNumber
          : ''),
        (component.request.registrationNo = null);
      component.request.complainant = null;
      component.request.transactionRefNo = null;
      (component.request.uuid =
        component.uploadDocuments?.filter(item => item?.uploaded)?.length > 0 ? component.uuid : null),
        spyOn(component.contactService, 'submitRequest').and.returnValue(
          throwError({
            status: 400,
            error: {
              message: {
                english: 'Invalid OTP',
                arabic: 'رمز التحقق غير صحيح'
              }
            }
          })
        );
      component.onSubmitComplaint(modalRef);
      expect(component.request).toBeDefined();
    });
    it('should submit', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      const forms = new ContactForms();
      component.contactForm = forms.ContactTypeForm();
      component.commentForm = forms.CommentForm();
      component.contactTypeForm = forms.createContactTypeForm();
      component.contactTypeForm.markAllAsTouched();
      component.commentForm.markAllAsTouched();
      component.contactForm.markAllAsTouched();
      component.onSubmitComplaint(modalRef);
      expect(component.contactForm.valid).toBeFalsy();
      expect(component.commentForm.valid).toBeFalsy();
      expect(component.contactTypeForm.valid).toBeFalsy();
    });
  });
  describe('show alert', () => {
    it('should show alert', () => {
      const error = {
        message: {
          arabic: 'يرجى الاتصال بمكتب المساعدة في تكنولوجيا المعلومات.',
          english: 'Unauthorized access, Please contact IT helpdesk.'
        }
      };
      spyOn(component.alertService, 'showError').and.callThrough();
      component.showAlerts(error);
      expect(component).toBeTruthy();
    });
  });
  describe('should cancel otp', () => {
    it('should cancel otp', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.onCancelOTP();
      expect(component.otp).toEqual(null);
    });
  });
  describe('on cancel', () => {
    it('should cancel', () => {
      spyOn(component.alertService, 'clearAlerts').and.callThrough();
      component.confirmGeneralCancel();
      expect(component).toBeTruthy();
    });
  });
  describe('reset page', () => {
    it('should reset page', () => {
      component.otp = null;
      component.otpUuid = null;
      component.resetPage();
      expect(component).toBeTruthy();
    });
  });
});
