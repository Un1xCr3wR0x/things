import { BilingualText } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class PersonConstants {
  //Patch Identifiers
  public static get PATCH_EDUCATION_ID(): string {
    return 'EDUCATION';
  }
  public static get PATCH_CONTACT_ID(): string {
    return 'CONTACT';
  }
  public static get PATCH_BANK_ID(): string {
    return 'BANK';
  }
  public static get PATCH_IDENTITY_ID(): string {
    return 'IDENTITY';
  }
  public static get PATCH_ADDRESS_ID(): string {
    return 'ADDRESS';
  }

  public static get NONSAUDI_DOCUMENT_TRANSACTION_KEY(): string {
    return 'UPDATE_NON_SAUDI_IBAN';
  }

  public static get DOCUMENT_TRANSACTION_TYPE(): string {
    return 'NON_SAUDI_IBAN_VERIFICATION';
  }

  public static get SAUDI_IBAN_VERIFICATION_STATUS(): string {
    return 'Sama Verification Pending';
  }

  public static get NONSAUDI_IBAN_VERIFICATION_STATUS(): string {
    return 'Validation in Workflow';
  }
  public static get CURRENCY_SAR(): BilingualText {
    const SAR = new BilingualText();
    SAR.english = 'SAR';
    SAR.arabic = 'ر.س';
    return SAR;
  }
}
