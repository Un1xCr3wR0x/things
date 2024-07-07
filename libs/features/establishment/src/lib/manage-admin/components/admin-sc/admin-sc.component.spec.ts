/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ApplicationTypeEnum, BilingualText, getIdentityByType, NationalityTypeEnum, RoleIdEnum } from '@gosi-ui/core';
import { noop, of, throwError } from 'rxjs';
import {
  EstablishmentAdminServiceStub,
  genericAdminResponse,
  genericError,
  genericEstablishmentResponse,
  genericOwnerReponse,
  genericPersonResponse,
  nationalityListData
} from 'testing';
import {
  commonImports,
  commonProviders,
  routerSpy
} from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { activatedRouteStub } from '../../../profile/components/establishment-group-profile-sc/establishment-group-profile-sc.component.spec';
import {
  Admin,
  AdminActionEnum,
  AdminFilterResponse,
  AdminRoleArabicEnum,
  AdminRoleEnum,
  AdminWrapper,
  ErrorCodeEnum,
  EstablishmentAdminService,
  EstablishmentBranchWrapper,
  EstablishmentConstants,
  EstablishmentRoutingService,
  FilterKeyEnum,
  FilterKeyValue,
  mapAdminToControlPersons
} from '../../../shared';
import { AdminScComponent, incorrectRoute } from './admin-sc.component';
import { enableActions } from './admin.helper';

class EstablishmentRoutingServiceStub {
  previousUrl$ = of(null);
}

