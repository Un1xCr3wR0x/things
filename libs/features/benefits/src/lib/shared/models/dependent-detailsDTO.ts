/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Name, NIN, BilingualText, GosiCalendar } from '@gosi-ui/core';

export class DependentDetailsDTO {
  namelabel: BilingualText = new BilingualText();
  actionType: string;
  relationLabel: BilingualText = new BilingualText();
  name: Name = new Name();
  relationship: BilingualText = new BilingualText();
  nin: NIN = new NIN();
  personId: number;
  sex: number;
  age: number = undefined;
  dateOfBirth: GosiCalendar = new GosiCalendar();
  heirStatus: BilingualText = new BilingualText();
  maritalStatus: BilingualText = new BilingualText();
  disabled: boolean;
  divorced: boolean;
  married: boolean;
  student: boolean;
  status: string;
  constructor() {}
}
