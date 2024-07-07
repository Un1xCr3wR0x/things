/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from '@gosi-ui/core';

export class CertificateDetailsRequest {
  fromDate? = new GosiCalendar();
  toDate? = new GosiCalendar();
  type: string = undefined;
  uuid?: string = undefined;
  isGroupCertificate = false;
}
