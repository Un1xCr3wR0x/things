/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class MbSessionCalendarDetailsDtoList {
  fieldOffice: BilingualText = new BilingualText();
  maximumBeneficiaries: number;
  noOfDoctorsInvited: number;
  noOfDoctorsAccepted: number;
  noOfParticipants: number;
  sessionId: number;
  templateId: number;
  sessionStartTime: string;
  sessionEndTime: string;
  sessionType: BilingualText = new BilingualText();
  status?: BilingualText;
  membersCount: number;
  membersTotalCount: number;
  participantsCount: number;
  participantsTotalCount: number;
  startTimeAmOrPm: BilingualText;
  endTimeAmOrPm: BilingualText;
}
