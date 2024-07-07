/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export enum BenefitValues {
  NonSaudi = 'Non-Saudi Lumpsum',
  SaudiArabia = 'Saudi Arabia',
  Others = 'Others',
  active = 'ACTIVE',
  annuity = 'Annuities Benefits',
  guardian = 'Guardian',
  authorizedPerson = 'Authorized Person',
  changeInMonthlyWage = 'Change in Monthly Wage',
  cheque = 'Cheque',
  contributor = 'Self',
  eligible = 'Eligible',
  married = 'Married',
  disabled = 'Disabled',
  lumpsum = 'Lumpsum Benefit',
  new = 'NEW',
  noneligible = 'Not Eligible',
  oh = 'Occupational Disability Benefits',
  plan10 = '10% of Pension benefit / Month',
  plan25 = '25% of Pension benefit / Month',
  reopen = 'REOPEN',
  workflow = 'WORKFLOW',
  gosi = 'GOSI',
  nic = 'NIC',
  moj = 'MOJ',
  ui = 'UI',
  BANK = 'Bank Transfer',
  deathOfTheContributor = 'Death of the Contributor',
  missingContributor = 'Missing Contributor',
  modified = 'MODIFIED',
  wife = 'Wife',
  mother = 'Mother',
  sister = 'Sister',
  granddaughter = 'Grand Daughter',
  grandmother = 'Grand Mother',
  daughter = 'Daughter',
  unborn = 'Unborn',
  dependents = 'Dependents',
  heirs = 'Heirs',
  hold = 'Hold',
  stop = 'Stop',
  restart = 'Restart',
  startBenefitWaive = 'Start Benefit Waive',
  stopBenefitWaive = 'Stop Benefit Waive',
  nationaliIdEnglish = 'National ID',
  nationalIdArabic = 'رقم الهوية الوطنية',
  birthOfChild = 'Birth of Unborn Child',
  deathOfChild = 'Death of Unborn Child',
  unbornChild = 'Unborn Child',
  leavingWork = 'Leaving work',
  joiningWork = 'Joining work',
  alreadySavedHeir = 'alreadySavedHeir',
  newPerson = 'newPerson',
  yes = 'Yes',
  no = 'No',
  updateJailWorker = 'Update Jail Worker',
  sampleNotes = 'The date by which the yearly notification documents are to be provided by the beneficiaries to GOSI for students and overseas beneficiaries/heirs.',
  inactive = 'Inactive',
  inactiveArabic = 'غير نشيط'
}

export class BankTransfer {
  arabic: 'تحويل للبنك';
  english: 'Bank Transfer';
}
