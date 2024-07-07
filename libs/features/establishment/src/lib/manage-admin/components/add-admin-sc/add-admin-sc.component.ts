/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BilingualText,
  Establishment,
  EstablishmentStatusCodeEnum,
  getIdentityByType,
  LookupService,
  LovList,
  markFormGroupTouched,
  WizardItem,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, noop, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  activateWizard,
  Admin,
  AdminBranchQueryParam,
  AdminRoleEnum,
  BranchList,
  ErrorCodeEnum,
  EstablishmentAdminService,
  EstablishmentBranchWrapper,
  EstablishmentErrorKeyEnum,
  EstablishmentService,
  filterIdentities,
  FilterKeyEnum,
  FilterKeyValue,
  getChangeAdminWizards
} from '../../../shared';
import { ManageAdminScBaseComponent } from '../../../shared/base/manage-admin-sc.base-component';
import { getAdminRole, mapAdminRolesToId } from '../../../shared/utils';
import { incorrectRoute } from '../admin-sc/admin-sc.component';

@Component({
  selector: 'est-add-admin-sc',
  templateUrl: './add-admin-sc.component.html',
  styleUrls: ['./add-admin-sc.component.scss']
})
export class AddAdminScComponent extends ManageAdminScBaseComponent implements OnInit {
  estAdminForm: FormGroup;
  adminWizards: WizardItem[];
  currentTab = 0;
  isGCC = false;
  defaultToSaudi = true;
  estAdmin: Admin;
  establishment: Establishment;
  adminId: number;
  mainRegNo: number;
  totalBranches = 0;
  currentPage = 1;
  itemsPerPage = 5;
  branchesWithChange: BranchList;
  updatedBranches: Map<number, { roles: BilingualText[]; isValid: boolean }> = new Map();
  noRoles: 'No Role';
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  branches: BranchList[];
  isValid = true;
  isSuccess: boolean;
  loggedInAdminRole: string;
  loggedInAdminRoleId: number;
  showOnlyRoleAdmins: boolean;
  branchFilters: FilterKeyValue[];
  locations$: Observable<LovList>;
  branchSearchParam: string;
  isLoadingBranches = false;

  constructor(
    readonly lookUpService: LookupService,
    readonly alertService: AlertService,
    readonly bsModalService: BsModalService,
    readonly establishmentService: EstablishmentService,
    @Inject(ApplicationTypeToken) readonly appType: string,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly adminService: EstablishmentAdminService,
    readonly location: Location,
    readonly workflowService: WorkflowService
  ) {
    super(bsModalService, lookUpService, alertService, establishmentService, appType, location, workflowService);
  }

  ngOnInit(): void {
    this.initialiseFromRoutes(this.route.paramMap).subscribe(noop, err =>
      this.alertService.showError(err?.error?.message)
    );
    this.loggedInAdminRole = this.establishmentService.loggedInAdminRole;
    const roles = getAdminRole([this.establishmentService.loggedInAdminRole]);
    this.loggedInAdminRoleId = mapAdminRolesToId(roles) ? mapAdminRolesToId(roles)[0] : undefined;
    if (!this.loggedInAdminRole) {
      this.router.navigate(['/home']); //TODO redirect to group profile page
    }
    this.checkRoles(this.loggedInAdminRole);
  }

