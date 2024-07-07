/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { EEngagementDetails } from './e-engagement-details';

/**
 * The wrapper class for add contributor engagement period details.
 *
 * @export
 * @class AddContEngagementDetails
 */

export class SaveEngagementPayload {
  commercialRegistrationNumber?: number = undefined;
  engagementRequestDto?: EEngagementDetails = new EEngagementDetails();
  // For individual app
  establishmentName?: string = undefined;
  gosiRegistrationNumber?: number = undefined;
  hrsdEstablishmentId?: number = undefined;
  nin?: number = undefined;
  ownerId?: number = undefined;
  unifiedNationalNumber?: number = undefined;
  id?: number = undefined;
  formSubmissionDate?: GosiCalendar = new GosiCalendar();
  establishmentStatus?: string = undefined;
  actualEstablishment?: BilingualText = new BilingualText();
  editFlow?: boolean = false;
  ppaEstablishment?: boolean = false;
  lawType?: BilingualText;
}
