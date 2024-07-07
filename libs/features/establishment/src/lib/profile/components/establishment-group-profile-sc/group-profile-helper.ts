import { TemplateRef } from '@angular/core';
import {
  Alert,
  ApplicationTypeEnum,
  BilingualText,
  EstablishmentStatusEnum,
  LovList,
  ProactiveStatusEnum,
  RoleIdEnum
} from '@gosi-ui/core';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  AdminBranchQueryParam,
  AdminRoleEnum,
  BranchList,
  checkInterDomainForAddSuperAdmin,
  eligibleExternalRolesForAdminView,
  eligibleInternalRolesForAdminView,
  EstablishmentActionEnum,
  EstablishmentBranchWrapper,
  EstablishmentConstants,
  EstablishmentService,
  EstablishmentTypeEnum,
  EstablishmentWarningKeyEnum,
  EstablishmentWorkFlowStatus,
  FilterKeyEnum,
  FilterKeyValue,
  getAdminRole,
  getAlerts,
  getBranchRequest,
  handleAddSuperAdminAction,
  isInArray,
  mapAdminIdsToRole,
  mapAdminRolesToId,
  ProfileConstants,
  WorkFlowStatusType
} from '../../../shared';
import { EstablishmentGroupProfileScComponent } from './establishment-group-profile-sc.component';

export function getAdminBranchQueries(
  regNo: number,
  role: number,
  pageNo: number,
  size: number,
  filters?: Array<FilterKeyValue>,
  searchParam?: string
): AdminBranchQueryParam {
  const params = new AdminBranchQueryParam();
  params.branchFilter.includeBranches = true;
  params.branchFilter.eligibleToUpdate = false;
  params.branchFilter.registrationNo = regNo;
  params.page.pageNo = pageNo;
  params.page.size = size;
  params.branchFilter.role = role;
  // params.branchFilter.status = getStatusesAbleToView();
  params.searchParam = searchParam;
  return applyAdminBranchFilters(params, filters);
}

export function applyAdminBranchFilters(param: AdminBranchQueryParam, filters?: Array<FilterKeyValue>) {
  if (filters?.length > 0) {
    const status = filters.filter(item => item.key === FilterKeyEnum.STATUS);
    const legalEntity = filters.filter(item => item.key === FilterKeyEnum.LEGAL_ENITY);
    const location = filters.filter(item => item.key === FilterKeyEnum.LOCATION);
    const roles = filters.filter(item => item.key === FilterKeyEnum.ROLES);
    if (status.length > 0) {
      param.branchFilter.status = [...status[0].codes];
    }
    if (legalEntity.length > 0) {
      param.branchFilter.legalEntity = [...legalEntity[0].codes];
    }
    if (location.length > 0) {
      param.branchFilter.location = [...location[0].codes];
    }
    if (roles.length > 0) {
      param.branchFilter.roles = mapAdminRolesToId([...roles[0].bilingualValues]);
    }
  }
  return param;
}

export function /**
 * Method to filter the actions based on the role
 * @param group
 */
setActions(self: EstablishmentGroupProfileScComponent, group: BranchList) {
  self.actionDropDown = ProfileConstants.groupActionsDropdown;
  if (!group.roles || group.roles[0]?.english === AdminRoleEnum.SUPER_ADMIN) {
    self.actionDropDown = ProfileConstants.groupActionsDropdown;
    if (
      self.branchStatus &&
      (self.branchStatus.closedEstablishments === self.branchStatus.totalBranches ||
        self.branchStatus.gccEstablishments === self.branchStatus.totalBranches)
    ) {
      self.actionDropDown = self.actionDropDown.filter(
        item =>
          item.key !== EstablishmentActionEnum.DELINK_NEW_GRP &&
          item.key !== EstablishmentActionEnum.CHG_MAIN_EST &&
          item.key !== EstablishmentActionEnum.DELINK_OTHER
      );
    }
    if (self.branchStatus && self.branchStatus.totalBranches === 1) {
      self.actionDropDown = self.actionDropDown.filter(
        item => item.key !== EstablishmentActionEnum.DELINK_NEW_GRP && item.key !== EstablishmentActionEnum.CHG_MAIN_EST
      );
    }
    if (
      !self.establishmentService.isUserEligible(
        EstablishmentConstants.CREATE_DELINK_ACCESS_ROLES,
        self.mainRegistrationNumber
      )
    ) {
      self.actionDropDown = self.actionDropDown.filter(
        item => item.key !== EstablishmentActionEnum.DELINK_NEW_GRP && item.key !== EstablishmentActionEnum.DELINK_OTHER
      );
    }
    if (
      !self.establishmentService.isUserEligible(
        EstablishmentConstants.CREATE_CBM_ACCESS_ROLES,
        self.mainRegistrationNumber
      )
    ) {
      self.actionDropDown = self.actionDropDown.filter(item => item.key !== EstablishmentActionEnum.CHG_MAIN_EST);
    }
    if (group.roles && self.establishmentGroups.length === 1) {
      self.actionDropDown = self.actionDropDown.filter(item => item.key !== EstablishmentActionEnum.DELINK_OTHER);
    }
  } else {
    self.actionDropDown.forEach(value => {
      if (value.key !== EstablishmentActionEnum.REG_NEW_EST) {
        value.disabled = true;
      }
    });
  }
  //If roles does not have csr the filter register establishment from dropdown
  if (!self.establishmentService.isUserEligible([RoleIdEnum.CSR])) {
    self.actionDropDown = self.actionDropDown.filter(value => value.key !== EstablishmentActionEnum.REG_NEW_EST);
  }
}

