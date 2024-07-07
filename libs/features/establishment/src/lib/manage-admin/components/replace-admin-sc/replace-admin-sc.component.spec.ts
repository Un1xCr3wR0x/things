// /**
//  * ~ Copyright GOSI. All Rights Reserved.
//   ~  This software is the proprietary information of GOSI.
//   ~  Use is subject to license terms.
//  */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, RouterModule } from '@angular/router';
import { NationalityTypeEnum, RoleIdEnum, TransactionFeedback } from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  Forms,
  genericAdminResponse,
  genericAdminWrapper,
  genericError,
  genericEstablishmentResponse,
  genericGccEstablishment,
  genericOwnerReponse,
  genericPersonResponse
} from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { activatedRouteStub } from '../../../profile/components/establishment-group-profile-sc/establishment-group-profile-sc.component.spec';
import { ReplaceAdminScComponent } from './replace-admin-sc.component';

describe('ReplaceAdminScComponent', () => {
  let component: ReplaceAdminScComponent;
  let fixture: ComponentFixture<ReplaceAdminScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReplaceAdminScComponent],
      providers: [...commonProviders, { provide: ActivatedRoute, useValue: activatedRouteStub }],
      imports: [...commonImports, RouterModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceAdminScComponent);
    component = fixture.componentInstance;
    component.establishmentService.selectedAdmin = genericAdminResponse;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnit', () => {
    it('should navigate back for invalid route', () => {
      activatedRouteStub.paramMap.subscribe(params => {
        component.mainRegNo = +params.get('registrationNo');
      });

      spyOn(component, 'initialiseFromRoutes');
      component.ngOnInit();
      expect(component.initialiseFromRoutes).toHaveBeenCalled();
    });
  });

  describe(' verify admin details', () => {
    it('should verify the admin', () => {
      const forms = new Forms();
      component.estAdminForm = forms.createAdminForm();
      component.estAdminForm.addControl(
        'search',
        new FormGroup({
          nationality: new FormControl(NationalityTypeEnum.SAUDI_NATIONAL)
        })
      );
      const mainRegNo = genericGccEstablishment.registrationNo;
      const adminId = 2224477667;
      const isAdminReplace = false;
      spyOn(component.establishmentService, 'verifyPersonDetails').and.returnValue(of(genericPersonResponse));
      spyOn(component, 'checkIfTheAdminIsAlreadyPresent').and.returnValue(of(false));
      component.verifyEstAdmin(mainRegNo, adminId, isAdminReplace);
      expect(component.estAdminForm.get('isVerified').value).toBeTruthy();
    });
    it('should throw mandatory error message', () => {
      const forms = new Forms();
      component.estAdminForm = forms.createAdminForm();
      component.estAdminForm.addControl(
        'search',
        new FormGroup({
          nationality: new FormControl(NationalityTypeEnum.SAUDI_NATIONAL)
        })
      );
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      const mainRegNo = genericGccEstablishment.registrationNo;
      const adminId = 2224477667;
      const isAdminReplace = false;
      component.verifyEstAdmin(mainRegNo, adminId, isAdminReplace);
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });

  describe('Save Admin Details', () => {
    it('should save admin details', () => {
      component.estAdminForm = component.createEstAdminForm();
      const nationalityControl = new FormGroup({
        english: new FormControl(),
        arabic: new FormControl()
      });
      const emailId = new FormGroup({
        primary: new FormControl(),
        secondary: new FormControl()
      });
      const contactControl = new FormGroup({
        emailId
      });
      component.estAdmin = genericAdminResponse;
      component.estAdminForm.addControl('person', new FormGroup({ nationalityControl }));
      component.estAdminForm.addControl('contactDetail', new FormGroup({ contactControl }));
      component.estAdminForm.get('isVerified').setValue(true);
      component.estAdmin.roles = [];
      component.mainRegNo = genericGccEstablishment.registrationNo;
      component.selectedAdmin = genericAdminWrapper.admins[2];
      component.loggedInAdminId = genericPersonResponse.identity[1].iqamaNo;
      component.loggedInAdminRoleId = RoleIdEnum.SUPER_ADMIN;
      spyOn(component.adminService, 'saveAsNewAdmin').and.returnValue(of(1036053648));
      spyOn(component.adminService, 'replaceAdminDetails').and.returnValue(of(new TransactionFeedback()));
      component.saveAdmin();
      expect(component.transactionFeedback).not.toBe(null);
    });
    it(' it should throw api error', () => {
      component.estAdminForm = component.createEstAdminForm();
      const nationalityControl = new FormGroup({
        english: new FormControl(),
        arabic: new FormControl()
      });
      const emailId = new FormGroup({
        primary: new FormControl(),
        secondary: new FormControl()
      });
      const contactControl = new FormGroup({
        emailId
      });
      component.estAdmin = genericAdminResponse;
      component.estAdminForm.addControl('person', new FormGroup({ nationalityControl }));
      component.estAdminForm.addControl('contactDetail', new FormGroup({ contactControl }));
      component.estAdminForm.get('isVerified').setValue(true);
      component.mainRegNo = genericGccEstablishment.registrationNo;
      component.selectedAdmin = genericAdminWrapper.admins[2];
      spyOn(component.adminService, 'saveAsNewAdmin').and.returnValue(of(1036053648));
      spyOn(component.adminService, 'replaceAdminDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.saveAdmin();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it(' it should throw admin not added error', () => {
      const forms = new Forms();
      component.estAdminForm = forms.createMockAdminForm();
      spyOn(component.alertService, 'showErrorByKey');
      component.saveAdmin();
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
    it('should throw mandatory error on save', () => {
      const forms = new Forms();
      component.estAdmin = genericAdminWrapper.admins[0];
      component.mainRegNo = genericGccEstablishment.registrationNo;
      component.selectedAdmin = genericAdminWrapper.admins[2];
      component.estAdminForm = forms.createAdminForm();
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.saveAdmin();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });

  describe('cancel Modal', () => {
    it('should cancel popup', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component, 'hideModal');
      component.cancelModal();
      expect(component.hideModal).toHaveBeenCalled();
    });
  });
  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      component.bsModalRef = new BsModalRef();
      component.hideModal();
      expect(component.bsModalRef).not.toEqual(null);
    });
  });
  describe('Get data from Routes', () => {
    it('initialise data From Routes', () => {
      component.establishmentService.selectedAdmin = genericAdminResponse;
      (activatedRouteStub as any).paramMap = of(
        convertToParamMap({
          registrationNo: genericEstablishmentResponse.registrationNo,
          adminId: genericOwnerReponse.ownerId
        })
      );
      component.initialiseFromRoutes(activatedRouteStub.paramMap);
      expect(component.loggedInAdminId).not.toBeNull();
    });
  });
});
