import {
  DocumentService,
  DocumentItem,
  AlertService,
  scrollToTop,
  BPMUpdateRequest,
  WorkFlowActions,
  RouterData,
  RouterDataToken,
  LovList,
  RouterConstants,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  CoreBenefitService,
  CoreContributorService
} from '@gosi-ui/core';
import { SaveAdjustmentResponse, AdjustmentService, PaymentService, AdjustmentLookupService } from '../../shared';
import { Router } from '@angular/router';
import { ViewChild, Directive, Inject } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { FormGroup } from '@angular/forms';

@Directive()
export abstract class AdjustmentBaseScComponent {
  adjustmentSubmitResponse: SaveAdjustmentResponse;
  documents: DocumentItem[];
  isDocError: Boolean = false;
  @ViewChild('adjustmentTab', { static: false })
  adjustmentTab: TabsetComponent;
  adjustmentModificationId;
  isSubmit = false;
  isValidator: Boolean = false;
  parentForm: FormGroup;
  adjustmentReasonList$: LovList;
  referenceNumber;
  role;
  taskId;
  user;
  sin: number;

  constructor(
    readonly adjustmentLookUpService: AdjustmentLookupService,
    readonly adjustmentService: AdjustmentService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly router: Router,
    readonly paymentService: PaymentService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly coreBenefitService: CoreBenefitService,
    readonly contributorService: CoreContributorService
  ) {}
  /** Method to get required document list. */
  getRequiredDocument(transactionId: string, transactionType: string, isRefreshRequired = false, isAdd = false) {
    this.documentService.getRequiredDocuments(transactionId, transactionType).subscribe(doc => {
      if (isAdd) {
        this.documents = doc.filter(res => res.name.english === 'Adjustment Document');
      } else {
        this.documents = doc;
      }
      if (isRefreshRequired)
        this.documents.forEach(docItem => {
          this.refreshDocument(docItem);
        });
    });
  }
  /**
   * Method to refresh documents after scan.
   * @param doc document
   */
  refreshDocument(doc: DocumentItem, isScan = false) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          this.adjustmentSubmitResponse?.adjustmentModificationId || this.adjustmentModificationId,
          'MAINTAIN_ADJUSTMENT',
          'MAINTAIN_ADJUSTMENT_REQUEST',
          this.adjustmentSubmitResponse?.referenceNo || this.referenceNumber
        )
        .subscribe(res => {
          doc = res;
          if (isScan && doc?.name?.english === 'Benefit Application Form') {
            scrollToTop();
            this.alertService.showInfo(
              {
                english: 'Notification will be sent to the beneficiary upon submitting the request',
                arabic: 'سيتم إحاطة المستفيد عند تقديم الطلب.'
              },
              null
            );
          }
        });
    }
  }
  deleteDocument(doc: DocumentItem) {
    if (doc?.name?.english === 'Benefit Application Form') {
      this.alertService.clearAlerts();
    }
  }
  /** Method to get the adjustment reason */
  getAdjustmentReasonList(eligibleForPensionReform = false) {
    this.adjustmentLookUpService.getAdjustmentReason(eligibleForPensionReform).subscribe(res => {
      this.adjustmentReasonList$ = res;
    });
  }
  submitAdjustmentDetails(identifier, adjustmentModificationId, referenceNumber, comments) {
    if (this.documentService.checkMandatoryDocuments(this.documents)) {
      this.isDocError = false;
      this.adjustmentService
        .submitAdjustmentDetails(identifier, adjustmentModificationId, referenceNumber, comments, this.sin)
        .subscribe(
          res => {
            this.alertService.clearAlerts();
            this.isSubmit = true;
            if (this.isValidator) {
              this.saveWorkFlowInEdit();
            } else {
              // this.alertService.showSuccess(res['message']);
              this.contributorService.selectedSIN = this.sin;
              this.contributorService.personId = identifier;
              this.coreBenefitService.setBenefitAppliedMessage(res['message']);
              this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? this.router.navigate([RouterConstants.ROUTE_BENEFIT_UI]) : this.router.navigate([RouterConstants.ROUTE_BENEFIT_LIST(this.sin)]);
            }
          },
          err => {
            this.showErrorMessage(err);
          }
        );
    } else {
      this.isDocError = true;
      this.alertService.showMandatoryDocumentsError();
    }
  }

  saveWorkFlowInEdit() {
    const workflowData = new BPMUpdateRequest();
    workflowData.assignedRole = this.role;
    workflowData.taskId = this.routerData.taskId;
    workflowData.user = this.routerData.assigneeId;
    workflowData.outcome = WorkFlowActions.SUBMIT;
    workflowData.comments = this.parentForm.get('documentsForm').get('comments').value || '';
    this.paymentService.handleAnnuityWorkflowActions(workflowData).subscribe(response => {
      if (response) {
        this.alertService.showSuccessByKey('PAYMENT.TRANSACTION-SUBMIT-MESSAGE');
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
      }
    });
  }

  initialiseView(routerData) {
    if (routerData.payload) {
      const payload = JSON.parse(routerData.payload);
      this.taskId = this.routerData.taskId;
      this.user = this.routerData.assigneeId;
      this.role = payload.assignedRole;
      this.sin = payload.socialInsuranceNo;
    }
  }
  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err?.error?.details && err.error.details.length > 0) {
      this.alertService.showError(null, err.error.details);
    } else {
      this.alertService.showError(err?.error?.message);
    }
  }
}
