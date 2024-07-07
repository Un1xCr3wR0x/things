/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, HostListener, Inject } from '@angular/core';
import {
  WizardItem,
  markFormGroupTouched,
  scrollToTop,
  RouterData,
  BPMUpdateRequest,
  WorkFlowActions,
  RouterDataToken,
  Channel,
  DocumentItem,
  ApplicationTypeEnum,
  RoleIdEnum,
  BenefitsGosiShowRolesConstants
} from '@gosi-ui/core';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { AnnuityBaseComponent } from '../../base/annuity.base-component';
import {
  ActiveBenefits,
  clearAlerts,
  EnableRepaymentRequest,
  showErrorMessage,
  EnableRepaymentResponse,
  BenefitConstants,
  ReturnLumpsumPaymentDetails,
  ReturnLumpsumResponse,
  ReturnLumpsumDetails,
  UITransactionType,
  StopSubmitRequest
} from '../../../shared';
import { FormGroup, Validators } from '@angular/forms';
import { Lov, LovList } from '@gosi-ui/core';

@Component({
  selector: 'bnt-restore-lumpsum-sc',
  templateUrl: './restore-lumpsum-sc.component.html',
  styleUrls: ['./restore-lumpsum-sc.component.scss']
})
export class RestoreLumpsumScComponent extends AnnuityBaseComponent implements OnInit, OnDestroy {
  restoreTransactionConstant = BenefitConstants.RESTORE_LUMPSUM_TRANSACTION_CONSTANT;
  accessForActionPrivate = BenefitsGosiShowRolesConstants.DIRECT_PAYMENT_ACCESS;
  // wizardItems = [];
  lang = 'en';
  isSmallScreen: boolean;
  requestRestorationLumpsumForm = new FormGroup({});
  reasonListSorted: LovList;
  restoreDetails = new EnableRepaymentRequest();
  savedLumpsumBenfitDetails: ActiveBenefits;
  enableRepaymentId: number;
  benefitRequestId: number;
  repayID: number;
  editRestoreDetails: EnableRepaymentRequest;
  restorationDetails: ReturnLumpsumDetails;
  submitDetails: ReturnLumpsumPaymentDetails;
  documentList: DocumentItem[];
  documentuuid: string;

  restoreLumpsumResponse: ReturnLumpsumResponse;
  inRestoreEditMode = false;

  @ViewChild('restoreLumpsumDetailsTab', { static: false })
  restoreLumpsumDetailsTab: TabsetComponent;

  @ViewChild('restoreBenefitWizard', { static: false })
  restoreBenefitWizard: ProgressWizardDcComponent;

  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;
  restoreResponse: EnableRepaymentResponse;
  ngOnInit(): void {
    super.ngOnInit();
    this.alertService.clearAlerts();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.route.queryParams.subscribe(params => {
      this.inRestoreEditMode = params.edit === 'true';
    });
    this.initVariables();
    this.initialiseTabWizards();
    //this.requestRestorationLumpsumForm = this.createRestorationLumpsumForm();
    this.getLookupValues();
    this.savedLumpsumBenfitDetails = this.returnLumpsumService.getSavedActiveBenefit();
    if (this.savedLumpsumBenfitDetails) {
      this.socialInsuranceNo = this.savedLumpsumBenfitDetails.sin;
      this.benefitType = this.savedLumpsumBenfitDetails.benefitType.english;
      this.benefitRequestId = this.savedLumpsumBenfitDetails.benefitRequestId;
      //this.referenceNo = this.savedLumpsumBenfitDetails.referenceNo;
    }
    this.getScreenSize();
    if (this.inRestoreEditMode) {
      this.getLookupValues();
      this.checkValidatorEditFlow();
      this.initialiseViewForEdit();
    }
  }

  /*
   * This initialise the wizard items
   */
  initialiseTabWizards() {
    this.wizardItems = this.wizardService.getRestoreLumpsumWizardItems();
    this.wizardItems[this.currentTab].isActive = true;
    this.wizardItems[0].isDisabled = false;
    if (this.currentTab === 1) {
      this.wizardItems[0].isDone = true;
    }
  }

