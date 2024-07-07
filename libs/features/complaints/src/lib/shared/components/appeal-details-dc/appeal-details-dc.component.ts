import { Component, Inject, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CustomerSummary } from '../../models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  AppealDetailsResponse,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentItem,
  Transaction,
  TransactionService,
  TransactionWorkflowItem
} from '@gosi-ui/core';
import { AppealOnViolationDetailsResponse } from '@gosi-ui/core/lib/models/appeal-on-violation-details-response';
import { ContributorDetails, ViolationTransaction } from '@gosi-ui/features/violations/lib/shared/models';
import { AppealOnViolation } from '@gosi-ui/features/violations/lib/shared/models/appeal-on-violation';

@Component({
  selector: 'gosi-ui-appeal-details-dc',
  templateUrl: './appeal-details-dc.component.html',
  styleUrls: ['./appeal-details-dc.component.scss']
})
export class AppealDetailsDcComponent implements OnInit, OnChanges {
  @Input() customerSummary: CustomerSummary = undefined;
  @Input() appealDetails: AppealDetailsResponse;
  @Input() appeal: AppealOnViolation;
  @Input() appealOnViolationDetails: AppealOnViolationDetailsResponse;
  @Input() violContributorList: ContributorDetails[];
  @Input() transactionTraceId: number;
  @Input() noFilesError = false;
  @Input() appealForm: FormGroup;
  @Input() diabledUpload = false;
  @Input() stringTransactionId: string;
  @Input() transaction: Transaction;
  @Input() employeeComment: string;
  @Input() uuid: string;
  @Input() documents: DocumentItem[] = [];
  @Input() decisionDocument: DocumentItem[] = [];
  @Input() isAppealApproved = false;
  @Input() isAppealProgress = false;
  @Input() disabled = false;
  @Input() hideFileDelete = false;
  @Input() violationDetails: ViolationTransaction;
  @Input() applicationType: string;
  @Input() currentRole: string;
  @Input() workflow: TransactionWorkflowItem[] = [];

  @Output() navigateEmitter: EventEmitter<any> = new EventEmitter();
  @Output() addDoc: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() deleteDoc: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() uploadFile: EventEmitter<any> = new EventEmitter();
  @Output() userProfile: EventEmitter<string> = new EventEmitter();

  accordionPanel: number;
  appealDecisionForm: FormGroup;
  isPrivate: boolean;

  constructor(
    readonly fb: FormBuilder,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.setApplicationType();
    if (!this.appealDecisionForm) this.initForm();
    setTimeout(() => {
      this.getWorkFlowDetails();
    }, 200);
  }
  /**Method to set the application type */
  setApplicationType() {
    this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
  }

  initForm(): void {
    this.appealDecisionForm = this.fb.group({
      reviewerDecision: [null],
      auditorDecision: [null],
      legalOpinion: [null],
      finalDecision: [null],
      executorDecision: [null]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.appealOnViolationDetails && changes.appealOnViolationDetails.currentValue) {
      this.appealOnViolationDetails = changes.appealOnViolationDetails.currentValue;
    }

    this.setApplicationType();
  }

  getWorkFlowDetails() {
    this.transactionService.getWorkflowDetails().subscribe(res => {
      this.currentRole = res?.workFlowList[res?.workFlowList.length - 1]?.approverRole?.english;
      console.log(this.currentRole);
    });
  }

  navigateToTransaction() {
    this.navigateEmitter.emit();
  }

  deleteDocument(document: DocumentItem) {
    this.deleteDoc.emit(document);
  }

  uploadEvent(event: boolean) {
    this.uploadFile.emit(true);
  }

  addAnotherDocument() {
    this.addDoc.emit();
  }

  selectPanel(openEvent: boolean, tabIndex: number, contributorId: number) {
    if (openEvent === true) {
      this.accordionPanel = tabIndex;
    }
    this.appendAppealDecisionForm(contributorId);
  }

  appendAppealDecisionForm(contributorId: number) {
    const appealDecision = this.appeal?.contributors.find(item => item.contributorId === contributorId);
    const lang = localStorage.getItem('lang');
    this.appealDecisionForm.patchValue({
      reviewerDecision:
        lang === 'en'
          ? appealDecision?.reviewerDecision?.english
          : lang === 'ar'
          ? appealDecision?.reviewerDecision?.arabic
          : null,
      auditorDecision: appealDecision?.auditorDecision,
      legalOpinion:
        lang === 'en'
          ? appealDecision?.legalOpinion?.english
          : lang === 'ar'
          ? appealDecision?.legalOpinion?.arabic
          : null,
      executorDecision: appealDecision?.executorDecision,
      finalDecision: appealDecision?.finalDecision
    });
  }

  onProfilePage(ninOrIqama: string) {
    this.userProfile.emit(ninOrIqama);
  }
}
