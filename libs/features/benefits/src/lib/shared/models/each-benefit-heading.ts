/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BenefitType } from '../enum/benefit-type';

export class EachBenefitHeading {
  //Benefit headings

  //pension (no: 7)
  earlyretirement = 'BENEFITS.EARLY-RETIREMENT-PENSION-BENEFIT-HEADING';
  hazardousPension = 'BENEFITS.RETIREMENT-PENSION-BENEFIT-HAZARDOUS';
  jailedContributorPension = 'BENEFITS.JAILED-CONTRIBUTOR-PENSION-BENEFIT';
  nonOccPensionBenefitType = 'BENEFITS.NON-OCC-DISABILITY-PENSION-BENEFIT';
  retirementPension = 'BENEFITS.RETIREMENT-PENSION-BENEFIT';
  occPension = 'BENEFITS.OCC-DISABLILITY-PENSION-BENEFIT';
  heirPension = 'BENEFITS.REQUEST-HEIR-PENSION-BENEFIT';
  heirMissingPension = 'BENEFITS.HEIR-PENSION-MISSING-BENEFIT';
  heirDeathPension = 'BENEFITS.HEIR-PENSION-DEATH-BENEFIT';
  heirDeathPension2 = 'BENEFITS.HEIR-PENSION-DEATH-BENEFIT';
  ui = 'BENEFITS.REQUEST-SANED-VALIDATOR-HEADING';
  oldAgeWomenPension = 'BENEFITS.OLD-AGE-WOMAN-PENSION-BENEFIT';
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
