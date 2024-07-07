/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormControl } from '@angular/forms';
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
import * as FormUtil from '@gosi-ui/core/lib/utils/form';
import { TranslateModule } from '@ngx-translate/core';
import {
  AlertServiceStub,
  ActivatedRouteStub,
  genericError,
  LookupServiceStub,
  DoctorServiceStub,
  MemberServiceStub,
  ModalServiceStub
} from 'testing';
import { throwError, of, BehaviorSubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DoctorService, MemberService } from '../../../shared/services';
import { DoctorDetailsScComponent } from './doctor-details-sc.component';

export const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ identificationNo: 2015767656 });

describe('DoctorDetailsScComponent', () => {
  let component: DoctorDetailsScComponent;
  let fixture: ComponentFixture<DoctorDetailsScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [DoctorDetailsScComponent],
      providers: [
        FormBuilder,
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: MemberService, useClass: MemberServiceStub },
        { provide: DoctorService, useClass: DoctorServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(DoctorDetailsScComponent);
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
  //save contract
  it('should throw error on getting save contract details', () => {
    spyOn(component, 'showErrorMessage');
    component.getFormValues();
    expect(component.showErrorMessage).not.toHaveBeenCalled();
  });

  //ngonchange
  it('should ngonchange', () => {
    spyOn(component, 'ngOnChanges');
    expect(component.ngOnChanges).not.toHaveBeenCalled();
  });

  //checkfrom validity
  it('should checkfrom validity', () => {
    const funcSpy = jasmine.createSpy('markFormGroupUntouched').and.returnValue('mockReturnValue');
    spyOnProperty(FormUtil, 'markFormGroupUntouched', 'get').and.returnValue(funcSpy);
    component.checkFormValidity();
  });
  //disable control
  it('should disable control', () => {
    component.disableControl(new FormControl('Test'));
  });

  //saveMemberDetil
  it('should checkfrom validity', () => {
    const funcSpy = jasmine.createSpy('markFormGroupUntouched').and.returnValue('mockReturnValue');
    spyOnProperty(FormUtil, 'markFormGroupUntouched', 'get').and.returnValue(funcSpy);
    component.saveMemberDetil();
  });
  //getSubSpecialtyDetail
  it('should checkfrom validity', () => {
    const funcSpy = jasmine.createSpy('markFormGroupUntouched').and.returnValue('mockReturnValue');
    spyOnProperty(FormUtil, 'markFormGroupUntouched', 'get').and.returnValue(funcSpy);
    let list: BilingualText[] = [
      {
        arabic: 'الكويت',
        english: 'Region Kuwait'
      }
    ];
    component.getSubSpecialtyDetail(list);
  });
  //getRegionDetail
  it('should checkfrom validity', () => {
    const funcSpy = jasmine.createSpy('markFormGroupUntouched').and.returnValue('mockReturnValue');
    spyOnProperty(FormUtil, 'markFormGroupUntouched', 'get').and.returnValue(funcSpy);
    let list: BilingualText[] = [
      {
        arabic: 'الكويت',
        english: 'Region Kuwait'
      }
    ];
    component.getRegionDetail(list);
  });
});
