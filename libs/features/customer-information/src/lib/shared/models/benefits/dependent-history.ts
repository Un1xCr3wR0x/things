/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar, BilingualText, Name, NIN, Iqama, NationalId, Passport, BorderNumber } from '@gosi-ui/core';

export interface DependentHistory {
  requestDate: GosiCalendar;
  dependentHistoryDetails: HistoryDetails[];
}

export interface HistoryDetails {
  name: Name;
  identifier: Array<NIN | Iqama | NationalId | Passport | BorderNumber>;
  statusHistory: StatusHistory[];
}

export interface StatusHistory {
  heirStatus: BilingualText;
  status: BilingualText;
  statusDate: GosiCalendar;
}
