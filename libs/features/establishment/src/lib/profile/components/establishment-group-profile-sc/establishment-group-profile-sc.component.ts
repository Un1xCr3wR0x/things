/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Alert,
  AlertService,
  AlertTypeEnum,
  AppConstants,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  EstablishmentStatusEnum,
  LovList,
  RegistrationNoToken,
  RegistrationNumber,
  RoleIdEnum,
  StorageService,
  DropdownItem as TabItems,
  WorkflowService
} from '@gosi-ui/core';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/src/lib/search/services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, forkJoin, noop, of, throwError } from 'rxjs';
import { catchError, map, pluck, switchMap, takeUntil, tap } from 'rxjs/operators';
import { incorrectRoute } from '../../../manage-admin/components';
import {
  Admin,
  AdminRoleEnum,
  AdminWrapper,
  BranchEligibility,
  BranchEligibilityWrapper,
  BranchList,
  ChangeGroupEstablishmentService,
  ControlPerson,
  ErrorCodeEnum,
  Establishment,
  EstablishmentActionEnum,
  EstablishmentConstants,
  EstablishmentRoutesEnum,
  EstablishmentService,
  EstablishmentStatusErrorEnum,
  EstablishmentTypeEnum,
  EstablishmentWorkFlowStatus,
  FilterKeyValue,
  ProfileConstants,
  WindowSizeService,
  getEstablishmentStatusErrorKey,
  goToResumeTransaction,
  mapAdminToControlPersons
} from '../../../shared';
import { EstablishmentScBaseComponent } from '../../../shared/base/establishment-sc.base-component';
import { AdminQueryParam } from '../../../shared/models/admin-query-param';
import { BranchStatus } from '../../../shared/models/branch-status';
import {
  assembleGroupFromBranchList,
  branchesUnderAdmin,
  branchesUnderGroup,
  canViewManageAdmin,
  getWorkflowDetails,
  navigateToAdmin,
  setActions
} from './group-profile-helper';
@Component({
  selector: 'est-establishment-group-profile-sc',
  templateUrl: './establishment-group-profile-sc.component.html',
  styleUrls: ['./establishment-group-profile-sc.component.scss']
})
export class EstablishmentGroupProfileScComponent extends EstablishmentScBaseComponent implements OnInit, OnDestroy {
  establishmentGroup: BranchList[]; //Main and Branch Establishments
  filteredBranches: BranchList[] = []; //Branches after filter and search has been applied
  adminsOfGroup: Admin[]; //Admins responsible for the selected group
  establishmentGroups: BranchList[]; ///Different Groups under which the person has admin privilages(adminId)
  readonly NO_OF_BRANCHES = 10;
  readonly NO_OF_ADMINS = 10;
  isGcc: boolean; //Selected group is GCC
  isPpa = false;
  ppaEstablishment: boolean;
  lastRoute = EstablishmentRoutesEnum.PROFILE_SEARCH;
  registrationNo: number; //Registration number through route
  loggedInAdminId: number; // Admin Identifier through route
  profileAccessErrorKey: string;
  actionDropDown = [];
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  currentPage = 1;
  eligibility: BranchEligibility[];
  eligibilityWarningHeader: string;
  eligibilityWarningMsg: Alert;
  @ViewChild('profileAccessError', { static: true })
  profileAccessError: TemplateRef<HTMLElement>;
  @ViewChild('eligibilityWarningTemplate', { static: true })
  eligibilityWarningTemplate: TemplateRef<HTMLElement>;
  @ViewChild('warningTemplate', { static: true })
  warningTemplate: TemplateRef<HTMLElement>;
  admins: ControlPerson[]; //Show the required details of admin
  totalBranches: number;
  establishment: Establishment;
  branchStatus: BranchStatus;
  currentActiveRegNo: number; //Current establishment group reg number which is being viewed
  estGroupTabs: TabItems[]; //Required Details to be shown in tabs
  showRole: boolean; //Show admin role if searched entered through admin id
  canManageAdmin = true; //To show the manage admin button
  gccAdmin = RoleIdEnum.GCC_ADMIN;
  adminRoleId: number;
  branchFilters: FilterKeyValue[]; //status,location,legalentity
  branchSearchParam: string;
  locations$: Observable<LovList>;
  legalEntity$: Observable<LovList>;
  status$: Observable<LovList>;
  roles$: Observable<BilingualText[]>;
  mainRegistrationNumber: number;
  adminAuthRegNo: number = undefined; // For admins not mapped to main est in group
  isBranchesLoading = false;
  isFilteredBranchesEmpty: boolean;
  totalFilteredBranches: number;
  initialTabsCount$: Observable<number> = of(4);
  hasSuccessAlert: boolean;
  hasNoSuperAdmin: boolean;
  workflowsInProgress: EstablishmentWorkFlowStatus[] = undefined;
  @ViewChild('editWarningTemplate', { static: true })
  editWarningTemplate: TemplateRef<HTMLElement>;
  @ViewChild('draftModal', { static: true })
  draftModal: TemplateRef<HTMLElement>;
  editWarningHeading: string;
  editWarningMsg: Alert[];
  adminUnderWorkflow: boolean;
  adminWorkflowMessage: BilingualText;
  id: number;
  proactivePendingKey: string;
  proactiveStatusPending = 0;
  draftTransaction: EstablishmentWorkFlowStatus;
  selectedTab: number;
  fromIndividualProfile: boolean;
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly bsModalService: BsModalService,
    readonly location: Location,
    readonly changeGroupEstablishmentService: ChangeGroupEstablishmentService,
    readonly changePersonService: ChangePersonService,
    readonly dashboardSearchService: DashboardSearchService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly windowService: WindowSizeService,
    readonly workflowService: WorkflowService,
    private storageService: StorageService,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber
  ) {
    super(bsModalService, workflowService);
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { fromIndividualProfile: boolean };
    this.fromIndividualProfile = state?.fromIndividualProfile;
  }
  ngOnInit(): void {
    this.alertService.getAlerts().subscribe(alerts => {
      this.hasSuccessAlert = alerts?.filter(alert => alert.type === AlertTypeEnum.SUCCESS).length > 0;
    });
    this.initialTabsCount$ = this.windowService.windowSizeInBreakpoints$.pipe(map(res => (res === 'sm' ? 2 : 4)));
    this.getRegNoOrAdminIdFromRouteAndInitialise(this.route);
  }
  /**
   * Method to get the registration number or admin id from route to initialise the view
   * @param route
   */
  getRegNoOrAdminIdFromRouteAndInitialise(route: ActivatedRoute) {
    route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        pluck('params'),
        switchMap(params => {
          if (params['registrationNo'] && !this.router?.url?.includes('group/user')) {
            //Group profile with registration number for CSR
            this.registrationNo = +params['registrationNo'];
            return this.getGroupWithBranchesAndAdmin(this.registrationNo, undefined);
          } else if (params['adminId'] && this.router?.url?.includes('group/user')) {
            //Group profile with Admin id for CSR and admin
            this.showRole = true;
            this.loggedInAdminId = +params['adminId'];
            return this.getGroupWithBranchesAndAdmin(undefined, this.loggedInAdminId);
          } else {
            this.router.navigate([this.lastRoute]);
            return throwError(incorrectRoute);
          }
        }),
        catchError(err => {
          if (err?.statusError) {
            this.alertService.showErrorByKey(err.statusError);
          } else {
            this.alertService.showError(err?.error?.message);
          }
          return of(null);
        })
      )
      .subscribe();
  }
  /**
   * Method to fetch all the groups,branches and admin
   * @param regNo
   * @param adminId
   */
  getGroupWithBranchesAndAdmin(regNo: number, adminId: number): Observable<BranchEligibilityWrapper> {
    return this.populateEstGroupsAndReturnMainEstRegNo(adminId, regNo).pipe(
      switchMap(res => {
        this.mainRegistrationNumber = res[0];
        return forkJoin([
          this.getBranches(adminId ? res[0] : regNo, adminId).pipe(
            tap(branches => {
              if (!adminId) {
                //If not admin access initialise the group tab with main
                this.initialiseForGroupTabs(assembleGroupFromBranchList(branches));
              }
            })
          ),
          this.getAdmins(res[0], adminId)

        ]);
      }),
      tap(() => {
        if (this.establishmentGroups?.length > 0) {
          setActions(this, this.establishmentGroups[0]);
        }
      }),
      switchMap(() => {
        return this.getGroupEligibility(this.adminAuthRegNo);
      })
    );
  }
  getGroupEligibility(regNo: number) {
    return this.changeGroupEstablishmentService.checkEligibility(regNo).pipe(
      tap(eligibilityCriteria => {
        this.eligibility = eligibilityCriteria;
      }),
      catchError(err => {
        this.alertService.showError(err?.error?.message);
        return of(null);
      })
    );
  }
  /**
   * Method to get the establishment groups returns array of main est with registration number
   * @param adminId
   * @param regNo
   */
  populateEstGroupsAndReturnMainEstRegNo(adminId: number, regNo: number): Observable<Array<number>> {
    if (adminId) {
      //Fetch all main establishments in groups under admin id
      return this.establishmentService.getEstablishmentGroupsUnderAdmin(adminId).pipe(
        tap(groups => {
          this.initialiseForGroupTabs(groups?.branchList);

          this.adminAuthRegNo = groups?.branchList[0]?.activeRegNo;
        }),
        map(groups => groups.branchList?.map(branch => branch.registrationNo))
      );
    } else {
      //If admin id not provided return the registration number to fetch the branches
      return this.establishmentService.getEstablishment(regNo).pipe(
        switchMap(res => {
          this.isPpa = this.establishmentService.isPpaEstablishment = res?.ppaEstablishment;
          if (res?.status?.english === EstablishmentStatusEnum.CANCELLED) {
            return throwError({ statusError: EstablishmentStatusErrorEnum.GROUP_ACCESS_CANCELLED });
          } else if (res?.status?.english === EstablishmentStatusEnum.DRAFT) {
            return throwError({ statusError: EstablishmentStatusErrorEnum.GROUP_ACCESS_DRAFT });
          } else {
            return of(res);
          }
        }),
        map(est => {
          this.adminAuthRegNo = est.mainEstablishmentRegNo;
          return [est.mainEstablishmentRegNo];
        })
      );
    }
  }
  //Assemble groups into tabs for showing only required data
  initialiseForGroupTabs(groups: BranchList[]) {
    this.establishmentGroups = groups;
    if (groups[0]?.roles) {
      this.establishmentService.loggedInAdminRole = groups[0]?.roles[0]?.english;
    }
    this.canManageAdmin = canViewManageAdmin(
      this.appToken,
      this.establishmentService,
      groups[0]?.gccCountry,
      this.establishmentService.loggedInAdminRole,
      this.hasNoSuperAdmin,
      this.isPpa
    );
    this.estGroupTabs = this.assembleGroupsAsTabs(groups);
    this.adminAuthRegNo = groups[0].registrationNo;
    this.isGcc = groups[0].gccCountry;
  }
  /**
   * Method to map the  establishment group into tabs
   * @param groups
   */
  assembleGroupsAsTabs(groups: BranchList[]): TabItems[] {
    const tabs: TabItems[] = [];
    groups.forEach(group => {
      const rolesAsSubValue = group.roles
        ? {
            english: group.roles?.map(role => role.english).join(', '),
            arabic: group.roles?.map(role => role.arabic).join(', ')
          }
        : undefined;
      tabs.push({
        id: group.registrationNo,
        value: group.name,
        subValue: rolesAsSubValue
      });
    });
    return tabs;
  }
  /**
   * Method to get admins of groups
   * @param mainRegNo
   * @param adminId
   */
  getAdmins(mainRegNo: number, adminId?: number): Observable<Admin[]> {
    this.admins = [];
    let admin$: Observable<AdminWrapper>;
    getWorkflowDetails(this, this.adminAuthRegNo);
    if (adminId) {
      const params = new AdminQueryParam();
      params.registrationNo = this.adminAuthRegNo || mainRegNo;
      admin$ = this.establishmentService.getAdminsUnderSupervisor(adminId, params);
    } else {
      admin$ = this.establishmentService.getAdminsUnderGroup(mainRegNo).pipe(
        tap(res => {
          //Use the super admin role if logged in with registration number
          this.establishmentService.loggedInAdminRole = res?.admins[0]?.roles[0]?.english;
        })
      );
    }
    return admin$.pipe(
      tap(res => {
        if (res) {
          const controlPersons = mapAdminToControlPersons(res);
          this.admins = controlPersons ? controlPersons : [];
          this.id = this.admins[0]?.commonId.id;
          if (
            this.admins &&
            (this.admins[0]?.role?.english === AdminRoleEnum.SUPER_ADMIN ||
              this.admins[0].role?.english === AdminRoleEnum.GCC_ADMIN)
          ) {
            this.hasNoSuperAdmin = false;
          } else {
            if (this.appToken === ApplicationTypeEnum.PRIVATE) {
              this.hasNoSuperAdmin = true;
            }
          }
        }
      }),
      map(res => res.admins),
      catchError(err => {
        if (err.error?.code !== ErrorCodeEnum.ADMIN_NO_RECORD) {
          this.alertService.showError(err?.error?.message);
        }
        this.admins = [];
        this.hasNoSuperAdmin = true;
        return of([] as Admin[]);
      })
    );
  }
  /**
   * Method to get the branches with for admin or for group
   * @param regNo
   * @param adminId
   */
  getBranches(regNo, adminId, size = 10, pageNo = 0): Observable<BranchList[]> {
    this.isBranchesLoading = true;
    this.establishmentGroup = this.filteredBranches = [];
    this.isFilteredBranchesEmpty = false;
    let branchList$: Observable<BranchList[]>;
    if (adminId) {
      //Branch under Admin
      branchList$ = branchesUnderAdmin(this, regNo, adminId, pageNo, size);
    } else {
      //Branch under Group
      branchList$ = branchesUnderGroup(this, regNo, size, pageNo);
    }
    return branchList$.pipe(
      tap(res => {
        this.isBranchesLoading = false;
        this.establishmentGroup = res;
        this.filteredBranches = res;
        this.filteredBranches.forEach(branch => {
          const roleInEnglish = branch.roles?.map(role => role.english).join(',');
          const roleInArabic = branch.roles?.map(role => role.arabic).join(',');
          branch.roles = [{ english: roleInEnglish, arabic: roleInArabic }];
        });
        this.pageDetails.currentPage = this.currentPage = pageNo + 1;
      }),
      catchError(err => {
        this.isBranchesLoading = false;
        if (err?.error?.code === ErrorCodeEnum.BRANCH_NO_RECORD) {
          this.isFilteredBranchesEmpty = true;
          return of([]);
        } else return throwError(err);
      })
    );
  }
  /**
   * Method to navigate to establishment profile
   * @param branchEstablishment
   */
  viewEstablishmentProfile(branchEstablishment: BranchList) {
    this.establishmentRegistrationNo.value = branchEstablishment.registrationNo;
    this.storageService.setSessionValue(AppConstants.ESTABLISHMENT_REG_KEY, this.establishmentRegistrationNo.value);
    if (!this.hasEstablishmentAccess(branchEstablishment.registrationNo)) {
      this.showMedModal(this.warningTemplate);
      return;
    }
    const showErrorAndNavigate = getEstablishmentStatusErrorKey(branchEstablishment?.status?.english);
    if (!showErrorAndNavigate || showErrorAndNavigate.valid === true) {
      const adminId = this.loggedInAdminId || (this.admins?.length > 0 ? this.admins[0]?.commonId.id : undefined);
      this.router.navigate([
        adminId
          ? EstablishmentConstants.EST_PROFILE_ADMIN_ROUTE(branchEstablishment.registrationNo, adminId)
          : EstablishmentConstants.EST_PROFILE_ROUTE(branchEstablishment.registrationNo)
      ]);
    } else if (showErrorAndNavigate.key && showErrorAndNavigate.valid === false) {
      this.profileAccessErrorKey = showErrorAndNavigate.key;
      this.showModal(this.profileAccessError);
    }
  }
  //Method to filter the establishment based on either registration number
  filterBranches(filters: Array<FilterKeyValue>) {
    this.branchFilters = filters;
    this.getBranches(this.adminAuthRegNo, this.loggedInAdminId, this.NO_OF_BRANCHES).subscribe();
  }
  searchBranches(searchParam: string) {
    this.branchSearchParam = searchParam;
    this.getBranches(this.adminAuthRegNo, this.loggedInAdminId, this.NO_OF_BRANCHES).subscribe();
  }
  //Get the branches and admins of selected group - @param regNo
  initialiseNewEstablishmentGroup(regNo: number) {
    if (!this.hasEstablishmentAccess(regNo)) {
      this.showMedModal(this.warningTemplate);
      this.selectedTab = this.adminAuthRegNo;
      return;
    }
    this.totalBranches = null;
    this.alertService.clearAlerts();
    const selectedGroup = this.establishmentGroups.filter(group => group.registrationNo === regNo)[0];
    this.establishmentService.loggedInAdminRole = selectedGroup?.roles ? selectedGroup?.roles[0]?.english : '';
    this.isGcc = selectedGroup?.gccCountry;
    this.mainRegistrationNumber = regNo;
    this.adminAuthRegNo = selectedGroup?.activeRegNo || regNo;
    this.proactivePendingKey = undefined;
    this.proactiveStatusPending = 0;
    forkJoin([
      this.getBranches(selectedGroup?.registrationNo, this.loggedInAdminId),
      this.getAdmins(regNo, this.loggedInAdminId)
    ])
      .pipe(
        switchMap(() => {
          return this.getGroupEligibility(regNo);
        }),
        tap(() => {
          this.adminAuthRegNo = regNo;
          this.canManageAdmin = canViewManageAdmin(
            this.appToken,
            this.establishmentService,
            selectedGroup?.gccCountry,
            this.establishmentService.loggedInAdminRole,
            this.hasNoSuperAdmin,
            this.isPpa
          );
          setActions(this, selectedGroup);
        })
      )
      .subscribe(noop, err => this.alertService.showError(err?.error?.message));
  }
  //Method to navigate back
  navigateBack() {
    // this.location.back();
    if (this.changePersonService.fromIndividualSearch) {
      this.dashboardSearchService.isSummaryPage = true;
    }
    this.location.back();
  }
  //Method to navigate to corresponding functionality as per action and Check all the validations/business rules before navigating
  navigateToFunctionality(actionKey: EstablishmentActionEnum): void {
    const isEligible = this.changeGroupEstablishmentService.isGroupEligibleForAction(this.eligibility, actionKey);
    if (isEligible.valid) {
      this.changeGroupEstablishmentService.registrationNo = this.adminAuthRegNo;

      this.establishmentService.registrationNo = this.mainRegistrationNumber;
      this.changeGroupEstablishmentService.loggedInAdminId = this.loggedInAdminId;
      const route = ProfileConstants.actionFunctionalityMap().get(actionKey)?.route;
      if (route) {
        this.router.navigate([route]);
      }
    } else if (this.eligibility) {
      this.eligibilityWarningMsg = this.changeGroupEstablishmentService.mapValidationMessagesToAlert(
        isEligible.messages
      );
      this.eligibilityWarningHeader = ProfileConstants.actionFunctionalityMap().get(actionKey)?.heading;
      this.showModal(this.eligibilityWarningTemplate, 'lg');
    }
  }
  //Method to get the no of branches under the filtered establishment group
  get noOfBranches() {
    return this.filteredBranches.filter(branch => branch?.establishmentType?.english !== EstablishmentTypeEnum.MAIN)
      .length;
  }
  //Method to handle pagination event
  selectedPage(pageIndex: number) {
    this.getBranches(this.adminAuthRegNo, this.loggedInAdminId, this.NO_OF_BRANCHES, pageIndex - 1).subscribe(
      noop,
      err => this.alertService.showError(err?.error?.message)
    );
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAlerts();
  }
  navigateToAdminPage() {
    navigateToAdmin(this, this.id);
  }
  cancelAndStart() {
    this.revertTransaction().subscribe();
  }
  navigateToTransaction() {
    goToResumeTransaction(this.router, this.draftTransaction?.referenceNo, this.draftTransaction?.transactionId);
  }

  revertTransaction() {
    return this.establishmentService
      .revertTransaction(this.mainRegistrationNumber, this.draftTransaction?.referenceNo)
      .pipe(
        tap(() => {
          this.router.navigate([EstablishmentConstants.ROUTE_REGISTER_SUPER_ADMIN(this.mainRegistrationNumber)]);
        }),
        catchError(err => {
          this.alertService.showError(err?.error?.message, err?.error?.details);
          return of(null);
        })
      );
  }

  /**
   * Method to check if the admin has access to establishment
   * @param regNo
   */
  hasEstablishmentAccess(regNo: number) {
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      if (
        !this.establishmentService.isUserEligible(
          [
            RoleIdEnum.SUPER_ADMIN,
            RoleIdEnum.BRANCH_ADMIN,
            RoleIdEnum.OH_ADMIN,
            RoleIdEnum.CNT_ADMIN,
            RoleIdEnum.GCC_ADMIN,
            RoleIdEnum.REG_ADMIN
          ],
          regNo
        )
      ) {
        return false;
      }
    }
    return true;
  }



}
