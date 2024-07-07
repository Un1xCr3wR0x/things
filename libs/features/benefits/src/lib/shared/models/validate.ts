/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, BorderNumber, GosiCalendar, Iqama, NationalId, NIN, Passport } from '@gosi-ui/core';
import { EventValidated } from './event';
import { DependentDetails } from './dependent-details';
import { HeirEvent } from '@gosi-ui/features/benefits/lib/shared';

export class ValidateRequest {
  actionType?: string;
  validatedHeir?: DependentDetails;
  validEvent: boolean;
  eventDate: GosiCalendar;
  income: number; //if value is 0 field editable (not gosi registered) greater than 0 income edit disabled
  existingIncome: number;
  marriageGrant: number;
  message: BilingualText;
  status: BilingualText;
  valid: boolean;
  statusDate?: GosiCalendar;
  pensionStatus: BilingualText;
  events: EventValidated[];
  name?: BilingualText;
  relationship?: BilingualText;
  //Custom Variables
  identity?: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  statusAfterValidation: BilingualText;
  oldestEvent?: EventValidated | HeirEvent;
  // showNotEligibleReason?: boolean;
  heirPensionStatus?: BilingualText;
  heirPersonId?: number;
  personId?: number;
  surplus?: boolean;

  constructor() {
    this.valid = undefined;
    this.message = undefined;
    this.surplus = undefined;
  }
}

export class SurplusEligibilityResponse {
  ineligibleHeir: boolean;
}
