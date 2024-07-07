/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BenefitType } from '../../enums/benefits/benefit-type';

export class RestartBenefitHeading {
  //Benefit headings

  //pension (no: 7)
  earlyretirement = 'BENEFITS.RESTART-EARLY-RETIREMENT-PENSION-BENEFIT-HEADING';
  hazardousPension = 'BENEFITS.RESTART-RETIREMENT-PENSION-BENEFIT-HAZARDOUS';
  jailedContributorPension = 'BENEFITS.RESTART-JAILED-CONTRIBUTOR-PENSION-BENEFIT';
  nonOccPensionBenefitType = 'BENEFITS.RESTART-NON-OCC-DISABILITY-PENSION-BENEFIT';
  retirementPension = 'BENEFITS.RESTART-RETIREMENT-PENSION-BENEFIT';
  occPension = 'BENEFITS.RESTART-OCC-DISABLILITY-PENSION-BENEFIT';
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
