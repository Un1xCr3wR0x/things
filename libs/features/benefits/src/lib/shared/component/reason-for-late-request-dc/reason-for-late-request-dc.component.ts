/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LateRequestDetails } from '../../models';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { BenefitConstants } from '../../constants/benefit-constants';

@Component({
  selector: 'bnt-reason-for-late-request-dc',
  templateUrl: './reason-for-late-request-dc.component.html',
  styleUrls: ['./reason-for-late-request-dc.component.scss']
})
export class ReasonForLateRequestDcComponent implements OnInit, OnChanges, OnDestroy {
  /*Input Variables*/
  @Input() parentForm: FormGroup;
  @Input() lateRequestDetails: LateRequestDetails;
  @Input() systemParameter: SystemParameter;
  @Input() isNonOcc = false;

  delayedMonths = 0;
  reasonMaxLength = BenefitConstants.DESCRIPTION_MAX_LENGTH;
  reasonForm: FormGroup;

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.reasonForm = this.getForm();
    if (this.parentForm) {
      if (this.parentForm.get('reasonForLateRequest')) {
        this.reasonForm.patchValue((this.parentForm.get('reasonForLateRequest') as FormGroup).getRawValue());
        this.parentForm.removeControl('reasonForLateRequest');
        this.parentForm.addControl('reasonForLateRequest', this.reasonForm);
      } else {
        this.parentForm.addControl('reasonForLateRequest', this.reasonForm);
      }
      this.parentForm.get('reasonForLateRequest').updateValueAndValidity();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.lateRequestDetails && changes.lateRequestDetails.currentValue) {
      if (changes.lateRequestDetails.currentValue.reason) {
        this.createForm();
        if (this.reasonForm.get('reason')) {
          this.reasonForm.get('reason').patchValue(changes.lateRequestDetails.currentValue.reason);
        }
      }
    }
    if (changes && changes.systemParameter) {
      if (this.isNonOcc) {
        this.delayedMonths = this.systemParameter.BACKDATED_NON_OCC_PENSION_REQUEST_IN_MONTHS;
      } else {
        this.delayedMonths = this.systemParameter.BACKDATED_PENSION_REQUEST_IN_MONTHS;
      }
    }
  }

  /**
   * create search person form
   */
  getForm(): FormGroup {
    if (!this.reasonForm) {
      return this.fb.group({
        reason: [null, { validators: Validators.required, updateOn: 'blur' }]
      });
    } else {
      return this.reasonForm;
    }
  }

  ngOnDestroy(): void {
    this.parentForm.removeControl('reasonForLateRequest');
  }
}
