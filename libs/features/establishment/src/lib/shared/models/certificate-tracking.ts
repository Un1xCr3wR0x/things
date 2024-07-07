/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class CertificateTrackingResponse {
  certificateType: BilingualText = new BilingualText();
  fromDate: GosiCalendar;
  toDate: GosiCalendar;
  isGroupCertificate: boolean;
  estName: BilingualText = new BilingualText();
}