  /*** this function will fetch the Lov list required for the other payment method */
  getLookupValues() {
    this.returnLumpsumService.getReasonLovList().subscribe(res => {
      const reasonlist: Lov[] = res;
      this.reasonListSorted = new LovList(reasonlist);
    });
  }
  /*
   * This method is to select wizard
   */
  selectedWizard(index: number) {
    this.selectWizard(index, this.restoreLumpsumDetailsTab, this.wizardItems);
  }
  /*
   * This method is to fetch uploaded documents
   */
  getUploadedDocuments(enableRepaymentId: number) {
    const transactionKey = UITransactionType.RESTORE_LUMPSUM_BENEFIT;
    const transactionType = UITransactionType.FO_REQUEST_SANED;
    this.benefitDocumentService
      .getUploadedDocuments(enableRepaymentId, transactionKey, transactionType)
      .subscribe(res => {
        this.requiredDocs = res;
      });
  }
  /*
   * This method is to save restore reasons
   */
  saveRestoreReason() {
    if (this.requestRestorationLumpsumForm.invalid) {
      this.alertService.clearAllErrorAlerts();
      markFormGroupTouched(this.requestRestorationLumpsumForm);
    } else {
      const restoreValues: EnableRepaymentRequest = {
        reason: this.requestRestorationLumpsumForm.get('editform').get('restorationReasons').value,
        notes: this.requestRestorationLumpsumForm.get('editform').get('restorationNotes').value,
        referenceNo: this.referenceNo
      };
      if (!this.inRestoreEditMode) {
        this.returnLumpsumService.restorePost(this.socialInsuranceNo, this.benefitRequestId, restoreValues).subscribe(
          res => {
            this.restoreResponse = res;
            if (this.restoreResponse?.message != null) {
              this.showSuccessMessage(this.restoreResponse.message);
            }
            if (this.restoreResponse?.enableLumpsumRepaymentId != null) {
              this.enableRepaymentId = this.restoreResponse.enableLumpsumRepaymentId;
              this.getUploadedDocuments(this.enableRepaymentId);
            }
            this.navigateRestoreWizard();
          },
          err => {
            if (err.status === 500 || err.status === 422 || err.status === 400) {
              this.showErrorMessage(err);
              this.goToTop();
            }
          }
        );
      } else {
        const repayID = this.returnLumpsumService.getRepayId();
        const benReqId = this.returnLumpsumService.getBenefitReqId();
        this.returnLumpsumService.restoreEdit(this.socialInsuranceNo, benReqId, repayID, restoreValues).subscribe(
          res => {
            this.restoreLumpsumResponse = res;
            if (this.restoreResponse?.enableLumpsumRepaymentId != null) {
              this.enableRepaymentId = this.restoreResponse.enableLumpsumRepaymentId;
            }
            this.navigateRestoreWizard();
          },
          err => {
            if (err.status === 500 || err.status === 422 || err.status === 400) {
              this.showErrorMessage(err);
              this.goToTop();
            }
          }
        );
      }
    }
  }

  /** Method to handle doc upload. */
  docUploadSuccess(comments) {
    const submitValues: StopSubmitRequest = {
      comments: comments.comments,
      referenceNo: this.referenceNo,
      uuid: this.documentuuid
    };
    if (!this.inRestoreEditMode) {
      this.returnLumpsumService
        .submitRestore(this.socialInsuranceNo, this.benefitRequestId, this.enableRepaymentId, submitValues)
        .subscribe(
          res => {
            this.restoreResponse = res;
            if (this.restoreResponse?.message != null) {
              this.alertService.showSuccess(this.restoreResponse?.message);
            }
            this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
          },
          err => {
            if (err.status === 500 || err.status === 422 || err.status === 400) {
              this.showErrorMessage(err);
              this.goToTop();
            }
          }
        );
    } else {
      const repayID = this.returnLumpsumService.getRepayId();
      this.returnLumpsumService
        .submitRestoreEdit(this.socialInsuranceNo, this.benefitRequestId, repayID, this.restoreLumpsumResponse)
        .subscribe(
          res => {
            this.restoreResponse = res;
            if (
              this.role &&
              (this.role === this.rolesEnum.VALIDATOR_1 ||
                this.role === this.rolesEnum.CUSTOMER_SERVICE_REPRESENTATIVE ||
                this.role === 'Contributor')
            ) {
              this.saveWorkflowInEdit(comments);
            }
          },
          err => {
            if (err.status === 500 || err.status === 422 || err.status === 400) {
              this.showErrorMessage(err);
              this.goToTop();
            }
          }
        );
    }
  }

