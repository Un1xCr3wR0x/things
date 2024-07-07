/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar } from '@gosi-ui/core';
import { VICWageCategory } from './vic-wage-category';

export class VICWageCategoryWrapper {
  wageCategories: VICWageCategory[] = [];
  wageIncrement: number = undefined;
  paymentDueDate: GosiCalendar = new GosiCalendar();
  wageApplicableOn: GosiCalendar = new GosiCalendar();
}
