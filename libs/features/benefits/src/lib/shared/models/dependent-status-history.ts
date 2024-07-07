/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, BorderNumber, Iqama, NationalId, NIN, Passport } from '@gosi-ui/core';
import { StatusHistoryDetails } from '.';

export class DependentStatusHistory {
  identifier: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  name: BilingualText;
  statusHistory: StatusHistoryDetails[];
}
