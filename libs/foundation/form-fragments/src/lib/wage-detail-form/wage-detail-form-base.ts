/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent, wageValidator } from '@gosi-ui/core';

/**
 * This class is the base for base detail form
 */
export abstract class WageDetailFormBase extends BaseComponent {
  /**
   * This method is to initiate WageDetailFormBase
   * @param fb
   */
  constructor(public fb: FormBuilder) {
    super();
  }

  /**
   * This method is used to create wage details form
   */
  createWageDetailsForm(isPpa = false): FormGroup {
    return this.fb.group({
      formSubmissionDate: this.fb.group({
        gregorian: [null],
        hijiri: ['']
      }),
      startDate: this.fb.group({
        gregorian: [null, Validators.required],
        hijiri: ['', { validators: isPpa ? Validators.required : null, updateOn: 'blur' }],
        entryFormat: [null]
      }),
      endDate: this.fb.group({
        gregorian: [null],
        hijiri: [''],
        entryFormat: [null]
      }),

      wage: this.fb.group({
        basicWage: [
          parseFloat('0.00').toFixed(2),
          { validators: !isPpa ? [Validators.required, wageValidator] : Validators.required, updateOn: 'blur' }
        ],
        commission: [parseFloat('0.00').toFixed(2)],
        housingBenefit: [parseFloat('0.00').toFixed(2)],
        otherAllowance: [parseFloat('0.00').toFixed(2)],
        contributoryWage: [parseFloat('0').toFixed(2), {}],
        totalWage: [parseFloat('0').toFixed(2), { validators: Validators.required, updateOn: 'blur' }]
      }),
      occupation: this.fb.group({
        english: [null, { validators: !isPpa ? Validators.required : null, updateOn: 'blur' }],
        arabic: [null]
      }),
      contributorAbroad: this.fb.group({
        english: ['No', { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      jobClassName: this.fb.group({
        english: [null, { validators: isPpa ? Validators.required : null, updateOn: 'blur' }],
        arabic: [null]
      }),
      jobGradeName: this.fb.group({
        english: [null, { validators: isPpa ? Validators.required : null, updateOn: 'blur' }],
        arabic: [null]
      }),
      jobRankName: this.fb.group({
        english: [null, { validators: isPpa ? Validators.required : null, updateOn: 'blur' }],
        arabic: [null]
      }),
      jobClassCode: null,
      jobRankCode: null,
      jobGradeCode: null
    });
  }

  /**
   * This method is used to calculate total wage
   */
  calculateTotalWage(updateWageForm: FormGroup) {
    const wageValues = updateWageForm.getRawValue();
    let totalWage = 0;
    let contributoryWage = 0;
    if (wageValues.wage.basicWage) {
      totalWage += parseFloat(wageValues.wage.basicWage);
      contributoryWage += parseFloat(wageValues.wage.basicWage);
    }
    if (wageValues.wage.commission) {
      totalWage += parseFloat(wageValues.wage.commission);
      contributoryWage += parseFloat(wageValues.wage.commission);
    }
    if (wageValues.wage.housingBenefit) {
      totalWage += parseFloat(wageValues.wage.housingBenefit);
      contributoryWage += parseFloat(wageValues.wage.housingBenefit);
    }
    if (wageValues.wage.otherAllowance) {
      totalWage += parseFloat(wageValues.wage.otherAllowance);
    }
    updateWageForm.get('wage').patchValue({
      totalWage: totalWage.toFixed(2)
    });
    updateWageForm.get('wage').patchValue({
      contributoryWage: contributoryWage.toFixed(2)
    });
  }
}
