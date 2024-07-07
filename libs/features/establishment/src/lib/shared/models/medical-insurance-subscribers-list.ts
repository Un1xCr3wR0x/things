/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, Name, NIN } from '@gosi-ui/core';

export class MedicalInsuranceSubscribersList {
  nin: NIN = new NIN();
  // name: BilingualText = new BilingualText();
  name: Name = new Name();
  registrationNumber: number = undefined;
  establishmentName: BilingualText = new BilingualText();
  policyStartDate: Date;
  policyEndDate: Date;
  policyStatus: number = undefined;
  requestStatus: number = undefined;
  estPaymentPercent?: number = 0;
}
