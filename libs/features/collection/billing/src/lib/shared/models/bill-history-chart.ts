/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class BillHistoryChart {
  label: BilingualText = new BilingualText();
  labelText: string = undefined;
  type: string = undefined;
  borderColor: string = undefined;
  backgroundColor: string = undefined;
  backgroundColorHover: string = undefined;
  data: number[] = [];
  fill = false;
}
