import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { LovList } from '@gosi-ui/core';
import { ReturnLumpsumDetails, BenefitConstants } from '../../../..//shared';

@Component({
  selector: 'bnt-restore-reason-dc',
  templateUrl: './restore-reason-dc.component.html',
  styleUrls: ['./restore-reason-dc.component.scss']
})
export class RestoreReasonDcComponent implements OnInit, OnChanges {
  restoreReasonsForm: FormGroup;
  restoreEditModeForm: FormGroup;
  currentReasonMode: string;
  repayNotesMaxLength = BenefitConstants.REPAY_NOTES_MAX_LENGTH;

  @Input() parentForm: FormGroup;
  @Input() reasonList: LovList;

  @Input() isAppPrivate: boolean;
  @Input() inRestoreMode: boolean;
  @Input() documentuuid: string;

  @Input() inRestoreEditMode: boolean;
  @Input() restorationDetails: ReturnLumpsumDetails;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.restoreEditModeForm = this.createRestorationLumpsumForm();
    this.parentForm.addControl('editform', this.restoreEditModeForm);
  }

  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.restorationDetails && changes.restorationDetails.currentValue) {
      this.bindReasonDetailsToForm(this.restorationDetails, this.restoreEditModeForm);
    }
    if (changes && changes.reasonList && changes.reasonList.currentValue) {
      this.reasonList = changes.reasonList.currentValue;
    }
  }
  createRestorationLumpsumForm() {
    return this.fb.group({
      restorationNotes: [null, { validators: Validators.required }],
      restorationReasons: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  /**
   * Bind reasons to form on edit mode.
   * @param data receipt details.
   * @param formGroup form group.
   */
  bindReasonDetailsToForm(data: ReturnLumpsumDetails, formGroup: FormGroup) {
    formGroup.get('restorationReasons.english').setValue(data.reasonForEnableRestoration.english);
    formGroup.get('restorationNotes').setValue(data.notesForEnableRestoration);
    formGroup.updateValueAndValidity();
  }

  /**
   * Method to disable form control.
   * @param formControl form control
   */
  disableField(formControl: AbstractControl) {
    formControl.setValue(null);
    //formControl.disable();
    formControl.clearValidators();
    formControl.markAsPristine();
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
  }
  /**
   * Nethod to enable form control.
   * @param formControl form control
   */
  enableField(formControl: AbstractControl) {
    formControl.setValue(null);
    formControl.setValidators([Validators.required]);
    //formControl.enable();
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
  }
}
