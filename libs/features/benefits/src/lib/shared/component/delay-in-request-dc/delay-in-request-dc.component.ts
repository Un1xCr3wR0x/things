/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { LovList } from '@gosi-ui/core';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { LateRequestDetails } from '../../models';
import { BenefitConstants } from '../../constants';

@Component({
  selector: 'bnt-delay-in-request-dc',
  templateUrl: './delay-in-request-dc.component.html',
  styleUrls: ['./delay-in-request-dc.component.scss']
})
export class DelayInRequestDcComponent implements OnInit {
  benefitValues = BenefitConstants;

  @Input() lateRequestDetails: LateRequestDetails;
  @Input() parentForm: FormGroup;
  @Input() listYesNo$: Observable<LovList>;
  @Input() isEdit = false;
  @Input() isNonOcc = false;
  @Input() isFuneral = false;
  @Input() systemParameter: SystemParameter;

  reasonForm: FormGroup;

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.reasonForm = this.fb.group({
      bypassTheDelay: this.fb.group({
        english: ['No', { validators: Validators.required }],
        arabic: null
      })
    });
    if (this.parentForm) {
      if (this.parentForm.get('delayInRequest')) this.parentForm.removeControl('delayInRequest');
      this.parentForm.addControl('delayInRequest', this.reasonForm);
    }
  }
}
