/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';
import { MedicalInsurancePolicy } from '@gosi-ui/core/lib/models/medical-insurance-policy';
import { Establishment } from '@gosi-ui/features/establishment';

export class contributorList {
  contributorFullName: BilingualText = new BilingualText();
  contributorName: BilingualText = new BilingualText();
  contributorId: number = undefined;
  requestStatus: BilingualText = new BilingualText();
  eligibilityStatus: BilingualText = new BilingualText();
  establishment?: Establishment;
  medicalInsurancePolicy?: MedicalInsurancePolicy;
  selected: boolean = false;
}
