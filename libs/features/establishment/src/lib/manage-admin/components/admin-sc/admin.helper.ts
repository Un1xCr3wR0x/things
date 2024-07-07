/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TemplateRef } from '@angular/core';
import { Alert, ApplicationTypeEnum, BilingualText, EstablishmentStatusCodeEnum } from '@gosi-ui/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  AdminActionEnum,
  AdminBranchFilter,
  AdminBranchQueryParam,
  AdminRoleEnum,
  EstablishmentWorkFlowStatus,
  FilterKeyEnum,
  FilterKeyValue,
  getAdminRole,
  getAlerts,
  getDraftWorkflow,
  mapAdminRolesToId,
  WorkFlowStatusType
} from '../../../shared';
import { AdminQueryParam } from '../../../shared/models/admin-query-param';
import { AdminScComponent } from './admin-sc.component';

/**
 * Method to enable the action items according to role of the logged in admin
 */
export function enableActions(self: AdminScComponent) {
  self.showBranches = self.canAssign = self.canAdd = self.canEdit = self.canDelete = self.canReplace = false;
  if (!self.viewOnly) {
    if (self.appType === ApplicationTypeEnum.PRIVATE) {
      self.canReplace =
        ((self.selectedAdmin.roles[0] as BilingualText)?.english === AdminRoleEnum.SUPER_ADMIN ||
          (self.selectedAdmin.roles[0] as BilingualText)?.english === AdminRoleEnum.GCC_ADMIN) &&
        !self.isUnderWorkflow;
      self.showBranches = true;
      self.showFilter = true;
    } else {
      if (self.establishmentService.loggedInAdminRole === AdminRoleEnum.GCC_ADMIN) {
        self.canReplace = !self.isUnderWorkflow; //GCC Admin (can only replace)
      } else if (
        self.establishmentService.loggedInAdminRole === AdminRoleEnum.SUPER_ADMIN ||
        self.establishmentService.loggedInAdminRole === AdminRoleEnum.BRANCH_ADMIN
      ) {
        self.showFilter = self.canAdd = true;
        if (self.establishmentService.loggedInAdminRole === AdminRoleEnum.BRANCH_ADMIN) {
          self.canReplace = self.establishmentService.loggedInAdminRole !== self.selectedAdminRole.english;
        } else {
          self.canReplace =
            self.establishmentService.loggedInAdminRole === self.selectedAdminRole.english
              ? !self.isUnderWorkflow
              : true;
        }
        self.canAssign =
          self.canEdit =
          self.canDelete =
            self.establishmentService.loggedInAdminRole !== self.selectedAdminRole.english;
      }
      if (self.selectedAdminRole.english !== AdminRoleEnum.SUPER_ADMIN) {
        self.showBranches = true;
      }
    }
  }
}

/**
 * Method to check if all the branches are already assigned
 */
export function canAssignBranches(self: AdminScComponent): Observable<boolean> {
  if (self.establishmentService.loggedInAdminRole === self.selectedAdminRole.english) {
    return of(false);
  } else {
    const params = setBranchesParams(self, self.registrationNo, 0, [EstablishmentStatusCodeEnum.REGISTERED], true);
    return self.establishmentService.getBranchesUnderAdmin(self.loggedInAdminId, params).pipe(
      catchError(() => {
        return of(null); //handle error
      }),
      map(branchWrapper => {
        if (branchWrapper?.branchList) {
          return branchWrapper?.branchList?.length !== 0;
        } else {
          return false;
        }
      })
    );
  }
}

/**
 * Method to filter the admin actions
 */
export function filterAdminActions(self: AdminScComponent) {
  return canAssignBranches(self).pipe(
    tap(ableToAssign => {
      if (self.canAssign) {
        self.canAssign = ableToAssign;
      }
      self.filteredActions = self.adminActions.reduce((agg, action) => {
        switch (action.key) {
          case AdminActionEnum.REPLACE: {
            if (self.canReplace) agg.push(action);
            break;
          }
          case AdminActionEnum.MODIFY: {
            if (self.canEdit) agg.push(action);
            break;
          }
          case AdminActionEnum.ASSIGN: {
            if (self.canAssign) agg.push(action);
            break;
          }
          case AdminActionEnum.DELETE: {
            if (self.canDelete) agg.push(action);
            break;
          }
        }
        return agg;
      }, []);
    })
  );
}

