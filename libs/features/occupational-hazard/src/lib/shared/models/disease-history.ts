/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar, BilingualText } from '@gosi-ui/core';
import { EstablishmentsDetails } from './establishments-details';
import { OccupationDetails } from './occupation';

export class DiseaseHistory {
  diseaseNo: number = undefined;
  diseaseId: number = undefined;
  date: GosiCalendar = new GosiCalendar();
  type: BilingualText = new BilingualText();
  diseaseType: BilingualText = new BilingualText();
  actualStatus?: BilingualText = new BilingualText();
  complicationHistory?: BilingualText = new BilingualText();
  diseaseReason: BilingualText = new BilingualText();
  diseaseDiagnosis: BilingualText = new BilingualText();
  injuryReason: BilingualText = new BilingualText();
  location: BilingualText = new BilingualText();
  place?: BilingualText = new BilingualText();
  status: BilingualText = new BilingualText();
  establishmentDetails : EstablishmentsDetails[] = [];
  complication?: DiseaseHistory[];
  disableId?: boolean;
  engagementId: number = undefined;  
  addComplicationAllowed: boolean;
  occupationDetails : OccupationDetails[] = [];
  diseaseComplicationAllowed?: boolean;
  
}
