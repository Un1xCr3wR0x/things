/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class TeamMember {
  id: string = undefined;
  name: BilingualText = new BilingualText();
  role: BilingualText = new BilingualText();
  pendingTransactions: number = undefined;
  olaExceeded: number = undefined;
  status: BilingualText = new BilingualText();
}

export class TeamMember1 {
  userId: string = undefined;
  containerDN: string = undefined;
  manager: string = undefined;
  mail: string = undefined;
  mobile: string = undefined;
  userreferenceid: string = undefined;
  adreferenceid: string = undefined;
}
