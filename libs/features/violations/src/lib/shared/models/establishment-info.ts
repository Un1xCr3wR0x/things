import { BilingualText } from '@gosi-ui/core';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class EstablishmentInfo {
  registrationNo: number;
  name: BilingualText = new BilingualText();
  isClosed: boolean;
  establishmentSize: number;
  isReopenClosingInProgress?: boolean;
}
