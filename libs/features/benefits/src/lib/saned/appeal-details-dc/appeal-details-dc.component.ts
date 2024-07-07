import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { LovList, Lov, BilingualText } from '@gosi-ui/core';
import moment from 'moment';
import { BenefitDetails } from '../../shared';

@Component({
  selector: 'bnt-appeal-details-dc',
  templateUrl: './appeal-details-dc.component.html',
  styleUrls: ['./appeal-details-dc.component.scss']
})
export class AppealDetailsDcComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() eligiblePeriod: LovList;
  @Input() reasonForAppeal: Observable<LovList>;
  @Input() benefitCalculation: BenefitDetails;
  @Input() lang = 'en';
  // isShow = false;

  /**
   * Output
   */
  @Output() maxAndMinDateForReqDate: EventEmitter<{ minDate: Date; maxDate: Date }> = new EventEmitter();
  // appealForm: FormGroup;
  formatDate = formatDate;
  appealForm: FormGroup;
  constructor(readonly fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.appealForm = this.getForm();
    if (this.parentForm) {
      if (this.parentForm.get('appealDetails')) {
        this.appealForm.patchValue((this.parentForm.get('appealDetails') as FormGroup).getRawValue());
        this.parentForm.removeControl('appealDetails');
        this.parentForm.addControl('appealDetails', this.appealForm);
      } else {
        this.parentForm.addControl('appealDetails', this.appealForm);
      }

      // if (this.parentForm.get('appealDetails')) this.parentForm.removeControl('appealDetails');
      // this.parentForm.addControl('appealDetails', this.appealForm);
      // this.parentForm.get('appealDetails').updateValueAndValidity();
    }
    this.parentForm.get('appealDetails').updateValueAndValidity();
  }

  periodSelected(period: Lov) {
    this.appealForm.get('periodSelected').patchValue(period.sequence);
    // this.parentForm.get('appealDetails').updateValueAndValidity();
    const minDate = period.value?.english ? moment(period.value.english.split('-')[1], 'DD/MM/YYYY').toDate() : null;
    const maxDate = this.eligiblePeriod.items[period.sequence + 1]
      ? moment(this.eligiblePeriod.items[period.sequence + 1].value?.english?.split('-')[0], 'DD/MM/YYYY').toDate()
      : null;
    this.maxAndMinDateForReqDate.emit({ minDate: minDate, maxDate: maxDate });
  }

  /**
   * create search person form
   */
  getForm(): FormGroup {
    return this.fb.group({
      eligiblePeriod: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      reasonForAppeal: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [null]
      }),
      periodSelected: null, //To get the id of eligibleperiod selected here
      otherReason: null
    });
  }

  reasonSelected(reason: string) {
    if (reason === 'Other') {
      this.appealForm?.get('otherReason').setValidators([Validators.required]);
    } else {
      this.appealForm?.get('otherReason').setErrors(null);
      this.appealForm?.get('otherReason').setValidators(null);
    }
    this.appealForm.updateValueAndValidity();
  }

  getIneligibilityReasons(reasons: BilingualText[]): BilingualText {
    return {
      english: reasons?.map((reason: BilingualText) => reason.english).join(','),
      arabic: reasons?.map((reason: BilingualText) => reason.arabic).join(',')
    };
  }
}
