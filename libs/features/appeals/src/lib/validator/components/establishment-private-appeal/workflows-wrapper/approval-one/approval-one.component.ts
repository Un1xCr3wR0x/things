import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Lov, WorkFlowActions } from '@gosi-ui/core';
import { FirstLevelFormService, AppealValidatorRoles, LegalReviewer } from '@gosi-ui/features/appeals/lib/shared';
import { Subscription } from 'rxjs-compat';

@Component({
  selector: 'appeals-approval-one',
  templateUrl: './approval-one.component.html',
  styleUrls: ['./approval-one.component.scss']
})
export class ApprovalOneComponent implements OnInit, OnChanges, OnDestroy {
  @Input() legalOpinionsList: Lov[];
  @Input() appealSearchList: Lov[];
  @Input() approvalModel: LegalReviewer;
  @Input() assignedRole: AppealValidatorRoles;

  approverForm: FormGroup;
  notifyFormSubscription: Subscription;
  outcome: WorkFlowActions;
  maxCharLength = 350;
  isReadOnly = false;

  constructor(private formService: FirstLevelFormService, readonly fb: FormBuilder) {}

  ngOnInit(): void {
    if (!this.approverForm) this.initForm();
    setTimeout(() => {
      this.setEmitterListener();
    }, 2000);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.appealSearchList && this.legalOpinionsList && this.approvalModel?.opinion) {
      if (!this.approverForm) this.initForm();
      this.bindModelToForm();
      if (
        ![AppealValidatorRoles.Legal_reviewer_public, AppealValidatorRoles.Legal_reviewer_private].includes(
          this.assignedRole
        )
      ) {
        this.setDisabledFields();
        this.isReadOnly = true;
      }
    }
  }

  initForm(): void {
    this.approverForm = this.fb.group({
      opinion: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      opinionComments: ['', Validators.required],
      legalOpinion: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      legalOpinionComments: ['', Validators.required]
    });
  }

  mapObject(): void {
    const FormValue = this.approverForm.value;
    this.approvalModel = {} as LegalReviewer;
    this.approvalModel.opinion = FormValue?.opinion.english;
    this.approvalModel.opinionComments = FormValue?.opinionComments;
    this.approvalModel.legalOpinion = FormValue?.legalOpinion.english;
    this.approvalModel.legalOpinionComments = FormValue?.legalOpinionComments;
  }

  onReviewerDecisionChanged(ev: Lov): void {
    if (!ev) return;
    if (+ev?.code === 103) this.outcome = WorkFlowActions.REJECT;
    else this.outcome = WorkFlowActions.APPROVE;
  }

  bindModelToForm(): void {
    const OPINION = this.appealSearchList.find(i => i.value.english === this.approvalModel.opinion?.english);
    const LEGAL_OPINION = this.legalOpinionsList.find(
      i => i.value.english === this.approvalModel.legalOpinion?.english
    );
    this.onReviewerDecisionChanged(LEGAL_OPINION);
    this.approverForm.patchValue({
      opinion: {
        english: OPINION?.code
      },
      opinionComments: this.approvalModel.opinionComments,
      legalOpinion: {
        english: LEGAL_OPINION?.code
      },
      legalOpinionComments: this.approvalModel.legalOpinionComments
    });
  }

  /**
   * this methoud for listen on submitting to emit the form value
   */
  setEmitterListener(): void {
    this.notifyFormSubscription = this.formService.listenOnFormToEmitting().subscribe(res => {
      if (
        [AppealValidatorRoles.Legal_reviewer_public, AppealValidatorRoles.Legal_reviewer_private].includes(res?.type)
      ) {
        if (this.approverForm?.disabled || !this.approverForm) return;

        this.approverForm.updateValueAndValidity();
        this.approverForm.markAllAsTouched();
        if (this.approverForm.valid) {
          this.mapObject();
          this.formService.updateFormValue(this.approvalModel, this.outcome);
          this.approverForm.reset();
        }
      }
    });
  }

  setDisabledFields() {
    this.approverForm.get('opinion.english').disable();
    this.approverForm.get('legalOpinion.english').disable();
  }

  ngOnDestroy() {
    this.notifyFormSubscription.unsubscribe();
  }
}
