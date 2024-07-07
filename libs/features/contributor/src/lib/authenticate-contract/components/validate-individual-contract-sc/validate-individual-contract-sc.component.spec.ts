/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertService, CaptchaService, OTPService } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import {
  ActivatedRouteStub,
  AlertServiceStub,
  CaptchaServiceStub,
  ContractAuthenticationServiceStub,
  genericError,
  OTPServiceStub
} from 'testing';
import { ContractAuthenticationService, ValidateContractResponse } from '../../../shared';
import { ValidateIndividualContractScComponent } from './validate-individual-contract-sc.component';
const routerSpy = { url: '', navigate: jasmine.createSpy('navigate') };

let activatedRoute = new ActivatedRouteStub(undefined, { reference_number: 'bf93d841' });
// activatedRoute.setQueryParams({ from: 'inbox' });
describe('ValidateIndividualContractScComponent', () => {
  let component: ValidateIndividualContractScComponent;
  let fixture: ComponentFixture<ValidateIndividualContractScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        BrowserDynamicTestingModule,
        RouterModule.forRoot(undefined),
        HttpClientTestingModule
      ],
      declarations: [ValidateIndividualContractScComponent],
      providers: [
        { provide: ContractAuthenticationService, useClass: ContractAuthenticationServiceStub },
        { provide: OTPService, useClass: OTPServiceStub },
        { provide: CaptchaService, useClass: CaptchaServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateIndividualContractScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get contract reference id', () => {
    (component as any).route = { queryParams: of({ reference_number: '38523692' }) };
    component.initialiseFromRoute().subscribe(() => {
      expect(component.referenceNo).toBeDefined();
    });
  });

  it('should navigate to invalid screen for invalid contract', () => {
    spyOn(component.contractService, 'validateContract').and.returnValue(throwError(genericError));
    component.validateContractDetails();
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should validate contract', () => {
    spyOn(component.contractService, 'validateCaptchaContract').and.returnValue(
      throwError({
        error: {
          uuid: '027e3fb8-b83d-4a89-b23b-59c8b1943d82'
        },
        status: 401
      })
    );
    component.sendOTP({
      identity: 1322021138,
      captchaValue: 'tev6'
    });
    expect(component.uuid).toBeDefined();
  });

  it('should  throw error  while validating contract', () => {
    spyOn(component.contractService, 'validateCaptchaContract').and.returnValue(throwError(genericError));
    component.sendOTP({
      identity: 1322021138,
      captchaValue: 'tev6'
    });
    expect(component.errorRes).toBeDefined();
  });

  it('should verify otp', () => {
    component.verifyOTP(1234);
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should throw error on verify otp', () => {
    component.referenceNo = '324234';
    spyOn(component.contractService, 'verifyOTP').and.returnValue(throwError(genericError));
    component.verifyOTP(1234);
    expect(component.errorRes).toBeDefined();
  });

  it('should cancel transaction', () => {
    component.referenceNo = '23423434';
    spyOn(component.contractService, 'validateContract').and.returnValue(of(undefined));
    component.cancelLogin();
    expect(component.contractService.validateContract).toHaveBeenCalled();
  });

  it('should throw error on resending otp', () => {
    spyOn(component.otpService, 'reSendOTP').and.returnValue(throwError(genericError));
    component.reSendOTP();
    expect(component.errorRes).toBeDefined();
  });
});
