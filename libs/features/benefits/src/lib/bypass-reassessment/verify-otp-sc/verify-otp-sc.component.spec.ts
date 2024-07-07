/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { VerifyOtpScComponent } from './verify-otp-sc.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRouteStub, ModalServiceStub, AlertServiceStub, genericError } from 'testing';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationTypeToken, ApplicationTypeEnum, LanguageToken, AlertService } from '@gosi-ui/core';

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { BypassReassessmentService } from '../../shared';

const routerSpy = { url: '', navigate: jasmine.createSpy('navigate') };

describe('VerifyOtpScComponent', () => {
  let component: VerifyOtpScComponent;
  let fixture: ComponentFixture<VerifyOtpScComponent>;
  const bypassServiceSpy = jasmine.createSpyObj<BypassReassessmentService>('BypassReassessmentService', [
    'getisValid',
    'getMobileNo',
    'getUuid',
    'authorization',
    'resendOTP',
    'setUuid',
    'verifyOTP'
  ]);
  bypassServiceSpy.getisValid.and.returnValue(true);
  bypassServiceSpy.getMobileNo.and.returnValue('123456789');
  bypassServiceSpy.getUuid.and.returnValue('2AUUI');
  bypassServiceSpy.verifyOTP.and.returnValue(of(new HttpResponse()));
  bypassServiceSpy.resendOTP.and.returnValue(of(new HttpResponse()));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [VerifyOtpScComponent],
      providers: [
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: Router, useValue: routerSpy },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: BypassReassessmentService, useValue: bypassServiceSpy },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyOtpScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should isValid', () => {
    component.isValid = true;
    component._isValid = component.isValid;
    expect(component._isValid).not.toEqual(null);
  });
  it('should errorRes', () => {
    component.errorRes = { english: '', arabic: '' };
    component._errorRes = component.errorRes;
    expect(component._errorRes).not.toEqual(null);
  });
  it('should showOtpScreen', () => {
    component.verifyOtpForm = new FormGroup({
      identity: new FormControl({ value: '' }),
      otp: new FormControl({ value: new FormArray([]) })
    });
    component.showOtpScreen();
    expect(component.showOtpScreen).toBeDefined();
  });
  describe('setIdentity', () => {
    it('should setIdentity', () => {
      component.verifyOtpForm = new FormGroup({
        identity: new FormControl({ value: '' }),
        otp: new FormControl({ value: new FormArray([]) })
      });
      component.personId = 31123989279;
      component.setIdentity();
      expect(component.setIdentity).toBeDefined();
    });
  });
  describe('setError', () => {
    it('should setError', () => {
      let messageKey = '';
      component.setError(messageKey);
      expect(component.setError).toBeDefined();
    });
  });
  describe('clearAlert', () => {
    it('should clearAlert', () => {
      component.clearAlert();
      expect(component.clearAlert).toBeDefined();
    });
  });
  describe('navigateToAssessment', () => {
    it('should navigateToAssessment', () => {
      component.navigateToAssessment();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('verifyOtp', () => {
    it('should verifyOtp', () => {
      component.verifyOtpForm = new FormGroup({
        identity: new FormControl({ value: '' }),
        otp: new FormControl({ value: new FormArray([]) })
      });
      component.referenceNo = '1234';
      component.personId = 1234;
      component.uuid = '2AUUI';
      component.verifyOtp();
      expect(component.verifyOtp).toBeDefined();
    });
    it('should verifyOtp', () => {
      component.verifyOtpForm = new FormGroup({ otp: new FormControl({ value: null }) });
      component.verifyOtp();
      expect(component.verifyOtp).toBeDefined();
    });
    it('should verifyOtp', () => {
      component.verifyOtpForm = new FormGroup({});
      component.verifyOtp();
      expect(component.verifyOtp).toBeDefined();
    });
  });
  describe('verifyOTP', () => {
    it('should verifyOTP', () => {
      component.verifyOtpForm = new FormGroup({
        identity: new FormControl({ value: '' }),
        otp: new FormControl({ value: new FormArray([]) })
      });
      component.referenceNo = '2a199dc3';
      component.personId = 423641258;
      component.uuid = '2AUUI';
      component.verifyOTP('28775ea5-6a09-41eb-9bcb-97555f272895:1298');
      expect(component.verifyOTP).toBeDefined();
    });
  });

  describe('reSendOtp', () => {
    it('should resendOtp', () => {
      component.referenceNo = '2a199dc3';
      component.personId = 423641258;
      component.reSendOtp();
      expect(component.reSendOtp).toBeDefined();
    });
  });
  describe('hasRetriesExceeded', () => {
    it('should hasRetriesExceeded', () => {
      component.hasRetriesExceeded();
      expect(component.hasRetriesExceeded).toBeDefined();
    });
  });
  describe('cancelTransaction', () => {
    it('should cancelTransaction', () => {
      component.modalRef = new BsModalRef();
      component.cancelTransaction();
      expect(component.cancelTransaction).toBeDefined();
    });
  });
  describe('showModal', () => {
    it('should show modal', () => {
      component.modalRef = new BsModalRef();
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.modalRef).not.toBeNull();
    });
  });
  describe('confirm', () => {
    it('confirm', () => {
      component.modalRef = new BsModalRef();
      component.confirm();
      expect(component.confirm).toBeDefined();
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.modalRef = new BsModalRef();
      component.decline();
      expect(component.decline).toBeDefined();
    });
  });
  describe('routeBack', () => {
    it('should routeBack', () => {
      component.routeBack();
      expect(component.routeBack).toBeTruthy();
    });
  });
});