export function setBranches(
  self: EstablishmentGroupProfileScComponent,
  branchWrapper: EstablishmentBranchWrapper,
  pageNo: number,
  checkRoles = false
) {
  if (branchWrapper?.branchStatus?.proactiveStatusPending > 0 && !self.proactivePendingKey) {
    const noOfEsts = branchWrapper?.branchStatus?.proactiveStatusPending;
    self.proactivePendingKey = getPendingKey(noOfEsts);
    self.proactiveStatusPending = noOfEsts;
  }
  branchWrapper?.branchList?.forEach(branch => {
    const canShow = checkRoles
      ? branch.adminRole
          ?.map(role => role.role)
          ?.filter(adminRole => {
            return isInArray([RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN], adminRole);
          })?.length > 0
      : true;
    if (
      canShow &&
      branch.proactiveStatus === ProactiveStatusEnum.PENDING_MOL_OR_MCI &&
      (branch.status?.english === EstablishmentStatusEnum.REGISTERED ||
        branch.status?.english === EstablishmentStatusEnum.CLOSING_IN_PROGRESS)
    ) {
      branch.showCompleteInfo = true;
    }
  });
  self.branchStatus = branchWrapper.branchStatus;
  self.totalFilteredBranches = branchWrapper.branchStatus.totalBranches;
  if (!self.branchFilters?.length && !self.branchSearchParam && pageNo === 0) {
    self.totalBranches = self.totalFilteredBranches;
    if (branchWrapper.filter?.locations?.length > 0) {
      self.locations$ = of(new LovList(branchWrapper.filter?.locations));
    }
    if (branchWrapper.filter?.legalEntities?.length > 0) {
      self.legalEntity$ = of(new LovList(branchWrapper.filter?.legalEntities));
    }
    if (branchWrapper.filter?.status?.length > 0) {
      self.status$ = of(new LovList(branchWrapper.filter?.status));
    }
    if (branchWrapper.filter?.roles?.length > 0) {
      self.roles$ = of(mapAdminIdsToRole(branchWrapper.filter?.roles));
    }
  }
}

export function getPendingKey(noOfEsts: number) {
  if (!noOfEsts) return undefined;
  if (noOfEsts === 1) {
    return EstablishmentWarningKeyEnum.ONE_EST_PENDING;
  } else if (noOfEsts === 2) {
    return EstablishmentWarningKeyEnum.TWO_EST_PENDING;
  } else if (noOfEsts <= 10) {
    return EstablishmentWarningKeyEnum.THREE_EST_PENDING;
  } else {
    return EstablishmentWarningKeyEnum.ELEVEN_EST_PENDING;
  }
}
/**
 * Method to find the main and convert it to establishment groups
 * @param branches
 */
export function assembleGroupFromBranchList(branches: BranchList[]): BranchList[] {
  const estGrps: BranchList[] = [];
  branches.forEach(branch => {
    if (branch?.establishmentType?.english === EstablishmentTypeEnum.MAIN) {
      estGrps.push({
        ...new BranchList(),
        ...{
          name: branch.name,
          registrationNo: branch.registrationNo,
          roles: undefined,
          gccCountry: branch.gccCountry
        }
      });
    }
  });
  return estGrps;
}

