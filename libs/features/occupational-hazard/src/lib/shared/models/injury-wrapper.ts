/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';
import { Injury } from './injury-details';

export class InjuryWrapper {
  injuryDetailsDto: Injury = new Injury();
  modifiedInjuryDetails: Injury = new Injury();
  establishmentRegNo: number = undefined;
}

export class InjuredPerson {
  injuredPerson: PersonWithInjury[];
}

export class PersonWithInjury {
  category: BilingualText;
  bodyParts: BilingualText[];
}

export class DisabilityDetails {
  count: number;
  data: AssessmentDetails[];
}
export class AssessmentDetails {
  assessmentDate: Date;
  assessmentId: number;
  disabilityType: number;
  assessmentType: BilingualText;
  assessmentResult: number;
  disabilityPercentage: number;
}