import { BilingualText, Person } from '@gosi-ui/core';
// import { Person } from '@gosi-ui/features/customer-information/lib/shared/models/benefits';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ReopenEstablishment {
  contentId?: String[];
  reopenReason?: BilingualText = new BilingualText();
  periodOfReopening?: number = undefined;
  person?: Person;
  referenceNo?: number;
  navigationIndicator?: number;
  comments?: string;
}
