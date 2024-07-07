import { AfterViewInit, Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import {
  AlertService,
  BPMUpdateRequest,
  convertToYYYYMMDD,
  DocumentItem,
  DocumentService,
  LookupService,
  LovList,
  Role,
  RouterData,
  RouterDataToken,
  scrollToTop,
  WizardItem,
  WorkFlowActions
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { noop, Observable } from 'rxjs';
import {
  AnnuityResponseDto,
  BenefitConstants,
  BenefitDocumentService,
  CalculatedAdjustment,
  ManageBenefitService,
  markFormGroupTouched,
  SuspendSanedDetails,
  UiBenefitsService,
  UITransactionType,
  WizardService
} from '../../shared';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import moment from 'moment';

interface EditState {
  suspendDetails: SuspendSanedDetails;
  referenceNo: number;
}
@Component({
  selector: 'bnt-suspend-saned-benefit-sc',
  templateUrl: './suspend-saned-benefit-sc.component.html',
  styleUrls: ['./suspend-saned-benefit-sc.component.scss']
})
export class SuspendSanedBenefitScComponent implements OnInit, AfterViewInit {
  wizardItems: WizardItem[];
  activeTab = 0;
  totalTabs = 3;
  modalRef: BsModalRef;
  documents: Array<DocumentItem> = [];
  referenceNo: number;

  requestDetailsForm: FormGroup;
  suspendReasonList: Observable<LovList>;
  sin: number;
  benefitRequestId: number;
  isEdit = false;

  adjustmentDetails: CalculatedAdjustment;
  benefitDetails: AnnuityResponseDto;

  docTransactionId = BenefitConstants.TRANSACTIONID_SUSPEND_SANED;
  transactionId = UITransactionType.SUSPEND_UNEMPLOYMENT_BENEFIT;
  transactionType = UITransactionType.FO_REQUEST_SANED;

  /** Child components. */
  @ViewChild('progressWizardItems') progressWizard: ProgressWizardDcComponent;

  constructor(
    readonly wizardService: WizardService,
    readonly alertService: AlertService,
    readonly fb: FormBuilder,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    private location: Location,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    private sanedService: UiBenefitsService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly manageBenefitService: ManageBenefitService
  ) {}

  ngOnInit() {
    this.initializeWizard();
    this.requestDetailsForm = this.createRequestDetailsForm();
    this.suspendReasonList = this.lookupService.getSuspendSanedReasonList();
    this.sin = Number(this.route.snapshot.queryParamMap.get('sin'));
    this.benefitRequestId = Number(this.route.snapshot.queryParamMap.get('benefitRequestId'));
    this.documentService.getRequiredDocuments(this.transactionId, [this.transactionType]).subscribe(res => {
      this.documents = res;
    });
  }

  ngAfterViewInit(): void {
    this.setDataIfEdit();
  }

  setDataIfEdit() {
    const state = this.location.getState() as EditState;
    if (!state.suspendDetails) return;

    this.isEdit = true;
    this.referenceNo = state.referenceNo;
    this.requestDetailsForm.patchValue({
      requestDate: {
        gregorian: moment(new Date()).toDate()
      },
      suspendDate: {
        gregorian: moment(state.suspendDetails.suspendDate.gregorian).toDate()
      },
      suspendReason: {
        ...state.suspendDetails.reason
      },
      notes: state.suspendDetails.notes
    });

    this.benefitDocumentService
      .getUploadedDocuments(this.benefitRequestId, this.transactionId, this.transactionType, this.referenceNo)
      .pipe(
        tap(res => {
          this.documents = res;
        })
      )
      .subscribe(noop);
  }

  /** Method to initialize wizard. */
  initializeWizard(): void {
    this.wizardItems = this.wizardService.getSuspendSanedBenefitItems();
    this.wizardItems[0].isDisabled = false;
    this.wizardItems[0].isActive = true;
  }

  createRequestDetailsForm() {
    return this.fb.group({
      requestDate: this.fb.group({
        gregorian: [moment(new Date()).toDate(), Validators.required],
        hijiri: [null]
      }),
      suspendDate: this.fb.group({
        gregorian: [null, Validators.required],
        hijiri: [null]
      }),
      suspendReason: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [null]
      }),
      notes: this.fb.control(null, Validators.required)
    });
  }

  selectFormWizard(selectedWizardIndex: number) {
    if (selectedWizardIndex === 0) {
      for (let i = selectedWizardIndex; i < this.totalTabs; i++) {
        if (this.wizardItems[i + 1]) {
          this.wizardItems[i + 1].isDisabled = true;
          this.wizardItems[i + 1].isActive = false;
          this.wizardItems[i + 1].isDone = false;
        }
      }
    }
    this.alertService.clearAlerts();
    this.activeTab = selectedWizardIndex;
  }
  /** Handle navigating to next section. */
  handleNext() {
    this.alertService.clearAllErrorAlerts();
    scrollToTop();
    this.activeTab++;
  }

  /** Handle navigating to previous section. */
  handlePrevious() {
    this.alertService.clearAllErrorAlerts();
    scrollToTop();
    this.activeTab--;
  }
  /** Method to navigate to next tab. */
  setNextSection() {
    this.handleNext();
    this.progressWizard.setNextItem(this.activeTab);
  }
  /** Method to navigate to previous tab. */
  setPreviousSection(): void {
    this.handlePrevious();
    this.progressWizard.setPreviousItem(this.activeTab);
    this.selectFormWizard(this.activeTab);
  }
  setAdjustmentDetailsSection() {
    this.alertService.clearAllErrorAlerts();
    markFormGroupTouched(this.requestDetailsForm);
    if (this.requestDetailsForm.valid) {
      this.sanedService
        .calculateSanedSuspendAdjustments(
          this.sin,
          this.benefitRequestId,
          convertToYYYYMMDD(this.requestDetailsForm.get('suspendDate.gregorian').value)
        )
        .pipe(
          switchMap(res => {
            this.adjustmentDetails = res;

            return this.sanedService.getUiBenefitRequestDetail(this.sin, this.benefitRequestId, null);
          }),
          tap(res => {
            this.benefitDetails = res;
          })
        )
        .subscribe(
          () => {
            this.setNextSection();
          },
          err => {
            this.showError(err);
          }
        );
    } else {
      scrollToTop();
      this.alertService.showMandatoryErrorMessage();
    }
  }

  initiateSuspendSaned() {
    this.alertService.clearAllErrorAlerts();
    let service;
    if (this.referenceNo) {
      service = this.sanedService.updateSuspendSanedRequest({
        sin: this.sin,
        benefitRequestId: this.benefitRequestId,
        referenceNo: this.referenceNo,
        suspendDate: convertToYYYYMMDD(this.requestDetailsForm.get('suspendDate.gregorian').value),
        reasonCode: this.requestDetailsForm.get('suspendReason').value,
        notes: this.requestDetailsForm.get('notes').value
      });
    } else {
      service = this.sanedService
        .initiateSuspendSanedRequest(this.sin, this.benefitRequestId)
        .pipe(tap(res => (this.referenceNo = res.referenceNo)));
    }

    service.subscribe(
      () => {
        this.setNextSection();
      },
      e => {
        this.showError(e);
      }
    );
  }
  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  /** Method to decline the popUp. */
  decline() {
    this.modalRef.hide();
  }

  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
    this.location.back();
    //this.onCancel.emit();
  }
  showError(error) {
    if (error?.error) {
      scrollToTop();
      this.alertService.showError(error.error.message, error.error.details);
    }
  }
  /** Method to refresh documents after scan. */
  refreshDocument(doc: DocumentItem) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(doc, this.benefitRequestId, this.transactionId, this.transactionType, this.referenceNo)
        .subscribe(res => (doc = res));
    }
  }
  /** Method to check documents. */
  checkDocuments(): boolean {
    return this.documentService.checkMandatoryDocuments(this.documents);
  }

  /** Method to delete any document scanned or uploaded when the transaction is cancelled. */
  // deleteDocumentsOnCancel() {
  //   this.documents.forEach(doc => {
  //     if (doc.documentContent)
  //       this.documentService
  //         .deleteDocument(this.person.personId, doc.name.english, null, null, doc.sequenceNumber, null)
  //         .subscribe(noop);
  //   });
  // }
  submitSuspendSaned(comment: { comments: string }) {
    this.alertService.clearAllErrorAlerts();
    let service;

    if (this.isEdit) {
      service = this.sanedService.updateSuspendSanedRequest({
        sin: this.sin,
        benefitRequestId: this.benefitRequestId,
        referenceNo: this.referenceNo,
        suspendDate: convertToYYYYMMDD(this.requestDetailsForm.get('suspendDate.gregorian').value),
        reasonCode: this.requestDetailsForm.get('suspendReason').value,
        notes: this.requestDetailsForm.get('notes').value
      });
    } else {
      service = this.sanedService.submitSuspendSanedRequest({
        sin: this.sin,
        benefitRequestId: this.benefitRequestId,
        referenceNo: this.referenceNo,
        suspendDate: convertToYYYYMMDD(this.requestDetailsForm.get('suspendDate.gregorian').value),
        reasonCode: this.requestDetailsForm.get('suspendReason').value,
        notes: this.requestDetailsForm.get('notes').value,
        comments: comment?.comments
      });
    }

    service.subscribe(
      res => {
        if (this.isEdit) {
          this.saveWorkflowInEdit(comment);
        } else {
          this.location.back();
          this.alertService.showSuccess(res.message);
        }
      },
      e => {
        this.showError(e);
      }
    );
  }

  /** Method to save workflow details in edit mode. */
  saveWorkflowInEdit(comment: { comments: string }) {
    const workflowData = new BPMUpdateRequest();
    workflowData.assignedRole = Role.VALIDATOR_1;
    workflowData.taskId = this.routerData.taskId;
    workflowData.user = this.routerData.assigneeId;
    workflowData.outcome = WorkFlowActions.SUBMIT;
    workflowData.referenceNo = this.referenceNo.toString();
    workflowData.comments = comment.comments || '';
    this.manageBenefitService.updateAnnuityWorkflow(workflowData).subscribe(
      _ => {
        this.alertService.showSuccessByKey('BENEFITS.VAL-SANED-SUCCESS-MSG');
        this.manageBenefitService.navigateToInbox();
      },
      err => {
        this.showError(err);
      }
    );
  }
}
