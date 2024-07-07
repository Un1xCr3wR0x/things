/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BenefitType } from '../../enums/benefits/benefit-type';

export class StopBenefitHeading {
  //Benefit headings

  //pension (no: 7)
  earlyretirement = 'BENEFITS.EARLY-RETIREMENT-PENSION-BENEFIT-HEADING-STOP';
  hazardousPension = 'BENEFITS.RETIREMENT-PENSION-BENEFIT-HAZARDOUS-STOP';
  jailedContributorPension = 'BENEFITS.JAILED-CONTRIBUTOR-PENSION-BENEFIT-STOP';
  nonOccPensionBenefitType = 'BENEFITS.NON-OCC-DISABILITY-PENSION-BENEFIT-STOP';
  retirementPension = 'BENEFITS.RETIREMENT-PENSION-BENEFIT-STOP';
  occPension = 'BENEFITS.OCC-DISABLILITY-PENSION-BENEFIT-STOP';
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
