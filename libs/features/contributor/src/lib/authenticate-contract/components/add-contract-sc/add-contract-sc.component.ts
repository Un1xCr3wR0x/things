/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  CalendarService,
  CoreContributorService,
  CoreIndividualProfileService,
  DocumentItem,
  DocumentService,
  downloadFile,
  LookupService,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WizardItem,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { concat, iif } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ContributorConstants } from '../../../shared/constants';
import { ContractStatus, DocumentTransactionId, DocumentTransactionType, SubmitActions } from '../../../shared/enums';
import {
  Clauses,
  ContractDetails,
  ContractParams,
  ContractRequest,
  ContributorBPMRequest
} from '../../../shared/models';
import {
  ContractAuthenticationService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../shared/services';
import { createAddContractWizard } from '../../../shared/utils';
import { AddContractBaseSc } from './add-contract-base-sc';

@Component({
  selector: 'cnt-add-contract-sc',
  templateUrl: './add-contract-sc.component.html',
  styleUrls: ['./add-contract-sc.component.scss']
})
export class AddContractScComponent extends AddContractBaseSc implements OnInit, AfterViewInit {
  /** Local variables */
  contractDetails: ContractRequest;
  successMessage: BilingualText;
  parentForm: FormGroup = new FormGroup({});
  contractAtDraft: ContractDetails;
  contractAtValidator: ContractDetails;
  contractId: number = undefined;
  contractClausesList: Clauses[];
  contractDataSaveStatus = false;
  optionalContractList: Clauses[];
  mandatoryClausesList: Clauses[];
  formWizardItems: WizardItem[] = [];
  isFromDraft: boolean;
  transportationAllowance: number;
  @ViewChild('cancelTemplate', { static: true })
  cancelTemplate: TemplateRef<HTMLElement>;
  @ViewChild('cancelDraftTemplate', { static:true })
  cancelDraftTemplate: TemplateRef<HTMLElement>;
  detailSaved: boolean = false;;
  /** Creates an instance of AddContractScComponent. */
  constructor(
    readonly contractAuthenticationService: ContractAuthenticationService,
    readonly coreContributorService: CoreContributorService,
    readonly router: Router,
    readonly lookupService: LookupService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly activatedRoute: ActivatedRoute,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly documentService: DocumentService,
    readonly location: Location,
    readonly workflowService: WorkflowService,
    readonly manageWageService: ManageWageService,
    readonly calendarService: CalendarService,
    readonly coreService: CoreIndividualProfileService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly modalService: BsModalService
  ) {
    super(
      alertService,
      lookupService,
      contributorService,
      establishmentService,
      engagementService,
      documentService,
      location,
      router,
      manageWageService,
      workflowService,
      calendarService,
      appToken,
      routerDataToken
    );
  }

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.setRouteDetails();
    this.checkEditMode();
    this.initializeWizard();
    this.setLovLists();
    this.fetchContractLookups();
    this.alertService.clearAlerts();
  }

  /**Method to handle task after child view initialised */
  ngAfterViewInit(): void {
    this.setFormWizardItems();
  }

  /** Method to initialize wizard. */
  initializeWizard() {
    this.formWizardItems = createAddContractWizard(this.appToken);
    this.formWizardItems[0].isDisabled = false;
    this.formWizardItems[0].isActive = true;
  }

  /** Method to set form wizard items and set first tab as active. */
  setFormWizardItems() {
    if (this.formWizardItems.length > 0 && this.progressWizardItems) {
      for (let i = 0; i < this.activeTab; i++) {
        this.progressWizardItems.setDone(i);
      }
      this.progressWizardItems.setActive(this.activeTab);
    }
  }

  /** Method to check whether it is edit mode. */
  checkEditMode() {
    this.activatedRoute.url.subscribe(res => {
      if (res.length > 1) if (res[0].path === 'edit' || res[1].path === 'edit') this.isEditMode = true;
    });
  }

  /** Method to set different flag based on the route params. */
  setRouteDetails() {
    if (this.router.url.indexOf('/edit') >= 0) {
      if (this.routerDataToken.payload) {
        const payload = JSON.parse(this.routerDataToken.payload);
        this.registrationNo = payload.registrationNo;
        this.socialInsuranceNo = payload.socialInsuranceNo;
        this.contractId = payload.contractId;
        this.documentUploadEngagementId = this.engagementId = payload.id;
        this.referenceNo = payload.referenceNo;
      }
      this.updateBpmTask.taskId = this.routerDataToken.taskId;
      this.updateBpmTask.user = this.routerDataToken.assigneeId;
      this.activeTab = this.routerDataToken.tabIndicator;
      this.initializeViewForEdit();
    } else {
      this.initializeFromWageService();
      if(this.draftNeeded == false && this.referenceNo !=undefined){ 
        this.revertContractsDraftDetails(false);
        this.notLocationBack = true;
      }
      this.getContractInDraft(this.registrationNo, this.socialInsuranceNo, this.engagementId)
        .pipe(switchMap(() => this.getBasicDetails()))
        .subscribe({
          error: err => this.showError(err)
        });
    }
  }

  /** Method to get data for view. */
  initializeViewForEdit() {
    concat(
      this.getBasicDetails(),
      this.getContractInValidator(this.registrationNo, this.socialInsuranceNo, this.engagementId),
      this.getListOfClauses(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.contractId)
    ).subscribe(
      () => {
        if (this.activeTab === 2) this.getDocuments();
      },
      err => this.showError(err)
    );
  }

  /** Method to navigate between form wizard steps while clicking on individual wizard icon. */
  selectWizard(selectedWizardIndex) {
    this.alertService.clearAlerts();
    this.activeTab = selectedWizardIndex;
  }

  /** Method to get documents. */
  getDocuments() {
    if (this.isEditMode)
      this.getDocumentsInEdit(
        DocumentTransactionId.ADD_CONTRACT,
        this.getTransactionTypes(),
        this.contractId,
        this.referenceNo
      );
    else this.getRequiredDocs(this.isFromDraft);
  }

  /** Method to get documents for contributor */
  getRequiredDocs(isRefreshRequired = false) {
    super.getRequiredDocuments(
      this.contractId !== undefined ? this.contractId : null,
      DocumentTransactionId.ADD_CONTRACT,
      this.getTransactionTypes(),
      isRefreshRequired,
      this.referenceNo
    );
  }

  /** Method to get transaction types. */
  getTransactionTypes() {
    const types = [DocumentTransactionType.ADD_CONTRACT];
    const iban = this.isEditMode
      ? this.bankInfo.ibanAccountNo
      : this.parentForm.get('bankDetailsForm')
      ? this.parentForm.get('bankDetailsForm.ibanAccountNo').value
      : null;
    if (iban && (this.approvedBank ? this.approvedBank.ibanAccountNo : '') !== iban)
      types.push(DocumentTransactionType.BANK_UPDATE);
    return types;
  }

  /** Method to refresh documents after scan.   */
  refreshDocument(doc: DocumentItem) {
    super.refreshDocument(
      doc,
      this.contractId !== undefined ? this.contractId : null,
      DocumentTransactionId.ADD_CONTRACT,
      null,
      this.referenceNo
    );
  }
  /** Method to handle cancellation of transaction. */
  onCancelClick(template: TemplateRef<HTMLElement>) {
    if (this.checkPopupRequired(this.parentForm, this.contractDataSaveStatus)) this.showTemplate(template);
    else this.navigateToBack();
  }
  onCancelDraftClick(template: TemplateRef<HTMLElement>){
    if(this.draftNeeded && this.referenceNo) this.showTemplate(template);
    else if (this.detailSaved) this.showTemplate(template);
    else this.navigateToBack();
  }
  /** Method to confirm cancellation. */
  onConfirmCancelClick() {
    this.hideModal();
    if (this.checkRevertRequired(this.parentForm, this.contractDataSaveStatus)) this.revertContractsDetails();
    else this.navigateToBack();
  }
  /** Methode to revert the edited data after validator1 edit and save and next  */
  revertContractsDetails() {
    this.contractAuthenticationService
      .revertContractDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.contractId)
      .subscribe(
        () => this.navigateToBack(),
        err => this.showError(err)
      );
  }
  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showTemplate(templateRef: TemplateRef<HTMLElement>, isAutoSize = false): void {
    const style = isAutoSize ? '' : 'modal-md';
    this.modalRef = this.modalService.show(templateRef,  Object.assign(
      {},
      {
        class: style + 'modal-dialog-centered',
        backdrop: true,
        ignoreBackdropClick: true
      }
    ));
  }
  /** Method to navigate back based on mode. */
  navigateToBack() {
    if (this.isEditMode && this.appToken === ApplicationTypeEnum.PRIVATE) this.navigateToValidatorView();
    else this.navigateToEngagmentDetails();
  }
  /** Method to update addContractModel while user update and move to next tab  */
  editContractDetails(contractValues) {
    this.alertService.clearAlerts();
    this.contractDataSaveStatus = true;
    this.contractAuthenticationService
      .addContractDetails(
        this.registrationNo,
        this.socialInsuranceNo,
        this.engagementId,
        contractValues,
        this.contractId,
        this.isEditMode,
        false
      )
      .pipe(
        tap(data => {
          this.successMessage = data['message'];
          this.contractId = data['contractId'];
          this.referenceNo = data['transactionId'];
        }),
        switchMap(() =>
          this.getListOfClauses(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.contractId)
        )
      )
      .subscribe(
        () => {this.navigateToNextTab()
          this.detailSaved = true;
        },
        err => {
          if (!err?.error?.details) {
            this.alertService.showError(err?.error?.message);
          } else {
            this.alertService.showError(null, err?.error?.details);
          }
        }
      );
  }
  /**Method to submit documents */
  onSubmitDocuments(): void {
    if (this.documentService.checkMandatoryDocuments(this.documents) && this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.navigateToNextTab();
    } else {
      super.showMandatoryDocumentsError();
    }
  }

  /* Method to sae workflow details. */
  saveWorkflowInEdit(comments) {
    const workflowData = new ContributorBPMRequest();
    workflowData.taskId = this.routerDataToken.taskId;
    workflowData.user = this.routerDataToken.assigneeId;
    workflowData.outcome = SubmitActions.SUBMIT;
    workflowData.comments = comments;
    this.workflowService.updateTaskWorkflow(workflowData).subscribe(
      res => {
        if (res) {
          this.alertService.showSuccessByKey('CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-SUBMIT-MESSAGE', null, 5);
          this.router.navigate([RouterConstants.ROUTE_INBOX]);
        }
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }

  /** Method to set contributor abroad */
  setContributorStatus(engDetails) {
    this.contributorAbroad = engDetails?.contributorAbroad;
  }

  /** Method to save clauses */
  saveClauses(obj) {
    if (this.contractId) {
      this.contractAuthenticationService
        .saveClauseDetails(
          obj?.selectedClauses,
          this.registrationNo,
          this.socialInsuranceNo,
          this.engagementId,
          this.contractId
        )
        .pipe(
          switchMap(() =>
            iif(
              () => this.isEditMode,
              this.getContractInValidator(this.registrationNo, this.socialInsuranceNo, this.engagementId),
              this.getContractInDraft(this.registrationNo, this.socialInsuranceNo, this.engagementId)
            )
          )
        )
        .subscribe(
          () => {
            this.navigateToNextTab();
            this.contractClausesList = [...obj?.finalClausesList];
            if (this.appToken === ApplicationTypeEnum.PRIVATE) this.getDocuments();
          },
          err => this.showError(err)
        );
    }
  }

  /** Method for final submit */
  finalSubmitContract() {
    if (this.isEditMode) {
      this.saveWorkflowInEdit(this.parentForm.get('documentsForm.comments').value);
    } else {
      this.contractAuthenticationService
        .addContractDetails(
          this.registrationNo,
          this.socialInsuranceNo,
          this.engagementId,
          null,
          this.contractId,
          false,
          true
        )
        .subscribe(
          data => {
            this.successMessage = data['message'];
            this.coreService.setSuccessMessage(data['message'], true);
            this.alertService.showSuccess(data['message'], null, 10);
            this.navigateToEngagmentDetails();
          },
          err => {
            this.alertService.showError(err['error']['message']);
          }
        );
    }
  }

  /* get list of clauses for adding contract   */
  getListOfClauses(reg: number, sin: number, engagementId: number, contractid: number) {
    return this.contractAuthenticationService.getListOfClauses(reg, sin, engagementId, contractid).pipe(
      tap(res => {
        this.contractClausesList = res.contractClause;
        if (res?.transportationAllowance) {
          this.transportationAllowance = Number(res?.transportationAllowance);
        } else this.transportationAllowance = 0;
      })
    );
  }

  /** Method to reach contract details tab */
  navigateToContractDetailsTab() {
    this.navigateToTabByIndex(0);
  }

  /** Method to navigate to clauses tab. */
  navigateToClausesTab() {
    this.navigateToTabByIndex(1);
  }

  /** Method to get contract in draft */
  getContractInDraft(regNo: number, socialNum: number, engagementId: number) {
    return this.contractAuthenticationService
      .getContracts(regNo, socialNum, new ContractParams(engagementId, ContractStatus.DRAFT, null))
      .pipe(
        tap(res => {
          if(this.draftNeeded == true && this.referenceNo !=undefined){this.contractAtDraft = res['contracts'][0];
          this.isFromDraft = this.contractAtDraft?.contractType?.english !== undefined ? true : false;
          if (res.contracts[0]?.bankAccount) {
            this.bankInfo = res.contracts[0].bankAccount;
            this.bankInfo.verificationStatus = res.contracts[0].status;
          }}
        })
      );
  }

  /** Method to get contract in validator */
  getContractInValidator(reg: number, sin: number, engid: number) {
    return this.contractAuthenticationService
      .getContracts(reg, sin, new ContractParams(engid, ContractStatus.VALIDATOR_PENDING, null))
      .pipe(
        tap(res => {
          this.contractAtValidator = res['contracts'][0];
          this.contractId = this.contractAtValidator?.id;
        })
      );
  }

  /** this method print the preview page in private and public */
  printPreview() {
    this.contractAuthenticationService
      .printPreview(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.contractId)
      .subscribe(data => {
        downloadFile(ContributorConstants.PRINT_CONTRACT_FILE_NAME, 'application/pdf', data);
      });
  }

  /** Method to to show error alert */
  showErrorAlert(key: string) {
    this.alertService.showErrorByKey(key);
  }

  onKeepDraft(){
    this.isDraftRequired = true;
    this.revertContractsDraftDetails(this.isDraftRequired);
    this.hideModal();
   }
   onDiscard(){
    this.isDraftRequired = false;
    this.revertContractsDraftDetails(this.isDraftRequired);
    this.hideModal();
   }
     /** Methode to revert the edited data after validator1 edit and save and next  */
  revertContractsDraftDetails(isDraftRequired?:boolean) {
    this.contractAuthenticationService
      .revertContractDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.contractId,isDraftRequired,this.referenceNo)
      .subscribe(
        () => {
          if(!this.notLocationBack) this.navigateToBack()
        },
        err => this.showError(err)
      );
  }

}
