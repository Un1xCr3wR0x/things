/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export enum BenefitType {
  //pension (no: 7)
  earlyretirement = 'Early Retirement Pension Benefit',
  hazardousPension = 'Retirement Pension Benefit (Hazardous Occupation)',
  heirPension = 'Heir Pension Benefit',
  heirBenefit = 'Heir Benefit',
  heirMissingPension = 'Heir Pension Missing Contributor Benefit',
  heirMissingLumpsum = 'Heir Lumpsum Missing Contributor Benefit',
  heirDeathPension = 'Heir Pension Death Contributor Benefit',
  heirDeathPension2 = 'Heir Pension Dead Contributor Benefit',
  heirLumpsumDeadContributor = 'Heir Lumpsum Dead Contributor Benefit',
  jailedContributorPension = 'Jailed Contributor Pension Benefit',
  nonOccPensionBenefitType = 'Non-Occupational Disability Pension Benefit',
  nonOcc = 'Non Occupational Disability Benefit',
  occPension = 'Occupational Disability Pension Benefit',
  funeralGrant = 'Funeral grant',

  // TODO: remove dupicate from below
  retirementPension = 'Retirement Pension Benefit',
  retirementPensionType = 'Retirement Pension Benefit', //this will be removed
  rpaBenefit = 'Moved to Public Pension Lumpsum (RPA) Benefit',

  //lumpsum (no:7)
  hazardousLumpsum = 'Retirement Lumpsum Benefit (Hazardous Occupation)',
  heirLumpsum = 'Heir Lumpsum Benefit',
  jailedContributorLumpsum = 'Jailed Contributor Lumpsum Benefit',
  lumpsum = 'Lumpsum Benefit', //TO DO: remove duplicate from Retirement Lumpsum
  nonOccLumpsumBenefitType = 'Non-Occupational Disability Lumpsum Benefit',
  occLumpsum = 'Occupational Disability Lumpsum Benefit',
  //TO DO: remove duplicate from Retirement Lumpsum
  retirementLumpsum = 'Retirement Lumpsum Benefit',
  retirementLumpsumType = 'Retirement Lumpsum Benefit', // this will be removed
  returnLumpsum = 'Return Lumpsum Benefit',
  womanLumpsum = 'Woman Lumpsum Benefit',
  //Add Modify Benefit Retirement Pension
  addModifyBenefit = 'Add/Modify Dependents',
  addModifyHeir = 'Add/Modify Heirs',
  holdbenefit = 'Hold',
  stopbenefit = 'Stop',
  restartbenefit = 'Restart',
  startBenefitWaive = 'Start Benefit Waive',
  stopBenefitWaive = 'Stop Benefit Waive',
  //other
  ui = 'Unemployment Insurance',
  oh = 'Occupational Disability Benefits',
  NonOccDisabilityAssessment = 'Non-Occupational Disability Assessment',
  NonOccDisabilityBenefitsType = 'Non-Occupational Disability Benefit'
}
