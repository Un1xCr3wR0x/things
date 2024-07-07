/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { EngagementPeriod } from './engagement-period';

/**
 * This class is used for handling current wage and updated wage
 */
export class UpdateWage {
  currentWage: EngagementPeriod = new EngagementPeriod();
  updatedWage: EngagementPeriod = new EngagementPeriod();
}
