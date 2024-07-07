import { GosiCalendar, BilingualText } from '@gosi-ui/core';
import { EngagementWage } from './engagement-wage';
import { ProductDetailsDto } from './productDetailsDto';
import { PeriodDurationDTO } from './periodDurationDto';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */



/**
 * Model class to hold EmployeeWageDetails fields
 *
 * @export
 * @class EmployeeWageDetails
 */
export class EngagementPeriod {
  startDate: GosiCalendar = new GosiCalendar();
  endDate: GosiCalendar = new GosiCalendar();
  occupation: BilingualText = new BilingualText();
  wage: EngagementWage = new EngagementWage();
  minDate?: Date = new Date();
  coverageType?: BilingualText = new BilingualText();
  contributorAbroad : boolean;
  effectiveEndDate : GosiCalendar = new GosiCalendar();
  effectiveStartDate : GosiCalendar = new GosiCalendar();
  id : number;
  lastUpdatedDate: GosiCalendar = new GosiCalendar();
  periodDuration : PeriodDurationDTO = new PeriodDurationDTO();
  product: ProductDetailsDto = new ProductDetailsDto(); 
}
