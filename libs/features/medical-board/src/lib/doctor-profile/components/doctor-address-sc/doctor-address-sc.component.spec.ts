/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DoctorAddressScComponent } from './doctor-address-sc.component';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  LookupService,
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
  ModalServiceStub
} from 'testing';
import { throwError, of } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DoctorService, MemberService } from '../../../shared/services';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';
import { MbRouteConstants } from '../../../shared';

export const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ identificationNo: 2015767656 });

describe('DoctorAddressScComponent', () => {
  let component: DoctorAddressScComponent;
  let fixture: ComponentFixture<DoctorAddressScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [DoctorAddressScComponent],
      providers: [
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
    fixture = TestBed.createComponent(DoctorAddressScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // get personal details
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
  it('It should decline modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.decline();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  //save address
  it('should throw error on getting save address details', () => {
    spyOn(component.doctorService, 'saveAddressDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showErrorMessage');
    component.saveAddress(component.person);
    expect(component.doctorService.saveAddressDetails).toHaveBeenCalled();
  });
  it('should save address details', () => {
    spyOn(component.doctorService, 'saveAddressDetails').and.callThrough();
    component.saveAddress(component.person);
    expect(component.doctorService.saveAddressDetails).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith([
      MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(component.identificationNo)
    ]);
  });
  //save address detail
  it('should throw error on getting save address details', () => {
    spyOn(component, 'saveAddressDetail').and.returnValue();
    spyOn(component, 'showErrorMessage');
    component.addressDetailsComponent = { getAddressValidity: () => true } as unknown as AddressDcComponent;
    component.saveAddress(component.person);
    expect(component.saveAddressDetail).not.toBeNull;
    expect(component.showErrorMessage).not.toHaveBeenCalled();
  });
});
