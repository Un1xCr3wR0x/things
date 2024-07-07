/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BenefitType } from '../../enums/benefits/benefit-type';

export class BenefitTypeLabels {
  //pension (no: 7)
  earlyretirement = 'BENEFITS.REQUEST-EARLY-RETIREMENT-PENSION-BENEFIT';
  hazardousPension = 'BENEFITS.REQUEST-HAZARDOUS-PENSION-BENEFIT';
  heirPension = 'BENEFITS.REQUEST-HEIR-PENSION-BENEFIT';
  heirMissingPension = 'BENEFITS.REQUEST-HEIR-PENSION-BENEFIT'; // Heir Pension Missing Contributor Benefit is changed as Request Heir Pension Benefit
  heirDeathPension = 'BENEFITS.HEIR-PENSION-DEATH-BENEFIT';
  heirDeathPension2 = 'BENEFITS.HEIR-PENSION-DEATH-BENEFIT';
  jailedContributorPension = 'BENEFITS.REQUEST-JAILED-PENSION-BENEFIT';
  nonOccPensionBenefitType = 'BENEFITS.NONOCC-PENSION-BENEFIT-HEADING';
  // TODO: remove dupicate from below
  retirementPension = 'BENEFITS.REQUEST-RETIREMENT-PENSION';
  retirementPensionType = 'BENEFITS.REQUEST-RETIREMENT-PENSION'; //this will be removed
  nonOcc = 'BENEFITS.NON-OCC-DISABILITY-BENEFIT-DETAILS';
  occPension = 'BENEFITS.REQ-OCC-PENSION-DISABILITY-BENEFIT';
  //lumpsum (no:7)
  hazardousLumpsum = 'Retirement Lumpsum Benefit (Hazardous Occupation)';
  heirLumpsum = 'Heir Lumpsum Benefit';
  jailedContributorLumpsum = 'Jailed Contributor Lumpsum Benefit';
  lumpsum = 'Lumpsum Benefit'; //TO DO: remove duplicate from Retirement Lumpsum
  nonOccLumpsumBenefitType = 'Non-Occupational Disability Lumpsum Benefit';
  occLumpsum = 'Occupational Disability Lumpsum Benefit';
  //TO DO: remove duplicate from Retirement Lumpsum
  retirementLumpsum = 'Retirement Lumpsum Benefit';
  retirementLumpsumType = 'Retirement Lumpsum Benefit'; // this will be removed
  womanLumpsum = 'Woman Lumpsum Benefit';
  //Modify Benefit Retirement Pension
  modifyBenefit = 'Modify Dependents - Retirement Pension Benefit';
  //other
  ui = 'Unemployment Insurance';
  oh = 'Occupational Disability Benefits';
  NonOccDisabilityBenefitsType = 'Non-Occupational Disability Benefit';
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
