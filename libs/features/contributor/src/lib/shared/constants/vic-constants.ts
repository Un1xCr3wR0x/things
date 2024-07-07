/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class VicConstants {
  public static get VIC_MANDATORY(): string {
    return 'Mandatory';
  }
  public static get ERR_NO_REGISTERED_ESTABLISHMENT(): string {
    return 'CON-ERR-5232';
  }

  public static get ERR_VIC_DEBT_ERROR(): string {
    return 'CON-ERR-5236';
  }

  public static get VIC_DOCTOR_REPORT(): string {
    return 'Doctor Report';
  }

  public static get IBAN_DOC(): string {
    return 'IBAN';
  }

  public static get DOCTOR_NOT_VERIFIED_STATUS(): string {
    return 'Not applicable';
  }

  public static get MANDATORY_HEALTH_ACkNOWLEDGEMENT_ERROR(): string {
    return 'CONTRIBUTOR.ADD-VIC.MEDICAL-ACKNOWLEDGEMENT-ERROR';
  }

  public static get REGISTER_VIC_BANNER_FIELDS(): string[] {
    return ['nameEnglish', 'nameArabic', 'identifier', 'dob'];
  }

  public static get UPDATE_WAGE_BANNER_FIELDS(): string[] {
    return ['nameBilingual', 'identifier', 'dob', 'status'];
  }

  public static get TERMINATION_REASON_DEATH(): string {
    return 'Death';
  }

  public static get TERMINATION_REASON_GOVT_JOB_JOINING(): string {
    return 'Government Job Joining';
  }
}
