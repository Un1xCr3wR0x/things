import { ItemizedAdjustment } from './itemized-adjustment';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ItemizedAdjustmentWrapper {
  itemizedAdjustment: ItemizedAdjustment[] = [];
  total: number = undefined;
  noOfRecords: number = undefined;
  covRemovalCredit: boolean;
}
