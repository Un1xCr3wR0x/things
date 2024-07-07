/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class StopBenefitRequest {
  eventDate: GosiCalendar = new GosiCalendar();
  notes: string;
  reason: BilingualText;
  referenceNo?: number;
  requestDate: GosiCalendar = new GosiCalendar();
}

export class StopSubmitRequest {
  comments?: string;
  referenceNo?: number;
  uuid?: string;
}

export class SubmitRequest {
  commitmentFlow: boolean; // new variable since document section is not required in individual app...so uuid will be null
  comments?: string;
  referenceNo?: number;
  uuid?: string;
}
