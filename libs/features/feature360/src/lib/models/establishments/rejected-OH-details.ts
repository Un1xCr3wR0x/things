/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar, Name } from '@gosi-ui/core';
import { ExpensesDetails } from './expenses-details';
import { PersonId } from './person-id';

export class RejectedOHDetails {
  personId: PersonId = new PersonId();
  name: Name = new Name();
  type: BilingualText = new BilingualText();
  caseNumber: number = undefined;
  rejectionDate: GosiCalendar = new GosiCalendar();
  rejectionReason: BilingualText = new BilingualText();
  expenses: ExpensesDetails[] = [];
}
