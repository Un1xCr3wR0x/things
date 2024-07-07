/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  AlertService,
  BilingualText,
  EstablishmentStatusCodeEnum,
  getIdentityByType,
  LovList,
  TransactionInterface,
  TransactionMixin,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, noop, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  Admin,
  AdminActionEnum,
  AdminBranchQueryParam,
  AdminRoleEnum,
  BranchList,
  ErrorCodeEnum,
  EstablishmentAdminService,
  EstablishmentBranchWrapper,
  EstablishmentConstants,
  EstablishmentService,
  FilterKeyEnum,
  FilterKeyValue,
  IBranchRole
} from '../../../shared';
import { EstablishmentScBaseComponent } from '../../../shared/base/establishment-sc.base-component';
import { getAdminRole, mapAdminRolesToId } from '../../../shared/utils';
import { incorrectRoute } from '../admin-sc/admin-sc.component';

/**
 * With respect to logged in admin modify/assign the access of the selected admin corresponding to the branches
 */
@Component({
  selector: 'est-update-admin-sc',
  templateUrl: './update-admin-sc.component.html',
  styleUrls: ['./update-admin-sc.component.scss']
})
export class UpdateAdminScComponent
  extends TransactionMixin(EstablishmentScBaseComponent)
  implements TransactionInterface, OnInit, OnDestroy
{
  /* State Variables - These variables govern the state of the component from external factor and doesnot change*/
  isFieldOffice: boolean;
  mainRegNo: number;
  loggedInAdminRole: string;
  loggedInAdminRoleId: number;
  loggedInAdminId: number; //NIN,GC Id, Iqama No
  adminToUpdate: Admin;
  showOnlyRoleAdmins: boolean;
  transationToAssign: boolean;

  //local state variables- govern the component state and can change
  isValid = false; //If the user submits without assigning or modifying
  isSuccess = false; //Is Transaction Success
  heading = AdminActionEnum.MODIFY;

  // Pagination Variables
  totalBranches = 0;
  currentPage = 1;
  itemsPerPage = 5;
  noRoles: 'No Role';
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };

  //Data Variables
  updatedBranches: Map<number, IBranchRole> = new Map();
  branches: BranchList[];
  branchesWithoutUpdate: BranchList[];
  initialsed: boolean;
  branchRolesBeforeChange: Array<BilingualText[]>;
  branchSearchParam: string;
  branchFilters: FilterKeyValue[];
  locations$: Observable<LovList>;
  isLoadingBranches = false;
  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;

  constructor(
    readonly alertService: AlertService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly bsModalService: BsModalService,
    readonly location: Location,
    readonly establishmentService: EstablishmentService,
    readonly adminService: EstablishmentAdminService,
    readonly workflowService: WorkflowService
  ) {
    super(bsModalService, workflowService);
  }

  ngOnInit(): void {
    this.getStateFromRoute(this.route.paramMap).subscribe(
      () => {
        this.initialsed = true;
      },
      err => {
        this.initialsed = false;
        this.alertService.showError(err?.error?.message);
      }
    );
  }

  /**
   * Method to validate the state
   */
  getStateFromRoute(params: Observable<ParamMap>) {
    return params.pipe(
      switchMap(param => {
        if (param?.get('adminId') && param?.get('registrationNo')) {
          this.initialiseState(param);
          return this.getBranches();
        } else {
          return throwError(incorrectRoute);
        }
      })
    );
  }

  /**
   * Method to initialise the state
   * @param param
   */
  initialiseState(param: ParamMap) {
    this.loggedInAdminId = +param.get('adminId');
    this.mainRegNo = +param.get('registrationNo');
    if (this.router.url.includes(EstablishmentConstants.ASSIGN_ADMIN_ROUTE(this.mainRegNo, this.loggedInAdminId))) {
      this.transationToAssign = true;
      this.heading = AdminActionEnum.ASSIGN;
    }
    if (this.establishmentService.selectedAdmin) {
      this.adminToUpdate = this.establishmentService.selectedAdmin;
      this.loggedInAdminRole = this.establishmentService.loggedInAdminRole;
      this.loggedInAdminRoleId = mapAdminRolesToId(getAdminRole([this.establishmentService.loggedInAdminRole]))[0];
      if (this.loggedInAdminRole !== AdminRoleEnum.SUPER_ADMIN) {
        this.showOnlyRoleAdmins = true;
      }
    }
  }

  /**
   * Method to fetch the branches under the establishment
   * @param pageNo
   * @param size
   */
  getBranches(pageNo = 0): Observable<EstablishmentBranchWrapper> {
    if (!this.isRolesValid([])) {
      return;
    }
    let hasRoles = true;
    this.updatedBranches.forEach(value => {
      if (value.roles !== undefined && value.roles.length === 0) {
        hasRoles = false;
      }
    });
    if (!hasRoles) {
      this.alertService.showErrorByKey('ESTABLISHMENT.SELECT-ROLE');
      return;
    }
    this.isLoadingBranches = true;
    return this.establishmentService
      .getBranchesUnderAdmin(this.loggedInAdminId, this.getBranchesWithAdminParams(pageNo))
      .pipe(
        tap(res => {
          if (res?.filter?.locations) {
            this.locations$ = of(new LovList(res.filter.locations));
          }
          this.branchesWithoutUpdate = res.branchList;
          this.branchRolesBeforeChange = [];
          res.branchList.forEach(branch => {
            this.branchRolesBeforeChange.push(branch.roles);
            const roles = this.transationToAssign ? [] : branch.roles;
            const updatedRoles = this.updatedBranches.get(branch.registrationNo)?.roles;
            branch.roles = updatedRoles?.length > 0 ? updatedRoles : roles;
          });
          this.branches = res.branchList;
          this.totalBranches = res.branchStatus.totalBranches;
          this.currentPage = this.pageDetails.currentPage = pageNo + 1;
          this.isLoadingBranches = false;
        }),
        map(res => res.branchList),
        catchError(err => {
          this.isLoadingBranches = false;
          if (err.error.code === ErrorCodeEnum.BRANCH_NO_RECORD) {
            return (this.branches = []);
          } else return throwError(err);
        })
      );
  }

  /**
   * Method to set the required params
   */
  getBranchesWithAdminParams(pageNo: number): AdminBranchQueryParam {
    const params = new AdminBranchQueryParam();
    params.branchFilter.registrationNo = this.mainRegNo;
    params.branchFilter.includeBranches = true; //get branches from the group
    params.branchFilter.adminId = getIdentityByType(
      this.adminToUpdate.person.identity,
      this.adminToUpdate.person.nationality?.english
    )?.id; //fetch the branches with roles respect to adminId
    params.branchFilter.excludeBranches = this.transationToAssign; //branches which the adminId has no access
    params.page.pageNo = pageNo;
    params.page.size = this.itemsPerPage;
    params.branchFilter.role = this.loggedInAdminRoleId;
    params.branchFilter.status = [EstablishmentStatusCodeEnum.REGISTERED];
    params.searchParam = this.branchSearchParam;
    if (this.branchFilters?.length > 0) {
      const locations = this.branchFilters.filter(item => item.key === FilterKeyEnum.LOCATION);
      if (locations[0]?.bilingualValues?.length > 0) {
        params.branchFilter.location = locations[0]?.codes;
      }
    }
    return params;
  }

  /**
   * Method to check if there are roles selected
   * @param branchesWithRole
   */
  isRolesValid(branchesWithRole): boolean {
    this.isValid = true;
    if (this.updatedBranches) {
      for (const [key, value] of this.updatedBranches) {
        if (value.isValid === false) {
          this.isValid = false;
          this.alertService.showMandatoryErrorMessage();
          return false;
        }
        //If transaction to assign we need not count est with no roles
        if (this.transationToAssign ? value.roles && value.roles.length > 0 : true) {
          const admin = new Admin();
          if (this.adminToUpdate) {
            admin.person = this.adminToUpdate.person;
          }
          admin.roles = value.roles;
          branchesWithRole.push({ registrationNo: key, admin: admin });
        }
      }
    }
    return this.isValid;
  }

  /**
   * Method to add roles
   * @param roles
   */
  updateBranches(value: IBranchRole, registrationNo: number) {
    const branchBeforeUpdate = this.branchesWithoutUpdate.find(branch => branch.registrationNo === registrationNo);
    if (this.rolesNotChanged(branchBeforeUpdate.roles, value.roles ? value.roles : [])) {
      if (this.updatedBranches.get(registrationNo)) {
        this.updatedBranches.delete(registrationNo);
      }
    } else {
      this.updatedBranches.set(registrationNo, value);
    }
  }

  /**
   * Check if roles has changed
   */
  rolesNotChanged(rolesBefore: BilingualText[], rolesUpdated: BilingualText[]): boolean {
    let noOfSameRoles = 0;
    rolesBefore?.forEach(role => {
      if (rolesUpdated.find(roleUpdated => roleUpdated.english === role.english)) {
        noOfSameRoles++;
      }
    });
    return noOfSameRoles === rolesBefore?.length && rolesBefore?.length === rolesUpdated.length;
  }

  /**
   * Method to get branches
   */
  selectBranches(page: number) {
    this.getBranches(page).subscribe(noop, err => this.alertService.showError(err?.error?.message));
  }

  submitTransaction() {
    this.alertService.clearAlerts();
    const branchesWithRole: Array<{ registrationNo: number; admin: Admin }> = [];
    if (!this.isRolesValid(branchesWithRole)) {
      return;
    }
    if (branchesWithRole.length < 1) {
      this.alertService.showMandatoryErrorMessage();
      return;
    }
    let successMessage: BilingualText;
    this.adminService
      .saveAdminDetails(branchesWithRole[0].admin, branchesWithRole[0].registrationNo, !this.transationToAssign)
      .pipe(
        switchMap(res => {
          successMessage = res.successMessage;
          return branchesWithRole.length > 1
            ? forkJoin(
                branchesWithRole
                  .slice(1)
                  .map(branch =>
                    this.adminService.saveAdminDetails(branch.admin, branch.registrationNo, !this.transationToAssign)
                  )
              )
            : of(null);
        })
      )
      .subscribe(
        () => {
          this.setTransactionComplete();
          this.alertService.showSuccess(successMessage);
          this.location.back();
        },
        err => this.alertService.showError(err?.error?.message, err?.error?.details)
      );
  }

  cancelTransaction() {
    this.setTransactionComplete();
    this.hideModal();
    this.reRoute ? this.router.navigate([this.reRoute]) : this.location.back();
  }

  searchBranches(searchParam: string) {
    this.alertService.clearAlerts();
    this.branchSearchParam = searchParam;
    this.getBranches().subscribe();
  }

  applyFilter(filters: Array<FilterKeyValue>) {
    this.branchFilters = filters;
    this.isLoadingBranches = true;
    this.getBranches().subscribe();
  }

  ngOnDestroy() {
    // this.alertService.clearAlerts();
    super.ngOnDestroy();
  }
  askForCancel() {
    this.showModal(this.cancelTemplate);
  }
}
