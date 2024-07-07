import { BilingualText } from './bilingual-text';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class RequestSort {
  column: string = undefined;
  direction: string = undefined;
  sortDirection: string = undefined;
  value: BilingualText = new BilingualText();
}

export class RoleLovList{
  value: BilingualText = new BilingualText();
  sequence: number = undefined;
  swimlaneRole?: string = undefined;
  resourceName?: string = undefined;
}
