/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ApplicationTypeEnum, Establishment, EstablishmentStatusEnum, MenuService, RoleIdEnum } from '@gosi-ui/core';
import { bindToObject } from '@gosi-ui/core/lib/utils';
import { noop, of, throwError } from 'rxjs';
import {
  ActivatedRouteStub,
  ChangeGroupEstablishmentStubService,
  establishmentProfileResponse,
  genericBranchListResponse,
  genericBranchListWithStatusResponse,
  genericError,
  genericEstablishmentGroups,
  genericEstablishmentResponse,
  genericOwnerReponse,
  nationalityListData
} from 'testing';
import {
  commonImports,
  commonProviders,
  routerSpy
} from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import {
  AdminBranchQueryParam,
  AdminRoleArabicEnum,
  AdminRoleEnum,
  BranchFilterResponse,
  BranchList,
  ChangeGroupEstablishmentService,
  ErrorCodeEnum,
  EstablishmentActionEnum,
  EstablishmentBranchWrapper,
  EstablishmentConstants,
  EstablishmentEligibilityEnum,
  EstablishmentRoutesEnum,
  FilterKeyEnum,
  FilterKeyValue,
  ProfileConstants
} from '../../../shared';
import { BranchStatus } from '../../../shared/models/branch-status';
import { EstablishmentGroupProfileScComponent } from './establishment-group-profile-sc.component';
import { applyAdminBranchFilters, setActions, setBranches } from './group-profile-helper';

export const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ registrationNo: 987654321 });

