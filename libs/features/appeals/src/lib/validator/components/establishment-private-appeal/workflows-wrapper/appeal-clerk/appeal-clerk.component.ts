import { Component, Input, OnDestroy, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Lov,
  WorkFlowActions,
  Transaction,
  UuidGeneratorService,
  DocumentItem,
  maxDateValidator
} from '@gosi-ui/core';
import { FirstLevelFormService, AppealValidatorRoles } from '@gosi-ui/features/appeals/lib/shared';
import { AppealClerk } from '@gosi-ui/features/appeals/lib/shared/models/employees/appeal-clerk';
import { Subscription } from 'rxjs-compat';
import { TransactionConstants } from '@gosi-ui/features/complaints/lib/shared/constants';
import moment from 'moment';

@Component({
  selector: 'appeal-clerk',
  templateUrl: './appeal-clerk.component.html',
  styleUrls: ['./appeal-clerk.component.scss']
})
export class AppealClerkComponent implements OnInit, OnChanges, OnDestroy {
  @Input() appealFinalDecisionList: Lov[];
  @Input() appealClerkModel: AppealClerk = {} as AppealClerk;
  @Input() transaction: Transaction;
  @Input() assignedRole: AppealValidatorRoles;

  appealClerkForm: FormGroup;
  notifyFormSubscription: Subscription;
  outcome: WorkFlowActions = WorkFlowActions.APPROVE;
  transactionRefNumber: number;
  appealTransactionNumber: number;
  maxStartDate = new Date();
  maxCharLength = 350;

  sequenceNumber: number;
  uuid: string;
  uploadResultofObjectionDocuments: DocumentItem[] = [];
  uploadMinutesofMeetingDocuments: DocumentItem[] = [];
  isScan = false;
  noFilesError = false;
  appealDocuments: DocumentItem[] = [];
  maxEndDate = new Date();
  appealValidatorRoles = AppealValidatorRoles;
  constructor(
    private formService: FirstLevelFormService,
    readonly fb: FormBuilder,
    readonly uuidGeneratorService: UuidGeneratorService,
  ) {}