describe('AdminScComponent', () => {
  let component: AdminScComponent;
  let fixture: ComponentFixture<AdminScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminScComponent],
      providers: [
        ...commonProviders,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: EstablishmentAdminService, useClass: EstablishmentAdminServiceStub },
        {
          provide: EstablishmentRoutingService,
          useClass: EstablishmentRoutingServiceStub
        }
      ],
      imports: [...commonImports],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Get data from Routes', () => {
    it('and handle invalid routes', () => {
      (activatedRouteStub as any).paramMap = of(convertToParamMap({}));
      spyOn(component.alertService, 'showError');
      component.getDataFromRouterParams(activatedRouteStub.paramMap);
      expect(component.alertService.showError).toHaveBeenCalledWith(incorrectRoute.error.message);
      expect(component.canInitialise).toBe(false);
    });
    it('fetch the admins and branches of the group by the csr', () => {
      (activatedRouteStub as any).paramMap = of(
        convertToParamMap({ registrationNo: genericEstablishmentResponse.registrationNo })
      );
      (component as any).router.url = EstablishmentConstants.GROUP_ADMINS_ADMIN_ID_ROUTE(
        genericEstablishmentResponse.registrationNo,
        undefined
      );
      component.establishmentService.loggedInAdminRole = 'test';
      spyOn(component.alertService, 'showError');
      component.getDataFromRouterParams(activatedRouteStub.paramMap);
      expect(component.alertService.showError).not.toHaveBeenCalled();
      expect(component.canInitialise).toBe(true);
      expect(component.underEst).toBe(true);
    });
    it('fetch the admins and the branches under the admin when logged in by admin', () => {
      (activatedRouteStub as any).paramMap = of(
        convertToParamMap({
          registrationNo: genericEstablishmentResponse.registrationNo,
          adminId: genericPersonResponse.identity[1].iqamaNo
        })
      );
      (component as any).router.url = EstablishmentConstants.GROUP_ADMINS_ADMIN_ID_ROUTE(
        genericEstablishmentResponse.registrationNo,
        genericPersonResponse.identity[1].iqamaNo
      );
      spyOn(component.alertService, 'showError');
      spyOn(component.establishmentService, 'getAdminsUnderSupervisor').and.callThrough();
      spyOn(component.establishmentService, 'getBranchesUnderAdmin').and.callThrough();
      component.establishmentService.loggedInAdminRole = 'test';
      component.getDataFromRouterParams(activatedRouteStub.paramMap);
      expect(component.alertService.showError).not.toHaveBeenCalled();
      expect(component.canInitialise).toBe(true);
      expect(component.underEst).toBe(false);
      expect(component.establishmentService.getAdminsUnderSupervisor).toHaveBeenCalled();
      expect(component.establishmentService.getBranchesUnderAdmin).toHaveBeenCalled();
    });
    it('fetch establishment details and admins of establishment when csr comes from est profile trigger', () => {
      (activatedRouteStub as any).paramMap = of(
        convertToParamMap({
          registrationNo: genericEstablishmentResponse.registrationNo
        })
      );
      (component as any).router.url = EstablishmentConstants.GROUP_ADMINS_ADMIN_ID_ROUTE(
        genericEstablishmentResponse.registrationNo,
        undefined
      );
      component.establishmentService.loggedInAdminRole = 'test';
      spyOn(component.alertService, 'showError');
      spyOn(component.establishmentService, 'getEstablishmentProfileDetails').and.callThrough();
      spyOn(component.establishmentService, 'getAdminsOfEstablishment').and.callThrough();
      component.getDataFromRouterParams(activatedRouteStub.paramMap);
      expect(component.alertService.showError).not.toHaveBeenCalled();
      expect(component.canInitialise).toBe(true);
      expect(component.underEst).toBe(true);
      expect(component.establishmentService.getAdminsOfEstablishment).toHaveBeenCalled();
      expect(component.establishmentService.getEstablishmentProfileDetails).toHaveBeenCalled();
    });
    it('fetch establishment details and admins of establishment when admin comes from est profile trigger', () => {
      (activatedRouteStub as any).paramMap = of(
        convertToParamMap({
          registrationNo: genericEstablishmentResponse.registrationNo,
          adminId: genericPersonResponse.identity[1].iqamaNo
        })
      );
      (component as any).router.url = EstablishmentConstants.EST_ADMINS_ADMIN_ID_ROUTE(
        genericEstablishmentResponse.registrationNo,
        genericPersonResponse.identity[1].iqamaNo
      );
      component.establishmentService.loggedInAdminRole = 'test';
      spyOn(component.alertService, 'showError');
      spyOn(component.establishmentService, 'getEstablishmentProfileDetails').and.callThrough();
      spyOn(component.establishmentService, 'getBranchesUnderAdmin').and.callThrough();
      component.getDataFromRouterParams(activatedRouteStub.paramMap);
      expect(component.alertService.showError).not.toHaveBeenCalled();
      expect(component.canInitialise).toBe(true);
      expect(component.underEst).toBe(false);
      expect(component.establishmentService.getEstablishmentProfileDetails).not.toHaveBeenCalled();
      expect(component.establishmentService.getBranchesUnderAdmin).toHaveBeenCalled();
    });
  });

  describe('select admin', () => {
    it('should fetch the branches of the selected admn', () => {
      spyOn(component.alertService, 'showError');
      component.admins = [
        {
          ...new Admin(),
          ...{ person: genericPersonResponse, roles: [{ english: AdminRoleEnum.SUPER_ADMIN, arabic: '' }] }
        }
      ];
      component.adminsForView = mapAdminToControlPersons({
        admins: [component.admins[0]]
      });
      component.selectAdmin(genericPersonResponse.identity[1].iqamaNo);
      expect(component.selectedAdminId).toBe(genericPersonResponse.identity[1].iqamaNo);
      expect(component.alertService.showError).not.toHaveBeenCalled();
    });
  });

  describe('Paginate Branches', () => {
    beforeEach(() => {
      component.registrationNo = genericEstablishmentResponse.registrationNo;
      component.underEst = true;
    });
    it('should fetch the second set of branches', () => {
      const pageIndex = 2;
      spyOn(component.alertService, 'showError');
      expect(component.currentBranchPage).not.toBe(pageIndex);
      component.selectBranch(pageIndex);
      expect(component.currentBranchPage).toBe(pageIndex);
      expect(component.alertService.showError).not.toHaveBeenCalled();
    });
    it('should handle error', () => {
      const pageIndex = 2;
      spyOn(component.alertService, 'showError');
      spyOn(component, 'getBranches').and.returnValue(throwError(genericError));
      component.selectBranch(pageIndex);
      expect(component.alertService.showError).toHaveBeenCalled();
      expect(component.currentBranchPage).not.toBe(pageIndex);
    });
  });

  describe('Clicking on Add Admin Button', () => {
    it('should navigate to add admin page if there is admin id present', () => {
      component.loggedInAdminId = genericPersonResponse.identity[1].iqamaNo;
      component.registrationNo = genericEstablishmentResponse.registrationNo;
      component.addAdmin();
      expect(component.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.ADD_ADMIN_ROUTE(
          genericEstablishmentResponse.registrationNo,
          genericPersonResponse.identity[1].iqamaNo
        )
      ]);
    });
  });

  describe('Clicking on Replace Admin Button', () => {
    beforeEach(() => {
      component.loggedInAdminId = genericPersonResponse.identity[1].iqamaNo;
      component.registrationNo = genericEstablishmentResponse.registrationNo;
      component.selectedAdmin = new Admin();
    });
    it('should navigate to replace super admin page if selected admin is super admin and logged in admin is super admin', () => {
      component.selectedAdminId = genericPersonResponse.identity[1].iqamaNo;
      component.selectedAdminRole = { ...new BilingualText(), ...{ english: AdminRoleEnum.SUPER_ADMIN } };
      component.replaceAdmin();
      expect(component.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.REPLACE_SUPER_ADMIN_ROUTE(component.registrationNo)
      ]);
    });
    it('should navigate to replace admin page if the selected admin is not a super admin', () => {
      component.selectedAdminId = genericPersonResponse.personId;
      component.selectedAdminRole = { ...new BilingualText(), ...{ english: AdminRoleEnum.REG_ADMIN } };
      component.replaceAdmin();
      expect(component.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.REPLACE_EST_ADMIN_ROUTE(
          genericPersonResponse.identity[1].iqamaNo,
          component.registrationNo
        )
      ]);
    });
  });

  describe('Delete Admin', () => {
    it('clicking on delete button should show a popup to confirm delete', () => {
      spyOn(component.bsModalService, 'show');
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.deleteAdmin(modalRef);
      expect(component.bsModalService.show).toHaveBeenCalled();
    });
    it('on confirm the admin should be deleted', () => {
      spyOn(component.alertService, 'showError');
      component.establishmentService.loggedInAdminRole = AdminRoleEnum.SUPER_ADMIN;
      component.selectedAdmin = new Admin();
      component.registrationNo = genericEstablishmentResponse.registrationNo;
      component.confirmDelete();
      expect(component.alertService.showError).not.toHaveBeenCalled();
    });
  });

  describe('Enable Manage Admin Functionalities', () => {
    beforeEach(() => {
      component.selectedAdmin = new Admin();
    });
    it('If Super Admin Logs in he can add,delete,assign,modify,replace other admin ', () => {
      component.viewOnly = false;
      (component as any).appType = ApplicationTypeEnum.PUBLIC;
      component.establishmentService.loggedInAdminRole = AdminRoleEnum.SUPER_ADMIN;
      component.selectedAdminRole = { english: AdminRoleEnum.BRANCH_ADMIN, arabic: AdminRoleArabicEnum.BRANCH_ADMIN };
      enableActions(component);
      expect(component.canAdd).toBe(true);
      expect(component.canAssign).toBe(true);
      expect(component.canDelete).toBe(true);
      expect(component.canReplace).toBe(true);
    });
    it('If Super Admin Logs in he can reaplce himself but cannot delete ', () => {
      component.viewOnly = false;
      (component as any).appType = ApplicationTypeEnum.PUBLIC;
      component.establishmentService.loggedInAdminRole = AdminRoleEnum.SUPER_ADMIN;
      component.selectedAdminRole = { english: AdminRoleEnum.SUPER_ADMIN, arabic: AdminRoleArabicEnum.SUPER_ADMIN };
      enableActions(component);
      expect(component.canAdd).toBe(true);
      expect(component.canAssign).toBe(false);
      expect(component.canDelete).toBeFalsy();
      expect(component.canReplace).toBe(true);
    });
    it('If Branch Admin Logs in he can add,delete,replace,modify other roles admin', () => {
      component.viewOnly = false;
      (component as any).appType = ApplicationTypeEnum.PUBLIC;
      component.establishmentService.loggedInAdminRole = AdminRoleEnum.BRANCH_ADMIN;
      component.selectedAdminRole = { english: AdminRoleEnum.REG_ADMIN, arabic: AdminRoleArabicEnum.REG_ADMIN };
      enableActions(component);
      expect(component.canAdd).toBe(true);
      expect(component.canAssign).toBe(true);
      expect(component.canDelete).toBe(true);
      expect(component.canReplace).toBe(true);
    });
    it('If Branch Admin he cannot replace or delete himself ', () => {
      component.viewOnly = false;
      (component as any).appType = ApplicationTypeEnum.PUBLIC;
      component.establishmentService.loggedInAdminRole = AdminRoleEnum.BRANCH_ADMIN;
      component.selectedAdminRole = { english: AdminRoleEnum.BRANCH_ADMIN, arabic: AdminRoleArabicEnum.BRANCH_ADMIN };
      enableActions(component);
      expect(component.canDelete).toBeFalsy();
      expect(component.canReplace).toBeFalsy();
    });
  });

  describe('Search Admin', () => {
    it('should fetch the admins matching the name', () => {
      const adminWrapper = new AdminWrapper();
      adminWrapper.admins = [genericAdminResponse];
      component.loggedInAdminId = genericPersonResponse.identity[1].iqamaNo;
      spyOn(component.establishmentService, 'getAdminsUnderSupervisor').and.returnValue(of(adminWrapper));
      component.searchAdmin(genericPersonResponse.name?.english.name?.slice(0, 4));
      expect(component.selectedAdminId).toBe(
        getIdentityByType(genericPersonResponse.identity, genericPersonResponse.nationality?.english)?.id
      );
    });
  });

  describe('Filter Admins', () => {
    it('should fetch the admins', () => {
      const adminWrapper = new AdminWrapper();
      const filters: Array<FilterKeyValue> = [];
      filters.push({
        key: FilterKeyEnum.NATIONALITY,
        bilingualValues: [{ english: NationalityTypeEnum.SAUDI_NATIONAL, arabic: '' }]
      });
      filters.push({
        key: FilterKeyEnum.ROLES,
        bilingualValues: [{ english: AdminRoleEnum.BRANCH_ADMIN, arabic: AdminRoleArabicEnum.BRANCH_ADMIN }]
      });
      adminWrapper.admins = [genericAdminResponse];
      component.loggedInAdminId = genericPersonResponse.identity[1].iqamaNo;
      spyOn(component.establishmentService, 'getAdminsUnderSupervisor').and.returnValue(of(adminWrapper));
      spyOn(component.establishmentService, 'getBranchesUnderAdmin').and.returnValue(
        of(new EstablishmentBranchWrapper())
      );
      component.underEst = false;
      component.filterAdmin(filters);
      expect(component.selectedAdminId).toBe(
        getIdentityByType(genericPersonResponse.identity, genericPersonResponse.nationality?.english)?.id
      );
    });
  });

  describe('filter branches', () => {
    it('should pass filters in the request', () => {
      component.loggedInAdminId = genericPersonResponse.identity[1].iqamaNo;
      spyOn(component.establishmentService, 'getBranchesUnderAdmin').and.returnValue(
        of(new EstablishmentBranchWrapper())
      );
      const filters: Array<FilterKeyValue> = [];
      filters.push({
        key: FilterKeyEnum.ROLES,
        bilingualValues: [{ english: AdminRoleEnum.BRANCH_ADMIN, arabic: AdminRoleArabicEnum.BRANCH_ADMIN }]
      });
      component.underEst = false;
      component.filterBranches(filters);
      expect(component.establishmentService.getBranchesUnderAdmin).toHaveBeenCalled();
    });
  });

  describe('Navigate Back', () => {
    it('should go back the previous url', () => {
      spyOn(component.location, 'back');
      component.navigateBack();
      expect(component.location.back).toHaveBeenCalled();
    });
  });

  describe('Select Action', () => {
    it('should navigate to assign branch functionality', () => {
      component.registrationNo = genericEstablishmentResponse.registrationNo;
      component.loggedInAdminId = genericOwnerReponse.ownerId;
      component.selectedAction(AdminActionEnum.ASSIGN, undefined);
      expect(component.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.ASSIGN_ADMIN_ROUTE(
          genericEstablishmentResponse.registrationNo,
          genericOwnerReponse.ownerId
        )
      ]);
    });
    it('should navigate to modify branch functionality', () => {
      component.registrationNo = genericEstablishmentResponse.registrationNo;
      component.loggedInAdminId = genericOwnerReponse.ownerId;
      component.selectedAction(AdminActionEnum.MODIFY, undefined);
      expect(component.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.MODIFY_ADMIN_ROUTE(
          genericEstablishmentResponse.registrationNo,
          genericOwnerReponse.ownerId
        )
      ]);
    });
    it('should navigate to replace branch functionality', () => {
      component.registrationNo = genericEstablishmentResponse.registrationNo;
      component.loggedInAdminId = genericOwnerReponse.ownerId;
      component.selectedAdminRole = new BilingualText();
      component.selectedAction(AdminActionEnum.REPLACE, undefined);
      expect(component.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.REPLACE_EST_ADMIN_ROUTE(
          genericOwnerReponse.ownerId,
          genericEstablishmentResponse.registrationNo
        )
      ]);
    });
    it('should navigate to delete branch functionality', () => {
      component.registrationNo = genericEstablishmentResponse.registrationNo;
      component.loggedInAdminId = genericOwnerReponse.ownerId;
      spyOn(component, 'deleteAdmin').and.callFake(() => {});
      component.selectedAction(AdminActionEnum.DELETE, undefined);
      expect(component.deleteAdmin).toHaveBeenCalled();
    });
  });

  describe('Get Branches', () => {
    it('should handle error', () => {
      component.underEst = false;
      spyOn(component.establishmentService, 'getBranchesUnderAdmin').and.returnValue(throwError({ ...genericError }));
      component.getBranches(genericEstablishmentResponse.registrationNo, 0);
      expect(component.underEst).toBe(false);
    });
  });

  describe('Search For Branches', () => {
    it('should Handle any error', () => {
      component.underEst = false;
      spyOn(component.alertService, 'showError');
      spyOn(component, 'getBranches').and.returnValue(throwError({ ...genericError }));
      component.searchBranches('branch1');
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should Handle no branch error', () => {
      component.underEst = false;
      const noBranchError = { error: { code: ErrorCodeEnum.BRANCH_NO_RECORD } };
      spyOn(component.establishmentService, 'getBranchesUnderAdmin').and.returnValue(throwError({ ...noBranchError }));
      component.searchBranches('branch1');
      expect(component.administringBranches?.length).toBe(0);
    });
  });

  describe('Get Admins And Branches', () => {
    it('should in gosi online', () => {
      (component as any).appType = ApplicationTypeEnum.PUBLIC;
      component.loggedInAdminId = genericOwnerReponse.ownerId;
      spyOn(component, 'getBranches').and.returnValue(of([]));
      spyOn(component, 'getAdmins').and.returnValue(of([]));
      routerSpy.url = EstablishmentConstants.EST_ADMINS_ADMIN_ID_ROUTE(
        genericEstablishmentResponse.registrationNo,
        genericOwnerReponse.ownerId
      );
      component.initialiseWithAdminsAndBranches(
        genericOwnerReponse.ownerId.toString(),
        genericEstablishmentResponse.registrationNo
      );
      expect(component.loggedInAdminId).toBe(genericOwnerReponse.ownerId);
    });
    it('should fetch branch admin record ', () => {
      const adminWrapper = new AdminWrapper();
      adminWrapper.admins = [{ ...genericAdminResponse }];
      adminWrapper.adminFilterResponseDto = new AdminFilterResponse();
      adminWrapper.adminFilterResponseDto.nationalitiesPresent = nationalityListData.items;
      adminWrapper.adminFilterResponseDto.roles = [RoleIdEnum.BRANCH_ADMIN];
      spyOn(component.establishmentService, 'getAdminsUnderSupervisor').and.returnValue(of(adminWrapper));
      component
        .initialiseWithAdminsAndBranches(
          genericOwnerReponse.ownerId.toString(),
          genericEstablishmentResponse.registrationNo
        )
        .subscribe(() => {
          expect(component.admins.length).toEqual(1);
        });
    });
    it('should fetch no admins', () => {
      const adminWrapper = new AdminWrapper();
      adminWrapper.admins = [];
      adminWrapper.adminFilterResponseDto = new AdminFilterResponse();
      adminWrapper.adminFilterResponseDto.nationalitiesPresent = [...nationalityListData.items];
      adminWrapper.adminFilterResponseDto.roles = [RoleIdEnum.SUPER_ADMIN];
      component.underEst = false;
      spyOn(component.establishmentService, 'getAdminsUnderSupervisor').and.returnValue(of({ ...adminWrapper }));
      component.getAdmins(genericEstablishmentResponse.registrationNo, genericOwnerReponse.ownerId).subscribe(res => {
        expect(res.length).toEqual(0);
      });
    });
    it('should handle errors', () => {
      component.underEst = false;
      spyOn(component.alertService, 'showError');
      spyOn(component.establishmentService, 'getAdminsUnderSupervisor').and.returnValue(throwError(genericError));
      component.getAdmins(genericEstablishmentResponse.registrationNo, genericOwnerReponse.ownerId);
      expect(component.underEst).toBe(false);
    });
  });
});
