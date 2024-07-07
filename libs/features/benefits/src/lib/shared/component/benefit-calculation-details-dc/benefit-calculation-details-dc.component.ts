/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BenefitType } from '../../enum/benefit-type';
import { BenefitDetails } from '../../models/benefit-details';

@Component({
  selector: 'bnt-benefit-calculation-details-dc',
  templateUrl: './benefit-calculation-details-dc.component.html',
  styleUrls: ['./benefit-calculation-details-dc.component.scss']
})
export class BenefitCalculationDetailsDcComponent implements OnInit {
  islessthan = false;
  ispercentage = false;
  isOcc: boolean;
  @Input() benefitType: string;
  @Input() benefitDetails: BenefitDetails;
  @Output() close = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    if (this.benefitType === BenefitType.occPension || this.benefitType === BenefitType.occLumpsum) {
      this.isOcc = true;
    }
  }
  closeModal() {
    this.close.emit();
  }
}
