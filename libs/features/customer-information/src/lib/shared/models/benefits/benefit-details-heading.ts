/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BenefitType } from '../../enums/benefits/benefit-type';

export class BenefitDetailsHeading {
  //pension (no: 7)
  earlyretirement = 'BENEFITS.EARLY-RETIREMENT-PENSION';
  hazardousPension = 'BENEFITS.HAZARDOUS-PENSION-BENEFIT-DETAILS';
  heirPension = 'BENEFITS.REQUEST-HEIR-PENSION-BENEFIT';
  heirBenefit = 'BENEFITS.HEIR-BENEFIT-DETAIL';
  heirMissingPension = 'BENEFITS.HEIR-PENSION-MISSING-BENEFIT';
  heirMissingLumpsum = 'BENEFITS.HEIR-LUMPSUM-MISSING-DETAILS';
  heirDeathPension = 'BENEFITS.HEIR-PENSION-DEATH-BENEFIT';
  heirDeathPension2 = 'BENEFITS.HEIR-PENSION-DEATH-BENEFIT-DETAILS';
  heirLumpsumDeadContributor = 'BENEFITS.HEIR-LUMPSUM-DEAD-CONTRIBUTOR-DETAILS';
  jailedContributorPension = 'BENEFITS.JAILED-CONTRIBUTOR-PESION-BENEFIT';
  nonOccPensionBenefitType = 'BENEFITS.NON-OCC-PENSION-DETAILS';
  occPension = 'BENEFITS.OCC-PENSION-DISABILITY-BENEFIT-DETAILS';
  // TODO: remove dupicate from below
  retirementPension = 'BENEFITS.RETIREMENT-PENSION';
  retirementPensionType = 'BENEFITS.RETIREMENT-PENSION'; //this will be removed

  //lumpsum (no:7)
  hazardousLumpsum = 'BENEFITS.HAZARDOUS-LUMPSUM-BENEFIT-DETAILS';
  heirLumpsum = 'BENEFITS.HEIR-LUMPSUM-BENEFIT-DETAILS';
  jailedContributorLumpsum = 'BENEFITS.JAILED-CONTRIBUTOR-LUMPSUM-BENEFIT';
  lumpsum = 'Lumpsum Benefit'; //TO DO: remove duplicate from Retirement Lumpsum
  nonOccLumpsumBenefitType = 'BENEFITS.NON-OCC-LUMPSUM-DETAILS';
  occLumpsum = 'BENEFITS.OCC-LUMPSUM-DISABILITY-BENEFIT-DETAILS';
  nonOcc = 'BENEFITS.NON-OCC-DISABILITY-BENEFIT-DETAILS';
  //TO DO: remove duplicate from Retirement Lumpsum
  retirementLumpsum = 'BENEFITS.RETIREMENT-LUMSPUM-PENSION';
  retirementLumpsumType = 'BENEFITS.RETIREMENT-LUMSPUM-PENSION'; // this will be removed
  womanLumpsum = 'BENEFITS.WOMAN-LUMPSUM-BENEFIT-DETAILS';
  funeralGrant = 'BENEFITS.FUNERAL-GRANT-DETAILS';
  //Modify Benefit Retirement Pension
  modifyBenefit = 'BENEFITS.MODIFY-DEPENDENTS-RETIREMENT-PENSION-DETAILS';
  //other
  ui = 'BENEFITS.REQUEST-SANED-VALIDATOR-HEADING';
  oh = 'Occupational Disability Benefits';
  NonOccDisabilityBenefitsType = 'BENEFITS.NON-OCC-DISABILITY-BENEFIT-DETAILS';
  oldAgeWomenLumpsum = 'BENEFITS.OLD-AGE-RETIREMENT-LUMPSUM-BENEFIT-DETAILS';
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
