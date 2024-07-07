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
export class EngagementDetailsDTO {
  establishmentName : BilingualText = new BilingualText(); 
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
  isRemovedFromUI: boolean;
  isSavedAfterDelete: boolean;
  engagementFormSubmissionDate:GosiCalendar = new GosiCalendar();
  engagementStartDate:GosiCalendar = new GosiCalendar(); 

}
