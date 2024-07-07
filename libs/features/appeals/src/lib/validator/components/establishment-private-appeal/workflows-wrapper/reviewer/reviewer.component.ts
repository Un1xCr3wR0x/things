import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lov, LovList, WorkFlowActions } from '@gosi-ui/core';
import { AppealValidatorRoles, FirstLevelFormService, Reviewer } from '@gosi-ui/features/appeals/lib/shared';
import { Subscription } from 'rxjs-compat';

@Component({
  selector: 'appeals-reviewer',
  templateUrl: './reviewer.component.html',
  styleUrls: ['./reviewer.component.scss']
})
export class ReviewerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() approveOrRejectList: LovList;
  @Input() legalOpinionsList: Lov[];
  @Input() reviewModel: Reviewer = {} as Reviewer;
  @Input() assignedRole: AppealValidatorRoles;

  reviewerForm: FormGroup;
  notifyFormSubscription: Subscription;
  outcome: WorkFlowActions;
  maxCharLength = 350;
  isReadOnly = false;
  constructor(private formService: FirstLevelFormService, readonly fb: FormBuilder) {}

  ngOnInit(): void {
    if (!this.reviewerForm) this.initForm();

    setTimeout(() => {
      this.setEmitterListener();
    }, 2000);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.legalOpinionsList && this.reviewModel?.reviewerDecision) {
      if (!this.reviewerForm) this.initForm();
      this.bindModelToForm();
      if (
        ![AppealValidatorRoles.IS_reviewer_private, AppealValidatorRoles.IS_reviewer_public].includes(this.assignedRole)
      ) {
        this.setDisabledFields();
        this.isReadOnly = true;
      }
    }
  }

  adjustModelAndEmit(): void {
    this.mapReviewObject();
    this.formService.updateFormValue(this.reviewModel, this.outcome);
    this.reviewerForm.reset();
  }

  mapReviewObject(): void {
    const reviewFormData = this.reviewerForm.value;
    this.reviewModel = {} as Reviewer;
    this.reviewModel.reviewerIsAcceptedFormally = reviewFormData.reviewerIsAcceptedFormally.english === 'Approve';
    this.reviewModel.reviewerComments = reviewFormData.reviewerComments;
    this.reviewModel.reviewerIsAcceptedObjectively = reviewFormData.reviewerIsAcceptedObjectively.english === 'Approve';
    this.reviewModel.reviewerObjectionComments = reviewFormData.reviewerObjectionComments;
    this.reviewModel.reviewerDecision = reviewFormData.reviewerDecision?.english;
  }

  onReviewerDecisionChanged(ev: Lov): void {
    if (!ev) return;
    if (+ev?.code === 103) this.outcome = WorkFlowActions.REJECT;
    else this.outcome = WorkFlowActions.APPROVE;
  }

  bindModelToForm() {
    const REVIEWER_DECISION = this.legalOpinionsList.find(
      i => i.value.english === this.reviewModel.reviewerDecision.english
    );

    this.onReviewerDecisionChanged(REVIEWER_DECISION);

    this.reviewerForm?.patchValue({
      reviewerIsAcceptedFormally: {
        english: this.reviewModel.reviewerIsAcceptedFormally ? 'Approve' : 'Reject'
      },
      reviewerComments: this.reviewModel.reviewerComments,
      reviewerIsAcceptedObjectively: {
        english: this.reviewModel.reviewerIsAcceptedObjectively ? 'Approve' : 'Reject'
      },
      reviewerObjectionComments: this.reviewModel.reviewerObjectionComments,
      reviewerDecision: {
        english: REVIEWER_DECISION.code
      }
    });
  }

  initForm(): void {
    this.reviewerForm = this.fb.group({
      reviewerIsAcceptedFormally: this.fb.group({
        english: ['Approve'],
        arabic: []
      }),
      reviewerComments: ['', Validators.required],
      reviewerIsAcceptedObjectively: this.fb.group({
        english: ['Approve'],
        arabic: []
      }),
      reviewerObjectionComments: ['', Validators.required],
      reviewerDecision: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      })
    });
  }

  /**
   * this method for listen on submitting to emit the form value
   */
  setEmitterListener(): void {
    this.notifyFormSubscription = this.formService.listenOnFormToEmitting().subscribe(res => {
      if ([AppealValidatorRoles.IS_reviewer_private, AppealValidatorRoles.IS_reviewer_public].includes(res?.type)) {
        if (this.reviewerForm?.disabled || !this.reviewerForm) return;
        this.reviewerForm.markAllAsTouched();
        this.reviewerForm.updateValueAndValidity();
        if (this.reviewerForm.valid) this.adjustModelAndEmit();
      }
    });
  }

  setDisabledFields() {
    this.reviewerForm.get('reviewerIsAcceptedFormally.english').disable();
    this.reviewerForm.get('reviewerIsAcceptedObjectively.english').disable();
    this.reviewerForm.get('reviewerDecision.english').disable();
  }

  ngOnDestroy() {
    this.notifyFormSubscription.unsubscribe();
  }
}
