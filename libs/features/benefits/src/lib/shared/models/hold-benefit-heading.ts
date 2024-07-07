/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BenefitType } from '../enum/benefit-type';

export class HoldBenefitHeading {
  //Benefit headings

  //pension (no: 7)
  earlyretirement = 'BENEFITS.EARLY-RETIREMENT-PENSION-BENEFIT-HEADING-HOLD';
  hazardousPension = 'BENEFITS.RETIREMENT-PENSION-BENEFIT-HAZARDOUS-HOLD';
  jailedContributorPension = 'BENEFITS.JAILED-CONTRIBUTOR-PENSION-BENEFIT-HOLD';
  nonOccPensionBenefitType = 'BENEFITS.NON-OCC-DISABILITY-PENSION-BENEFIT-HOLD';
  retirementPension = 'BENEFITS.RETIREMENT-PENSION-BENEFIT-HOLD';
  occPension = 'BENEFITS.OCC-DISABLILITY-PENSION-BENEFIT-HOLD';
  oldAgeWomenPension = 'BENEFITS.OLD-AGE-WOMAN-PENSION-BENEFIT-HOLD';
  benefitType: string;

  constructor(btype: string) {
    this.benefitType = btype;
  }

  getHeading() {
    const key = this.getEnumKeyByEnumValue(BenefitType, this.benefitType);
    return this[key] || '';
  }

  getEnumKeyByEnumValue(myEnum, enumValue) {
    const keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
  }
}
