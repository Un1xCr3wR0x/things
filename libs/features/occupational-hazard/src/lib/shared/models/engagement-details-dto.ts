import { BilingualText, GosiCalendar } from '@gosi-ui/core';

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
export class EngagementDetailDTO {
  establishmentName : BilingualText = new BilingualText(); 
  engagementId : number;
  description : string;
  endDate : GosiCalendar = new GosiCalendar();
  establishmentRegNo : number;
  occupation: BilingualText = new BilingualText();
  occupationType : BilingualText = new BilingualText();
  startDate : GosiCalendar = new GosiCalendar();
  status: string;
  isExpanded : boolean;
}