export function getAdminParams(
  registrationNo?: number,
  adminFilters?: FilterKeyValue[],
  searchParam?: string
): AdminQueryParam {
  const params = new AdminQueryParam();
  if (registrationNo) {
    params.registrationNo = registrationNo;
  }
  if (adminFilters?.length > 0) {
    params.branchFilter = new AdminBranchFilter();
    params.branchFilter.molEstIncluded = undefined;
    const roleFilter = adminFilters.filter(item => item.key === FilterKeyEnum.ROLES);
    const nationalityFilter = adminFilters.filter(item => item.key === FilterKeyEnum.NATIONALITY);
    if (roleFilter?.length > 0 && roleFilter[0]?.bilingualValues?.length > 0) {
      params.branchFilter.roles = mapAdminRolesToId(roleFilter[0]?.bilingualValues);
    }
    if (nationalityFilter?.length > 0 && nationalityFilter[0]?.bilingualValues?.length > 0) {
      params.branchFilter.nationality = nationalityFilter[0]?.codes;
    }
  }
  if (searchParam !== undefined) {
    params.searchParam = searchParam;
  }
  return params;
}

/**
 * Method to set the required params
 * @param registrationNo
 * @param pageNo
 * @param statuses
 * @param includeUnassigned
 */
export function setBranchesParams(
  self: AdminScComponent,
  registrationNo: number,
  pageNo: number = 0,
  statuses: number[],
  includeUnassigned = false,
  filters?: Array<FilterKeyValue>,
  searchParams?: string
) {
  const params = new AdminBranchQueryParam();
  params.branchFilter.registrationNo = registrationNo;
  params.branchFilter.includeBranches = true;
  params.branchFilter.excludeBranches = includeUnassigned;
  if (Number(self.selectedAdminId )!== Number(self.loggedInAdminId)) {
    params.branchFilter.adminId = self.selectedAdminId;
  }
  params.page.pageNo = pageNo;
  params.page.size = self.itemsPerPage;
  const role = getAdminRole([self.establishmentService.loggedInAdminRole]);
  params.branchFilter.role = mapAdminRolesToId(role) ? mapAdminRolesToId(role)[0] : undefined;
  params.branchFilter.status = statuses;
  if (filters?.length > 0) {
    const roles = filters.filter(item => item.key === FilterKeyEnum.ROLES);
    if (roles[0]?.bilingualValues?.length > 0) {
      params.branchFilter.roles = mapAdminRolesToId(roles[0]?.bilingualValues);
    }
  }
  params.searchParam = searchParams;
  return params;
}

export const checkReplaceAdminTransaction = (
  self: AdminScComponent,
  workflows: EstablishmentWorkFlowStatus[] = [],
  template: TemplateRef<HTMLElement>,
  draftTemp: TemplateRef<HTMLElement>
) => {
  let alert: Alert;
  const [alertKeys, alertMessages, paramMap] = workflows
    ?.filter(item => !item?.isDraft)
    .reduce(
      (keyAndMessage, workflow) => {
        keyAndMessage = checkInterDomainForReplaceSuperAdmin(workflow, keyAndMessage);
        return keyAndMessage;
      },
      [[] as string[], [] as BilingualText[], new Map<number, Object>()]
    );
  alert = getAlerts(alertKeys, alertMessages, paramMap);
  if (alert?.details?.length > 0) {
    showEditWarningModal(self, 'ESTABLISHMENT.REPLACE-BRANCH-MANAGER', alert.details, template);
  } else {
    self.draftTransaction = getDraftWorkflow(workflows, WorkFlowStatusType.REPLACE_SUPER_ADMIN);
    if (self.draftTransaction) {
      self.showMedModal(draftTemp);
    } else {
      self.goToReplace();
    }
  }
};
const checkInterDomainForReplaceSuperAdmin = (
  workflow: EstablishmentWorkFlowStatus,
  keyAndMessage: [string[], BilingualText[], Map<number, Object>]
) => {
  if (workflow.type === WorkFlowStatusType.DELINK) {
    keyAndMessage[1].push(workflow.message);
  }
  if (workflow.type === WorkFlowStatusType.CBM) {
    keyAndMessage[1].push(workflow.message);
  }
  return keyAndMessage;
};

export const showEditWarningModal = (
  self: AdminScComponent,
  heading: string,
  warningMsg: Alert[],
  editWarningTemplate: TemplateRef<HTMLElement>
) => {
  self.editWarningHeading = heading;
  self.editWarningMsg = warningMsg;
  self.showModal(editWarningTemplate, 'lg', true);
};
