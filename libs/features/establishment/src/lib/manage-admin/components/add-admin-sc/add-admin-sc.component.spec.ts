/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, RouterModule } from '@angular/router';
import { RoleIdEnum } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { noop, of, throwError } from 'rxjs';
import {
  branchesWithRoleTestData,
  branchListItemGenericResponse,
  EstablishmentAdminServiceStub,
  genericAdminResponse,
  genericBranchListResponse,
  genericBranchListWithStatusResponse,
  genericError,
  genericEstablishmentResponse,
  genericPersonResponse,
  ModalServiceStub
} from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { activatedRouteStub } from '../../../profile/components/establishment-group-profile-sc/establishment-group-profile-sc.component.spec';
import {
  Admin,
  AdminRoleEnum,
  ErrorCodeEnum,
  EstablishmentAdminService,
  EstablishmentErrorKeyEnum,
  FilterKeyEnum,
  FilterKeyValue,
  SaveAdminResponse
} from '../../../shared';
import { incorrectRoute } from '../admin-sc/admin-sc.component';
import { AddAdminScComponent } from './add-admin-sc.component';

describe('AddAdminScComponent', () => {
  let component: AddAdminScComponent;
  let fixture: ComponentFixture<AddAdminScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddAdminScComponent],
      providers: [
        ...commonProviders,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: EstablishmentAdminService, useClass: EstablishmentAdminServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub }
      ],
      imports: [...commonImports, RouterModule.forRoot([]), NgxPaginationModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdminScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ng On init', () => {
    it('should initialise the view', () => {
      (activatedRouteStub as any).paramMap = of(
        convertToParamMap({ registrationNo: genericEstablishmentResponse.registrationNo })
      );
      activatedRouteStub.paramMap.subscribe(params => {
        component.mainRegNo = +params.get('registrationNo');
      });
      spyOn(component, 'initialiseFromRoutes').and.callThrough();
      component.ngOnInit();
      expect(component.initialiseFromRoutes).toHaveBeenCalled();
    });
  });

  describe('Get admin id and registration number from route', () => {
    it('should fetch the parameters from route', () => {
      const params = ((activatedRouteStub as any).paramMap = of(
        convertToParamMap({
          registrationNo: genericEstablishmentResponse.registrationNo,
          adminId: genericAdminResponse.person.personId
        })
      ));
      component.initialiseFromRoutes(params).subscribe(res => {
        expect(res).toBeNull();
      });
    });
    it('should throw error if parameters are not present', () => {
      const params = ((activatedRouteStub as any).paramMap = of(
        convertToParamMap({ adminId: genericAdminResponse.person.personId })
      ));
      component.initialiseFromRoutes(params).subscribe(noop, error => {
        expect(error).toEqual(incorrectRoute);
      });
    });
  });
  describe('get branches', () => {
    it('should get branches', () => {
      spyOn(component.alertService, 'showErrorByKey');
      spyOn(component.establishmentService, 'getBranchesUnderAdmin').and.callThrough();
      component.estAdmin = new Admin();
      component.getBranches();
      expect(component.alertService.showErrorByKey).not.toHaveBeenCalled();
    });
    it('should handle no branches error', () => {
      spyOn(component.alertService, 'showErrorByKey');
      const branchNotFound = { ...genericError };
      branchNotFound.error.code = ErrorCodeEnum.BRANCH_NO_RECORD;
      spyOn(component.establishmentService, 'getBranchesUnderAdmin').and.returnValue(throwError(branchNotFound));
      component.estAdmin = new Admin();
      component.getBranches().subscribe(res => {
        expect(res).toBeNull();
      });
      expect(component.alertService.showErrorByKey).not.toHaveBeenCalled();
    });
    it('should handle other error', () => {
      spyOn(component.alertService, 'showErrorByKey');
      spyOn(component.establishmentService, 'getBranchesUnderAdmin').and.returnValue(throwError(genericError));
      component.estAdmin = new Admin();
      component.getBranches().subscribe(noop, err => {
        expect(err).toEqual(genericError);
      });
      expect(component.alertService.showErrorByKey).not.toHaveBeenCalled();
    });
    it('should not call get branches if no roles are selected for the chosen branch', () => {
      spyOn(component, 'isRolesValid').and.returnValue(false);
      spyOn(component.establishmentService, 'getBranchesUnderAdmin');
      component.getBranches();
      expect(component.establishmentService.getBranchesUnderAdmin).not.toHaveBeenCalled();
    });
    it('should not call get branches if roles are empty for updated branches', () => {
      spyOn(component, 'isRolesValid').and.returnValue(true);
      spyOn(component.establishmentService, 'getBranchesUnderAdmin');
      spyOn(component.alertService, 'showErrorByKey');
      component.updatedBranches.set(123, { roles: [], isValid: true });
      component.getBranches();
      expect(component.establishmentService.getBranchesUnderAdmin).not.toHaveBeenCalled();
      expect(component.alertService.showErrorByKey).toHaveBeenCalledWith('ESTABLISHMENT.SELECT-ROLE');
    });
  });
  describe('submit transaction', () => {
    it('should submit transaction', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.alertService, 'clearAlerts');
      spyOn(component.alertService, 'showSuccess').and.callThrough();
      spyOn(component.adminService, 'saveAdminDetails').and.returnValue(of(new SaveAdminResponse()));
      component.estAdmin = new Admin();
      component.isRolesValid(branchesWithRoleTestData);
      component.submitTransaction();
      expect(component.alertService.showError).not.toHaveBeenCalled();
    });
  });
  describe(' select Wizard', () => {
    it('It should navigate to selected section', () => {
      component.selectedWizard(1);
      component.initialiseTabWizards(1);
      expect(component.currentTab).toEqual(1);
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

  describe('Verify the admin and fetch the details', () => {
    it('for adding', () => {
      const id = 200011125; //test data mock admin id
      component.estAdminForm = component.createEstAdminForm();
      component.estAdminForm.addControl('search', createSearchPersonForm());
      component.estAdminForm.get('search').patchValue(genericPersonResponse);
      component.verifyEstAdmin(genericEstablishmentResponse.registrationNo, id, false);
      expect(component.estAdminForm.get('personExists').value).toBe(true);
    });
  });

  describe('Reset form', () => {
    it('should reset the form', () => {
      component.estAdminForm = component.createEstAdminForm();
      component.estAdminForm.get('personExists').setValue(true);
      expect(component.estAdminForm.get('personExists').value).toBe(true);
      component.resetEventDetails(component.estAdminForm);
      expect(component.estAdminForm.get('personExists').value).toBe(false);
    });
  });

  describe('check Roles', () => {
    it('It shouldcheck the role of admin', () => {
      component.loggedInAdminRole = AdminRoleEnum.BRANCH_ADMIN;
      component.checkRoles(component.loggedInAdminRole);
      expect(component.showOnlyRoleAdmins).toBeTruthy();
    });
    it('It shouldcheck the role of admin', () => {
      component.loggedInAdminRole = AdminRoleEnum.GCC_ADMIN;
      component.checkRoles(component.loggedInAdminRole);
      expect(component.showOnlyRoleAdmins).toBeFalsy();
    });
  });

  describe('Validate the selected roles', () => {
    it('should throw mandatory error message if no roles are assigned after selecting the brach', () => {
      const branchRole = { roles: [{ english: AdminRoleEnum.CNT_ADMIN, arabic: '' }], isValid: true };
      component.updatedBranches.set(genericBranchListResponse[0].registrationNo, branchRole);
      expect(component.isRolesValid([])).toBeTruthy();
    });
    it('should throw mandatory error message if no roles are assigned after selecting the brach', () => {
      const branchRole = { roles: [], isValid: false };
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.updatedBranches.set(genericBranchListResponse[0].registrationNo, branchRole);
      expect(component.isRolesValid([])).toBeFalsy();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });

  describe('submit the transaction', () => {
    it('should successfully complete the transaction and show the success message', () => {
      spyOn(component.alertService, 'showSuccess');
      const branchRole = { roles: [{ english: AdminRoleEnum.CNT_ADMIN, arabic: '' }], isValid: true };
      component.updatedBranches.set(genericBranchListResponse[0].registrationNo, branchRole);
      component.estAdmin = genericAdminResponse;
      component.adminId = genericPersonResponse.identity[1].iqamaNo;
      component.loggedInAdminRoleId = RoleIdEnum.SUPER_ADMIN;
      component.submitTransaction();
      expect(component.alertService.showSuccess).toHaveBeenCalled();
    });
    it('should throw roles invalid error', () => {
      const branchRole = { roles: [{ english: AdminRoleEnum.CNT_ADMIN, arabic: '' }], isValid: false };
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.updatedBranches.set(genericBranchListResponse[0].registrationNo, branchRole);
      component.submitTransaction();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
    it('should throw mandatory error message if no roles are selected', () => {
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.submitTransaction();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });

  describe('Save the new admin', () => {
    beforeEach(() => {
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
    });
    it('should the save the admin', () => {
      component.estAdminForm.get('isVerified').setValue(true);
      expect(component.currentTab).toBe(0);
      component.saveAdmin();
      expect(component.currentTab).toBe(1);
    });
    it('should the handle api error', () => {
      component.estAdminForm.get('isVerified').setValue(true);
      expect(component.currentTab).toBe(0);
      spyOn(component.adminService, 'saveAsNewAdmin').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.saveAdmin();
      expect(component.currentTab).toBe(0);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('If form not valid throw mandatory error message', () => {
      component.estAdminForm.get('contactDetail').setErrors({ notValid: true });
      component.estAdminForm.get('isVerified').setValue(true);
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      expect(component.currentTab).toBe(0);
      component.saveAdmin();
      expect(component.currentTab).toBe(0);
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
    it('Throw person not verified error if admin not verified', () => {
      component.estAdminForm.get('isVerified').setValue(false);
      spyOn(component.alertService, 'showErrorByKey');
      expect(component.currentTab).toBe(0);
      component.saveAdmin();
      expect(component.currentTab).toBe(0);
      expect(component.alertService.showErrorByKey).toHaveBeenCalledWith(EstablishmentErrorKeyEnum.VERIFY_ADMIN);
    });
  });
  describe('select branches', () => {
    it('should select branches', () => {
      const page = 1;
      component.estAdmin = genericAdminResponse;
      spyOn(component, 'getBranches').and.callThrough();
      component.isRolesValid(branchesWithRoleTestData);
      component.selectBranches(page);
      expect(component.getBranches).toHaveBeenCalled();
    });
    it('should handle error', () => {
      const page = 1;
      component.estAdmin = genericAdminResponse;
      spyOn(component, 'getBranches').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.selectBranches(page);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('search for branch', () => {
    it('should search with branch name', () => {
      const searchParam = branchListItemGenericResponse.name?.arabic?.slice(0, 3);
      const branchRole = { roles: [{ english: AdminRoleEnum.CNT_ADMIN, arabic: '' }], isValid: true };
      spyOn(component.establishmentService, 'getBranchesUnderAdmin').and.returnValue(
        of(genericBranchListWithStatusResponse)
      );
      component.updatedBranches.set(genericBranchListResponse[0].registrationNo, branchRole);
      component.estAdmin = genericAdminResponse;
      component.adminId = genericPersonResponse.identity[1].iqamaNo;
      component.loggedInAdminRoleId = RoleIdEnum.SUPER_ADMIN;
      component.searchBranches(searchParam);
      expect(component.establishmentService.getBranchesUnderAdmin).toHaveBeenCalled();
      expect(component.branchSearchParam).toBeDefined();
    });
  });

  describe('filter branches', () => {
    it('should filter the branches', () => {
      const filters: FilterKeyValue[] = [];
      filters.push({
        key: FilterKeyEnum.LOCATION,
        bilingualValues: [{ english: 'Riyadh', arabic: 'Riyadh' }],
        codes: [1003]
      });
      spyOn(component.establishmentService, 'getBranchesUnderAdmin').and.returnValue(
        of(genericBranchListWithStatusResponse)
      );
      const branchRole = { roles: [{ english: AdminRoleEnum.CNT_ADMIN, arabic: '' }], isValid: true };
      component.updatedBranches.set(genericBranchListResponse[0].registrationNo, branchRole);
      component.estAdmin = genericAdminResponse;
      component.adminId = genericPersonResponse.identity[1].iqamaNo;
      component.loggedInAdminRoleId = RoleIdEnum.SUPER_ADMIN;
      component.applyFilter(filters);
      expect(component.establishmentService.getBranchesUnderAdmin).toHaveBeenCalled();
      expect(component.branchFilters?.length).toBeGreaterThan(0);
    });
  });

  describe('Add Branches', () => {
    it('should track the updated branch', () => {
      const value = {
        roles: [{ english: AdminRoleEnum.SUPER_ADMIN, arabic: '' }],
        isValid: true
      };
      component.addBranches(value, genericEstablishmentResponse.registrationNo);
      expect(component.updatedBranches.get(genericEstablishmentResponse.registrationNo)).toEqual(value);
    });
  });
});

function createSearchPersonForm(): FormGroup {
  const fb: FormBuilder = new FormBuilder();
  return fb.group({
    nationality: fb.group({
      english: [null, { validators: Validators.required, updateOn: 'blur' }],
      arabic: null
    }),
    birthDate: fb.group({
      gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
      hijiri: null
    })
  });
}
