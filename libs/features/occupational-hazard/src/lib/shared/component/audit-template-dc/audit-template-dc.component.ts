import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstants, LovList, scrollToModalError } from '@gosi-ui/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'oh-audit-template-dc',
  templateUrl: './audit-template-dc.component.html',
  styleUrls: ['./audit-template-dc.component.scss']
})
export class AuditTemplateDcComponent implements OnInit, OnDestroy, OnChanges {
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() auditReasonList$: Observable<LovList> = null;
  @Input() audit = false;
  heading = 'OCCUPATIONAL-HAZARD.CLAIMS-VALIDATOR.ASSIGN-AUDIT';
  //Local Variables
  auditForm: FormGroup = new FormGroup({});
  showmandatory = false;

  //OUtput Variables
  @Output() auditEvent: EventEmitter<null> = new EventEmitter();
  @Output() cancelEvent: EventEmitter<null> = new EventEmitter();
  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.showmandatory = false;
    this.auditForm = this.createAuditForm();
    if (this.parentForm) {
      this.parentForm.addControl('auditForm', this.auditForm);
    }
  }
  commentsSelection() {
    this.auditForm.get('auditComments').clearValidators();
    if (this.auditForm.get('auditReason').get('english').value === 'Others') {
      this.auditForm.get('auditComments').setValidators(Validators.required);
    } else {
      this.auditForm.get('auditComments').clearValidators();
    }
    this.auditForm.get('auditComments').markAsUntouched();
    this.auditForm.get('auditComments').markAsPristine();
    this.auditForm.get('auditComments').updateValueAndValidity();
  }
  /** This method is to reject transaction */
  confirmAuditDetails() {
    this.showmandatory = false;
    if (this.auditForm.valid) {
      this.auditEvent.emit();
    } else {
      this.parentForm.markAllAsTouched();
      this.parentForm.updateValueAndValidity();
      this.showmandatory = true;
      scrollToModalError();
    }
  }
  /** This method is to clear transaction */
  ngOnDestroy() {
    this.parentForm.removeControl('auditForm');
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.audit) {
      this.audit = changes.audit.currentValue;
      if (this.audit) {
        this.heading = 'OCCUPATIONAL-HAZARD.CLAIMS-VALIDATOR.MARK-AUDIT';
      }
    }
  }
  // Method to emit cancel details

  cancelEventDetails() {
    this.showmandatory = false;
    this.cancelEvent.emit();
  }
  createAuditForm() {
    return this.fb.group({
      auditComments: [null],
      auditReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null, { validators: Validators.required }]
      })
    });
  }
}
