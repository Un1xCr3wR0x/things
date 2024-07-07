import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  BPMUpdateRequest,
  BilingualText,
  DocumentItem,
  DocumentService,
  EstablishmentStatusEnum,
  LanguageToken,
  LookupService,
  LovList,
  RegistrationNoToken,
  RegistrationNumber,
  RouterData,
  RouterDataToken,
  TransactionReferenceData,
  UuidGeneratorService,
  WizardItem,
  WorkflowService,
  scrollToTop
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import moment from 'moment';
import { BehaviorSubject, Observable, noop, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BillingConstants, MiscellaneousConstants } from '../../../shared/constants';
import { TransactionOutcome } from '../../../shared/enums/transaction-outcome';
import { EstablishmentDetails, MiscellaneousRequest, MiscellaneousResponse } from '../../../shared/models';
import { BillingRoutingService, EstablishmentService, MiscellaneousAdjustmentService } from '../../../shared/services';

@Component({
  selector: 'blg-miscellaneous-adjustment-details-sc',
  templateUrl: './miscellaneous-adjustment-details-sc.component.html',
  styleUrls: ['./miscellaneous-adjustment-details-sc.component.scss']
})
export class MiscellaneousAdjustmentDetailsScComponent implements OnInit {
  /** Local Vaiables */
  regNumber: number;
  lang = 'en';
  inWorkflow = false;
  establishmentDetails: EstablishmentDetails;
  miscellaneousAdjustmentWizardItems: WizardItem[] = [];
  currentTab = 0;
  miscellaneousAdjustmentForm: FormGroup = new FormGroup({});
  selectedReason: String;
  isContributorLevel: boolean;
  requestNo: number;
  isEdit = true;
  documents: DocumentItem[] = [];
  uuid: String;
  isGcc = false;
  isMofpayment =false;
  referenceNumber: number;
  transactionId: String;
  comments: TransactionReferenceData[] = [];
  isCommentsPresent = false;
  isVerified: boolean;
  miscSubmitRequest: MiscellaneousRequest = new MiscellaneousRequest();
  miscResponse: MiscellaneousResponse = new MiscellaneousResponse();
  successMessage: BilingualText;
  submissionDate: string;
  estStartDate: Date;
  misscId: number;
  previousTab = false;
  miscellanousDetails: MiscellaneousRequest = new MiscellaneousRequest();
  isPPAEst = false;

  /** Observables */
  adjustmentReason$: Observable<LovList> = new Observable<LovList>(null);
  isEstablishmentClosed = false;

  //** Constants */
  documentTransactionId = BillingConstants.MISC_ADJUSTMENT_DOCUMENT_TRANSACTION_ID;