describe('EstablishmentGroupProfileScComponent', () => {
  let component: EstablishmentGroupProfileScComponent;
  let fixture: ComponentFixture<EstablishmentGroupProfileScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EstablishmentGroupProfileScComponent],
      imports: [...commonImports],
      providers: [
        ...commonProviders,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: ChangeGroupEstablishmentService, useClass: ChangeGroupEstablishmentStubService },
        {
          provide: MenuService,
          useValue: {
            getRoles() {
              return [];
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentGroupProfileScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialise', () => {
    it('should navigate back for invalid route', () => {
      routerSpy.url = '';
      (activatedRouteStub as any).paramMap = of(convertToParamMap({}));
      component.ngOnInit();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });

  describe('Get Initial Data From Route', () => {
    it('should initialise for super admin', () => {
      routerSpy.url = 'group/user';
      spyOn(component, 'getGroupWithBranchesAndAdmin');
      spyOn(component.establishmentService, 'getEstablishmentProfileDetails').and.returnValue(
        of(establishmentProfileResponse)
      );
      (activatedRouteStub as any).paramMap = of(convertToParamMap({ adminId: genericOwnerReponse.ownerId }));
      component.getRegNoOrAdminIdFromRouteAndInitialise(component.route);
      expect(component.loggedInAdminId).toBe(genericOwnerReponse.ownerId);
      expect(component.getGroupWithBranchesAndAdmin).toHaveBeenCalled();
    });
    it('should initilase the group with registraion number and the route does not contains user', () => {
      routerSpy.url = 'group';
      (activatedRouteStub as any).paramMap = of(
        convertToParamMap({ registrationNo: genericEstablishmentResponse.registrationNo })
      );
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(of(genericEstablishmentResponse));
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        of(genericBranchListWithStatusResponse)
      );
      spyOn(component.changeGroupEstablishmentService, 'checkEligibility').and.returnValue(of([]));
      component.getRegNoOrAdminIdFromRouteAndInitialise(component.route);
      expect(component.establishmentService.getEstablishment).toHaveBeenCalled();
      expect(component.establishmentService.getBranchEstablishmentsWithStatus).toHaveBeenCalled();
    });
  });

  describe('fetch establishment group', () => {
    it('should fetch establishment group', () => {
      const establishmentGroup = [bindToObject(new Establishment(), genericEstablishmentResponse)];
      component.establishmentGroup = establishmentGroup;
      spyOn(component.establishmentService, 'getBranchEstablishments').and.returnValue(of(establishmentGroup));
      component.getGroupWithBranchesAndAdmin(genericEstablishmentResponse.registrationNo, undefined);
      expect(component.establishmentGroup).not.toBe(null);
    });
  });

  describe('view seleccted establishment', () => {
    it('should view selected establishment', () => {
      const establishmentGroup = [bindToObject(new Establishment(), genericEstablishmentResponse)];
      component.establishmentGroup = establishmentGroup;
      const branch: BranchList = {
        ...new BranchList(),
        status: { english: EstablishmentStatusEnum.REGISTERED, arabic: '' },
        registrationNo: genericEstablishmentResponse.registrationNo
      };
      component.loggedInAdminId = undefined;
      component.admins = [];
      component.viewEstablishmentProfile(branch);
      expect(component.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.EST_PROFILE_ROUTE(genericEstablishmentResponse.registrationNo)
      ]);
    });
    it('should restrict access for  establishment not yet registered with gosi', () => {
      component.establishmentGroup = [bindToObject(new Establishment(), genericEstablishmentResponse)];
      const branch: BranchList = {
        ...new BranchList(),
        status: { english: EstablishmentStatusEnum.UNDER_INSPECTION, arabic: '' },
        registrationNo: genericEstablishmentResponse.registrationNo
      };
      spyOn(component.bsModalService, 'show');
      component.viewEstablishmentProfile(branch);
      expect(component.bsModalService.show).toHaveBeenCalled();
    });
  });

  describe('initialise for new group', () => {
    it('should handle error from establishment profile', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.changeGroupEstablishmentService, 'checkEligibility').and.returnValue(throwError(genericError));
      component.establishmentGroups = [...genericEstablishmentGroups];
      component.initialiseNewEstablishmentGroup(genericEstablishmentResponse.registrationNo);
      expect(component.alertService.showError).toHaveBeenCalledTimes(1);
    });
  });

  describe('filter establishment', () => {
    it('should filter establishment', () => {
      const establishmentGroup = [bindToObject(new Establishment(), genericEstablishmentResponse)];
      const appliedFilters = [];
      appliedFilters.push({
        key: FilterKeyEnum.STATUS,
        bilingualValues: [{ english: EstablishmentStatusEnum.REGISTERED, arabic: '' }],
        codes: [1002]
      });
      appliedFilters.push({
        key: FilterKeyEnum.LOCATION,
        bilingualValues: [{ english: 'Saudi Arabia', arabic: '' }],
        codes: [1001]
      });
      appliedFilters.push({
        key: FilterKeyEnum.LEGAL_ENITY,
        bilingualValues: [{ english: 'Government', arabic: '' }],
        codes: [1009]
      });
      appliedFilters.push({
        key: FilterKeyEnum.ROLES,
        bilingualValues: [{ english: AdminRoleEnum.BRANCH_ADMIN, arabic: '' }]
      });
      component.establishmentGroup = establishmentGroup;
      component.filterBranches(appliedFilters);
      expect(component.filteredBranches).not.toBe(null);
    });
  });

  describe('Filter branches', () => {
    it('should not filter with name', () => {
      component.establishmentGroup = genericBranchListResponse;
      component.filterBranches([]);
      expect(component.filteredBranches).toEqual(component.establishmentGroup);
    });
  });

  describe('Pagination', () => {
    it('should handle any other error', () => {
      component.currentActiveRegNo = genericEstablishmentResponse.registrationNo;
      component.loggedInAdminId = undefined;
      component.branchFilters = [];
      spyOn(component, 'getBranches').and.returnValue(throwError({ ...genericError }));
      spyOn(component.alertService, 'showError');
      component.selectedPage(1);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should fetch the first 10 pages', fakeAsync(() => {
      component.currentActiveRegNo = genericEstablishmentResponse.registrationNo;
      spyOn(component.establishmentService, 'getBranchEstablishments').and.returnValue(of(genericBranchListResponse));
      component.selectedPage(1);
      tick();
      expect(component.establishmentGroup.length).toBeGreaterThan(0);
    }));
    it('should handle branches not found error', fakeAsync(() => {
      component.currentActiveRegNo = genericEstablishmentResponse.registrationNo;
      component.loggedInAdminId = undefined;
      const branchesNotFound = { ...genericError, error: { code: ErrorCodeEnum.BRANCH_NO_RECORD } };
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        throwError(branchesNotFound)
      );
      spyOn(component.alertService, 'showError');
      component.selectedPage(1);
      tick();
      expect(component.alertService.showError).not.toHaveBeenCalled();
    }));
  });

  describe('Get admin', () => {
    it('should handle error', () => {
      component.currentActiveRegNo = genericEstablishmentResponse.registrationNo;
      component.loggedInAdminId = undefined;
      component.branchFilters = [];
      spyOn(component.alertService, 'showError');
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        throwError({ ...genericError })
      );
      component.getBranches(genericEstablishmentResponse.registrationNo, undefined, component.NO_OF_BRANCHES, 0);
      expect(component.currentActiveRegNo).toBe(genericEstablishmentResponse.registrationNo);
    });
  });

  describe('get branches', () => {
    it('should fetch the branches under admin', () => {
      spyOn(component.establishmentService, 'getBranchesUnderAdmin').and.returnValue(
        of(genericBranchListWithStatusResponse)
      );
      component.getBranches(undefined, 123456, 10, 0).subscribe(res => {
        expect(res?.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Search Branches', () => {
    it('should search for branches', () => {
      component.currentActiveRegNo = genericEstablishmentResponse.registrationNo;
      component.loggedInAdminId = undefined;
      const branchesNotFound = { ...genericError, error: { code: ErrorCodeEnum.BRANCH_NO_RECORD } };
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        throwError(branchesNotFound)
      );
      spyOn(component.alertService, 'showError');
      component.searchBranches(undefined);
      expect(component.alertService.showError).not.toHaveBeenCalled();
    });
  });

  describe('User Click On Group Action Item', () => {
    it('Regiter Establishment', () => {
      component.eligibility = [{ eligible: true, key: undefined, messages: undefined }];
      component.navigateToFunctionality(EstablishmentActionEnum.REG_NEW_EST);
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VERIFY_REG_ESTABLISHMENT]);
    });
    it('Change Main', () => {
      component.eligibility = [{ eligible: true, key: EstablishmentEligibilityEnum.CBM, messages: undefined }];
      component.registrationNo = genericEstablishmentResponse.registrationNo;
      component.navigateToFunctionality(EstablishmentActionEnum.CHG_MAIN_EST);
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.CHANGE_MAIN]);
    });
    it('Delink to Other group', () => {
      component.eligibility = [{ eligible: true, key: EstablishmentEligibilityEnum.DELINK, messages: undefined }];
      component.navigateToFunctionality(EstablishmentActionEnum.DELINK_OTHER);
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.DELINK]);
    });
    // it('Delink to new group', () => {
    //   component.eligibility = [{ eligible: true, key: EstablishmentEligibilityEnum.DELINK, messages: undefined }];
    //   component.navigateToFunctionality(EstablishmentActionEnum.DELINK_NEW_GRP);
    //   expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.DELINK_NEW]);
    // });
  });

  describe('applyBranchFilter', () => {
    it('should filter the branches based on status,legalentity,location and roles', () => {
      let params = new AdminBranchQueryParam();
      const filters: Array<FilterKeyValue> = [];
      expect(params.branchFilter?.legalEntity).toBeUndefined();
      filters.push({ key: FilterKeyEnum.LEGAL_ENITY, codes: [1001] });
      filters.push({ key: FilterKeyEnum.STATUS, codes: [1002] });
      filters.push({ key: FilterKeyEnum.LOCATION, codes: [32] });
      filters.push({
        key: FilterKeyEnum.ROLES,
        bilingualValues: [{ english: AdminRoleEnum.BRANCH_ADMIN, arabic: AdminRoleArabicEnum.BRANCH_ADMIN }]
      });
      params = applyAdminBranchFilters(params, filters);
      expect(params.branchFilter?.legalEntity?.length).toBe(1);
      expect(params.branchFilter?.location?.length).toBe(1);
      expect(params.branchFilter?.status?.length).toBe(1);
      expect(params.branchFilter?.roles?.length).toBe(1);
    });
    it('should filter the branches with only available values', () => {
      let params = new AdminBranchQueryParam();
      const filters: Array<FilterKeyValue> = [];
      filters.push({ key: 'unknown' as FilterKeyEnum, codes: [1001] });
      expect(params.branchFilter?.legalEntity).toBeUndefined();
      params = applyAdminBranchFilters(params, filters);
      expect(params.branchFilter?.legalEntity?.length).toBeUndefined();
      expect(params.branchFilter?.fieldOffice?.length).toBeUndefined();
      expect(params.branchFilter?.status?.length).toBe(0);
      expect(params.branchFilter?.roles?.length).toBeUndefined();
    });
  });

  describe('Set Branches', () => {
    it('Set Filters', () => {
      const branchWrapper: EstablishmentBranchWrapper = new EstablishmentBranchWrapper();
      branchWrapper.branchList = genericBranchListResponse;
      branchWrapper.branchStatus = new BranchStatus();
      branchWrapper.filter = new BranchFilterResponse();
      branchWrapper.filter.locations = nationalityListData.items;
      branchWrapper.filter.legalEntities = nationalityListData.items;
      branchWrapper.filter.roles = [RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN];
      branchWrapper.filter.status = nationalityListData.items;
      component.branchFilters = undefined;
      component.branchSearchParam = undefined;
      setBranches(component, branchWrapper, 0);
      component.locations$.subscribe(res => {
        expect(res.items).toEqual(nationalityListData.items);
      });
    });
  });

  describe('Enable Group Funcionalities', () => {
    it('If CSR enters all branches are closed/gcc/proactive then hide all the group functionalities', () => {
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      const group: BranchList = new BranchList();
      group.roles = undefined;
      component.branchStatus = {
        totalBranches: 1,
        closedEstablishments: 1,
        proactiveEstablishments: 1,
        gccEstablishments: 1
      } as BranchStatus;
      expect(ProfileConstants.groupActionsDropdown?.length).toBe(4);
      setActions(component, group);
      expect(component.actionDropDown?.length).toBe(1);
    });
    it('If only one establishment in group then dont show change main functionality and delink to new group', () => {
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      const group: BranchList = new BranchList();
      group.roles = [{ english: AdminRoleEnum.SUPER_ADMIN, arabic: '' }];
      component.branchStatus = {
        totalBranches: 1,
        closedEstablishments: 0,
        proactiveEstablishments: 0,
        gccEstablishments: 0
      } as BranchStatus;
      expect(ProfileConstants.groupActionsDropdown?.length).toBe(4);
      setActions(component, group);
      expect(component.actionDropDown?.length).toBe(2);
    });
    it('If establishment is public dont show delink functionalitires', () => {
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      const group: BranchList = new BranchList();
      group.roles = undefined;
      component.branchStatus = {
        totalBranches: 2,
        closedEstablishments: 0,
        proactiveEstablishments: 0,
        gccEstablishments: 0
      } as BranchStatus;
      expect(ProfileConstants.groupActionsDropdown?.length).toBe(4);
      setActions(component, group);
      expect(component.actionDropDown?.length).toBe(2);
    });
  });

  describe('Navigate Back', () => {
    it('should go back', () => {
      spyOn(component.location, 'back');
      component.navigateBack();
      expect(component.location.back).toHaveBeenCalled();
    });
  });

  describe('Get groups and branches', () => {
    it('should fetch the groups under admin', () => {
      component.populateEstGroupsAndReturnMainEstRegNo(12345, undefined).subscribe(res => {
        expect(res).toBeDefined();
      });
    });
  });
});
