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
  RouterDataToken,
  RouterData,
  LanguageToken
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
  BilingualTextPipeMock
} from 'testing';
import { throwError, of, BehaviorSubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DoctorService, MemberService } from '../../../shared/services';
import { DoctorContactScComponent } from './doctor-contact-sc.component';
import { Contracts, MemberData, PersonWrapper, UpdateDoctorResponse } from '../../../shared';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { DatePipe } from '@angular/common';

export const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ identificationNo: 2015767656 });

describe('DoctorContactScComponent', () => {
  let component: DoctorContactScComponent;
  let fixture: ComponentFixture<DoctorContactScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const doctorServiceSpy = jasmine.createSpyObj<DoctorService>('DoctorService',[
    'getContractDetails',
    'getContractProfileDetail',
    'getContractDataDetail',
    'getPersonDetails',
    'getPerson'

  ]);
  doctorServiceSpy.getContractDetails.and.returnValue(of(new Contracts[0]()));
  doctorServiceSpy.getContractProfileDetail.and.returnValue(of(new MemberData[0]()));
  doctorServiceSpy.getContractDataDetail.and.returnValue(of(new UpdateDoctorResponse[0]()));
  doctorServiceSpy.getPerson.and.returnValue(of(new PersonWrapper[0]()));
  doctorServiceSpy.revertTransactionDetails.and.returnValue(of(true));
  doctorServiceSpy.getPersonDetails.and.returnValue(of(new UpdateDoctorResponse[0]()));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [DoctorContactScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: DoctorService, useValue: doctorServiceSpy },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: Router, useValue: routerSpy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        FormBuilder,
        DatePipe
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(DoctorContactScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
  //show error
  it('should get showError', () => {
    spyOn(component.alertService, 'showMandatoryErrorMessage');
    component.showError();
    expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
  });
  //cancel
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
  //save contact
  it('should throw error on getting save contact details', () => {
    spyOn(component.doctorService, 'saveContactDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showErrorMessage');
    component.saveContact(component.person);
    expect(component.doctorService.saveContactDetails).toHaveBeenCalled();
  });
});