  /**method to tab change */
  navigateRestoreWizard() {
    scrollToTop();
    this.currentTab++;
    this.alertService.clearAlerts();
    if (this.restoreBenefitWizard) {
      this.restoreBenefitWizard.setNextItem(this.currentTab);
    }
    if (!this.inRestoreEditMode) {
      this.returnLumpsumService.getReqDocsForRestoreLumpsum(this.isAppPrivate).subscribe(documents => {
        this.requiredDocs = documents;
        this.requiredDocs.forEach(doc => {
          doc.canDelete = true;
        });
      });
    } else {
      this.getUploadedDocuments(this.enableRepaymentId);
    }
  }
  /***-----------------------Edit fuction---------------------------------- */
  /** Method to save workflow details in edit mode. */
  saveWorkflowInEdit(comments) {
    const workflowData = new BPMUpdateRequest();
    workflowData.assignedRole = this.role;
    workflowData.comments = comments.comments;
    workflowData.taskId = this.routerData.taskId;
    workflowData.user = this.routerData.assigneeId;
    workflowData.outcome = WorkFlowActions.SUBMIT;
    this.manageBenefitService.updateAnnuityWorkflow(workflowData).subscribe(
      () => {
        this.alertService.showSuccessByKey('BENEFITS.VAL-SANED-SUCCESS-MSG');
        this.manageBenefitService.navigateToInbox();
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }
  /**
   * Method to perform feedback call after scanning.
   * @param document
   */
  refreshDocument(document: DocumentItem) {
    if (document && document.name) {
      this.documentService
        .refreshDocument(
          document,
          this.enableRepaymentId,
          undefined,
          undefined,
          undefined,
          undefined,
          this.documentuuid
        )
        .subscribe(res => {
          if (res) {
            document = res;
          }
        });
    }
  }
  /* Method to intialise the view in edit mode */
  initialiseViewForEdit() {
    if (this.inRestoreEditMode) {
      // calling the lumpsum repayment api with repay id
      const repayID = this.returnLumpsumService.getRepayId();
      this.returnLumpsumService
        .getLumpsumRepaymentDetails(this.socialInsuranceNo, this.benefitRequestId, repayID)
        .subscribe(
          res => {
            this.restorationDetails = res;
            this.enableRepaymentId = this.restorationDetails.enableLumpsumRepaymentId;
          },
          err => {
            this.alertService.showError(err.error.message);
          }
        );
    }
  }
  /*
   * This method is to go to previous form
   */
  previousForm() {
    this.alertService.clearAlerts();
    this.currentTab--;
    if (this.restoreBenefitWizard) {
      this.restoreBenefitWizard.setPreviousItem(this.currentTab);
    }
    scrollToTop();
  }

  /** Method to handle cancellation of transaction. */
  cancelTransaction() {
    this.showModal(this.confirmTemplate);
    this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
  }

  //This method is to decline cancellation of transaction
  decline() {
    this.commonModalRef.hide();
  }

  /** Route back to previous page */
  routeBack() {
    this.location.back();
  }
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(modalRef: TemplateRef<HTMLElement>, size?: string) {
    this.commonModalRef = this.modalService.show(
      modalRef,
      Object.assign(
        {},
        {
          class: `modal-${size ? size : 'lg'}`,
          backdrop: true,
          ignoreBackdropClick: true
        }
      )
    );
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }
  showErrorMessages($event) {
    showErrorMessage($event, this.alertService);
  }

  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err.error.details && err.error.details.length > 0) {
      this.alertService.showError(null, err.error.details);
    } else {
      this.alertService.showError(err.error.message);
    }
  }
  /** Method to handle clearing alerts before component destroyal . */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
}
