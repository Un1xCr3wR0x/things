/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RoleIdEnum } from '@gosi-ui/core';
import { of } from 'rxjs';
import {
  EstablishmentAdminServiceStub,
  genericAdminResponse,
  genericBranchListResponse,
  genericEstablishmentResponse,
  genericPersonResponse
} from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { activatedRouteStub } from '../../../profile/components/establishment-group-profile-sc/establishment-group-profile-sc.component.spec';
import {
  AdminRoleEnum,
  EstablishmentAdminService,
  EstablishmentConstants,
  FilterKeyEnum,
  FilterKeyValue
} from '../../../shared';
import { branchAndOtherOptions } from '../../../shared/utils';
import { incorrectRoute } from '../admin-sc/admin-sc.component';
import { UpdateAdminScComponent } from './update-admin-sc.component';

describe('UpdateAdminScComponent', () => {
  let component: UpdateAdminScComponent;
  let fixture: ComponentFixture<UpdateAdminScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...commonImports],
      providers: [
        ...commonProviders,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: EstablishmentAdminService, useClass: EstablishmentAdminServiceStub }
      ],
      declarations: [UpdateAdminScComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAdminScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialise State from route', () => {
    it('should handle invalid route', () => {
      spyOn(component.alertService, 'showError');
      (activatedRouteStub as any).paramMap = of(convertToParamMap({}));
      component.ngOnInit();
      expect(component.alertService.showError).toHaveBeenCalledWith(incorrectRoute.error.message);
    });
    it('should get the data from the route and initialise the component', () => {
      expect(component.initialsed).toBeFalsy();
      component.establishmentService.selectedAdmin = genericAdminResponse;
      (activatedRouteStub as any).paramMap = of(
        convertToParamMap({
          adminId: genericPersonResponse.identity[1].iqamaNo,
          registrationNo: genericEstablishmentResponse.registrationNo
        })
      );
      (component.router as any).url = EstablishmentConstants.ASSIGN_ADMIN_ROUTE(
        genericEstablishmentResponse.registrationNo,
        genericPersonResponse.identity[1].iqamaNo
      );
      component.ngOnInit();
      expect(component.transationToAssign).toBeTruthy();
      expect(component.initialsed).toBeTruthy();
    });
  });

  describe('update branches', () => {
    it('should register new change for new values', () => {
      component.branchesWithoutUpdate = genericBranchListResponse;
      component.updateBranches(
        { roles: [{ english: AdminRoleEnum.REG_ADMIN, arabic: '' }], isValid: true },
        genericBranchListResponse[0].registrationNo
      );
      expect(component.updatedBranches.get(genericBranchListResponse[0].registrationNo)).toBeDefined();
    });
    it('delete the record if there is no change', () => {
      component.branchesWithoutUpdate = genericBranchListResponse;
      const branchRole = { roles: [{ english: AdminRoleEnum.CNT_ADMIN, arabic: '' }], isValid: true };
      component.branchesWithoutUpdate[0].roles = branchRole.roles;
      component.updatedBranches.set(component.branchesWithoutUpdate[0].registrationNo, branchRole);
      component.updateBranches(branchRole, genericBranchListResponse[0].registrationNo);
      expect(component.updatedBranches.get(genericBranchListResponse[0].registrationNo)).toBeUndefined();
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
      component.adminToUpdate = genericAdminResponse;
      component.loggedInAdminId = genericPersonResponse.identity[1].iqamaNo;
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
      branchAndOtherOptions();
      component.submitTransaction();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });

  describe('cancel transaction', () => {
    it('should cancel transaction', () => {
      spyOn(component.location, 'back');
      component.cancelTransaction();
      expect(component.location.back).toHaveBeenCalled();
    });
  });

  describe('search branches', () => {
    it('should search for branches', () => {
      component.adminToUpdate = genericAdminResponse;
      component.searchBranches('testAdmin');
      expect(component.branchSearchParam).toBe('testAdmin');
    });
  });

  describe('apply filter', () => {
    it('should filter branches', () => {
      const filter: FilterKeyValue[] = [
        {
          key: FilterKeyEnum.LOCATION,
          bilingualValues: [{ english: 'Saudi Arabic', arabic: 'test' }]
        }
      ];
      component.adminToUpdate = genericAdminResponse;
      component.applyFilter(filter);
      expect(component.branchFilters?.length).toBeGreaterThan(0);
    });
  });
});
