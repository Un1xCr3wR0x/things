/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BenefitType } from '../enum/benefit-type';

export class ModifyDepentsHeadingTypes {
  //pension tpes and it's headings
  earlyretirement = 'BENEFITS.MODIFY-EARLT-RETIREMENT-PENSION';
  hazardousPension = 'BENEFITS.MODIFY-HAZARDOUS-PENSION';
  heirMissingPension = 'BENEFITS.ADD-MODIFY-HEIR-MISSING-PENSION-PENSION';
  heirDeathPension = 'BENEFITS.ADD-MODIFY-HEIR-DEATH-PENSION-PENSION';
  heirDeathPension2 = 'BENEFITS.ADD-MODIFY-HEIR-DEATH-PENSION-PENSION';
  jailedContributorPension = 'BENEFITS.MODIFY-JAILED-PENSION';
  nonOccPensionBenefitType = 'BENEFITS.NONOCC-PENSION-BENEFIT-HEADING';
  retirementPension = 'BENEFITS.REQUEST-RETIREMENT-PENSION';
  retirementPensionType = 'BENEFITS.REQUEST-RETIREMENT-PENSION'; //this will be removed

  benefitType: string;

  constructor(btype: string) {
    this.benefitType = btype;
  }

  getHeading() {
    //BenefitType is enum and this.benefitType is the passed value
    const key = this.getEnumByEnumvalue(BenefitType, this.benefitType);
    return this[key] || '';
  }

  getEnumByEnumvalue(myEnum, enumValue) {
    const keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
  }
}
