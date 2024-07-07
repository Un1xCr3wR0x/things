/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Alert,
  AlertService,
  AlertTypeEnum,
  AppConstants,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  DocumentService,
  DropdownItem,
  Establishment,
  EstablishmentProfile,
  EstablishmentRouterData,
  EstablishmentStatusEnum,
  EstablishmentToken,
  MainEstablishmentInfo,
  MenuService,
  RoleIdEnum,
  RouterConstants, RouterConstantsBase,
  StorageService,
  Tab,
  TransactionReferenceData,
  UuidGeneratorService,
  WorkflowService
} from '@gosi-ui/core';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/src/lib/search/services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, pluck, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import {
  Admin,
  BranchList,
  ControlPerson,
  EstablishmentActionEnum,
  EstablishmentConstants,
  EstablishmentRoutesEnum,
  EstablishmentTransEnum,
  EstablishmentWorkFlowStatus,
  FlagConstants,
  FlagDetails,
  InspectionDetails,
  OHRate,
  ProfileConstants,
  TerminateEstablishmentConstants,
  TerminateResponse,
  WorkFlowStatusType,
  canEditLateFeeDetails,
  canEditLegalEntityDetails,
  canReopenEstablishment,
  checksBeforeAdminTransaction,
  checksBeforeTransaction,
  filterGccCsr,
  getDropDownItem,
  getEstablishmentStatusErrorKey,
  goToResumeTransaction,
  internalRoles,
  mciEstablishment,
  navigateWithTransactionId
} from '../../../shared';
import { EstablishmentScBaseComponent } from '../../../shared/base/establishment-sc.base-component';
import { Manager } from '../../../shared/models/manager';
import { RelationshipManager } from '../../../shared/models/relationship-manager';
import {
  ChangeEstablishmentService,
  ChangeGroupEstablishmentService,
  EstablishmentRoutingService,
  EstablishmentService,
  FlagEstablishmentService,
  SafetyInspectionService,
  TerminateEstablishmentService,
  WindowSizeService
} from '../../../shared/services';
import {
  canEditEstablishment,
  canRefresh,
  checkCloseNavigation,
  enableCertificate,
  enableEstablishmentAccess,
  extractPatchBasicDetailsFromEstablishment,
  getEstablishmentAndMain,
  getFlagDetails,
  getRelationshipManager,
  getSafetyDetails,
  handleAdminOwnerAndLegalEntity,
  handleErrors,
  handleProfileState,
  handleViolations,
  setStateVariables,
  showRestrictAddFlagModal
} from './establishment-profile-helper';
import { getTerminateStatus } from './establishment-terminate-helper';
import { IndicatorsService } from 'libs/features/violations/src/lib/commitment-indicator/services/indicators.service';
import {HealthInsuranceInfoRequest} from "@gosi-ui/features/contributor";

@Component({
  selector: 'est-establishment-profile-sc',
  templateUrl: './establishment-profile-sc.component.html',
  styleUrls: ['./establishment-profile-sc.component.scss']
})
export class EstablishmentProfileScComponent extends EstablishmentScBaseComponent implements OnInit, OnDestroy {
  establishmentProfile: EstablishmentProfile;
  mainEstablishment: MainEstablishmentInfo;
  establishment: Establishment;
  establishmentAdmins: ControlPerson[];
  establishmentOwners: ControlPerson[];
  branchDropDown$: Observable<DropdownItem[]>;
  editBasicDetailsMsg: string;
  editIdentifierDetailsMsg: string;
  editBankDetailsMsg: string;
  editContactDetailsMsg: string;
  editAddressDetailsMsg: string;
  canEditBasicDetails = false;
  canEditIdentifier = false;
  canEditBankDetails = false;
  canEditContactDetails = false;
  canEditAddressDetails = false;
  canCloseEstablsihment: boolean;
  viewMode = false;
  showFlags = false;
  isCompliant = true;
  OhRateDetails: OHRate;
  safetyInspectionDetails: InspectionDetails;
  closureTransactionId: number;
  isPpa = false;
  isMain = false;
  isGcc: boolean;
  actionDropdown: DropdownItem[] = [];
  canEditLegalEntity: boolean;
  referenceNumber: number;
  identifierReferenceNo: number;
  basicReferenceNo: number;
  bankReferenceNo: number;
  addressReferenceNo: number;
  contactReferenceNo: number;
  editLateFeeWarning = '';
  closureMonth: string;
  currentMonth: string;
  reopenSameMonth: boolean;
  loggedInAdminRole: string;
  showOnlyRoleAdmins= false ;
  isRegisteredInHealthInsurance:boolean=false;

