/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NIN, Iqama, BilingualText } from '@gosi-ui/core';

export class CustomerSummary {
  customerName: BilingualText = new BilingualText();
  id: NIN | Iqama;
  contactId: string;
  emailId: string;
  customerType: string;
}