  initialiseFromRoutes(paramMap: Observable<ParamMap>) {
    return paramMap.pipe(
      switchMap(params => {
        if (params && params.get('adminId') && params.get('registrationNo')) {
          this.adminId = +params.get('adminId');
          this.mainRegNo = +params.get('registrationNo');
          return of(null);
        } else {
          return throwError(incorrectRoute);
        }
      }),
      tap(() => {
        this.estAdminForm = this.createEstAdminForm();
        this.initialiseTabWizards(this.currentTab);
        this.intialiseLookUpValues();
      })
    );
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
    return this.establishmentService.getBranchesUnderAdmin(this.adminId, this.getBranchesWithAdminParams(pageNo)).pipe(
      tap(res => {
        if (res?.filter?.locations) {
          this.locations$ = of(new LovList(res.filter.locations));
        }
        res.branchList.forEach(branch => {
          const updatedRoles = this.updatedBranches.get(branch.registrationNo)?.roles;
          branch.roles = updatedRoles?.length > 0 ? updatedRoles : [];
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
          this.totalBranches = 0;
          this.branches = [];
          return of(null);
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
      this.estAdmin.person.identity,
      this.estAdmin.person.nationality?.english
    )?.id; //fetch the branches with respect to adminId
    params.branchFilter.excludeBranches = true; //branches which the adminId has no access
    params.page.pageNo = pageNo;
    params.page.size = this.itemsPerPage;
    params.branchFilter.role = this.loggedInAdminRoleId;
    params.searchParam = this.branchSearchParam;
    params.branchFilter.status = [EstablishmentStatusCodeEnum.REGISTERED];
    if (this.branchFilters?.length > 0) {
      const locations = this.branchFilters.filter(item => item.key === FilterKeyEnum.LOCATION);
      if (locations[0]?.bilingualValues?.length > 0) {
        params.branchFilter.location = locations[0]?.codes;
      }
    }
    return params;
  }

  /**
   * Method to get branches
   */
  selectBranches(page: number) {
    this.getBranches(page).subscribe(noop, err => this.alertService.showError(err?.error?.message));
  }

  /**
   * Method to initialise current tab
   * @param currentTab
   */
  initialiseTabWizards(currentTab: number) {
    this.adminWizards = getChangeAdminWizards(currentTab);
  }
  /**
   * Method to select the tab
   * @param tabIndex
   */
  selectedWizard(tabIndex: number, restrictNextWizards: boolean = false) {
    this.currentTab = tabIndex;
    this.adminWizards = activateWizard(this.adminWizards, tabIndex, restrictNextWizards);
  }

  saveAdmin() {
    this.alertService.clearAlerts();
    markFormGroupTouched(this.estAdminForm);
    if (this.estAdminForm.get('isVerified').value === true) {
      const newAdmin = new Admin();
      newAdmin.person = this.estAdmin.person;
      if (this.estAdminForm.get('contactDetail').valid && this.estAdminForm.get('person').valid) {
        newAdmin.person?.fromJsonToObject((this.estAdminForm.get('person') as FormGroup)?.getRawValue());
        newAdmin.person.contactDetail = (this.estAdminForm.get('contactDetail') as FormGroup).getRawValue();
        newAdmin.person.identity = filterIdentities(newAdmin.person.identity);
        this.adminService
          .saveAsNewAdmin(newAdmin)
          .pipe(
            tap(res => {
              newAdmin.person.personId = res;
            }),
            switchMap(() => this.getBranches()),
            tap(() => {
              this.estAdmin = newAdmin;
              this.currentTab++;
              this.selectedWizard(1);
            })
          )
          .subscribe(noop, err => {
            this.alertService.showError(err?.error?.message, err?.error?.details);
          });
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    } else {
      this.alertService.showErrorByKey(EstablishmentErrorKeyEnum.VERIFY_ADMIN);
    }
  }

  /**
   * Method to submit transaction
   */
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
      .saveAdminDetails(branchesWithRole[0].admin, branchesWithRole[0].registrationNo)
      .pipe(
        switchMap(res => {
          successMessage = res.successMessage;
          if (branchesWithRole.length > 1) {
            return forkJoin(
              branchesWithRole
                .slice(1)
                .map(branch => this.adminService.saveAdminDetails(branch.admin, branch.registrationNo))
            );
          } else {
            return of(null);
          }
        })
      )
      .subscribe(
        () => {
          this.alertService.showSuccess(successMessage);
          this.location.back();
        },
        err => this.alertService.showError(err?.error?.message, err?.error?.details)
      );
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
        if (value.roles && value.roles.length > 0) {
          const admin = new Admin();
          if (this.estAdmin) {
            admin.person = this.estAdmin.person;
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
  addBranches(value, registrationNo: number) {
    this.updatedBranches.set(registrationNo, value);
  }

  /**
   * Method to check if the logged in user is a role admin
   */
  checkRoles(loggedInAdminRole: string) {
    if (loggedInAdminRole === AdminRoleEnum.GCC_ADMIN || loggedInAdminRole === AdminRoleEnum.SUPER_ADMIN) {
      this.showOnlyRoleAdmins = false;
    } else this.showOnlyRoleAdmins = true;
  }

  applyFilter(filters: Array<FilterKeyValue>) {
    this.branchFilters = filters;
    this.getBranches().subscribe();
  }

  searchBranches(searchParam: string) {
    this.alertService.clearAlerts();
    this.branchSearchParam = searchParam;
    this.getBranches().subscribe();
  }
}
