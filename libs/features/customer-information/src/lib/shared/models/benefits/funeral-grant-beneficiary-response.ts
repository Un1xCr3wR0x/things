/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { DependentDetails } from './dependent-details';

export class FuneralGrantBeneficiaryResponse {
  beneficiaryDetails: DependentDetails;
  beneficiaryType: BilingualText;
  notes: string;
  requestDate: GosiCalendar;
  //No coming from API
  lateRequestReason?: string;

  constructor() {}
}
