import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LovList, WorkFlowActions } from '@gosi-ui/core';
import { AppealValidatorRoles, FirstLevelFormService, Executor } from '@gosi-ui/features/appeals/lib/shared';
import { Subscription } from 'rxjs-compat';

@Component({
  selector: 'appeals-executor',
  templateUrl: './executor.component.html',
  styleUrls: ['./executor.component.scss']
})
export class ExecutorComponent implements OnInit {
  @Input() executor: Executor;
  @Input() processedList: LovList;
  @Input() assignedRole: AppealValidatorRoles;

  approverForm: FormGroup;
  notifyFormSubscription: Subscription;
  showComments: boolean = false;
  outcome: WorkFlowActions = WorkFlowActions.APPROVE;
  maxCharLength = 350;
  isReadOnly = false;

  constructor(private formService: FirstLevelFormService, readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    setTimeout(() => {
      this.setEmitterListener();
    }, 2000);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.processedList && this.executor?.executorDecision) {
      if (!this.approverForm) this.initForm();
      this.bindModelToForm();
      if (![AppealValidatorRoles.Executor_private, AppealValidatorRoles.Executor_public].includes(this.assignedRole)) {
        this.setDisabledFields();
        this.isReadOnly = true;
      }
    }
  }

  mapObject(): void {
    this.executor = {} as Executor;
    const FormValue = this.approverForm.value;
    this.executor.executorDecision = FormValue.executorDecision.english === 'Approve';
    this.executor.executorComments = FormValue.executorComments;
  }

  initForm(): void {
    this.approverForm = this.fb.group({
      executorDecision: this.fb.group({
        english: ['Approve'],
        arabic: []
      }),
      executorComments: ['', Validators.required]
    });
  }

  bindModelToForm(): void {
    this.approverForm.patchValue({
      executorDecision: {
        english: this.executor.executorDecision ? ['Approve'] : ['Reject']
      },
      executorComments: this.executor.executorComments
    });
  }

  /**
   * this method for listen on submitting to emit the form value
   */
  setEmitterListener(): void {
    this.notifyFormSubscription = this.formService.listenOnFormToEmitting().subscribe(res => {
      if ([AppealValidatorRoles.Executor_private, AppealValidatorRoles.Executor_public].includes(res?.type)) {
        if (this.approverForm?.disabled || !this.approverForm) return;

        this.approverForm.updateValueAndValidity();
        this.approverForm.markAllAsTouched();
        if (this.approverForm.valid) {
          this.mapObject();
          this.formService.updateFormValue(this.executor, this.outcome);
          this.approverForm.reset();
        }
      }
    });
  }
  setDisabledFields() {
    this.approverForm.get('executorDecision.english').disable();
  }

  ngOnDestroy() {
    this.notifyFormSubscription.unsubscribe();
  }
}