  establishmentTranslateModule = 'ESTABLISHMENT.WARNING';
  flags: FlagDetails[];
  @ViewChild('lateFeeTemplate', { static: true })
  lateFeeTemplate: TemplateRef<HTMLElement>;
  @ViewChild('profileAccessErrorTemplate', { static: true })
  profileAccessErrorTemplate: TemplateRef<HTMLElement>;
  @ViewChild('terminateRestrictTemplate', { static: true })
  terminateRestrictTemplate: TemplateRef<HTMLElement>;
  @ViewChild('addFlagRestrictTemplate', { static: true })
  addFlagRestrictTemplate: TemplateRef<HTMLElement>;
  @ViewChild('complianceTemplate', { static: true })
  complianceTemplate: TemplateRef<HTMLElement>;
  @ViewChild('editWarningTemplate', { static: true })
  editWarningTemplate: TemplateRef<HTMLElement>;
  @ViewChild('draftModal', { static: true })
  draftModal: TemplateRef<HTMLElement>;
  @ViewChild('draftRequiredTemplate', { static: true }) draftRequiredTemplate: TemplateRef<HTMLElement>;
  editWarningHeading: string;
  editWarningMsg: Alert[];
  bsModalRef: BsModalRef;
  branchList: BranchList[];
  profileAccessErrorKey: string;
  isFromRoute = false;
  noDropDowns = true;
  warnigAlertType = AlertTypeEnum.WARNING;
  adminProfileLink: string;
  adminId: number;
  showAdminButton: boolean;
  relationshipManager: RelationshipManager;
  isProactive: boolean;
  terminateRestrictMsg: Alert;
  terminateEligibility: TerminateResponse;
  isCloseNavigationInProgress = false;
  noOfActiveFlags: number;
  flagMap: Map<string, FlagDetails[]>;
  hasDifferentLE: boolean;
  transactionDetails$: Observable<TransactionReferenceData[]>;
  isMainRegistered = true;
  showOwnerSection = true;
  workflowsInProgress: EstablishmentWorkFlowStatus[] = undefined;
  showManageOwners = true;
  showLateFeeIndicator: boolean;
  showAddSuperAdmin: boolean;
  showCertificates = false;
  isProactivePending = false;
  proactiveInWorkflow = false;
  completeRegMessage: string;
  activityTypeMessage = 'ESTABLISHMENT.WARNING.ACTIVITY-MISSING';
  completeRegInWorkflow: BilingualText;
  showMofPaymentDetails: boolean;
  adminUnderWorkflow: boolean;
  adminWorkflowMessage: BilingualText;
  eligibleRoleForEdit: RoleIdEnum[] = [];
  eligibleRoleForMCIEdit: RoleIdEnum[] = [];
  filteredEligibleRole: RoleIdEnum[] = [];
  isEligibleUser: boolean;
  isEligibleUserForReopen: boolean;
  previousUrl: string;
  regNo: number;
  terminateStatus: TerminateResponse;
  proactiveAccessRoles = [RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN];
  canCompleteEstDetails = false;
  violationUnpaidCount: number;
  violationNoPenaltyCount: number;
  showViolations = false;
  closeInProgress = EstablishmentStatusEnum.CLOSING_IN_PROGRESS;
  closedStatus = EstablishmentStatusEnum.CLOSED;
  registered = EstablishmentStatusEnum.REGISTERED;
  reopened = EstablishmentStatusEnum.REOPEN;
  reopenedClosingInProgress = EstablishmentStatusEnum.REOPEN_CLOSING_IN_PROGRESS;
  isAppPrivate: boolean;
  canRefreshMC: boolean;
  isMciEstablishment: boolean;
  isCanCloseMciEstablsihment: boolean;
  hasAdminIdInUrl = false;
  profileTabs: Tab[] = [];
  draftTransaction: EstablishmentWorkFlowStatus;
  filteredEligibleRoleMof: RoleIdEnum[];
  isEligibleUserMof: boolean;
  hasCertificateViewAccess: boolean;
  fromIndividualProfile: boolean;
  restrictDetailEdit: boolean;
  managerDetails: Manager;
  noActiveOwnerFlag: boolean;
  noActiveAdminFlag: boolean;
  ISGOL = false ;
  canEditEstInfo = false ;
  thereIsnoOwner: Alert = new Alert();
  activeAdmins: Admin[];
  isReopenClosingInProgress: boolean = false;
  proactiveTransactioninDraft: EstablishmentWorkFlowStatus = undefined;
  DraftTransactionNo: number;
  messageKey = 'ESTABLISHMENT.WARNING.NO-CURRENT-ACTIVE-OWNER';
  admins: Admin[] = [];
  superAdmin: Admin;
  message = {
    arabic: '',
    english: ''
  };
  messageParam = {
    link1: EstablishmentConstants.ADD_OWNER_EN,
    link2: EstablishmentConstants.ADD_OWNER_AR
  };
  thereIsNoAdmin: Alert = new Alert();
  adminMessageKey: string;
  adminMessageParam = {
    link1: AppConstants.ADD_ADMIN_GPT_LINK_EN,
    link2: AppConstants.ADD_ADMIN_GPT_LINK_AR
  };
  commitmentIndicatorTotalRatio: string = '';
  @Input() showDropdownForMciClose = true;
  isAppPublic: boolean;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    readonly bsModalService: BsModalService,
    readonly storageService: StorageService,
    readonly workflowService: WorkflowService,
    readonly menuService: MenuService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly location: Location,
    readonly terminateService: TerminateEstablishmentService,
    readonly changeGroupEstablishmentService: ChangeGroupEstablishmentService,
    readonly flagEstablishmentService: FlagEstablishmentService,
    readonly safetyInspectionService: SafetyInspectionService,
    readonly windowSizeService: WindowSizeService,
    readonly estRoutingService: EstablishmentRoutingService,
    readonly dashboardSearchService: DashboardSearchService,
    readonly uuidService: UuidGeneratorService,
    readonly indicatorsService: IndicatorsService
  ) {
    super(bsModalService, workflowService);
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { fromIndividualProfile: boolean };
    this.fromIndividualProfile = state?.fromIndividualProfile;
  }

  ngOnInit() {
    // this.canCloseMciEstablsihment(this.establishment);
    this.thereIsnoOwner.message = this.message;
    this.thereIsnoOwner.messageKey = this.messageKey;
    this.thereIsnoOwner.messageParam = this.messageParam;
    this.thereIsNoAdmin.message = this.message;
    this.alertService.clearAllErrorAlerts();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.ISGOL = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
    if (
      this.estRouterData.taskId &&
      RouterConstants.TRANSACTIONS_UNDER_ESTABLISHMENT.indexOf(this.estRouterData.resourceType) !== -1
    ) {
      this.viewMode = true;
    }
    this.isPpa = this.establishmentService.isPpaEstablishment;
    this.initialiseWithRoute();
    this.eligibleRoleForEdit = [
      RoleIdEnum.GCC_CSR,
      RoleIdEnum.CSR,
      RoleIdEnum.BRANCH_ADMIN,
      RoleIdEnum.SUPER_ADMIN,
      RoleIdEnum.GCC_ADMIN
    ];
    this.eligibleRoleForMCIEdit = [
      RoleIdEnum.NEW_ROLE_FOR_MCI_EDIT,
      RoleIdEnum.BRANCH_ADMIN,
      RoleIdEnum.SUPER_ADMIN,
      RoleIdEnum.GCC_ADMIN
    ];
    this.eligibleRoleForMCIEdit = [
      RoleIdEnum.NEW_ROLE_FOR_MCI_EDIT,
      RoleIdEnum.BRANCH_ADMIN,
      RoleIdEnum.SUPER_ADMIN,
      RoleIdEnum.GCC_ADMIN
    ];
    this.getHealthInsuranceCompliance();
    if(this.ISGOL) this.getCommitmentIndicatorTotalRatio();
    this.canCreateNewPolicy();

    if(this.ISGOL){
      if(this.isProactive === false){
        this.canEditEstInfo = true;
      }
    }


  }
  initialiseWithRoute() {
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        pluck('params'),
        switchMap((params): Observable<EstablishmentProfile> => {
          this.adminId = +params['adminId'];
          if (this.adminId) this.hasAdminIdInUrl = true;
          this.regNo =
            params['registrationNo'] || this.storageService.getSessionValue(AppConstants.ESTABLISHMENT_REG_KEY);
          if (this.regNo) {
            return this.establishmentService.getEstablishmentProfileDetails(this.regNo, true);
          } else {
            this.navigateBack();
            return of(null);
          }
        }),
        filter(res => (res ? true : false)),
        tap(res => (this.establishmentProfile = res)),
        switchMap(res =>
          enableEstablishmentAccess(this, res?.status?.english, this.terminateService.transactionFeedback?.length !== 0)
        ), //If status is not privilaged to accesss profile then error is thrown
        switchMap(() => getEstablishmentAndMain(this)),
        tap(() => {
          this.setProfileTabs();
          setStateVariables(this);
          enableCertificate(this);
          this.setActions(this.establishment);
          this.restrictEditForMCI();
          if (
            this.appToken === ApplicationTypeEnum.PRIVATE &&
            this.establishmentService.isUserEligible(
              internalRoles.filter(role => role !== RoleIdEnum.MEDICAL_AUDITOR && role !== RoleIdEnum.AMEEN_USER)
            )
          ) {
            this.showFlags = true;
            getFlagDetails(this, this.establishment.registrationNo);
          }
          getTerminateStatus(this, this.establishment);
          getSafetyDetails(this, this.establishment.registrationNo);
          getRelationshipManager(this);
          this.isReopenClosingInProgress =
            this.establishment?.status?.english === EstablishmentStatusEnum.REOPEN_CLOSING_IN_PROGRESS ? true : false;
          getRelationshipManager(this);
          this.filteredEligibleRole = filterGccCsr(this.eligibleRoleForEdit, this.establishment);
          this.filteredEligibleRoleMof = [...this.filteredEligibleRole];
          this.filteredEligibleRoleMof.push(RoleIdEnum.FEATURE_360_ALL_USER);
        }),
        switchMap(() => handleAdminOwnerAndLegalEntity(this)),
        switchMap(() => {
          return this.estRoutingService.previousUrl$.pipe(
            take(1),
            tap(preUrl => {
              this.previousUrl = preUrl;
            })
          );
        }),
        switchMap(() => handleViolations(this)),
        switchMap(() => handleProfileState(this)), //LE Different or establishment closed will throw error
        tap(() => canEditEstablishment(this, this.establishmentProfile)), //check if what all transactions can be enabled
        catchError(err => handleErrors(err, this))
      )
      .subscribe();
  }

  /**
   * Method to get the branches for the drop down
   * @param registrationNo
   * @param noOfBranches
   */
  getBranches(registrationNo: number, noOfBranches: number): Observable<DropdownItem[]> {
    return this.establishmentService.getBranchEstablishments(registrationNo, noOfBranches + 2).pipe(
      tap(res => (this.branchList = res)),
      map(res => {
        const array: DropdownItem[] = [];
        res.forEach(branch => {
          const englishName = branch.name.english;
          const arabicName = branch.name.arabic;
          array.push({
            id: branch.registrationNo,
            value: { english: englishName ? englishName : arabicName, arabic: arabicName }
          });
        });
        return array;
      })
    );
  }

  /**
   * Method to navigate to legal entity
   */
  navigateToLegalEntityChange(template: TemplateRef<HTMLElement>, draftTemplate: TemplateRef<HTMLElement>) {
    this.changeEstablishmentService.selectedEstablishment = this.establishment;
    this.changeEstablishmentService.selectedRegistrationNo = this.establishmentProfile.registrationNo;
    this.changeEstablishmentService.establishmentProfile = this.establishmentProfile;
    canEditLegalEntityDetails(this, this.workflowsInProgress, template, draftTemplate);
  }

  /**
   * Method to navigate to view Mof payemnt
   */
  navigateToViewMofPayment() {
    this.changeEstablishmentService.selectedEstablishment = this.establishment;
    this.changeEstablishmentService.selectedRegistrationNo = this.establishmentProfile.registrationNo;
    this.router.navigate([EstablishmentRoutesEnum.VIEW_MOF_PAYMENT]);
  }

  navigateToModifyLateFee(template: TemplateRef<HTMLElement>) {
    this.changeEstablishmentService.selectedEstablishment = this.establishment;
    this.changeEstablishmentService.selectedRegistrationNo = this.establishmentProfile.registrationNo;
    canEditLateFeeDetails(this, this.workflowsInProgress, template);
  }

  navigateToChange(workflowType: WorkFlowStatusType) {
    this.changeEstablishmentService.selectedEstablishment = this.establishment;
    checksBeforeTransaction(this, workflowType, this.editWarningTemplate);
  }

  navigateToFunctionality(actionKey: EstablishmentActionEnum): void {
    this.alertService.clearAlerts();
    if (actionKey === EstablishmentActionEnum.CLOSE_EST) {
      checkCloseNavigation(this);
    } else if (actionKey === EstablishmentActionEnum.SAFETY_CHECK) {
      this.navigateToInitiateSafetyCheck();
    } else if (actionKey === EstablishmentActionEnum.REOPEN_EST) {
      this.navigateToReopen();
    }
  }

  navigateToReopen() {
    this.establishmentService.registrationNo = this.establishment?.registrationNo;
    if (this.establishment?.closureDateAfterReopen?.gregorian) {
      this.closureMonth = this.getMonths(this.establishment?.closureDateAfterReopen?.gregorian);
      this.currentMonth = this.getMonths(new Date().toISOString());
      this.reopenSameMonth = this.closureMonth == this.currentMonth ? true : false;
    }
    canReopenEstablishment(this, this.workflowsInProgress, this.editWarningTemplate, this.reopenSameMonth);
    this.hideModal();
  }

  navigateBack() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.isFromRoute = false;
    if (this.fromIndividualProfile) {
      this.dashboardSearchService.isSummaryPage = true;
    } else {
      this.dashboardSearchService.isSummaryPage = false;
    }
    this.location.back();
  }

  navigateToProfile(regNo: number) {
    const navigateStatus = getEstablishmentStatusErrorKey(
      this.branchList.find(item => item.registrationNo === regNo)?.status?.english
    );
    if (!navigateStatus || navigateStatus.valid === true) {
      this.router.navigate([EstablishmentConstants.EST_PROFILE_ROUTE(regNo)]);
    } else {
      this.profileAccessErrorKey = navigateStatus.key;
      this.showModal(this.profileAccessErrorTemplate, 'md', true);
    }
  }

  /**
   * Method to display actions
   * @param regNo
   */
  setActions(establishment: Establishment) {
    this.isCanCloseMciEstablsihment = this.canCloseMciEstablsihment(this.establishment);
    this.isEligibleUser = this.establishmentService.isUserEligible(
      filterGccCsr(TerminateEstablishmentConstants.TERMINATE_ESTABLISHMENT_ACCESS_ROLES, establishment),
      this.establishment.registrationNo
    );
    this.isEligibleUserForReopen = this.establishmentService.isUserEligible(
      filterGccCsr(TerminateEstablishmentConstants.REOPEN_ESTABLISHMENT_ACCESS_ROLES, establishment),
      this.establishment.registrationNo
    );
    this.hasCertificateViewAccess = this.establishmentService.isUserEligible(
      filterGccCsr(EstablishmentConstants.CERITIFICATE_INELIGIBILTY_ROLES, establishment),
      this.establishment.registrationNo
    );
    const eligibleRoles = [...TerminateEstablishmentConstants.TERMINATE_ESTABLISHMENT_ACCESS_ROLES];
    eligibleRoles.push(RoleIdEnum.FEATURE_360_ALL_USER);
    this.isEligibleUserMof = this.establishmentService.isUserEligible(
      filterGccCsr(eligibleRoles, establishment),
      this.establishment.registrationNo
    );

    if (
      (this.isProactive && !this.isCanCloseMciEstablsihment) ||
      establishment.status.english !== EstablishmentStatusEnum.REGISTERED ||
      !this.isEligibleUser
    ) {
      this.actionDropdown = ProfileConstants.establishmentActionsDropdown.filter(
        item => item.key !== EstablishmentActionEnum.CLOSE_EST
      );
    } else {
      this.actionDropdown = ProfileConstants.establishmentActionsDropdown;
    }
    if (establishment.status.english == EstablishmentStatusEnum.CLOSED && this.isEligibleUserForReopen) {
      this.actionDropdown = ProfileConstants.establishmentReopenDropdown;
    }
    this.isMciEstablishment = mciEstablishment(establishment);
    this.canRefreshMC = canRefresh(this);
  }

  /**
   * Method to check if establishment is from MCI
   * @param establishment
   */
  canCloseMciEstablsihment = (establishment: Establishment): boolean => {
    if (
      establishment?.crn?.number &&
      establishment?.crn?.number > 0 &&
      establishment?.unifiedNationalNumber !== null &&
      establishment?.unifiedNationalNumber !== 0 &&
      establishment?.molEstablishmentIds == null
    ) {
      return true;
    } else {
      return false;
    }
  };

  navigateToClose() {
    this.terminateService.selectedEstablishment = this.establishment;
    this.router.navigate([EstablishmentRoutesEnum.CLOSE_ESTABLISHMENT]);
    this.hideModal();
  }
  navigateToFlags() {
    this.flagEstablishmentService.registrationNo = this.establishment.registrationNo;
    if (this.establishment.status.english !== EstablishmentStatusEnum.REGISTERED) {
      showRestrictAddFlagModal(this);
    } else {
      this.router.navigate([EstablishmentConstants.ADD_FLAG_ROUTE()]);
    }
  }
  navigateToViewflagDetails() {
    if (
      this.establishmentService.isUserEligible(FlagConstants.VIEW_FLAG_ACCESS_ROLES, this.establishment.registrationNo)
    ) {
      this.router.navigate([EstablishmentConstants.VIEW_FLAGS(this.establishment.registrationNo)]);
    }
  }
  navigateToViewCertificate() {
    this.router.navigate([EstablishmentConstants.VIEW_CERITICATES_ROUTE(this.establishment.registrationNo)]);
  }
  navigateToHealthInsurance() {
    this.router.navigate([RouterConstantsBase.ROUTE_ESTABLISHMENT_HEALTH_INSURANCE(this.establishment.registrationNo)]);
  }
  navigateToCommitmentIndicator(){
    this.router.navigate([RouterConstants.ROUTE_VIOLATIONS_COMMITMENT_INDICATORS(this.establishment.registrationNo)]);
  }
  navigateToRequestReinspection() {
    this.hideModal();
    this.safetyInspectionService.registrationNo = this.establishment.registrationNo;
    this.router.navigate([EstablishmentConstants.REQUEST_REINSPECTION_ROUTE()]);
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.alertService.clearAllErrorAlerts();
    this.terminateService.transactionFeedback = [];
    this.alertService.clearAlerts();
  }
  navigateToCompleteProactive() {
    if (this.proactiveTransactioninDraft) {
      this.showModal(this.draftRequiredTemplate);
    } else this.router.navigate([EstablishmentConstants.REGISTER_PROACTIVE_ROUTE(this.establishment.registrationNo)]);
  }
  navigateToAdminPage() {
    if (this.showAddSuperAdmin) {
      checksBeforeAdminTransaction(this, this.workflowsInProgress, this.editWarningTemplate, this.draftModal);
    } else {
      this.router.navigate([
        EstablishmentConstants.EST_ADMINS_ADMIN_ID_ROUTE(this.establishmentProfile.registrationNo, this.adminId)
      ]);
    }
  }
  navigateToViolations() {
    this.router.navigate([RouterConstants.ROUTE_VIOLATION_HISTORY(this.establishment.registrationNo)]);
  }
  /**
   * Method to reload profile page
   * @param url
   */
  navigateToTabView(url: string) {
    if (url === this.estProfileRoute) {
      this.ngOnInit();
    }
  }
  //Method to disable router outlet
  getTabStatus() {
    if (this.regNo) return this.router.url === this.estProfileRoute;
  }
  //Method to get profile url
  get estProfileRoute() {
    if (this.hasAdminIdInUrl) {
      return EstablishmentConstants.EST_PROFILE_ADMIN_ROUTE(this.regNo, this.adminId);
    } else {
      return EstablishmentConstants.EST_PROFILE_ROUTE(this.regNo);
    }
  }
  // Method to set the profile tab items based on eligibility
  setProfileTabs() {
    this.profileTabs = EstablishmentConstants.getProfileTabs(this.regNo, this.adminId, this.isAppPrivate).filter(item =>
      this.menuService.isUserEntitled(item.allowedRoles, this.regNo)
    );
  }
  cancelAndStart() {
    if (this.establishmentProfile?.registrationNo && this.draftTransaction?.referenceNo) {
      this.callRevert().subscribe();
    }
  }
  navigateToTransaction() {
    goToResumeTransaction(this.router, this.draftTransaction?.referenceNo, this.draftTransaction?.transactionId);
  }
  callRevert() {
    return this.establishmentService
      .revertTransaction(this.establishmentProfile?.registrationNo, this.draftTransaction?.referenceNo)
      .pipe(
        tap(() => {
          this.hideModal();
          navigateWithTransactionId(
            this.router,
            this.draftTransaction?.transactionId?.toString(),
            this.establishmentProfile?.registrationNo
          );
          this.router.navigate([EstablishmentRoutesEnum.CHANGE_LEGAL_ENTITY]);
        }),
        catchError(err => {
          this.alertService.showError(err?.error?.message, err?.error?.message);
          return of(null);
        })
      );
  }
  restrictEditForMCI() {
    this.restrictDetailEdit =
      this.establishment?.crn?.number && this.establishment.unifiedNationalNumber ? true : false;
  }

  // To refresh the establishment profile where updating mci arabic name

  refreshBasicDetails() {
    let basicDetails = extractPatchBasicDetailsFromEstablishment(this.establishment);
    basicDetails.contentIds = [];
    basicDetails.uuid = this.uuidService.getUuid();
    basicDetails.referenceNo = this.estRouterData.referenceNo;

    this.changeEstablishmentService
      .updateEstablishmentBasicDetails(this.establishment.registrationNo, basicDetails)
      .subscribe(
        res => {
          this.getEstAfterRefresh();
          //handle error here
        },
        err => this.alertService.showError(err.error.message)
      );
  }
  getEstAfterRefresh() {
    getEstablishmentAndMain(this).subscribe(
      res => {
        canRefresh(this);
      },
      err => this.alertService.showError(err.error.message)
    );
  }
  navigateToViewSafetyHistory() {
    // change route
    this.safetyInspectionService.registrationNo = this.establishment.registrationNo;
    this.router.navigate([EstablishmentConstants.INITIATE_SAFETY_CHECK_ROUTE()]);
  }
  navigateToInitiateSafetyCheck() {
    // change route
    this.safetyInspectionService.registrationNo = this.establishment.registrationNo;
    this.router.navigate([EstablishmentConstants.INITIATE_SAFETY_CHECK_ROUTE()]);
  }
  setSafetyCheckAction() {
    if (
      this.menuService.isUserEntitled([RoleIdEnum.SAFETY_AND_HEALTH_OFFICER, this.establishment.registrationNo]) &&
      this.establishment?.status?.english === EstablishmentStatusEnum.REGISTERED &&
      !this.isGcc &&
      this.OhRateDetails?.currentOhRate === 2
    ) {
      this.actionDropdown.push(getDropDownItem(EstablishmentActionEnum.SAFETY_CHECK, 'clipboard-list'));
    }
  }
  navigateToAddManager() {
    this.router.navigate([EstablishmentConstants.RELATIONSHIP_MANAGER(this.establishment.registrationNo)]);
  }
  navigateToModifyManager() {
    this.router.navigate([EstablishmentConstants.RELATIONSHIP_MANAGER_MODIFY(this.establishment.registrationNo)]);
  }

  getUserDetailsFromIam(empId: string) {
    this.establishmentService.getRelationshipManagerInfo(this.establishment.registrationNo, empId).subscribe(
      res => {
        this.managerDetails = res;
      }
      // err => this.alertService.showError(err.error.message)
    );
  }

  //To get the current month and reopen-closed month
  getMonths(date): string {
    const dates = date.split('-');
    const year = parseInt(dates[0], null);
    const month = parseInt(dates[1], null);
    return year + '/' + month;
  }

  /** To navigate the transaction to draft screen */
  navigateToDraftTransaction(DraftTransactionNo) {
    this.alertService.clearAlerts();
    this.hideModal();
    this.router.navigate([
      'home',
      'establishment',
      'transactions',
      'resume',
      EstablishmentTransEnum.COMPLETE_PROACTIVE_TRANSACTION,
      DraftTransactionNo
    ]);
  }

  /** to navigate to Health Insurance Details screen */
  navigateToHealthInsuranceDetails(){
      this.router.navigate([EstablishmentConstants.HEALTH_INSURANCE_DETAILS_ROUTE],  {queryParams: {regNo: this.establishment.registrationNo}});
  }

  /** Method to clear the draft transaction. */
  clearDraft(transactionNumber) {
    this.alertService.clearAlerts();
    this.changeEstablishmentService.revertTransaction(this.establishment.registrationNo, transactionNumber).subscribe(
      () => {
        this.alertService.clearAlerts();
        this.hideModal();
        this.router.navigate([EstablishmentConstants.REGISTER_PROACTIVE_ROUTE(this.establishment.registrationNo)]);
      },
      err => this.alertService.showError(err?.error?.message)
    );
  }

  getHealthInsuranceCompliance() {
    this.establishmentService.getEstablishment(this.regNo, {includeMainInfo: true})
    .subscribe(res => {
        this.establishmentService
        .healthInsuranceCompliance(new HealthInsuranceInfoRequest(res.unifiedNationalNumber, 0, 10))
        .subscribe(data => {
          this.isRegisteredInHealthInsurance = data.StatusDesc === EstablishmentConstants.COMPLIANCE_DETAILS_SUCCESS;
        })
      }
    )
  }
  getCommitmentIndicatorTotalRatio(){
    const currentDate = new Date();
    let monthParameter = currentDate.getMonth();
    let yearParameter = currentDate.getFullYear();
    if (currentDate.getDate() >= 17) {
      monthParameter = currentDate.getMonth() + 1;
      yearParameter = currentDate.getFullYear();
    } else {
      if ((currentDate.getMonth() + 1) == 1) {
        monthParameter = 12;
        yearParameter = currentDate.getFullYear() - 1;
      } else {
        monthParameter = currentDate.getMonth();
        yearParameter = currentDate.getFullYear();
      }
    }
    this.indicatorsService.getEstablishmentIndicators(this.regNo,yearParameter,monthParameter).subscribe(res=>{
      if (res && Object.keys(res).length !== 0){
        this.commitmentIndicatorTotalRatio = res.COMPOUND_VALUE_1.toString()+"%";
        console.log(this.commitmentIndicatorTotalRatio)
      }
    })
  }


  /** Method to only allow super admin to accsess health insurance. */
  canCreateNewPolicy() {
    const roles = this.menuService.getRoles();
    if (
      roles.find(
        item =>
          item === RoleIdEnum.SUPER_ADMIN.toString()
      )
    ) {
      this.showOnlyRoleAdmins = true;
    }
  }
}
