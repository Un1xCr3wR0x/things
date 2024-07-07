/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Alert,
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Autobind,
  BilingualText,
  CommonIdentity,
  DocumentItem,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentStatusEnum,
  EstablishmentToken,
  GenderEnum,
  LovList,
  Person,
  RouterConstants,
  TransactionFeedback,
  TransactionInterface,
  TransactionMixin,
  WizardItem,
  WorkflowService,
  markFormGroupTouched
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import {
  ActionTypeEnum,
  Admin,
  BranchList,
  CURRENT_ADMIN_LOV_VALUE,
  ChangeEstablishmentScBaseComponent,
  ChangeEstablishmentService,
  ChangeGroupEstablishmentService,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  EstLookupService,
  Establishment,
  EstablishmentActionEnum,
  EstablishmentAdminService,
  EstablishmentConstants,
  EstablishmentQueryKeysEnum,
  EstablishmentRoutesEnum,
  EstablishmentService,
  EstablishmentTypeEnum,
  LegalEntityEnum,
  NEW_ADMIN_LOV_VALUE,
  PersonDetailsFormModel,
  QueryParam,
  activateWizard,
  getDelinkEstWizards
} from '../../../shared';

import { tap } from 'rxjs/operators';
import {
  cancelTransaction,
  createDeLinkForm,
  getBranchEstablishmentsWithStatus,
  getBranches,
  getSuperAdmin,
  initialiseInfoMessage,
  loadLovLists,
  saveAdmin,
  saveBranches,
  searchEstablishment,
  updateBranches,
  verifyAdmin
} from './delink-establishment-helper';

