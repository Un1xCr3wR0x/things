/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BenefitConstants } from '../../../shared';

@Component({
  selector: 'bnt-disability-details-dc',
  templateUrl: './disability-details-dc.component.html',
  styleUrls: ['./disability-details-dc.component.scss']
})
export class DisabilityDetailsDcComponent implements OnInit {
  disabilityDescriptionForm: FormGroup;
  disabilityMaxLength = BenefitConstants.DESCRIPTION_MAX_LENGTH;
  @Input() parentForm: FormGroup;
  @Input() isValidator: boolean;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
