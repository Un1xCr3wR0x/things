/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  LookupService,
  LanguageToken,
  BilingualText,
  Alert,
  bindToObject,
  MobileDetails
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  AlertServiceStub,
  BilingualTextPipeMock,
  genericError,
  LookupServiceStub,
  DoctorServiceStub,
  MemberServiceStub,
  ModalServiceStub,
  unAvailabilityPeriodMock,
  mobileNoTestData
} from 'testing';
import { PersonalDetailsScComponent } from './personal-details-sc.component';
import { DoctorService, MemberService } from '../../../shared/services';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Type } from '@angular/core';
import { convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { ISD_PREFIX_MAPPING } from '@gosi-ui/features/establishment/lib/validator/components';
import { MbRouteConstants, SamaStatusConstants } from '../../../shared/constants';
import { SamaStatusEnum } from '../../../shared/enums';

describe('PersonalDetailsScComponent', () => {
  let component: PersonalDetailsScComponent;
  let fixture: ComponentFixture<PersonalDetailsScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [PersonalDetailsScComponent, BilingualTextPipeMock],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: of({ identificationNo: 2015767656 })
            }
          }
        },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: MemberService, useClass: MemberServiceStub },
        { provide: DoctorService, useClass: DoctorServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(PersonalDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('must initialize component', () => {
    spyOn(component, 'getPersonDetails').and.callThrough();
    component.ngOnInit();
    expect(component.getPersonDetails).toHaveBeenCalled();
  });
  it('must getPersonDetails', () => {
    spyOn(component, 'getPersonDetails').and.callThrough();
    component.person.bankAccount.verificationStatus = SamaStatusEnum.NotApplicable;
    component.getPersonDetails(123);
    expect(component.getPersonDetails).toHaveBeenCalled();
    expect(component.bankStatus).not.toEqual(null);
    expect(component.bankStatus).toEqual(SamaStatusConstants.VERIFIED);
  });
  it('must getPersonDetails', () => {
    spyOn(component, 'getPersonDetails').and.callThrough();
    component.person.bankAccount.verificationStatus = SamaStatusEnum.SamaNotVerified;
    component.getPersonDetails(123);
    expect(component.getPersonDetails).toHaveBeenCalled();
    expect(component.bankStatus).not.toEqual(null);
    expect(component.bankStatus).toEqual(SamaStatusConstants.VERIFICATION_IN_PROGRESS);
  });
  it('must getPersonDetails', () => {
    spyOn(component, 'getPersonDetails').and.callThrough();
    component.person.bankAccount.verificationStatus = SamaStatusEnum.SamaVerificationFailed;
    component.getPersonDetails(123);
    expect(component.getPersonDetails).toHaveBeenCalled();
    expect(component.bankStatus).not.toEqual(null);
    expect(component.bankStatus).toEqual(SamaStatusConstants.VERIFICATION_FAILED);
  });
  it('must getPersonDetails', () => {
    spyOn(component, 'getPersonDetails').and.callThrough();
    component.person.bankAccount.verificationStatus = SamaStatusEnum.SamaExpired;
    component.getPersonDetails(123);
    expect(component.getPersonDetails).toHaveBeenCalled();
    expect(component.bankStatus).not.toEqual(null);
    expect(component.bankStatus).toEqual(SamaStatusConstants.EXPIRED);
  });
  //edit address details
  it('should navigate to address page', () => {
    // component.editAddressDetail();
    expect(component.router.navigate).toHaveBeenCalledWith(['home/medical-board/doctor-profile/2015767656/address']);
  });
  //edit bank details
  it('should navigate to bank details', () => {
    // component.editBankDetails();
    expect(component.router.navigate).toHaveBeenCalledWith(['home/medical-board/doctor-profile/2015767656/bank']);
  });
  //edit contact details
  it('should navigate to contact details', () => {
    // component.editContactDetail();
    expect(component.router.navigate).toHaveBeenCalledWith([
      'home/medical-board/doctor-profile/2015767656/contact/edit'
    ]);
  });
  //edit contract details
  it('should navigate to contract details', () => {
    // component.editMemberDetails();
    expect(component.router.navigate).toHaveBeenCalledWith([
      'home/medical-board/doctor-profile/2015767656/doctor-details'
    ]);
  });
  //add unavailable data
  it('should navigate to add unavailable data', () => {
    component.addUnavailableData();
    expect(component.router.navigate).toHaveBeenCalledWith([
      'home/medical-board/doctor-profile/2015767656/add-unavailable-period'
    ]);
  });
  //modify contract
  it('should modify contract', () => {
    const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
    component.modifyContractDetails(templateRef);
    expect(component.router.navigate).toHaveBeenCalledWith([
      `home/medical-board/doctor-profile/2015767656/modify-contract/${component.contractId}`
    ]);
  });
  //modify unavailable period
  it('should showRemoveModal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.showRemoveModal(modalRef);
  });
  it('should modify unavailable period', () => {
    component.modifyUnavailableData();
    expect(component.router.navigate).toHaveBeenCalledWith([
      MbRouteConstants.ROUTE_PROFILE_MODIFY_UNAVAILABLE_PERIOD(
        component.identificationNo,
        component.unavailableList[component.index]?.calendarId
      )
    ]);
  });
  it('should getUnavailablePeriod', () => {
    // spyOn(component, 'showError').and.callThrough();
    spyOn(component.doctorService, 'getUnavailablePeriod');
    component.getPeriodData('professionalId');
    expect(component.doctorService.getUnavailablePeriod).toHaveBeenCalled();
  });
  it('should removePeriod', () => {
    spyOn(component.doctorService, 'removeUnavailablePeriod');
    component.removePeriod();
    expect(component.doctorService.removeUnavailablePeriod).toHaveBeenCalled();
  });
  it('should removePeriod', () => {
    spyOn(component, 'showErrorMessage').and.callThrough();
    spyOn(component.doctorService, 'removeUnavailablePeriod').and.returnValue(throwError(genericError));
    component.removePeriod();
    expect(component.showErrorMessage).toHaveBeenCalled();
  });
  it('should throw error on unavailable period data', () => {
    spyOn(component, 'showError').and.callThrough();
    spyOn(component.doctorService, 'getUnavailablePeriod').and.returnValue(throwError(genericError));
    component.getPeriodData('professionalId');
    expect(component.showError).toHaveBeenCalled();
  });
  it('should get prefix for the corresponsing isd code', () => {
    const mobileNum = bindToObject(new MobileDetails(), mobileNoTestData);
    expect(component.getISDCodePrefix(mobileNum)).toBe(ISD_PREFIX_MAPPING.sa);
  });
  //cancel form
  it('It should cancel form', () => {
    component.cancelForm();
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/medical-board/list-members']);
  });
  //cancel removing
  it('It should navigate', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide').and.callThrough();
    component.cancelRemoving();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  //show error message
  it('Should call showErrorMessage', () => {
    spyOn(component.alertService, 'showError').and.callThrough();
    component.showErrorMessage({ error: { message: new BilingualText(), details: [new Alert()] } });
    expect(component.alertService.showError).toHaveBeenCalled();
  });
  // should call getContractId
  it('should call  getContractId', () => {
    const data = 12;
    const i = 1;
    component.getContractId(data, i);
  });
  //should call terminateContract
  it('should call  terminateContract', () => {
    const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
    component.terminateContract(templateRef);
  });
  //should call setIndex
  it('should call setIndex', () => {
    const data = 12;
    component.setIndex(data);
  });
  //should show modal
  it('should show modal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.showModal(modalRef, 'lg');
    expect(component.modalRef).not.toEqual(null);
  });
  //should cancel transaction
  it('should cancel transaction', () => {
    component.bsModalRef = new BsModalRef();
    spyOn(component.bsModalRef, 'hide');
    component.closeModal();
    expect(component.bsModalRef.hide).toHaveBeenCalled();
  });
  it('should contractHistory', () => {
    component.contractHistory(123123132);
    expect(component.router.navigate).toHaveBeenCalledWith([
      MbRouteConstants.ROUTE_CONTRACT_HISTORY(component.person.contracts[0].mbProfessionalId, 123123132)
    ]);
  });
});
