/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Alert,
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Autobind,
  BilingualText,
  DocumentItem,
  DocumentService,
  EstablishmentProfile,
  EstablishmentRouterData,
  EstablishmentStatusEnum,
  EstablishmentToken,
  RouterConstants,
  TransactionFeedback,
  TransactionInterface,
  TransactionMixin,
  WizardItem,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  BranchList,
  ChangeEstablishmentScBaseComponent,
  ChangeEstablishmentService,
  ChangeGroupEstablishmentService,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  ErrorCodeEnum,
  EstablishmentActionEnum,
  EstablishmentBranchWrapper,
  EstablishmentConstants,
  EstablishmentRoutesEnum,
  EstablishmentService,
  EstablishmentTypeEnum,
  getBranchRequest,
  getChangeMainEstWizards,
  getChangeMainEstWizardsGOL,
  getDocumentContentIds,
  selectWizard
} from '../../../shared';

@Component({
  selector: 'est-change-main-establishment-sc',
  templateUrl: './change-main-establishment-sc.component.html',
  styleUrls: ['./change-main-establishment-sc.component.scss']
})
export class ChangeMainEstablishmentScComponent
  extends TransactionMixin(ChangeEstablishmentScBaseComponent)
  implements TransactionInterface, OnInit
{
  /**
   * Local Variables
   */
  currentTab = 0;
  changeMainEstTabWizards: WizardItem[];
  branchEstablishments: BranchList[];
  registrationNo: number;
  changeMainEstablishmentForm: FormGroup;
  documents: DocumentItem[];
  transactionId = DocumentTransactionIdEnum.CHANGE_LEGAL_ENTITY;
  commentsMaxLength: number;
  selectedMainEstablishment: BranchList;
  documentTransactionType = DocumentTransactionTypeEnum.CHANGE_BRANCH_TO_MAIN;
  documentTransactionKey = DocumentTransactionTypeEnum.CHANGE_BRANCH_TO_MAIN;
  documentTransactionId = DocumentTransactionIdEnum.CHANGE_BRANCH_TO_MAIN;
  documents$: Observable<DocumentItem[]>;
  main = EstablishmentTypeEnum.MAIN;
  branch = EstablishmentTypeEnum.BRANCH;
  newMainEstRegistrationNo: number;
  mainEstablishmentRegNo: number;
  referenceNo: number;
  transactionFeedback: TransactionFeedback;
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  wizardTwoCurrentPage = 1;
  pageSize = 5;
  totalBranchCount: number;
  isValidator = false;
  routeToView: string;
  private = ApplicationTypeEnum.PRIVATE;
  public = ApplicationTypeEnum.PUBLIC;
  registeredStatus = new BilingualText();
  showInfo = false;
  infoDetails: Alert = new Alert();
  searchParam: string;
  isLoading = true;
  isResultEmpty: boolean;
  disableSubmitBtn: boolean = false;
  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    readonly route: ActivatedRoute,
    readonly bsModalService: BsModalService,
    readonly fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly changeGrpEstablishmentService: ChangeGroupEstablishmentService,
    readonly location: Location,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly workflowService: WorkflowService,
    readonly router: Router
  ) {
    super(
      establishmentService,
      changeEstablishmentService,
      alertService,
      bsModalService,
      documentService,
      workflowService
    );
    this.changeMainEstablishmentForm = this.createForm();
  }

  //Method for initialization tasks
  ngOnInit(): void {
    if (
      this.estRouterData.resourceType === RouterConstants.TRANSACTION_CHANGE_MAIN_ESTABLISHMENT &&
      this.estRouterData.taskId !== null
    ) {
      this.isValidator = true;
      this.routeToView = EstablishmentRoutesEnum.VALIDATOR_CHANGE_MAIN_EST;
      this.registrationNo = this.estRouterData.registrationNo;
      this.getEstablishmentWithWorkflowData(
        this.estRouterData,
        this.intialiseView,
        this.navigateToValidator,
        false,
        true
      );
    } else if (
      this.changeGrpEstablishmentService.registrationNo &&
      this.changeGrpEstablishmentService.groupEligibilty.get(EstablishmentActionEnum.CHG_MAIN_EST)
    ) {
      this.registrationNo = this.changeGrpEstablishmentService.registrationNo;
      this.routeToView = EstablishmentConstants.GROUP_PROFILE_ROUTE(this.registrationNo);
      this.intialiseView();
    } else {
      this.setTransactionComplete();
      this.location.back();
    }
  }

  /**
   * Method to  initialise the component view
   */
  @Autobind
  intialiseView() {
    if (this.isValidator) {
      this.newMainEstRegistrationNo = this.establishmentToChange.registrationNo;
      this.referenceNo = +this.estRouterData.referenceNo;
      this.changeMainEstablishmentForm.get('referenceNo').setValue(+this.estRouterData.referenceNo);
    }
    this.initialiseTabWizards(this.currentTab);
    this.registeredStatus.english = EstablishmentStatusEnum.REGISTERED;
    this.getBranchEstablishments(this.registrationNo, this.pageSize, 0, [this.registeredStatus], false, this.setBranch);
    this.initialiseInfoMessage(this.registrationNo);
  }

  /**
   * Create form
   */
  createForm() {
    return this.fb.group({
      comments: null,
      referenceNo: undefined
    });
  }
  /**
   * Method to initialise current tab
   * @param currentTab
   */
  initialiseTabWizards(currentTab: number) {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.changeMainEstTabWizards = getChangeMainEstWizards(currentTab);
    } else {
      this.changeMainEstTabWizards = getChangeMainEstWizardsGOL(currentTab);
    }
  }

  /**
   * Method to select the tab
   * @param tabIndex
   */
  selectedWizard(tabIndex: number) {
    this.currentTab = tabIndex;
    this.changeMainEstTabWizards = selectWizard(this.changeMainEstTabWizards, tabIndex);
  }

  /**
   * method to set new main establishment as selected
   * @param newMainEstRegistrationNo
   * @param branchEstablishments
   */
  setNewMainEstablishment(newMainEstRegistrationNo: number, branchEstablishments: BranchList[]): BranchList[] {
    branchEstablishments.map(branch => {
      if (
        branch.registrationNo === newMainEstRegistrationNo ||
        (!newMainEstRegistrationNo && branch.registrationNo === this.mainEstablishmentRegNo)
      ) {
        branch.establishmentType.english = this.main;
      } else {
        branch.establishmentType.english = this.branch;
      }
      return branch;
    });
    return branchEstablishments;
  }

  /**
   * Method to save the selected establishment
   * @param establishment
   * @param newMainEstIndex
   */
  onSelectEstablishment(establishment: BranchList) {
    if (
      this.selectedMainEstablishment?.registrationNo !== establishment.registrationNo &&
      establishment.status.english === EstablishmentStatusEnum.REGISTERED
    ) {
      const mainBranchIndex = this.branchEstablishments.findIndex(
        branch => branch.establishmentType.english === this.main
      );
      if (mainBranchIndex >= 0) {
        this.branchEstablishments[mainBranchIndex].establishmentType.english = this.branch;
      }
      const newMainEstIndex = this.branchEstablishments.findIndex(
        branchItem => branchItem.registrationNo === establishment.registrationNo
      );
      this.branchEstablishments[newMainEstIndex].establishmentType.english = this.main;
      this.selectedMainEstablishment = establishment;
      this.newMainEstRegistrationNo = this.selectedMainEstablishment.registrationNo;
    }
  }

  /**
   *Method to submit new main establishment Details
   */
  saveMainEstablishmentDetails(isFinalSubmit: boolean) {
    this.disableSubmitBtn = true;
    this.alertService.clearAlerts();
    if (!this.newMainEstRegistrationNo) {
      this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.ERR-SELECT-MAIN');
    } else if (this.newMainEstRegistrationNo === this.mainEstablishmentRegNo) {
      this.alertService.showErrorByKey('ESTABLISHMENT.ERROR.ERR_CHANGE_MAIN');
    } else if (isFinalSubmit && !this.documentService.checkMandatoryDocuments(this.documents)) {
      this.alertService.showMandatoryDocumentsError();
    } else {
      this.changeGrpEstablishmentService
        .saveMainEstablishment(this.mainEstablishmentRegNo, {
          newMainRegistrationNo: this.newMainEstRegistrationNo,
          navigationIndicator: this.changeGrpEstablishmentService.getNavigationIndicator(
            EstablishmentActionEnum.CHG_MAIN_EST,
            isFinalSubmit,
            this.isValidator,
            this.appToken
          ),
          comments: this.changeMainEstablishmentForm.get('comments').value,
          contentIds:
            this.appToken === ApplicationTypeEnum.PRIVATE && isFinalSubmit ? getDocumentContentIds(this.documents) : [],
          referenceNo: this.changeMainEstablishmentForm.get('referenceNo').value
        })
        .pipe(
          catchError(err => {
            this.alertService.showError(err.error.message, err.error.details);
            this.disableSubmitBtn = false;
            return throwError(err);
          }),
          tap(res => {
            if (this.appToken === ApplicationTypeEnum.PUBLIC || isFinalSubmit) {
              this.transactionFeedback = res;
              if (this.isValidator) {
                this.updateBpm(
                  this.estRouterData,
                  this.changeMainEstablishmentForm.get('comments').value,
                  res.successMessage
                ).subscribe(
                  () => {
                    this.setTransactionComplete();
                    this.disableSubmitBtn = false;
                    this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
                  },
                  err => {
                    this.alertService.showError(err?.error?.message);
                    this.disableSubmitBtn = false;
                  }
                );
              } else {
                this.setTransactionComplete();
                this.disableSubmitBtn = false;
                this.location.back();
                this.alertService.showSuccess(this.transactionFeedback.successMessage);
              }
            } else {
              this.referenceNo = +res?.transactionId;
              this.changeMainEstablishmentForm.get('referenceNo').setValue(+res?.transactionId);
              this.getDocuments().subscribe(
                () => {
                  this.disableSubmitBtn = false;
                  this.selectedWizard(1);
                },
                () => {
                  this.disableSubmitBtn = false;
                }
              );
            }
          })
        )
        .subscribe(noop, noop);
    }
  }

  /**
   * Method to confirm cancel
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.cancelTransaction();
  }

  /**
   * Method to get all documents
   */
  getDocuments(): Observable<DocumentItem[]> {
    return this.changeGrpEstablishmentService
      .getDocuments(this.documentTransactionKey, this.documentTransactionType, this.registrationNo, this.referenceNo)
      .pipe(
        tap(res => (this.documents = res)),
        catchError(err => {
          this.alertService.showError(err.error.message, err.error.details);
          return throwError(err);
        })
      );
  }

  /**
   * method to fetch the data based on page selection
   */
  selectedPage(pageIndex: number, searchParam: string) {
    this.searchParam = searchParam;
    const registeredStatus = new BilingualText();
    registeredStatus.english = EstablishmentStatusEnum.REGISTERED;
    const payload = getBranchRequest(this.pageSize, pageIndex - 1, [registeredStatus], false, searchParam);
    this.isLoading = true;
    this.isResultEmpty = false;
    this.branchEstablishments = [];
    this.establishmentService.getBranchEstablishmentsWithStatus(this.registrationNo, payload).subscribe(
      res => {
        this.isLoading = false;
        this.branchEstablishments = res.branchList;
        this.totalBranchCount = res.branchStatus?.totalBranches;
        this.branchEstablishments = this.setNewMainEstablishment(
          this.newMainEstRegistrationNo,
          this.branchEstablishments
        );
        this.pageDetails.currentPage = this.currentPage = pageIndex;
      },
      err => {
        this.isLoading = false;
        if (err.error.code === ErrorCodeEnum.BRANCH_NO_RECORD) this.isResultEmpty = true;
        else this.alertService.showError(err?.error?.message, err?.error?.details);
      }
    );
  }

  /**
   * Method to navigate to previous page
   */
  navigateBack() {
    this.setTransactionComplete();
    this.alertService.clearAlerts();
    this.location.back();
  }

  /**
   * Method to navigate to validator screen
   */
  @Autobind
  navigateToValidator() {
    this.setTransactionComplete();
    this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_CHANGE_MAIN_EST]);
  }

  @Autobind
  setBranch(braches: EstablishmentBranchWrapper, profileDetails: EstablishmentProfile) {
    this.isLoading = false;
    this.branchEstablishments = braches.branchList;
    this.totalBranchCount = braches.branchStatus?.totalBranches;
    this.mainEstablishmentRegNo = profileDetails.mainEstablishmentRegNo;
    this.branchEstablishments = this.setNewMainEstablishment(this.newMainEstRegistrationNo, this.branchEstablishments);
  }

  initialiseInfoMessage(registrationNo: number) {
    this.infoDetails = new Alert();
    this.infoDetails.message = undefined;
    this.infoDetails.dismissible = false;
    this.infoDetails.details = [];
    this.establishmentService
      .getBranchEstablishmentsWithStatus(registrationNo, getBranchRequest(this.pageSize, 0, [], false))
      .subscribe(
        res => {
          const branchStatus = res.branchStatus;
          if (branchStatus?.closedEstablishments + branchStatus?.activeEstablishments !== branchStatus.totalBranches) {
            this.showInfo = true;
            this.infoDetails.details.push({ ...new Alert(), messageKey: 'ESTABLISHMENT.INFO.CBM-REGISTERED-ONLY' });
          }
        },
        err => this.alertService.showError(err?.error?.message, err?.error?.details)
      );
  }

  /**
   * Method to cancel the transaction
   */
  cancelTransaction() {
    if (this.changeMainEstablishmentForm.get('referenceNo').value || this.isValidator) {
      this.changeEstablishmentService
        .revertTransaction(this.mainEstablishmentRegNo, this.changeMainEstablishmentForm.get('referenceNo').value)
        .subscribe(
          () => {
            this.setTransactionComplete();
            if (this.isValidator) {
              this.changeEstablishmentService.navigateToChangeMainValidator();
            } else this.changeEstablishmentService.navigateToGroupProfile(this.registrationNo);
          },
          err => this.alertService.showError(err?.error?.message)
        );
    } else if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.setTransactionComplete();
      this.location.back();
    } else {
      this.setTransactionComplete();
      this.changeEstablishmentService.navigateToGroupProfile(this.registrationNo);
    }
  }

  askForCancel() {
    this.showModal(this.cancelTemplate);
  }
}
