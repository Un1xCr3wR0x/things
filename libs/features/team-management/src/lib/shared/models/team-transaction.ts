/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class TeamTransaction {
  id: number = undefined;
  description: BilingualText = new BilingualText();
  assignee: BilingualText = new BilingualText();
  assigneeId: number = undefined;
  date: Date = undefined;
  priority: number = undefined;
  ola: number = undefined;
  status: BilingualText = new BilingualText();
  taskId?: string = undefined;
}
