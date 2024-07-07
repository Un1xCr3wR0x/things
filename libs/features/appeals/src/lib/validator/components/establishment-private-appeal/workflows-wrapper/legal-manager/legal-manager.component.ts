import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Lov, WorkFlowActions } from '@gosi-ui/core';
import { FirstLevelFormService, AppealValidatorRoles, LegalReviewer } from '@gosi-ui/features/appeals/lib/shared';
import { LegalManager } from '@gosi-ui/features/appeals/lib/shared/models/employees/legal-manager';
import { Subscription } from 'rxjs-compat';

@Component({
  selector: 'appeals-legal-manager',
  templateUrl: './legal-manager.component.html',
  styleUrls: ['./legal-manager.component.scss']
})
export class LegalManagerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() legalOpinionsList: Lov[];
  @Input() appealSearchList: Lov[];
  @Input() legalManagerModel: LegalManager = {} as LegalManager;
  @Input() assignedRole: AppealValidatorRoles;
  @Input() legalReviewerModel: LegalReviewer;

  legalManagerForm: FormGroup;
  notifyFormSubscription: Subscription;
  outcome: WorkFlowActions;
  maxCharLength = 350;

  constructor(private formService: FirstLevelFormService, readonly fb: FormBuilder) {}

  ngOnInit(): void {
    if (!this.legalManagerForm) this.initForm();
    setTimeout(() => {
      this.setEmitterListener();
    }, 2000);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.legalOpinionsList && this.appealSearchList && this.legalManagerModel?.finalLegalOpinion) {
      if (!this.legalManagerForm) this.initForm();
      this.bindModelToForm();
      if (
        ![AppealValidatorRoles.Legal_manager_private, AppealValidatorRoles.Legal_manager_public].includes(
          this.assignedRole
        )
      )
        this.legalManagerForm.disable();
    }

    if (
      this.legalOpinionsList &&
      this.appealSearchList &&
      this.legalReviewerModel?.opinion &&
      [AppealValidatorRoles.Legal_manager_private, AppealValidatorRoles.Legal_manager_public].includes(
        this.assignedRole
      )
    ) {
      this.bindLegalReviewerModelToForm();
    }
  }

  initForm(): void {
    this.legalManagerForm = this.fb.group({
      finalOpinion: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      finalOpinionComments: ['', Validators.required,  ],
      finalLegalOpinion: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      finalLegalOpinionComments: ['', Validators.required,  ]
    });
  }

  onFinalLegalOpinionChanged(ev: Lov): void {
    if (!ev) return;
    if (+ev?.code === 103) this.outcome = WorkFlowActions.REJECT;
    else this.outcome = WorkFlowActions.APPROVE;
  }

  bindModelToForm(): void {
    const OPINION = this.appealSearchList.find(i => i.value.english === this.legalManagerModel.finalOpinion?.english);
    const LEGAL_OPINION = this.legalOpinionsList.find(
      i => i.value.english === this.legalManagerModel.finalLegalOpinion?.english
    );
    this.onFinalLegalOpinionChanged(LEGAL_OPINION);
    this.legalManagerForm.patchValue({
      finalOpinion: {
        english: OPINION?.code
      },
      finalOpinionComments: this.legalManagerModel.finalOpinionComments,
      finalLegalOpinion: {
        english: LEGAL_OPINION?.code
      },
      finalLegalOpinionComments: this.legalManagerModel.finalLegalOpinionComments
    });
  }

  bindLegalReviewerModelToForm(): void {
    const OPINION = this.appealSearchList.find(i => i.value.english === this.legalReviewerModel.opinion?.english);
    const LEGAL_OPINION = this.legalOpinionsList.find(
      i => i.value.english === this.legalReviewerModel.legalOpinion?.english
    );
    this.onFinalLegalOpinionChanged(LEGAL_OPINION);
    this.legalManagerForm.patchValue({
      finalOpinion: {
        english: OPINION?.code
      },
      finalOpinionComments: this.legalReviewerModel.opinionComments,
      finalLegalOpinion: {
        english: LEGAL_OPINION?.code
      },
      finalLegalOpinionComments: this.legalReviewerModel.legalOpinionComments
    });
  }

  mapObject(): void {
    const FormValue = this.legalManagerForm.value;
    this.legalManagerModel = {} as LegalManager;
    this.legalManagerModel.finalOpinion = FormValue?.finalOpinion.english;
    this.legalManagerModel.finalOpinionComments = FormValue?.finalOpinionComments;
    this.legalManagerModel.finalLegalOpinion = FormValue?.finalLegalOpinion.english;
    this.legalManagerModel.finalLegalOpinionComments = FormValue?.finalLegalOpinionComments;
  }

  /**
   * this methoud for listen on submitting to emit the form value
   */
  setEmitterListener(): void {
    this.notifyFormSubscription = this.formService.listenOnFormToEmitting().subscribe(res => {
      if ([AppealValidatorRoles.Legal_manager_private, AppealValidatorRoles.Legal_manager_public].includes(res?.type)) {
        if (this.legalManagerForm?.disabled || !this.legalManagerForm) return;

        this.legalManagerForm.updateValueAndValidity();
        this.legalManagerForm.markAllAsTouched();
        if (this.legalManagerForm.valid) {
          this.mapObject();
          this.formService.updateFormValue(this.legalManagerModel, this.outcome);
          this.legalManagerForm.reset();
        }
      }
    });
  }

  ngOnDestroy() {
    this.notifyFormSubscription.unsubscribe();
  }
}
