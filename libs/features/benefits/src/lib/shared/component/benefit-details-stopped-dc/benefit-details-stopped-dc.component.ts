/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BenefitType } from '@gosi-ui/features/payment/lib/shared/enums/benefit-type';
import { AnnuityResponseDto } from '../../models';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-benefit-details-stopped-dc',
  templateUrl: './benefit-details-stopped-dc.component.html',
  styleUrls: ['./benefit-details-stopped-dc.component.scss']
})
export class BenefitDetailsStoppedDcComponent implements OnInit, OnChanges {
  isRetirement: boolean;
  isOcc: boolean;
  isOccLumpsum: boolean;
  @Input() activeBenefitDetails: AnnuityResponseDto;
  @Input() benefitType: BenefitType;
  @Input() lang = 'en';

  @Output() onViewBenefitDetails = new EventEmitter();
  BenefitType = BenefitType;

  constructor() {}

  ngOnInit(): void {
    if (
      this.benefitType === BenefitType.retirementPension ||
      this.benefitType === BenefitType.jailedContributorPension ||
      this.benefitType === BenefitType.hazardousPension ||
      this.benefitType === BenefitType.earlyretirement
    ) {
      this.isRetirement = true;
    } else if (this.benefitType === BenefitType.occPension) {
      this.isOcc = true;
    } else if (this.benefitType === BenefitType.occLumpsum) {
      this.isOccLumpsum = true;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.benefitType?.currentValue) {
      if (this.benefitType === BenefitType.retirementPension) {
        this.isRetirement = true;
      } else if (this.benefitType === BenefitType.occPension) {
        this.isOcc = true;
      } else if (this.benefitType === BenefitType.occLumpsum) {
        this.isOccLumpsum = true;
      }
    }
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
  viewBenefitDetails() {
    this.onViewBenefitDetails.emit();
  }
}
