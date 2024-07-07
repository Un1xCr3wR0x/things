import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LovList, WorkFlowActions } from '@gosi-ui/core';
import { AppealValidatorRoles, FirstLevelFormService, LegalAuditor } from '@gosi-ui/features/appeals';
import { Subscription } from 'rxjs-compat';

@Component({
  selector: 'appeals-approval-two',
  templateUrl: './approval-two.component.html',
  styleUrls: ['./approval-two.component.scss']
})
export class ApprovalTwoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() legalAuditor: LegalAuditor;
  @Input() agreeOrDisagreeList: LovList;
  @Input() assignedRole: AppealValidatorRoles;
  @Input() isLegalRejected: boolean;

  approverForm: FormGroup;
  notifyFormSubscription: Subscription;
  showAuditorComments: boolean = false;
  outcome: WorkFlowActions = WorkFlowActions.APPROVE;

  constructor(private formService: FirstLevelFormService, readonly fb: FormBuilder) {}

  ngOnInit(): void {
    if (!this.approverForm) this.initForm();

    setTimeout(() => {
      this.setEmitterListener();
    }, 2000);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.approverForm) this.initForm();

    if (this.agreeOrDisagreeList && this.legalAuditor?.auditorDecision != null) {
      this.bindModelToForm();
      if (
        ![AppealValidatorRoles.Legal_auditor_public, AppealValidatorRoles.Legal_auditor_private].includes(
          this.assignedRole
        )
      )
        this.approverForm.disable();
    }

    if (changes.isLegalRejected) {
      if (changes.isLegalRejected?.currentValue) {
        this.outcome = WorkFlowActions.REJECT;
      } else {
        this.outcome = WorkFlowActions.APPROVE;
      }

      this.approverForm.updateValueAndValidity();
    }
  }

  mapObject(): void {
    const FormValue = this.approverForm.value;
    this.legalAuditor = {} as LegalAuditor;
    this.legalAuditor.auditorDecision = FormValue.auditorDecision.english === 'Approve';
    this.legalAuditor.auditorComments = FormValue.auditorComments;
  }

  initForm(): void {
    this.approverForm = this.fb.group({
      auditorDecision: this.fb.group({
        english: ['Approve'],
        arabic: []
      }),
      auditorComments: ['']
    });
  }

  bindModelToForm(): void {
    this.approverForm.patchValue({
      auditorDecision: {
        english: this.getAuditorDecision(this.legalAuditor.auditorDecision)
      },
      auditorComments: this.legalAuditor.auditorComments
    });

    this.onAuditorDecisionChanged(this.legalAuditor.auditorDecision ? 'Approve' : 'Reject');
  }

  // Get Decision Value and Bind to Radio Button
  getAuditorDecision(value: boolean): string {
    if (value) {
      this.showAuditorComments = false;
      return 'Approve';
    } else {
      this.showAuditorComments = true;
      return 'Reject';
    }
  }

  /**
   * this method for listen on submitting to emit the form value
   */
  setEmitterListener(): void {
    this.notifyFormSubscription = this.formService.listenOnFormToEmitting().subscribe(res => {
      if ([AppealValidatorRoles.Legal_auditor_public, AppealValidatorRoles.Legal_auditor_private].includes(res?.type)) {
        if (this.approverForm?.disabled || !this.approverForm) return;
        this.approverForm.updateValueAndValidity();
        this.approverForm.markAllAsTouched();
        if (this.approverForm.valid) {
          this.mapObject();
          this.formService.updateFormValue(this.legalAuditor, this.outcome);
          this.approverForm.reset();
        }
      }
    });
  }

  onAuditorDecisionChanged(state: any) {
    if (state === 'Reject') {
      this.showAuditorComments = true;
      this.approverForm.get('auditorComments')?.setValidators([Validators.required]);
      this.isLegalRejected ? (this.outcome = WorkFlowActions.APPROVE) : (this.outcome = WorkFlowActions.REJECT);
    } else {
      this.showAuditorComments = false;
      this.approverForm.get('auditorComments')?.clearValidators();
      this.approverForm.get('auditorComments')?.updateValueAndValidity();
      this.isLegalRejected ? (this.outcome = WorkFlowActions.REJECT) : (this.outcome = WorkFlowActions.APPROVE);
    }

    this.approverForm.updateValueAndValidity();
  }

  ngOnDestroy() {
    this.notifyFormSubscription.unsubscribe();
  }
}