@Component({
  selector: 'est-delink-establishment-sc',
  templateUrl: './delink-establishment-sc.component.html',
  styleUrls: ['./delink-establishment-sc.component.scss']
})
export class DelinkEstablishmentScComponent
  extends TransactionMixin(ChangeEstablishmentScBaseComponent)
  implements TransactionInterface, OnInit
{
  readonly currentAdminSelection: string = CURRENT_ADMIN_LOV_VALUE.english;
  readonly createAdminSelection: string = NEW_ADMIN_LOV_VALUE.english;
  femaleGender = GenderEnum.FEMALE;
  documentTransactionType = DocumentTransactionTypeEnum.LINK_ESTABLISHMENT;
  documentTransactionKey = DocumentTransactionTypeEnum.LINK_ESTABLISHMENT;
  documentTransactionId = DocumentTransactionIdEnum.LINK_ESTABLISHMENT;
  currentTab = 0;
  delinkEstTabWizards: WizardItem[];
  branches: BranchList[] = [];
  registrationNo: number;
  documents: DocumentItem[];
  documents$: Observable<DocumentItem[]>;
  deLinkForm: FormGroup;
  commentsMaxLength: number;
  isDelinkToNewGroup: boolean;
  selectedBranchesRegNo: number[] = [];
  selectedBranches: BranchList[] = [];
  unSelectedBranches: BranchList[] = [];
  delinkedBranches: BranchList[] = [];
  main = EstablishmentTypeEnum.MAIN;
  branch = EstablishmentTypeEnum.BRANCH;
  newMainEstablishmentRegNo: number;
  totalBranchCount = 0;
  totalSearchBranchCount = 0;
  newGroupBranchesCount = 0;
  delinkedBranchesCount = 0;
  wizardOnePageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  wizardTwoPageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  pageSize = 5;
  isValidator = false;
  routeToView: string;
  transactionFeedback: TransactionFeedback;
  establishment: Establishment;
  searchNewMainResult: BranchList[] = [];
  mainEstablishmentRegNo: number;
  distinctLE: string;
  registeredStatus = new BilingualText();
  referenceNo: number;
  showInfo = false;
  infoDetails: Alert;
  parentGroupAdmin: Admin;
  newGroupAdmin: Admin;
  parentGroupAdminIdentifier: CommonIdentity;
  chooseAdminLovList: LovList;
  personFormDetail = new PersonDetailsFormModel();
  person: Person;
  nationalityList$: Observable<LovList>;
  genderList$: Observable<LovList>;
  countryList$: Observable<LovList>;
  cityList$: Observable<LovList>;
  defaultToSaudi = true;
  wizardOneSearchParam: string;
  wizardTwoSearchParam: string;
  isLoading = true;
  isResultEmpty = false;
  isAppPrivate: boolean;
  isPublicLink: boolean;
  disableSubmitBtn: boolean = false;
  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    readonly route: ActivatedRoute,
    readonly bsModalService: BsModalService,
    readonly fb: FormBuilder,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    readonly documentService: DocumentService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly changeGrpEstablishmentService: ChangeGroupEstablishmentService,
    readonly workflowService: WorkflowService,
    readonly location: Location,
    readonly router: Router,
    readonly lookUpService: EstLookupService,
    readonly adminService: EstablishmentAdminService
  ) {
    super(
      establishmentService,
      changeEstablishmentService,
      alertService,
      bsModalService,
      documentService,
      workflowService
    );
    this.deLinkForm = createDeLinkForm(this);
  }

  //Method for initialization tasks
  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    if (
      (this.estRouterData.resourceType === RouterConstants.TRANSACTION_DELINK_ESTABLISHMENT ||
        this.estRouterData.resourceType === RouterConstants.TRANSACTION_LINK_ESTABLISHMENT) &&
      this.estRouterData.taskId !== null
    ) {
      this.isValidator = true;
      this.routeToView = EstablishmentRoutesEnum.VALIDATOR_DELINK;
      this.registrationNo = this.estRouterData.registrationNo;
      this.referenceNo = this.estRouterData.referenceNo;
      this.getEstablishmentWithWorkflowData(this.estRouterData, this.intialiseView, this.navigateToValidator, false);
    } else if (
      this.changeGrpEstablishmentService.registrationNo &&
      (this.changeGrpEstablishmentService.groupEligibilty.get(EstablishmentActionEnum.DELINK_NEW_GRP) ||
        this.changeGrpEstablishmentService.groupEligibilty.get(EstablishmentActionEnum.DELINK_OTHER))
    ) {
      this.registrationNo = this.isAppPrivate
        ? this.changeGrpEstablishmentService.registrationNo
        : this.establishmentService.registrationNo;
      this.routeToView = EstablishmentConstants.GROUP_PROFILE_ROUTE(this.registrationNo);
      this.intialiseView();
    } else {
      this.setTransactionComplete();
      this.location.back();
    }
  }

  //Method to  initialise the component view
  @Autobind
  intialiseView() {
    this.route.paramMap.subscribe(res => {
      this.isDelinkToNewGroup = res.get('groupStatus') === EstablishmentTypeEnum.NEW;
      this.isPublicLink = !this.isDelinkToNewGroup && !this.isAppPrivate;
      this.delinkEstTabWizards = getDelinkEstWizards(this.currentTab, this.isDelinkToNewGroup, this.isAppPrivate);
    });
    if (this.isValidator) {
      this.newMainEstablishmentRegNo = this.establishmentToChange.mainEstablishmentRegNo;
    }
    this.registeredStatus.english = EstablishmentStatusEnum.REGISTERED;
    if (this.isDelinkToNewGroup) {
      this.documentTransactionType = DocumentTransactionTypeEnum.DELINK_ESTABLISHMENT;
      this.documentTransactionKey = DocumentTransactionTypeEnum.DELINK_ESTABLISHMENT;
      this.documentTransactionId = DocumentTransactionIdEnum.DELINK_ESTABLISHMENT;
      getSuperAdmin(this);
    }
    initialiseInfoMessage(this);
    getBranches(this);
    loadLovLists(this);
  }

  /**
   * Method to select the tab
   * @param tabIndex
   */
  selectedWizard(tabIndex: number) {
    if (tabIndex === 0) {
      this.wizardOneSelectedPage(this.wizardOnePageDetails.currentPage, this.wizardOneSearchParam);
    }
    this.currentTab = tabIndex;
    this.delinkEstTabWizards = activateWizard(this.delinkEstTabWizards, tabIndex, true);
  }

  /**
   * method to save the selecction/unselection of branches to delink
   * @param branch
   */
  onSelectEstablishment(branch: BranchList) {
    if (this.selectedBranchesRegNo.indexOf(branch.registrationNo) === -1) {
      branch.recordActionType = ActionTypeEnum.ADD;
      this.selectedBranchesRegNo.push(branch.registrationNo);
      if (
        !branch?.delinked &&
        !this.selectedBranches.some(
          b => b.registrationNo === branch.registrationNo && b.recordActionType === ActionTypeEnum.ADD
        )
      ) {
        this.selectedBranches.push(branch);
      }
      this.unSelectedBranches = this.unSelectedBranches.filter(
        branchItem => branchItem.registrationNo !== branch.registrationNo
      );
    } else {
      branch.recordActionType = ActionTypeEnum.REMOVE;
      this.selectedBranchesRegNo = this.selectedBranchesRegNo.filter(
        branchRegno => branchRegno !== branch.registrationNo
      );
      this.selectedBranches = this.selectedBranches.filter(
        branchItem => branchItem.registrationNo !== branch.registrationNo
      );
      if (this.isDelinkToNewGroup) {
        this.newMainEstablishmentRegNo =
          this.newMainEstablishmentRegNo === branch.registrationNo ? undefined : this.newMainEstablishmentRegNo;
      }
      if (
        branch?.delinked &&
        !this.unSelectedBranches.some(
          b => b.registrationNo === branch.registrationNo && b.recordActionType === ActionTypeEnum.REMOVE
        )
      ) {
        this.unSelectedBranches.push(branch);
      }
    }
    this.delinkedBranchesCount = this.selectedBranches.length;
  }

  /**
   * method to save the new main establishment in the case of delink
   * @param branchList
   */
  onSelectMainEstablishment(branch: BranchList) {
    if (this.newMainEstablishmentRegNo !== branch.registrationNo) {
      this.newMainEstablishmentRegNo = branch.registrationNo;
      this.delinkedBranches.map(branchItem => {
        if (branchItem.establishmentType.english === this.main) {
          branchItem.establishmentType.english = this.branch;
        }
        if (this.newMainEstablishmentRegNo === branchItem.registrationNo) {
          branchItem.establishmentType.english = this.main;
        }
        return branchItem;
      });
    }
  }

  // method to navigate to select main establishment page
  saveSelectedBranches() {
    this.alertService.clearAlerts();
    saveBranches(this);
  }

  /**
   * Method to save teh delink transaction
   * @param isFinalSubmit
   */
  saveGroup(isFinalSubmit: boolean, isAdminSubmit = false) {
    this.disableSubmitBtn = true;
    this.alertService.clearAlerts();
    markFormGroupTouched(this.deLinkForm);
    if (!this.newMainEstablishmentRegNo) {
      this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.ERR-SELECT-MAIN');
    } else if (isAdminSubmit && !this.deLinkForm.valid) {
      this.alertService.showMandatoryErrorMessage();
    } else if (isFinalSubmit && !this.documentService.checkMandatoryDocuments(this.documents) && this.isAppPrivate) {
      this.alertService.showMandatoryDocumentsError();
    } else {
      if (isAdminSubmit && this.deLinkForm?.get('chooseAdmin')?.get('english').value === this.createAdminSelection) {
        saveAdmin(this, isFinalSubmit);
      } else {
        updateBranches(this, isFinalSubmit, isAdminSubmit);
      }
    }
    this.disableSubmitBtn = false;
  }

  /**
   * Method to get all documents
   */
  getDocuments(): Observable<DocumentItem[]> {
    return this.documents
      ? of(this.documents)
      : this.documentService
          .getDocuments(
            this.documentTransactionKey,
            this.documentTransactionType,
            this.registrationNo,
            this.referenceNo
          )
          .pipe(tap(res => (this.documents = res)));
  }

  /**
   * method to fetch the data based on page selection
   */
  wizardOneSelectedPage(pageIndex: number, searchParam: string) {
    this.wizardOneSearchParam = searchParam;
    const queryParams: QueryParam[] = [
      {
        queryKey: EstablishmentQueryKeysEnum.EXCLUDE_INVALID_MAIN_FOR_DELINK,
        queryValue: true
      }
    ];
    if (this.referenceNo) {
      queryParams.push({
        queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER,
        queryValue: this.referenceNo
      });
    }
    this.unSelectedBranches = [];
    this.selectedBranches = [];
    this.selectedBranchesRegNo = [];
    this.delinkedBranchesCount = 0;
    this.branches = [];
    getBranchEstablishmentsWithStatus(
      this,
      pageIndex,
      queryParams,
      false,
      this.registrationNo,
      false,
      [this.registeredStatus],
      true,
      this.wizardOneSearchParam
    );
  }

  /**
   * method to fetch the data based on page selection
   */
  wizardTwoSelectedPage(pageIndex: number, isLink: boolean, searchParam: string) {
    this.wizardTwoSearchParam = searchParam;
    this.searchNewMainResult = [];
    this.delinkedBranches = [];
    const queryParams: QueryParam[] = [
      {
        queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER,
        queryValue: this.referenceNo
      }
    ];
    if (isLink) {
      queryParams.push({
        queryKey: EstablishmentQueryKeysEnum.NEW_MAIN_REG_NO,
        queryValue: this.newMainEstablishmentRegNo
      });
    } else {
      queryParams.push({
        queryKey: EstablishmentQueryKeysEnum.DELINKED_ONLY,
        queryValue: 'true'
      });
    }
    getBranchEstablishmentsWithStatus(
      this,
      pageIndex,
      queryParams,
      isLink,
      this.mainEstablishmentRegNo,
      false,
      [],
      false,
      this.wizardTwoSearchParam
    );
  }

  /**
   * Method to navigate to validator screen
   */
  @Autobind
  navigateToValidator() {
    if (this.isDelinkToNewGroup) {
      this.router.navigate([EstablishmentRoutesEnum.DELINK_NEW]);
    } else {
      this.router.navigate([EstablishmentRoutesEnum.DELINK]);
    }
  }

  /**
   * Method to search the branches
   * @param searchTerm
   */
  searchEstablishment(searchTerm: FormControl) {
    this.alertService.clearAlerts();
    const registrationNo = +searchTerm.value;
    const legalEntity = this.distinctLE === LegalEntityEnum.SEMI_GOV ? LegalEntityEnum.GOVERNMENT : this.distinctLE;
    searchEstablishment(this, registrationNo, legalEntity, searchTerm);
  }

  /**
   * Method to confirm cancel
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    cancelTransaction(this);
  }

  /**
   * Method to reset search
   */
  resetSearch() {
    this.alertService.clearAlerts();
    this.newMainEstablishmentRegNo = undefined;
    this.establishment = null;
    this.searchNewMainResult = [];
  }

  /**
   * Method to navigate to previous page
   */
  navigateBack() {
    this.alertService.clearAlerts();
    cancelTransaction(this);
  }

  /**
   *
   * @param form method to reset admin form
   */
  resetEventDetails(form: FormGroup) {
    if (form) {
      this.resetNewAdminDetailsForm(form);
    }
  }
  /**
   * method to verify new admin
   */
  verifyAdmin() {
    this.alertService.clearAlerts();
    markFormGroupTouched(this.deLinkForm);
    if (this.deLinkForm.valid) {
      verifyAdmin(this);
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  /**
   *
   * @param form method to reset the form
   */
  resetNewAdminDetailsForm(form: FormGroup) {
    form.get('isSaved').setValue(false);
    form.get('personExists').setValue(false);
    form.get('isVerified').setValue(false);
  }
  /**
   * Method to trigger admin selection change
   */
  changeAdminSelection() {
    if (
      this.deLinkForm?.get('chooseAdmin')?.get('english').value !== this.createAdminSelection &&
      this.deLinkForm.get('search')
    )
      this.deLinkForm.removeControl('search');
  }

  askForCancel() {
    this.showModal(this.cancelTemplate);
  }
}
