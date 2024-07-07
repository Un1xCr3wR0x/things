/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { RejectedInjuryReportsScComponent } from './rejected-injury-reports-sc.component';
import { OhClaimsService } from '../../shared/services/oh-claims.service';
import { BrowserModule } from '@angular/platform-browser'; 
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { OhMockService, AlertServiceStub, ModalServiceStub, genericError, sinResponseData, contractSocialInsuranceNo } from 'testing';
import { AlertService, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('RejectedInjuryReportsScComponent', () => {
  let component: RejectedInjuryReportsScComponent;
  let fixture: ComponentFixture<RejectedInjuryReportsScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        BrowserDynamicTestingModule
      ],
      declarations: [RejectedInjuryReportsScComponent],
      providers: [
        { provide: OhClaimsService, useClass: OhMockService },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: BsModalService, useClass: ModalServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RejectedInjuryReportsScComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(RejectedInjuryReportsScComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('RejectedInjuryReportsScComponent', () => {
    it('should getRejectedCount', () => {
      component.getRejectedCount();
      expect(component.rejectedCount).not.toBe(null);
    });
  });
  it('should selectRange', () => {
    component.selectRange();
    expect(component.isThirtyDays).toBeTruthy();
  });
  it('should selectDateRange', () => {
    component.selectDateRange();
    expect(component.isThirtyDays).toBeFalsy();
  });
  it('should getRejectedCount', () => {
    spyOn(component.claimsService, 'getRejectedCount').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.getRejectedCount();
    expect(component.showError).toHaveBeenCalled();
  });
  it('should identitySelect', () => {
    component.identitySelect('');
    expect(component.isSinSelected).toBeTruthy();

  });
  it('should getClaimsAmount', () => {
    spyOn(component.claimsService, 'getClaimsAmount').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.generateClaimsAmount();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should generateCasesExceeds', () => {
    spyOn(component.claimsService, 'generateCasesExceedsReport').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.generateCasesExceeds();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should generateDailyAllowance', () => {
    spyOn(component.claimsService, 'generateDailyAllowanceReport').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.generateDailyAllowance();
    expect(component.showError).toHaveBeenCalled();
  });

  it('should generateInjuriesMore', () => {
    spyOn(component.claimsService, 'generateInjuriesMoreReport').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.generateInjuriesMore(this);
    expect(component.showError).toHaveBeenCalled();
  });

  it('should generateInjuryStatus', () => {
    spyOn(component.claimsService, 'getInjuryPeriodReport').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.generateInjuryStatus();
    expect(component.showError).toHaveBeenCalled(); 
  });

  it('should generateClosedPassed', () => {
    spyOn(component.claimsService, 'generateClosedReport').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.generateClosedPassed(true, []);
    expect(component.showError).toHaveBeenCalled();
  });

  it('should generateRecoveryForm', () => {
    spyOn(component.claimsService, 'getRecoveryReport').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.generateRecoveryForm();
    expect(component.showError).toHaveBeenCalled();
  });
  it('should hideModal', () => {
    component.hideModal();
    expect(component.showErrorMessage).toBeFalsy();
    expect(component.showMandatoryMessage).toBeFalsy();
    expect(component.resetClosed).toBeNull();


  });



     
  
});

