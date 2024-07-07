/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BenefitType } from '../enum/benefit-type';

export class ReturnBenefitTypeLabels {
  benefitType: string;

  /**return lumpsum headings */
  womanLumpsum = 'BENEFITS.WOMAN-LUMPSUM-BENEFIT-DETAILS';
  retirementLumpsum = 'BENEFITS.RETIREMENT-LUMSPUM-PENSION';
  hazardousLumpsum = 'BENEFITS.HAZARDOUS-LUMPSUM-BENEFIT-DETAILS';
  heirLumpsum = 'BENEFITS.HEIR-LUMPSUM-BENEFIT-DETAILS';
  jailedContributorLumpsum = 'BENEFITS.JAILED-CONTRIBUTOR-LUMPSUM-BENEFIT';
  //lumpsum = 'Lumpsum Benefit';
  nonOccLumpsumBenefitType = 'BENEFITS.NON-OCC-LUMPSUM-DETAILS';
  occLumpsum = 'BENEFITS.OCC-LUMPSUM-DISABILITY-BENEFIT-DETAILS';

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
