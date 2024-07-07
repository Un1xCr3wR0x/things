/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, GosiCalendar } from '@gosi-ui/core';

/**
 * The wrapper class for product.
 * @export
 * @class Coverage
 */
export class CoverageDetails {
  engagementId: number = undefined;
  joiningDate: GosiCalendar = new GosiCalendar();
  leavingDate: GosiCalendar = new GosiCalendar();
  status: BilingualText = new BilingualText();
  coverages: BilingualText[];
}
