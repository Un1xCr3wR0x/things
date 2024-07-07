import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, ApplicationTypeEnum, ApplicationTypeToken, Captcha, CaptchaService } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ActivatedRouteStub, AlertServiceStub } from 'testing';
import { BypassReassessmentService, ValidateCaptchaResponse } from '../../shared';
import { AuthenticateCaptchaScComponent } from './authenticate-captcha-sc.component';

const routerSpy = { url: '', navigate: jasmine.createSpy('navigate') };

describe('AuthenticateContributorScComponent', () => {
  let component: AuthenticateCaptchaScComponent;
  let fixture: ComponentFixture<AuthenticateCaptchaScComponent>;
  const captchaServiceSpy = jasmine.createSpyObj<CaptchaService>('CaptchaService', ['getCaptchaCode']);
  captchaServiceSpy.getCaptchaCode.and.returnValue(of({ ...new Captcha(), captcha: '', captchaId: 1234 }));
  const bypassReassessmentServiceSpy = jasmine.createSpyObj<BypassReassessmentService>('BypassReassessmentService', [
    'validateAssessment',
    'setMobileNo',
    'identifier',
    'validateCaptcha',
    'setisValid',
    'setUuid',
    'setisValid'
  ]);
  bypassReassessmentServiceSpy.validateAssessment.and.returnValue(
    of({ ...new ValidateCaptchaResponse(), personIdentifier: 1234, mobileNo: '123456789' })
  );
  bypassReassessmentServiceSpy.validateCaptcha.and.returnValue(
    of({ ...new ValidateCaptchaResponse(), mobileNo: '123456789' })
  );
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [AuthenticateCaptchaScComponent],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: BypassReassessmentService, useValue: bypassReassessmentServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: CaptchaService, useValue: captchaServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticateCaptchaScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('initialiseFromRoute', () => {
    it('should initialiseFromRoute', () => {
      (component as any).route = { queryParams: of({ reference_number: '38523692' }) };
      component.initialiseFromRoute();
      expect(component.referenceNo).not.toEqual(null);
    });
  });
  describe('getCaptcha', () => {
    it('should getCaptcha', () => {
      component.personIdentifier = 10000602;
      component.getCaptcha();
      expect(component.captchaId).not.toEqual(null);
    });
  });
  describe('getPersonId', () => {
    it('should getPersonId', () => {
      const nin = 10000602;
      component.getPersonId(nin);
      expect(component.captchaId).not.toEqual(null);
    });
  });
  describe('validateCaptchaDetails', () => {
    it('should validateCaptchaDetails', () => {
      component.referenceNo = '2a199dc3';
      component.validateCaptchaDetails();
      expect(component.personIdentifier).not.toEqual(null);
    });
  });
  describe('verifyCaptcha', () => {
    it('should verifyCaptcha', () => {
      component.verifyCaptcha();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });

  describe('sendOtp', () => {
    it('should sendOtp', () => {
      component.isValid = false;
      const referenceNo = '2a199dc3';
      const identifier = 1031027616;
      const xCaptcha = 'g545dgf4gfd5f4gd54';
      component.isValid = true;
      component.referenceNo = referenceNo;
      component.sendOTP({ identity: identifier, captchaValue: xCaptcha });
      expect(component.sendOTP).toBeDefined();
    });
  });
  describe('showErrorAlert', () => {
    it('should showErrorAlert', () => {
      const key = 'afdhgfjkhu12343v';
      component.showErrorAlert(key);
      expect(component.showErrorAlert).toBeDefined();
    });
  });
});
