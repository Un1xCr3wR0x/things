/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';

export class MonthlyViewDetails {
  monthlyView: MonthlyView[] = [];
  component: BilingualText = new BilingualText();
  background: string = undefined;
}
export class MonthlyView {
  period: BilingualText = new BilingualText();
  count: number = undefined;
}
