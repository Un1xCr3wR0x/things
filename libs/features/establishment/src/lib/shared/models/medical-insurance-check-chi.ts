/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class MedicalInsuranceCheckChi {
  contributorName: BilingualText = new BilingualText();
  nin: string;
  approvalStatus: number = undefined;
  registrationStatus: boolean;
}