  ngOnInit(): void {
    this.setEmitterListener();
    if (!this.appealClerkForm) this.initForm();
    this.uuid = this.uuidGeneratorService.getUuid();
    this.addResultofObjectionDocument();
    this.addMinutesofMeetingDocument();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.appealFinalDecisionList && this.appealClerkModel.finalDecision) {
      if (!this.appealClerkForm) this.initForm();
      this.bindModelToForm();
      if (
        ![AppealValidatorRoles.Appeal_clerk_private, AppealValidatorRoles.Appeal_clerk_public].includes(
          this.assignedRole
        )
      )
        this.appealClerkForm.disable();
    }
    this.appealDocuments = this.appealClerkModel.appealDocumentList;
    this.transactionRefNumber = this.appealClerkModel.transactionNumber;
    this.appealTransactionNumber = this.appealClerkModel.appealTransactionNumber;
  }

  mapAppealClerkObject(): void {
    const appealClerkFormData = this.appealClerkForm.value;
    this.appealClerkModel = {} as AppealClerk;
    this.appealClerkModel.finalDecision = appealClerkFormData.finalDecision?.english;
    this.appealClerkModel.finalDecisionDate = appealClerkFormData.finalDecisionDate?.gregorian;
    this.appealClerkModel.finalDecisionComments = appealClerkFormData.finalDecisionComments;
    this.appealClerkModel.outcome = this.outcome;
  }

  // Initializing Form
  initForm(): void {
    this.maxEndDate = moment().subtract(1, 'days').toDate();

    this.appealClerkForm = this.fb.group({
      finalDecision: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      finalDecisionDate: this.fb.group({
        gregorian: [
          null,
          {
            validators: Validators.compose([maxDateValidator(this.maxEndDate)]),
            updateOn: 'blur'
          }
        ],
        hijiri: ['']
      }),
      finalDecisionComments:  ['', Validators.required,  ],
    });
  }

  bindModelToForm(): void {
    const FINAL_DECISION = this.appealFinalDecisionList.find(
      i => i.value.english === this.appealClerkModel.finalDecision.english
    );
    this.appealClerkForm.patchValue({
      finalDecision: {
        english: FINAL_DECISION.code
      },
      finalDecisionComments: this.appealClerkModel.finalDecisionComments,
      finalDecisionDate: {
        gregorian: this.formatDate(this.appealClerkModel.finalDecisionDate),
        hijiri: ''
      }
    });
  }

  /**
   * this methoud for listen on submitting to emit the form value
   */
  setEmitterListener(): void {
    this.notifyFormSubscription = this.formService.listenOnFormToEmitting().subscribe(res => {
      if ([AppealValidatorRoles.Appeal_clerk_private, AppealValidatorRoles.Appeal_clerk_public].includes(res?.type)) {
        if (this.appealClerkForm?.disabled || !this.appealClerkForm) return;

        this.appealClerkForm.updateValueAndValidity();
        this.appealClerkForm.markAllAsTouched();

        if (this.uploadResultofObjectionDocuments[0].size == null) {
          this.noFilesError = true;
          return;
        } else {
          this.noFilesError = false;
        }

        if (this.appealClerkForm.valid) {
          this.mapAppealClerkObject();
          this.formService.updateFormValue(this.appealClerkModel, this.outcome);
          this.appealClerkForm.reset();
        }
      }
    });
  }

  uploadFileofResultObjection($e: any, document: any) {
    // console.log($e);
    // console.log(document);
    // if ($e) {
    //   // let documentContentsList = this.uploadDocuments.map((item) => item.contentId)
    //   console.log(document.contentId);
    //   this.mapAppealClerkObject();
    // }
  }

  formatDate(dateType: Date): Date {
    const date = dateType.toString().split('T')[0];
    const disbDate = moment(date).toDate();
    const offsetdisbDate = moment(moment(disbDate).format('YYYY-MM-DDTHH:mm:ss')).toDate();
    return offsetdisbDate;
  }

  uploadMinutesofMeeting($e: any, document: any) {
    // console.log($e);
    // console.log(document);
    // if ($e) {
    //   // let documentContentsList = this.uploadDocuments.map((item) => item.contentId)
    //   console.log(document.contentId);
    // }
  }

  addResultofObjectionDocument(): void {
    const documentDetails = TransactionConstants.APPEAL_DOCUMENT_DETAILS.find(item => item.actionName == 'canAppeal');
    this.sequenceNumber = this.uploadResultofObjectionDocuments.length + 1;
    const documentItem = new DocumentItem();
    documentItem.uuid = this.uuid;
    documentItem.sequenceNumber = this.sequenceNumber;
    documentItem.fileName = 'Appeal - Result of Objection';
    documentItem.transactionId = documentDetails.transactionId.toString();
    documentItem.documentTypeId = 2519;
    documentItem.name = { arabic: '', english: 'Appeal - Result of Objection' };
    documentItem.required = true;
    this.uploadResultofObjectionDocuments.push(documentItem);
  }

  addMinutesofMeetingDocument(): void {
    const documentDetails = TransactionConstants.APPEAL_DOCUMENT_DETAILS.find(item => item.actionName == 'canAppeal');
    this.sequenceNumber = this.uploadMinutesofMeetingDocuments.length + 1;
    const documentItem = new DocumentItem();
    documentItem.uuid = this.uuid;
    documentItem.sequenceNumber = this.sequenceNumber;
    documentItem.fileName = 'Appeal - Minutes of Meeting';
    documentItem.transactionId = documentDetails.transactionId.toString();
    documentItem.documentTypeId = documentDetails.documentType;
    documentItem.name = { arabic: '', english: 'Appeal - Minutes of Meeting' };
    documentItem.required = true;
    this.uploadMinutesofMeetingDocuments.push(documentItem);
  }

  ngOnDestroy() {
    this.notifyFormSubscription.unsubscribe();
  }
}
