/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  Alert,
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  DropdownItem,
  EstablishmentProfile, IdentityTypeEnum, Iqama, LoginService,
  LovList, NationalId, NIN,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import {
  Admin,
  AdminActionEnum,
  AdminRoleEnum,
  AdminWrapper,
  BranchList,
  ControlPerson,
  ErrorCodeEnum,
  EstablishmentAdminService,
  EstablishmentConstants,
  EstablishmentRoutingService,
  EstablishmentService,
  EstablishmentWorkFlowStatus,
  FilterKeyValue,
  mapAdminToControlPersons,
  WorkFlowStatusType
} from '../../../shared';
import { EstablishmentScBaseComponent } from '../../../shared/base/establishment-sc.base-component';
import { adminActionList, getAdminRole, goToResumeTransaction, mapAdminIdsToRole } from '../../../shared/utils';
import {
  checkReplaceAdminTransaction,
  enableActions,
  filterAdminActions,
  getAdminParams,
  setBranchesParams
} from './admin.helper';
export const incorrectRoute = { error: { message: { english: 'Incorrect Route', arabic: 'Incorrect Route' } } };
@Component({
  selector: 'est-admin-sc',
  templateUrl: './admin-sc.component.html',
  styleUrls: ['./admin-sc.component.scss']
})
export class AdminScComponent extends EstablishmentScBaseComponent implements OnInit, OnDestroy {
  registrationNo: number;
  loggedInAdminId: any;
  admins: Admin[] = [];
  administringBranches: BranchList[] = [];
  selectedAdminIndex: number;
  selectedAdminId: number;
  selectedAdminRole: BilingualText;
  selectedAdmin: Admin;
  viewOnly = false; // Restrict all actions if viewed from validator view
  underEst: boolean;
  estProfile: EstablishmentProfile;
  branchPagination = {
    currentPage: 1,
    goToPage: 1
  };
  currentBranchPage = 1;
  itemsPerPage = 5;
  noOfAdminsInitially = 6;
  adminActions = adminActionList();
  filteredActions: DropdownItem[];
  adminsForView: ControlPerson[];
  totalAdmin: ControlPerson[];
  canInitialise = false;
  canAdd: boolean;
  canEdit: boolean;
  canReplace: boolean;
  canDelete: boolean;
  canAssign: boolean;
  showBranches: boolean;
  showFilter: boolean;
  branchList: BranchList[];
  totalBranches: number;
  loggedInAdminRoleId: number;
  isUnderWorkflow: boolean; //check if replace already in workflow for super admin
  delinkUnderWorkflow: boolean;
  delinkWorkflowMessage: BilingualText;
  assignBranchesHeading = AdminActionEnum.ASSIGN;
  nationalityFilter$: Observable<LovList>;
  roleList$: Observable<BilingualText[]>;
  adminFilters: FilterKeyValue[] = [];
  adminFilterValue: FilterKeyValue[] = [];
  adminSearchParam: string = undefined;
  branchFilters: FilterKeyValue[];
  branchSearchParam: string;
  roles$: Observable<BilingualText[]>;
  searchForm = new FormGroup({});
  isLoadingBranches = false;
  isLoadingAdmin = false;
  previousUrl: string;
  workflowsInProgress: EstablishmentWorkFlowStatus[] = undefined;
  editWarningMsg: Alert[];
  editWarningHeading: string;
  @ViewChild('replaceAdminRestrictTemplate', { static: true })
  replaceAdminRestrictTemplate: TemplateRef<HTMLElement>;
  @ViewChild('draftModal', { static: true })
  draftModal: TemplateRef<HTMLElement>;
  draftTransaction: EstablishmentWorkFlowStatus;
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly adminService: EstablishmentAdminService,
    @Inject(ApplicationTypeToken) readonly appType: string,
    readonly alertService: AlertService,
    readonly bsModalService: BsModalService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly location: Location,
    readonly estRoutingService: EstablishmentRoutingService,
    readonly workflowService: WorkflowService,
    readonly loginService: LoginService,
    private authTokenService: AuthTokenService
  ) {
    super(bsModalService, workflowService);
  }
  ngOnInit(): void {
    this.getDataFromRouterParams(this.route.paramMap);
  }
  /**
   * Method to fetch the data from activate route
   * @param paramMap
   */
  getDataFromRouterParams(paramMap: Observable<ParamMap>) {
    paramMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          // to identify the group/establishment
          if (params?.get('registrationNo') && this.establishmentService.loggedInAdminRole) {
            this.registrationNo = +params.get('registrationNo');
            if (params.get('adminId')) {
              this.underEst = false;
              return this.initialiseWithAdminsAndBranches(params.get('adminId'), this.registrationNo);
            } else {
              this.underEst = true;
              return this.establishmentService.getEstablishmentProfileDetails(this.registrationNo).pipe(
                switchMap(res => {
                  this.estProfile = res;
                  return this.initialiseWithAdminsAndBranches(params.get('adminId'), this.registrationNo);
                })
              );
            }
          } else {
            this.location.back();
            if (!params?.get('registrationNo')) {
              return throwError(incorrectRoute);
            }
          }
        }),
        switchMap(() => {
          return this.estRoutingService.previousUrl$.pipe(
            take(1),
            tap(preUrl => {
              this.previousUrl = preUrl;
            })
          );
        }),
        tap(() => {
          this.canInitialise = true;
        }),
        switchMap(() => {
          return this.establishmentService.getWorkflowsInProgress(this.registrationNo).pipe(
            catchError(() => {
              return of([] as EstablishmentWorkFlowStatus[]);
            }),
            tap(res => {
              this.workflowsInProgress = res;
              if (res?.length > 0) {
                const replaceSuperAminWorkflow: EstablishmentWorkFlowStatus = res
                  ?.filter(item => !item.isDraft)
                  .find(item => item.type === WorkFlowStatusType.REPLACE_SUPER_ADMIN);
                if (replaceSuperAminWorkflow) {
                  this.isUnderWorkflow = true;
                  if (this.previousUrl.indexOf('/replace-admin') === -1) {
                    this.alertService.showWarning(replaceSuperAminWorkflow.message);
                  }
                }
              }
            })
          );
        }),
        switchMap(() => {
          enableActions(this);
          return filterAdminActions(this);
        })
      )
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
        this.canInitialise = false;
      });
  }
  /**
   * Method to initialise the page with admins or corresponding establishment
   * @param params
   * @param registrationNo
   */
  initialiseWithAdminsAndBranches(adminId: string, registrationNo: number): Observable<BranchList[]> {
    this.loggedInAdminId = adminId ? adminId : undefined;
    let admins$: Observable<Admin[]>;
    if (this.appType === ApplicationTypeEnum.PUBLIC) {
      // Access this page only with admin identifier in the route
      if (adminId && this.router.url.indexOf('user') !== -1) {
        admins$ = this.getAdmins(registrationNo, +adminId);
      } else {
        return throwError(incorrectRoute);
      }
    } else {
      admins$ = this.getAdmins(registrationNo, adminId ? +adminId : undefined);
    }
    return admins$.pipe(
      switchMap(res => {
        if (this.adminsForView?.length > 0) this.selectedAdminId = this.adminsForView[0]?.commonId?.id;
        if (res?.length > 0) this.selectedAdminRole = res[0]?.roles[0] as BilingualText;
        this.selectedAdminIndex = 0;
        if (this.admins?.length > 0) this.selectedAdmin = this.admins[0];
        return this.getBranches(registrationNo);
      })
    );
  }
  getAdmins(
    registrationNo: number,
    adminId: number,
    adminFilters: FilterKeyValue[] = [],
    adminSearchParam?: string
  ): Observable<Admin[]> {
    let admin$: Observable<AdminWrapper>;
    if (!this.underEst) {
      this.isLoadingAdmin = true;
      const params = getAdminParams(registrationNo, adminFilters, adminSearchParam);
      admin$ = this.establishmentService.getAdminsUnderSupervisor(adminId, params);
    } else {
      admin$ = this.establishmentService.getAdminsOfEstablishment(registrationNo);
    }
    return admin$.pipe(
      tap(adminWrapper => {
        if (adminWrapper?.adminFilterResponseDto) {
          if (adminWrapper.adminFilterResponseDto.nationalitiesPresent?.length > 0) {
            this.nationalityFilter$ = of(new LovList(adminWrapper.adminFilterResponseDto.nationalitiesPresent));
          }
          if (adminWrapper.adminFilterResponseDto.roles?.length > 0) {
            this.roleList$ = of(mapAdminIdsToRole(adminWrapper.adminFilterResponseDto.roles));
          }
        }
      }),
      map(res => res.admins),
      tap(res => {
        if (res?.length === 0) {
          this.isLoadingAdmin = false;
          this.adminsForView = [];
        } else {
          this.admins = res;
          this.isLoadingAdmin = false;
          const isBranchAdmin = this.admins[0].roles.find(role => {
            if ((role as BilingualText).english === AdminRoleEnum.BRANCH_ADMIN) {
              return true;
            }
          })
            ? true
            : false;
          if (isBranchAdmin) {
            this.admins[0].roles = getAdminRole([AdminRoleEnum.BRANCH_ADMIN]);
          }
          this.adminsForView = mapAdminToControlPersons({ admins: this.admins });
          if (!this.adminSearchParam) {
            if (this.adminFilterValue.length === 0) {
              this.totalAdmin = this.adminsForView;
            }
          }
        }
      }),
      catchError(err => {
        this.alertService.showError(err?.error?.message);
        return throwError(err);
      })
    );
  }
  getBranches(registrationNo: number, pageNo: number = 0): Observable<BranchList[]> {
    let branches$: Observable<BranchList[]>;
    if (this.underEst) {
      this.totalBranches = 1;
      branches$ = of([{ ...new BranchList(), ...this.estProfile, ...{ roles: [this.selectedAdminRole] } }]);
    } else {
      this.isLoadingBranches = true;
      const params = setBranchesParams(
        this,
        registrationNo,
        pageNo,
        [],
        false,
        this.branchFilters,
        this.branchSearchParam
      );
      branches$ = this.establishmentService.getBranchesUnderAdmin(this.loggedInAdminId, params)?.pipe(
        tap(branchWrapper => {
          this.isLoadingBranches = false;
          this.totalBranches = branchWrapper.branchStatus.totalBranches;
          if (branchWrapper.filter?.roles?.length > 0) {
            this.roles$ = of(mapAdminIdsToRole(branchWrapper.filter?.roles));
          }
        }),
        map(res => res.branchList),
        catchError(err => {
          this.isLoadingBranches = false;
          if (err.error.code === ErrorCodeEnum.BRANCH_NO_RECORD) {
            this.totalBranches = 0;
            return of([]);
          } else return throwError(err);
        })
      );
    }
    return branches$?.pipe(tap(res => (this.administringBranches = res)));
  }
  // method to get the details of the selected admin
  selectAdmin(adminId: number) {
    this.selectedAdminId = adminId;
    this.getBranches(this.registrationNo)
      .pipe(
        tap(() => {
          this.adminsForView.some((admin, index) => {
            if (admin.commonId.id === adminId) {
              this.selectedAdminIndex = index;
            }
          });
          this.branchFilters = [];
          this.selectedAdmin = this.admins[this.selectedAdminIndex];
          this.selectedAdminRole = this.selectedAdmin.roles[0] as BilingualText;
        }),
        switchMap(() => {
          enableActions(this);
          return filterAdminActions(this);
        })
      )
      .subscribe(noop, err => this.alertService.showError(err?.error?.message));
  }
  /**
   * Branch Pagination
   * @param pageIndex
   */
  selectBranch(pageIndex: number) {
    this.getBranches(this.registrationNo, pageIndex - 1)
      .pipe(
        tap(() => {
          this.branchPagination.currentPage = pageIndex;
          this.currentBranchPage = pageIndex;
        })
      )
      .subscribe(noop, err => this.alertService.showError(err?.error?.message));
  }
  /**
   * Method to search the admin under the logged in user
   * @param value
   */
  searchAdmin(value: string) {
    this.adminSearchParam = value;
    this.branchSearchParam = null;
    this.searchForm?.get('search')?.setValue(null);
    this.branchFilters = [];
    this.getAdmins(this.registrationNo, this.loggedInAdminId, this.adminFilters, value)
      .pipe(switchMap(res => this.selectAdminAndLoadBranches(res)))
      .subscribe();
  }
  filterAdmin(filters: FilterKeyValue[]) {
    if (filters) {
      this.adminFilterValue = filters;
      this.branchFilters = [];
      this.branchSearchParam = null;
      this.searchForm?.get('search')?.setValue(null);
      this.getAdmins(this.registrationNo, this.loggedInAdminId, filters, this.adminSearchParam)
        .pipe(switchMap(res => this.selectAdminAndLoadBranches(res)))
        .subscribe();
    }
  }
  searchBranches(searchParam: string) {
    this.branchSearchParam = searchParam;
    this.branchPagination.currentPage = this.currentBranchPage = 1;
    this.getBranches(this.registrationNo, 0).subscribe(noop, err => this.alertService.showError(err?.error?.message));
  }
  filterBranches(filters: FilterKeyValue[]) {
    this.branchFilters = filters;
    this.getBranches(this.registrationNo, 0).subscribe(noop, err => this.alertService.showError(err?.error?.message));
  }
  selectAdminAndLoadBranches(admins: Admin[]): Observable<BranchList[]> {
    this.selectedAdminId = this.adminsForView[0].commonId.id;
    this.selectedAdminRole = admins[0].roles[0] as BilingualText;
    this.selectedAdminIndex = 0;
    this.selectedAdmin = this.admins[0];
    return this.getBranches(this.registrationNo);
  }
  // Method to navigate to add admin
  addAdmin() {
    if (this.loggedInAdminId) {
      this.router.navigate([EstablishmentConstants.ADD_ADMIN_ROUTE(this.registrationNo, this.loggedInAdminId)]);
    }
  }
  replaceAdmin() {
    this.establishmentService.selectedAdmin = this.selectedAdmin;
    if (
      this.selectedAdminRole.english === AdminRoleEnum.SUPER_ADMIN ||
      this.selectedAdminRole.english === AdminRoleEnum.GCC_ADMIN
    ) {
      checkReplaceAdminTransaction(this, this.workflowsInProgress, this.replaceAdminRestrictTemplate, this.draftModal);
    } else {
      this.router.navigate([EstablishmentConstants.REPLACE_EST_ADMIN_ROUTE(this.loggedInAdminId, this.registrationNo)]);
    }
  }
  // Method to show the modal to delete admin
  deleteAdmin(deleteTemplate: TemplateRef<HTMLElement>) {
    this.alertService.clearAlerts();
    this.showModal(deleteTemplate);
  }
  //Method to delete the selected admin
  confirmDelete() {
    let successMessage: BilingualText;
    this.adminService
      .deleteAdmin(this.loggedInAdminId, this.registrationNo, this.selectedAdmin?.person?.personId)
      .pipe(
        tap(res => {
          successMessage = res.successMessage;
          if(this.compareIdNum()){
            this.authTokenService.doLogout();
          }
        }),
        switchMap(() => this.getAdmins(this.registrationNo, this.loggedInAdminId)),
        switchMap(res => {
          this.selectedAdminId = this.adminsForView[0]?.commonId.id;
          this.selectedAdminRole = res[0]?.roles[0];
          this.selectedAdminIndex = 0;
          this.selectedAdmin = this.admins[0];
          return this.getBranches(this.registrationNo);
        })
      )
      .subscribe(
        () => {
          this.hideModal();
          this.alertService.showSuccess(successMessage);
        },
        err => this.alertService.showError(err?.error?.message)
      );
  }
  //Method to modify branches page
  modifyBranch() {
    this.establishmentService.selectedAdmin = this.selectedAdmin;
    this.router.navigate([EstablishmentConstants.MODIFY_ADMIN_ROUTE(this.registrationNo, this.loggedInAdminId)]);
  }
  //Navigate to assign branches page
  assignBranch() {
    this.establishmentService.selectedAdmin = this.selectedAdmin;
    this.router.navigate([EstablishmentConstants.ASSIGN_ADMIN_ROUTE(this.registrationNo, this.loggedInAdminId)]);
  }
  selectedAction(key: string, deleteTemplate: TemplateRef<HTMLElement>) {
    if (key === AdminActionEnum.ASSIGN) {
      this.assignBranch();
    } else if (key === AdminActionEnum.MODIFY) {
      this.modifyBranch();
    } else if (key === AdminActionEnum.REPLACE) {
      this.replaceAdmin();
    } else if (key === AdminActionEnum.DELETE) {
      this.deleteAdmin(deleteTemplate);
    }
  }
  ngOnDestroy() {
    this.alertService.clearAlerts();
    super.ngOnDestroy();
  }
  navigateBack() {
    this.alertService.clearAlerts();
    this.location.back();
  }
  cancelAndStart() {
    this.establishmentService
      .revertTransaction(this.registrationNo, this.draftTransaction?.referenceNo)
      .pipe(
        tap(() => {
          this.goToReplace();
        }),
        catchError(err => {
          this.alertService.showError(err?.error?.code, err?.error?.details);
          return of(null);
        })
      )
      .subscribe();
  }
  navigateToTransaction() {
    goToResumeTransaction(this.router, this.draftTransaction?.referenceNo, this.draftTransaction?.transactionId);
  }
  goToReplace() {
    this.router.navigate([EstablishmentConstants.REPLACE_SUPER_ADMIN_ROUTE(this.registrationNo)]);
  }

  compareIdNum(): boolean {
    switch (this.selectedAdmin.person.identity[0].idType) {
      case IdentityTypeEnum.IQAMA:
        return Number((this.selectedAdmin.person.identity[0] as Iqama).iqamaNo) === Number(this.loggedInAdminId);
      case IdentityTypeEnum.NIN:
        return Number((this.selectedAdmin.person.identity[0] as NIN).newNin ) === Number(this.loggedInAdminId);
      case IdentityTypeEnum.NATIONALID:
        return Number((this.selectedAdmin.person.identity[0]  as NationalId).id) === Number(this.loggedInAdminId);

    }
  }
}
