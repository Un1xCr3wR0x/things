/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TeamManagementService } from '../../shared/services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BlockPeriod, ValidatorProfile, RouterConstants } from '../../shared';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockPeriodModalTypeEnum } from '../../shared';
import { ValidatorProfileScComponent } from './validator-profile-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplicationTypeToken,
  bindToObject,
  ContactDetails,
  WorkflowService,
  IdentityManagementService,
  UserProfile
} from '@gosi-ui/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfileForm, ActiveReportee, genericError, UserProfileData, BlockPeriodData, reporteeObject } from 'testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
export const routerSpy = { url: RouterConstants.ROUTE_MY_TEAM, navigate: jasmine.createSpy('navigate') };
describe('ValidatorProfileScComponent', () => {
  let component: ValidatorProfileScComponent;
  let fixture: ComponentFixture<ValidatorProfileScComponent>;

  beforeEach(() => {
    const teamManagementServiceStub = () => ({
      getMyTeamMembers: teamRequest => ({ subscribe: f => f({}) }),
      getVacationPeriods: userId => ({ subscribe: f => f({}) }),
      setVacationPeriods: vacationObject => ({ subscribe: f => f({}) }),
      updateVacationPeriods: (vacationObject, employeeVacationId) => ({
        subscribe: f => f({})
      }),
      deleteVacationPeriods: blockPeriod => ({ subscribe: f => f({}) }),
      getReporteeStatus: userid => ({ subscribe: f => f({}) }),
      validatorProfile: reporteeObject
    });

    const bsModalServiceStub = () => ({ show: (template, config) => ({}) });
    const datePipeStub = () => ({ transform: (startDate, string) => ({}) });
    const formBuilderStub = () => ({ group: object => ({}) });
    const activatedRouteStub = () => ({
      queryParams: { subscribe: f => f({}) }
    });
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientModule, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ValidatorProfileScComponent],
      providers: [
        {
          provide: TeamManagementService,
          useFactory: teamManagementServiceStub
        },
        { provide: BsModalService, useFactory: bsModalServiceStub },
        { provide: DatePipe, useFactory: datePipeStub },
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: Router, useValue: routerSpy },
        HttpClientModule
      ]
    });
    fixture = TestBed.createComponent(ValidatorProfileScComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      endDate: new FormControl(new Date()),
      startDate: new FormControl(new Date()),
      reason: new FormControl('Reason')
    });
    component.userId = '101';
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`blockPeriods has default value`, () => {
    expect(component.blockPeriods).toEqual([]);
  });

  it(`type has default value`, () => {
    expect(component.type).toEqual(BlockPeriodModalTypeEnum);
  });
  describe('ngOninit', () => {
    it('should ngoninit', () => {
      const profileForm = new ProfileForm();
      component.form = profileForm.createProfileForm();
      spyOn(component, 'getProfileData').and.callThrough();
      spyOn(component, 'getVacationPeriods').and.callThrough();
      component.ngOnInit();
      expect(component.form).toBeDefined();
    });
    it('should ngoninit', () => {
      const profileForm = new ProfileForm();
      component.form = profileForm.createProfileForm();
      component.router.navigate([RouterConstants.ROUTE_MY_TEAM]);
      component.ngOnInit();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_MY_TEAM]);
      expect(component.form).toBeDefined();
    });
  });
  describe('deleteVacationPeriod', () => {
    it('makes expected calls', () => {
      const teamManagementServiceStub: TeamManagementService = fixture.debugElement.injector.get(TeamManagementService);
      const blockPeriodStub: BlockPeriod = <any>{};
      spyOn(component, 'getVacationPeriods').and.callThrough();
      spyOn(component, 'hideModal').and.callThrough();
      spyOn(teamManagementServiceStub, 'deleteVacationPeriods').and.callThrough();
      component.deleteVacationPeriod(blockPeriodStub);
      expect(component.getVacationPeriods).toHaveBeenCalled();
      expect(component.hideModal).toHaveBeenCalled();
      expect(teamManagementServiceStub.deleteVacationPeriods).toHaveBeenCalled();
    });
  });

  describe('onConfirm', () => {
    it('makes expected calls', () => {
      spyOn(component, 'deleteVacationPeriod').and.callThrough();
      component.onConfirm();
      expect(component.deleteVacationPeriod).toHaveBeenCalled();
    });
  });
  describe('getCurrent sts', () => {
    it('makes expected calls', () => {
      const response = [
        {
          channel: 'tamam',
          userId: 'e0026212',
          startDate: null,
          endDate: null,
          reason: 'reason',
          status: '3',
          employeeVacationId: '1234e'
        }
      ];
      component.getCurrentStatus(response);
      expect(response[0].channel).toEqual('tamam');
    });
    it('makes expected calls', () => {
      const response = [];
      component.getCurrentStatus(response);
      expect(response.length).toEqual(0);
    });
  });
  describe('getVacationPeriods', () => {
    it('makes expected calls', () => {
      const teamManagementServiceStub: TeamManagementService = fixture.debugElement.injector.get(TeamManagementService);
      spyOn(teamManagementServiceStub, 'getVacationPeriods').and.callThrough();
      component.getVacationPeriods();
      expect(teamManagementServiceStub.getVacationPeriods).toHaveBeenCalled();
    });
  });

  describe('setVacationPeriod', () => {
    it('makes expected calls', () => {
      const teamManagementServiceStub: TeamManagementService = fixture.debugElement.injector.get(TeamManagementService);
      spyOn(component, 'getVacationPeriods').and.callThrough();
      spyOn(component, 'hideModal').and.callThrough();
      spyOn(teamManagementServiceStub, 'setVacationPeriods').and.callThrough();
      component.setVacationPeriod();
      expect(component.getVacationPeriods).toHaveBeenCalled();
      expect(component.hideModal).toHaveBeenCalled();
      expect(teamManagementServiceStub.setVacationPeriods).toHaveBeenCalled();
    });
  });

  describe('updateVacationPeriod', () => {
    it('makes expected calls', () => {
      component.blockPeriod = {
        employeeVacationId: 101,
        endDate: new Date(),
        reason: 'Reason',
        startDate: new Date(),
        status: 100,
        userId: '101',
        channel: 'tamam'
      };
      const teamManagementServiceStub: TeamManagementService = fixture.debugElement.injector.get(TeamManagementService);
      spyOn(component, 'getVacationPeriods').and.callThrough();
      spyOn(component, 'hideModal').and.callThrough();
      spyOn(teamManagementServiceStub, 'updateVacationPeriods').and.callThrough();
      component.updateVacationPeriod();
      expect(component.getVacationPeriods).toHaveBeenCalled();
      expect(component.hideModal).toHaveBeenCalled();
      expect(teamManagementServiceStub.updateVacationPeriods).toHaveBeenCalled();
    });
  });
  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.hideModal();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('should show modal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.showModal(modalRef, 'lg');
    expect(component.modalRef).not.toEqual(null);
  });
  describe('get profile data', () => {
    it('should get profile data', () => {
      const userid = 'e0026212';
      spyOn(component.idmService, 'getProfile').and.returnValue(of(bindToObject(new UserProfile(), UserProfileData)));
      spyOn(component.tmService, 'getVacationPeriods').and.returnValue(
        of([bindToObject(new BlockPeriod(), BlockPeriodData)])
      );
      component.contact = new ContactDetails();
      component.validatorProfileDetails = new ValidatorProfile();
      component.getProfileData();
      expect(userid).not.toEqual(null);
      expect(component.contact).toBeDefined();
      expect(component.validatorProfileDetails).toBeDefined();
      expect(component.contact.emailId.primary).not.toEqual(null);
      expect(component.contact.mobileNo.primary).not.toEqual(null);
    });
  });
  it('should open modal', () => {
    const profileForm = new ProfileForm();
    component.form = profileForm.createProfileForm();
    component.form.markAsUntouched();
    component.form.updateValueAndValidity();
    component.form.controls.reason.setValue('test');
    component.form.controls.startDate.setValue('05/05/2021');
    component.form.controls.endDate.setValue('06/05/2021');
    const action = component.type.ADD_BLOCK;
    spyOn(component, 'showModal').and.callThrough();
    component.openModal(action);
    expect(action).not.toEqual(null);
    expect(component.form).toBeDefined();
    expect(component.form).toBeTruthy();
  });
  it('should open modal', () => {
    const profileForm = new ProfileForm();
    component.form = profileForm.createProfileForm();
    component.form.markAsUntouched();
    component.form.updateValueAndValidity();
    component.form.controls.reason.setValue('test');
    component.form.controls.startDate.setValue('05/05/2021');
    component.form.controls.endDate.setValue('06/05/2021');
    const action = component.type.MODIFY_BLOCK;
    spyOn(component, 'showModal').and.callThrough();
    component.openModal(action);
    expect(action).not.toEqual(null);
    expect(component.form).toBeDefined();
    expect(component.form).toBeTruthy();
  });
  it('should open modal', () => {
    const profileForm = new ProfileForm();
    component.form = profileForm.createProfileForm();
    component.form.markAsUntouched();
    component.form.updateValueAndValidity();
    component.form.controls.reason.setValue('test');
    component.form.controls.startDate.setValue('05/05/2021');
    component.form.controls.endDate.setValue('06/05/2021');
    const action = null;
    spyOn(component, 'showModal').and.callThrough();
    component.openModal(action);
    expect(action).toEqual(null);
    expect(component.form).toBeDefined();
    expect(component.form).toBeTruthy();
  });
});
