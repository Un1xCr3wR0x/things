import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { Engagement } from './engagement';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */


/**
 * Wrapper class to hold occupation details.
 *
 * @export
 * @class Occupation
 */
export class DiseaseOccupationDetails {
  occupationCode: string = undefined;
  occupationName: BilingualText = new BilingualText();
  occupationType: BilingualText = new BilingualText();
  engagementId: number;
  workType: string = undefined;
  occupationStartDate: GosiCalendar = new GosiCalendar();
  value: BilingualText = new BilingualText();
  disabled? = false;
  engagementDetails: Engagement[];
  category: BilingualText = new BilingualText();
  endDate : GosiCalendar = new GosiCalendar();
  engagementDuration : number;
  establishmentName : BilingualText = new BilingualText();
  occupation: BilingualText = new BilingualText();
  registrationNo : number;
  startDate : GosiCalendar = new GosiCalendar();
  durationInMonths : number;
  age : number;
  manual = false;
  description : string;
}
