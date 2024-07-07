/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BenefitType, HoldBenefitDetails } from '@gosi-ui/features/benefits/lib/shared';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-stop-benefit-details-dc',
  templateUrl: './stop-benefit-details-dc.component.html',
  styleUrls: ['./stop-benefit-details-dc.component.scss']
})
export class StopBenefitDetailsDcComponent implements OnInit, OnChanges {
  isRetirement: boolean;
  isOcc: boolean;
  isNonOcc: boolean;
  isOccLumpsum: boolean;
  BenefitType = BenefitType;
  @Input() stopDetails: HoldBenefitDetails;
  @Input() lang = 'en';
  constructor() {}

  ngOnInit(): void {
    if (this.stopDetails?.pension?.annuityBenefitType?.english === BenefitType.retirementPension) {
      this.isRetirement = true;
    } else if (this.stopDetails?.pension?.annuityBenefitType?.english === BenefitType.occPension) {
      this.isOcc = true;
    } else if (this.stopDetails?.pension?.annuityBenefitType?.english === BenefitType.occLumpsum) {
      this.isOccLumpsum = true;
    } else if (this.stopDetails?.pension?.annuityBenefitType?.english === BenefitType.nonOccPensionBenefit) {
      this.isNonOcc = true;
    } else if (this.stopDetails?.pension?.annuityBenefitType?.english === BenefitType.nonOccLumpsumBenefitType) {
      this.isNonOcc = true;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.stopDetails?.currentValue) {
      if (this.stopDetails?.pension?.annuityBenefitType?.english === BenefitType.retirementPension) {
        this.isRetirement = true;
      } else if (this.stopDetails?.pension?.annuityBenefitType?.english === BenefitType.occPension) {
        this.isOcc = true;
      } else if (this.stopDetails?.pension?.annuityBenefitType?.english === BenefitType.occLumpsum) {
        this.isOccLumpsum = true;
      } else if (this.stopDetails?.pension?.annuityBenefitType?.english === BenefitType.nonOccPensionBenefitType) {
        this.isNonOcc = true;
      } else if (this.stopDetails?.pension?.annuityBenefitType?.english === BenefitType.nonOccLumpsumBenefitType) {
        this.isNonOcc = true;
      }
    }
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
