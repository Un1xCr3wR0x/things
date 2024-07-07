/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class TodoItem {
  title?: BilingualText = new BilingualText();
  resourceType: string = undefined;
  activityName: string = undefined;
  resourceId: string = undefined;
  resourceUrl: string = undefined;
  updatedBy: string = undefined;
  state: BilingualText = new BilingualText();
  assignedRole: string = undefined;
  taskId: string = undefined;
  assigneeId: string = undefined;
  route: string = undefined;
  sourceChannel: string = undefined;

  constructor() {}
}
