import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { EngagementPeriod } from './engagement-period';

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
export class EngagementDetails {
  establishmentName : BilingualText = new BilingualText();
  engagementPeriod : EngagementPeriod;
  engagementId : number;
  description : string;
  endDate : GosiCalendar = new GosiCalendar();
  establishmentRegNo : number;
  occupationName: BilingualText = new BilingualText();
  occupationType : BilingualText = new BilingualText();
  startDate : GosiCalendar = new GosiCalendar();
  status: string;
  isExpanded : boolean;
  establishmentOccupationKey: string;
  isRemoved: boolean;
}
