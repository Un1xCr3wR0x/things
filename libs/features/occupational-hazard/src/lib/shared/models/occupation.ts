import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { DiseaseOccupationDetails } from './disease-occupation-details';
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
export class OccupationDetails {
  occupationId : number;
  diseaseOccupationDetails: DiseaseOccupationDetails[] = [];
  engagementDuration : number;
  occupation : BilingualText = new BilingualText(); 
  isManual :boolean;
} 