  @ViewChild('miscellaneousAdjustmentWizard', { static: false })
  miscellaneousAdjustmentWizard: ProgressWizardDcComponent;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly miscellaneousAdjustmentService: MiscellaneousAdjustmentService,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly miscellanousAdjustmentService: MiscellaneousAdjustmentService,
    readonly billingRoutingService: BillingRoutingService,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    private uuidGeneratorService: UuidGeneratorService,
    readonly documentService: DocumentService,
    readonly workFlowService: WorkflowService,
    readonly routingService: BillingRoutingService
  ) {}

  ngOnInit() {
    this.modeOfTransaction();
    this.language.subscribe(lang => (this.lang = lang));
    this.adjustmentReason$ = this.lookupService.getAdjustmentReason();
    this.uuid = this.uuidGeneratorService.getUuid();
    this.isVerified = false;
    if (this.inWorkflow) {
      if (this.routerData.payload) {
        const payload = JSON.parse(this.routerData.payload);
        if (payload) {
          this.referenceNumber = payload.referenceNo ? Number(payload.referenceNo) : null;
          this.misscId = payload.referenceNo ? Number(payload.id) : null;
          this.regNumber = payload.registrationNo ? Number(payload.registrationNo) : null;
          if (this.misscId && this.regNumber) this.getDataForViews();
        }
        if (this.routerData.comments) {
          if (this.routerData.comments.length > 0) {
            this.comments = this.routerData.comments;
            this.isCommentsPresent = true;
          }
        }
      }
      this.initializeWizards();
    } else {
      this.initializeWizards();
      this.regNumber = this.establishmentRegistrationNo.value;
      this.getEstablishmentDetails(this.regNumber);
      this.getRequiredDocuments();
    }
  }

  /** Method to initialize the navigation wizard. */
  initializeWizards() {
    this.miscellaneousAdjustmentWizardItems = this.getWizards();
    this.miscellaneousAdjustmentWizardItems[0].isDisabled = false;
    this.miscellaneousAdjustmentWizardItems[0].isActive = true;
  }

  /** Method to get establishment details */
  getEstablishmentDetails(regNumber: number) {
    this.establishmentService.getEstablishment(regNumber).subscribe(
      establishment => {
        this.alertService.clearAlerts();
        this.establishmentDetails = establishment;
        this.isPPAEst = establishment?.ppaEstablishment;
          if (
            this.establishmentDetails.status.english === EstablishmentStatusEnum.CLOSED ||
            this.establishmentDetails.status.english === EstablishmentStatusEnum.CANCELLED
          ) {
            this.alertService.showErrorByKey('BILLING.ESTABLISHMENT-STATUS-ERROR');
            this.isEstablishmentClosed = true;
          }
          this.estStartDate = this.establishmentDetails.startDate.gregorian;
          this.isGcc = this.establishmentDetails.gccCountry;
          this.isMofpayment =this.establishmentDetails.establishmentAccount.paymentType.english ==='Yes'?true:false;
      },
      err => this.alertService.showError(err.error.message)
    );
  }

  /** Method to get wizard items */
  getWizards() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BillingConstants.ADJUSTMENT_DETAILS, 'money-bill'));
    wizardItems.push(new WizardItem(BillingConstants.DOCUMENTS, 'file-alt'));
    return wizardItems;
  }

  /** Method to enable navigation through wizard. */
  selectWizard(index) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }

  /** Method to navigate to next form */
  nextForm() {
    if (this.selectedReason === 'Others') {
      if (this.miscellaneousAdjustmentForm.valid) {
        if (this.miscellaneousAdjustmentForm.get('adjustmentGroupDeatilsForm').get('totalAmount').value <= 0) {
          this.alertService.showErrorByKey('BILLING.MISCELLANOUS-ERROR-MSG');
        } else {
          scrollToTop();
          this.alertService.clearAlerts();
          this.currentTab = 1;
          if (this.miscellaneousAdjustmentWizard) {
            this.miscellaneousAdjustmentWizard.setNextItem(this.currentTab);
          }
        }
      } else this.alertService.showMandatoryErrorMessage();
    } else {
      scrollToTop();
      this.alertService.clearAlerts();
      this.currentTab = 1;
      if (this.miscellaneousAdjustmentWizard) {
        this.miscellaneousAdjustmentWizard.setNextItem(this.currentTab);
      }
    }
  }
  /** Methid to indicate which reason is selected */
  selectedReasonItem(item) {
    this.selectedReason = item;
  }

  /** Method to indicate if contributor level selected or establishment level. */
  selectedLevel(level) {
    this.miscellaneousAdjustmentForm
      .get('adjustmentdetailsForm')
      .get('adjustmentFor')
      .get('english')
      .setValue(level.english);
    this.miscellaneousAdjustmentForm
      .get('adjustmentdetailsForm')
      .get('adjustmentFor')
      .get('arabic')
      .setValue(level.arabic);
  }

  /** Method to Cancle adjustment */
  cancelAvailableAdjustmentPage() {
    if (this.inWorkflow) {
      this.miscellaneousAdjustmentService.revertAdjustmentDetails(this.regNumber, this.misscId).subscribe(
        () => this.billingRoutingService.navigateToValidator(),
        err => this.alertService.showError(err.error.message)
      );
    } else {
      this.router.navigate(['home']);
    }
    this.alertService.clearAlerts();
  }

  /** Method to submit adjustmentdetails */
  submitAdjustmentDetails() {
    this.miscellaneousAdjustmentForm
      .get('adjustmentdetailsForm')
      .get('periodStartDate')
      .get('gregorian')
      .setValue(
        this.miscellaneousAdjustmentForm.get('adjustmentdetailsForm').get('transactionDate').get('gregorian').value[0]
      );
    this.miscellaneousAdjustmentForm
      .get('adjustmentdetailsForm')
      .get('periodEndDate')
      .get('gregorian')
      .setValue(
        this.miscellaneousAdjustmentForm.get('adjustmentdetailsForm').get('transactionDate').get('gregorian').value[1]
      );
    this.miscSubmitRequest = new MiscellaneousRequest();
    if (this.miscellaneousAdjustmentForm) {
      if (
        this.miscellaneousAdjustmentForm.get('adjustmentdetailsForm').get('adjustmentFor').get('english').value ===
        'Establishment Level'
      ) {
        this.miscSubmitRequest.adjustmentLevel = MiscellaneousConstants.ESTABLISHMENT_LEVEL;
      } else this.miscSubmitRequest.adjustmentLevel = MiscellaneousConstants.CONTRIBUTOR_LEVEL;
      if (
        this.miscellaneousAdjustmentForm.get('adjustmentdetailsForm').get('adjustmentType').get('english').value ===
        'Credit'
      ) {
        this.miscSubmitRequest.adjustmentType = MiscellaneousConstants.MISC_CREDIT;
      } else this.miscSubmitRequest.adjustmentType = MiscellaneousConstants.MISC_DEBIT;
      this.miscSubmitRequest.adjustmentReason = this.miscellaneousAdjustmentForm
        .get('adjustmentdetailsForm')
        .get('adjustmentReason').value;
      this.miscSubmitRequest.reason = this.miscellaneousAdjustmentForm
        .get('adjustmentdetailsForm')
        .get('adjustmentReasonText').value;
      this.miscSubmitRequest.description = this.miscellaneousAdjustmentForm
        .get('adjustmentdetailsForm')
        .get('adjustmentDecriptionText').value;
      this.miscSubmitRequest.comments = this.miscellaneousAdjustmentForm.get('commentsForm').get('comments').value;
      this.miscSubmitRequest.periodStartDate = this.miscellaneousAdjustmentForm
        .get('adjustmentdetailsForm')
        .get('periodStartDate').value;
      this.miscSubmitRequest.periodEndDate = this.miscellaneousAdjustmentForm
        .get('adjustmentdetailsForm')
        .get('periodEndDate').value;
      this.miscSubmitRequest.uuid = this.uuid;
      if (
        this.miscellaneousAdjustmentForm
          .get('adjustmentGroupDeatilsForm')
          .get('AdjustmentLevel')
          .get('OH')
          .get('amount').value > 0
      )
        this.miscSubmitRequest.adjustmentDetails.push(
          this.miscellaneousAdjustmentForm.get('adjustmentGroupDeatilsForm').get('AdjustmentLevel').get('OH').value
        );
      if (
        this.miscellaneousAdjustmentForm
          .get('adjustmentGroupDeatilsForm')
          .get('AdjustmentLevel')
          .get('OHPenalty')
          .get('amount').value > 0
      )
        this.miscSubmitRequest.adjustmentDetails.push(
          this.miscellaneousAdjustmentForm.get('adjustmentGroupDeatilsForm').get('AdjustmentLevel').get('OHPenalty')
            .value
        );
      if (
        this.miscellaneousAdjustmentForm
          .get('adjustmentGroupDeatilsForm')
          .get('AdjustmentLevel')
          .get('UI')
          .get('amount').value > 0
      )
        this.miscSubmitRequest.adjustmentDetails.push(
          this.miscellaneousAdjustmentForm.get('adjustmentGroupDeatilsForm').get('AdjustmentLevel').get('UI').value
        );
      if (
        this.miscellaneousAdjustmentForm
          .get('adjustmentGroupDeatilsForm')
          .get('AdjustmentLevel')
          .get('UIPenalty')
          .get('amount').value > 0
      )
        this.miscSubmitRequest.adjustmentDetails.push(
          this.miscellaneousAdjustmentForm.get('adjustmentGroupDeatilsForm').get('AdjustmentLevel').get('UIPenalty')
            .value
        );
      if (
        this.miscellaneousAdjustmentForm
          .get('adjustmentGroupDeatilsForm')
          .get('AdjustmentLevel')
          .get('annuity')
          .get('amount').value > 0
      )
        this.miscSubmitRequest.adjustmentDetails.push(
          this.miscellaneousAdjustmentForm.get('adjustmentGroupDeatilsForm').get('AdjustmentLevel').get('annuity').value
        );
      if (
        this.miscellaneousAdjustmentForm
          .get('adjustmentGroupDeatilsForm')
          .get('AdjustmentLevel')
          .get('annuityPenalty')
          .get('amount').value > 0
      )
        this.miscSubmitRequest.adjustmentDetails.push(
          this.miscellaneousAdjustmentForm
            .get('adjustmentGroupDeatilsForm')
            .get('AdjustmentLevel')
            .get('annuityPenalty').value
        );
      if (
        this.miscellaneousAdjustmentForm
          .get('adjustmentGroupDeatilsForm')
          .get('AdjustmentLevel')
          .get('prAnnuity')
          .get('amount').value > 0
      )
        this.miscSubmitRequest.adjustmentDetails.push(
          this.miscellaneousAdjustmentForm.get('adjustmentGroupDeatilsForm').get('AdjustmentLevel').get('prAnnuity')
            .value
        );
      if (
        this.miscellaneousAdjustmentForm
          .get('adjustmentGroupDeatilsForm')
          .get('AdjustmentLevel')
          .get('prAnnuityPenalty')
          .get('amount').value > 0
      )
        this.miscSubmitRequest.adjustmentDetails.push(
          this.miscellaneousAdjustmentForm
            .get('adjustmentGroupDeatilsForm')
            .get('AdjustmentLevel')
            .get('prAnnuityPenalty').value
        );
      if (
        this.miscellaneousAdjustmentForm
          .get('adjustmentGroupDeatilsForm')
          .get('AdjustmentLevel')
          .get('ppaAnnuity')
          .get('amount').value > 0
      )
        this.miscSubmitRequest.adjustmentDetails.push(
          this.miscellaneousAdjustmentForm.get('adjustmentGroupDeatilsForm').get('AdjustmentLevel').get('ppaAnnuity')
            .value
        );
      if (
        this.miscellaneousAdjustmentForm
          .get('adjustmentGroupDeatilsForm')
          .get('AdjustmentLevel')
          .get('ppaAnnuityPenalty')
          .get('amount').value > 0
      )
        this.miscSubmitRequest.adjustmentDetails.push(
          this.miscellaneousAdjustmentForm
            .get('adjustmentGroupDeatilsForm')
            .get('AdjustmentLevel')
            .get('ppaAnnuityPenalty').value
        );
      if (
        this.miscellaneousAdjustmentForm
          .get('adjustmentGroupDeatilsForm')
          .get('AdjustmentLevel')
          .get('rejectedOH')
          .get('amount').value > 0
      )
        this.miscSubmitRequest.adjustmentDetails.push(
          this.miscellaneousAdjustmentForm.get('adjustmentGroupDeatilsForm').get('AdjustmentLevel').get('rejectedOH')
            .value
        );
      if (
        this.miscellaneousAdjustmentForm
          .get('adjustmentGroupDeatilsForm')
          .get('AdjustmentLevel')
          .get('violation')
          .get('amount').value > 0
      )
        this.miscSubmitRequest.adjustmentDetails.push(
          this.miscellaneousAdjustmentForm.get('adjustmentGroupDeatilsForm').get('AdjustmentLevel').get('violation')
            .value
        );
      if (this.inWorkflow) {
        this.miscellaneousAdjustmentService
          .updateMiscellaneousDetails(this.regNumber, this.misscId, this.miscSubmitRequest)
          .pipe(
            tap(res => {
              this.alertService.clearAlerts();
              this.miscResponse.fromJsonToObject(res);
              this.successMessage = this.miscResponse.message; //Setting success message
              if (this.successMessage) {
                this.handleWorkflowActions();
                this.isVerified = true;
                this.nextForm();
              }
              this.alertService.showSuccess(this.successMessage, null, 10);
            }),
            catchError(err => {
              this.alertService.showError(err.error.message);
              return throwError(err);
            })
          )
          .subscribe(noop, noop);
      } else {
        this.miscellaneousAdjustmentService
          .submitMiscellaneousDetails(this.regNumber, this.miscSubmitRequest)
          .pipe(
            tap(res => {
              this.alertService.clearAlerts();
              this.miscResponse.fromJsonToObject(res);
              this.successMessage = this.miscResponse.message; //Setting success message
              if (this.successMessage) {
                this.isVerified = true;
                this.nextForm();
              }
              this.alertService.showSuccess(this.successMessage, null, 10);
            }),
            catchError(err => {
              this.alertService.showError(err.error.message);
              return throwError(err);
            })
          )
          .subscribe(noop, noop);
      }
    }
    this.submissionDate = moment(new Date()).format('DD/MM/YYYY');
  }

  /** Method to navigate to previous section */
  previousForm() {
    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab--;
    this.miscellaneousAdjustmentWizard.setPreviousItem(this.currentTab);
    this.previousTab = true;
  }

  /** Method to return to home page*/
  homePage() {
    this.router.navigate(['home']);
    this.alertService.clearAlerts();
  }
  /**
   * Method to check form validity
   * @param form form control */
  checkDocumentValidity(form: FormGroup) {
    if (!this.documentService.checkMandatoryDocuments(this.documents)) {
      this.alertService.showMandatoryDocumentsError();
      return false;
    } else if (form) {
      return form.valid;
    } else {
      return true;
    }
  }
  /** Method to get required documents */
  getRequiredDocuments() {
    this.documentService
      .getRequiredDocuments(
        BillingConstants.MISC_ADJUSTMENT_DOC_TRANSACTION_ID,
        BillingConstants.MISC_ADJUSTMENT_DOC_TRANSACTION_TYPE
      )
      .pipe(
        map(docs => this.documentService.removeDuplicateDocs(docs)),
        catchError(error => of(error))
      )
      .subscribe(doc => (this.documents = doc), noop);
  }
  /** Method to fetch scanned document details. */
  getScannedDocuments(referenceNo) {
    this.documentService
      .getDocuments(
        BillingConstants.MISC_ADJUSTMENT_DOC_TRANSACTION_ID,
        BillingConstants.MISC_ADJUSTMENT_DOC_TRANSACTION_TYPE,
        this.regNumber,
        referenceNo
      )
      .subscribe(doc => (this.documents = doc));
    this.documents.forEach(doc => {
      this.refreshDocuments(doc);
    });
  }
  /** Method to show error alert. */
  showError(errors): void {
    this.alertService.showError(errors.error.message, errors.error.details);
  }
  /** Method to refresh documents after scan. */
  refreshDocuments(doc: DocumentItem) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          this.regNumber,
          BillingConstants.MISC_ADJUSTMENT_DOC_TRANSACTION_ID,
          BillingConstants.MISC_ADJUSTMENT_DOC_TRANSACTION_TYPE
        )
        .subscribe(res => (doc = res));
    }
  }
  modeOfTransaction() {
    this.route.url.subscribe(res => {
      if (res[0] && res[0].path === 'edit') this.inWorkflow = true;
    });
  }

  /** Method to get required data to view transaction */
  getDataForViews() {
    this.getEstablishmentDetails(this.regNumber);
    this.miscellanousAdjustmentService
      .getValidatorMiscellaneousDetails(this.regNumber, this.misscId)
      .subscribe(datas => {
        this.miscellanousDetails = datas;
        this.selectedReason = this.miscellanousDetails.adjustmentReason.english;
      });
    this.getScannedDocuments(this.referenceNumber);
  }

  /**
   *  this method is used to approve workflow details om validator edit
   * */
  handleWorkflowActions() {
    this.workFlowService.updateTaskWorkflow(this.setWorkflowData()).subscribe(
      () => this.navigateBackToInbox(),
      err => this.alertService.showError(err.error.message)
    );
  }
  /** Method to navigate back to inbox page */
  navigateBackToInbox() {
    this.routingService.navigateToInbox();
  }
  /** Method to set workflow data. */
  setWorkflowData(): BPMUpdateRequest {
    const data = new BPMUpdateRequest();
    data.taskId = this.routerData.taskId;
    data.user = this.routerData.assigneeId;
    data.outcome = TransactionOutcome.UPDATE;
    data.commentScope = 'BPM';
    if (this.miscellaneousAdjustmentForm && this.miscellaneousAdjustmentForm.get('commentsForm.comments'))
      data.comments = this.miscellaneousAdjustmentForm.get('commentsForm').get('comments').value;
    return data;
  }
}
