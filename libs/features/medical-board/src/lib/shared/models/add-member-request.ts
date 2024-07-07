import { BilingualText } from '@gosi-ui/core';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class AddMemberRequest {
  contractId: number = undefined;
  memberType: BilingualText = new BilingualText();
  mbProfessionalId: number = undefined;
  sessionId?: number = undefined;
  inviteeId?: number;
}
