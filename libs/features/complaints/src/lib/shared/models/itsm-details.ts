/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
 import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class ITSMDetails {
  status: string;
  serviceName: string;
  incidentNumber: string;
  type: string;
  subType: string;
  notes: string;
  incId: string;
  category: string;
  resolvedDate: GosiCalendar = new GosiCalendar();
  instanceId: string;
//   type: BilingualText = new BilingualText();
//   subtype: BilingualText = new BilingualText();
}
