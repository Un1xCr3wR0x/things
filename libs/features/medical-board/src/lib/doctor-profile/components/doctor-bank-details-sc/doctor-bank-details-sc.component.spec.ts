/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  LookupService,
  BilingualText,
  Alert,
  LovList
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  AlertServiceStub,
  ActivatedRouteStub,
  genericError,
  LookupServiceStub,
  DoctorServiceStub,
  MemberServiceStub,
  ModalServiceStub,
  bankDetailsByIBAN
} from 'testing';
import { throwError, of } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DoctorService, MemberService } from '../../../shared/services';
import { DoctorBankDetailsScComponent } from './doctor-bank-details-sc.component';
import { SamaStatusConstants, SamaStatusEnum, SamaStatusNumberEnum } from '../../../shared';

export const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ identificationNo: 2015767656 });

describe('DoctorBankDetailsScComponent', () => {
  let component: DoctorBankDetailsScComponent;
  let fixture: ComponentFixture<DoctorBankDetailsScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  const lookupServiceSpy = jasmine.createSpyObj<LookupService>('LookupService', ['getBank']);
  lookupServiceSpy.getBank.and.returnValue(of(<any>new LovList([bankDetailsByIBAN])));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [DoctorBankDetailsScComponent],
      providers: [
        FormBuilder,
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: MemberService, useClass: MemberServiceStub },
        { provide: DoctorService, useClass: DoctorServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(DoctorBankDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('must initialize component', () => {
    (activatedRouteStub as any).paramMap = of(
      convertToParamMap({
        identificationNo: 2015767656
      })
    );
    activatedRouteStub.paramMap.subscribe(params => {
      component.identificationNo = +params.get('identificationNo');
    });
    spyOn(component, 'getPersonDetails').and.callThrough();
    component.ngOnInit();
    expect(component.getPersonDetails).toHaveBeenCalled();
  });

  //show error message
  it('Should call showErrorMessage', () => {
    spyOn(component.alertService, 'showError');
    component.showErrorMessage({ error: { message: new BilingualText(), details: [new Alert()] } });
    expect(component.alertService.showError).toHaveBeenCalled();
  });

  it('It should save bank details', () => {
    spyOn(component.alertService, 'clearAlerts');
    component.saveBankDetails();
    expect(component.alertService.clearAlerts).toHaveBeenCalled();
  });

  it('It should save bank details show mandatory error', () => {
    spyOn(component.alertService, 'showMandatoryErrorMessage');
    component.BankDetailsForm = component.createBankDetailsForm();
    component.saveBankDetails();
    expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
  });

  it('it should thow error on save bank', () => {
    spyOn(component.doctorService, 'saveBankDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showErrorMessage');
    component.saveBank(component.person);
    expect(component.doctorService.saveBankDetails).toHaveBeenCalled();
  });

  it('it should thow error on get Person Details', () => {
    spyOn(component.doctorService, 'getPersonDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showErrorMessage');
    component.getPersonDetails(1234);
    expect(component.doctorService.getPersonDetails).toHaveBeenCalled();
  });

  it('It should navigate', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.confirmCancel();
    expect(component.modalRef.hide).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith([
      'home/medical-board/doctor-profile/2015767656/person-details'
    ]);
  });
  //cancel popup
  it('should cancel popup', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.popUpCancel(modalRef);
    expect(component.modalRef).not.toEqual(null);
  });
  //decline
  it('It should decline', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.decline();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('It should populate value', () => {
    spyOn(component.lookUpService, 'getBank').and.callThrough();
    component.person.bankAccount.verificationStatus = SamaStatusEnum.SamaVerified;
    component.populateValue();
    expect(component.BankDetailsForm.get('bankStatus').value).toEqual(SamaStatusConstants.VERIFIED);
  });
  it('It should populate value', () => {
    spyOn(component.lookUpService, 'getBank').and.callThrough();
    component.person.bankAccount.verificationStatus = SamaStatusEnum.SamaVerificationPending;
    component.populateValue();
    expect(component.BankDetailsForm.get('bankStatus').value).toEqual(SamaStatusConstants.VERIFICATION_IN_PROGRESS);
  });
  it('It should populate value', () => {
    spyOn(component.lookUpService, 'getBank').and.callThrough();
    component.person.bankAccount.verificationStatus = SamaStatusEnum.SamaIbanNotVerifiable;
    component.populateValue();
    expect(component.BankDetailsForm.get('bankStatus').value).toEqual(SamaStatusConstants.VERIFICATION_FAILED);
  });
  it('It should populate value', () => {
    spyOn(component.lookUpService, 'getBank').and.callThrough();
    component.person.bankAccount.verificationStatus = SamaStatusEnum.SamaExpired;
    component.populateValue();
    expect(component.BankDetailsForm.get('bankStatus').value).toEqual(SamaStatusConstants.EXPIRED);
  });
  xit('It should save bank details', () => {
    spyOn(component.alertService, 'clearAlerts');
    component.saveBankDetails();
    component.person.bankAccount.verificationStatus = SamaStatusNumberEnum.NotApplicable;
    component.saveBank(component.person);
    expect(component.doctorService.saveBankDetails).toHaveBeenCalled();
  });
});