export function navigateToAdmin(self: EstablishmentGroupProfileScComponent, id?: number) {
  if (self.hasNoSuperAdmin) {
    checksSuperAdminTransaction(self, self.workflowsInProgress, self.editWarningTemplate, self.draftModal);
  } else {
    self.router.navigate([EstablishmentConstants.GROUP_ADMINS_ADMIN_ID_ROUTE(self.adminAuthRegNo, id)]);
  }
}

export function getWorkflowDetails(self: EstablishmentGroupProfileScComponent, registrationNo: number) {
  const workflow$ = self.establishmentService.getWorkflowsInProgress(registrationNo, true).pipe(
    catchError(() => of([] as EstablishmentWorkFlowStatus[])),
    tap(res => (self.workflowsInProgress = res))
  );
  workflow$.subscribe(workflowRes => {
    self.adminUnderWorkflow = workflowRes.some(e => e.type === WorkFlowStatusType.ADD_SUPER_ADMIN);
    self.adminWorkflowMessage = workflowRes.find(e => e.type === WorkFlowStatusType.ADD_SUPER_ADMIN)?.message;
  });
}

export function canViewManageAdmin(
  appToken: string,
  establishmentService: EstablishmentService,
  isGCC: boolean,
  accessRole?: string,
  hasNoSuperAdmin?: boolean,
  isPPA?: boolean
): boolean {
  if (ApplicationTypeEnum.PRIVATE === appToken) {
    if(!isGCC && !isPPA && hasNoSuperAdmin) return false;
    return establishmentService.isUserEligible(
      eligibleInternalRolesForAdminView?.filter(item =>
        isGCC ? item === RoleIdEnum.GCC_CSR : item === RoleIdEnum.CSR
      ),
      undefined
    );
  } else if (accessRole) {
    const accessRoleId = mapAdminRolesToId([{ english: accessRole, arabic: '' }])?.[0];
    const roles = eligibleExternalRolesForAdminView?.filter(item =>
      isGCC ? item === RoleIdEnum.GCC_ADMIN : item !== RoleIdEnum.GCC_ADMIN
    );
    if (roles.indexOf(accessRoleId) !== -1) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

export const checksSuperAdminTransaction = (
  self: EstablishmentGroupProfileScComponent,
  workflows: EstablishmentWorkFlowStatus[],
  template: TemplateRef<HTMLElement>,
  draftTemp: TemplateRef<HTMLElement>
) => {
  let alert: Alert;
  const adminWorkflows = workflows?.filter(item => !item.isDraft);
  const [alertKeys, alertMessages, paramMap] = adminWorkflows?.reduce(
    (keyAndMessage, workflow) => {
      keyAndMessage = checkInterDomainForAddSuperAdmin(workflow, keyAndMessage);
      return keyAndMessage;
    },
    [[] as string[], [] as BilingualText[], new Map<number, Object>()]
  );
  alert = getAlerts(alertKeys, alertMessages, paramMap);
  handleAddSuperAdminAction(self, alert, workflows, template, draftTemp, self.mainRegistrationNumber);
};
export const showEditWarningModal = (
  self: EstablishmentGroupProfileScComponent,
  heading: string,
  warningMsg: Alert[],
  editWarningTemplate: TemplateRef<HTMLElement>
) => {
  self.editWarningHeading = heading;
  self.editWarningMsg = warningMsg;
  self.showModal(editWarningTemplate, 'lg', true);
};

export const branchesUnderAdmin = (
  self: EstablishmentGroupProfileScComponent,
  regNo: number,
  adminId: number,
  pageNo: number,
  size: number
) => {
  const roles = getAdminRole([self.establishmentService.loggedInAdminRole]);
  const role = mapAdminRolesToId(roles) ? mapAdminRolesToId(roles)[0] : undefined;
  const params = getAdminBranchQueries(
    self.adminAuthRegNo || regNo,
    role,
    pageNo,
    size,
    self.branchFilters,
    self.branchSearchParam
  );
  self.adminRoleId = params.branchFilter.role;
  return self.establishmentService.getBranchesUnderAdmin(adminId, params).pipe(
    tap(res => {
      setBranches(self, res, pageNo, true);
    }),
    map(estGroups => estGroups.branchList)
  );
};

export const branchesUnderGroup = (self: EstablishmentGroupProfileScComponent, regNo, size: number, pageNo: number) => {
  return self.establishmentService
    .getBranchEstablishmentsWithStatus(
      regNo,
      getBranchRequest(size, pageNo, [], undefined, self.branchSearchParam, self.branchFilters, true)
    )
    .pipe(
      map(res => {
        setBranches(self, res, pageNo);
        return res.branchList;
      })
    );
};
