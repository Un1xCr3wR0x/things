import { BilingualText, GosiCalendar } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */


/**
 * Wrapper class to hold occupation engagement details.
 *
 * @export
 * @class OccupationDetail
 */
export class OccupationEngagementDetails {
  code: string = undefined;
  occupationName: BilingualText = new BilingualText();
  occupationType : BilingualText = new BilingualText();
  establishmentName: BilingualText = new BilingualText();
  workType: string = undefined;
  startDate: GosiCalendar = new GosiCalendar();
  endDate : GosiCalendar = new GosiCalendar();
  value: BilingualText = new BilingualText();
  disabled? = false;
  category: BilingualText = new BilingualText();
  isExpanded : boolean;
  isRemoved : boolean;
  engagementId:number;
  occupationEngagementId: number;
  occupationEngagementValue: string;
  establishmentOccupationKey: string;
} 
