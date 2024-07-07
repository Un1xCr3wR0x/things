/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { GccEstablishmentDetails } from './gcc-establishment-details';

/**
 * Model class to hold header for billing.
 *
 * @export
 * @class EstablishmentHeader
 */
export class EstablishmentHeader {
  registrationNo: number = undefined;
  name: BilingualText = new BilingualText();
  gccEstablishment: GccEstablishmentDetails = new GccEstablishmentDetails();
  status: BilingualText = new BilingualText();
  gccCountry: boolean;
  startDate?: GosiCalendar = new GosiCalendar();
  lawType: BilingualText = new BilingualText();
  ppaEstablishment: boolean;
}
