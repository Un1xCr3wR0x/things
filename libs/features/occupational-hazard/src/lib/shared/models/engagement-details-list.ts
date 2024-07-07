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
export class EngagementDetailsList {
  establishmentName : BilingualText = new BilingualText(); 
  engagementId : number;
  description : string;  
  establishmentRegNo : number;
  occupation: BilingualText = new BilingualText();
  occupationType : BilingualText = new BilingualText();
  engagementPeriod: EngagementPeriod[] = [];
  status: string;
  isExpanded : boolean;
  isRemoved : boolean;
}

export class EstablishmentHealth {
  occupation: BilingualText = new BilingualText();
  establishmentId: number;
  establishmentName: BilingualText = new BilingualText();
  sequenceNo: number;
}