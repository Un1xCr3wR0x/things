/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
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
  LanguageToken,
  BilingualText,
  Alert
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
  unavailablePeriodMock
} from 'testing';
import { throwError, of, BehaviorSubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DoctorService, MemberService } from '../../../shared/services';
import { DoctorUnavailablePeriodScComponent } from './doctor-unavailable-period-sc.component';

export const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({
  identificationNo: 2015767656,
  calenderId: 1234
});

describe('DoctorUnavailablePeriodScComponent', () => {
  let component: DoctorUnavailablePeriodScComponent;
  let fixture: ComponentFixture<DoctorUnavailablePeriodScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [DoctorUnavailablePeriodScComponent],
      providers: [
        FormBuilder,
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: MemberService, useClass: MemberServiceStub },
        { provide: DoctorService, useClass: DoctorServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        // { provide: Router, useValue: routerSpy },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(DoctorUnavailablePeriodScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorUnavailablePeriodScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('must initialize component', () => {
    (activatedRouteStub as any).paramMap = of(
      convertToParamMap({
        identificationNo: 2015767656,
        calenderId: 1234
      })
    );
    activatedRouteStub.paramMap.subscribe(params => {
      component.identificationNo = +params.get('identificationNo');
      component.calenderId = +params.get('calenderId');
    });
    spyOn(component, 'getPersonDetails').and.callThrough();
    spyOn(component, 'getMemberDetails').and.callThrough();
    component.ngOnInit();
    expect(component.getPersonDetails).toHaveBeenCalled();
    expect(component.getMemberDetails).toHaveBeenCalled();
  });

  it('should cancel popup', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.popUpCancel(modalRef);
    expect(component.modalRef).not.toEqual(null);
  });

  it('It should decline', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.decline();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });

  it('should navigate tp person details on confirming cancel', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    spyOn(component.router, 'navigate');
    component.confirmCancel();
    expect(component.modalRef.hide).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith([
      'home/medical-board/doctor-profile/2015767656/person-details'
    ]);
  });

  it('should throw error on getting medical board profile details', () => {
    spyOn(component.doctorService, 'getPersonDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.getPersonDetails(20157676562);
    expect(component.showError).toHaveBeenCalled();
  });

  it('should throw error on getting member details', () => {
    spyOn(component.doctorService, 'getMemberDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.getMemberDetails(20157676562, 1);
    expect(component.showError).toHaveBeenCalled();
  });

  it('should throw error on saving unavailable periods', () => {
    spyOn(component.doctorService, 'addUnavailablePeriod').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.addDetails(1);
    expect(component.showError).toHaveBeenCalled();
  });

  it('should throw error on saving unavailable periods', () => {
    spyOn(component.doctorService, 'modifyUnavailablePeriod').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.modifyDetails(1234);
    expect(component.showError).toHaveBeenCalled();
  });

  it('Should call showErrorMessage', () => {
    spyOn(component.alertService, 'showError');
    component.showError({ error: { message: new BilingualText(), details: [new Alert()] } });
    expect(component.alertService.showError).toHaveBeenCalled();
  });

  it('Should call getStart', () => {
    component.unavailableForm.get('startDate').get('gregorian').setValue(new Date('2007-05-01T00:00:00.000Z'));
    component.unavailableForm.get('endDate').get('gregorian').setValue(new Date('2007-06-01T00:00:00.000Z'));
    component.getStart();
    spyOn(component, 'checkValidity');
  });

  it('Should call checkValidity', () => {
    component.checkValidity();
  });

  it('Should call checkDateValidation', () => {
    component.checkDateValidation();
  });

  it('Should call saveDetails', () => {
    component.saveDetails();
  });
});
