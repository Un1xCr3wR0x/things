import { BilingualText } from '@gosi-ui/core';

export class BulkParticipants {
  contractId?: number = undefined;
  assessmentType: BilingualText = new BilingualText();
  participantId: number = undefined;
  noOfDaysInQueue: number;
  mobileNumber: string;
  identityNumber: string = undefined;
  idType?: string = undefined;
  location: BilingualText;
  specialty?: BilingualText;
  sessionId?: number;
  selectedIndex?:number
}
