/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { FormBuilder, Validators } from '@angular/forms';
export class PenaltyWaiverForm {
  fb: FormBuilder = new FormBuilder();
  public createGracePeriodForm() {
    return this.fb.group({
      extensionReason: [null, { validators: Validators.required }],
      extendedGracePeriod: [5, { validators: Validators.compose([Validators.pattern('[1-7]'), Validators.required]) }],
      exceptionalGracePeriod: [true ? 5 : 2, { validators: Validators.required }]
    });
  }
  public createPenaltyWaiverDetailsForm() {
    return this.fb.group({
      gracePeriod: [5, { validators: Validators.required }]
    });
  }
  public commentForm() {
    return this.fb.group({
      comments: null
    });
  }
  createCheckForm() {
    return this.fb.group({
      checkBoxFlag: [true, { validators: Validators.required }]
    });
  }
  createWaivePeriodForm() {
    return this.fb.group({
      waiveOffEligible: [
        '',
        { validators: Validators.compose([Validators.min(1), Validators.max(100), Validators.required]) }
      ]
    });
  }
}
