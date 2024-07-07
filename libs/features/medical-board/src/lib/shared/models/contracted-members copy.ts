import { BilingualText, BorderNumber, Iqama, NIN, NationalId, Passport } from '@gosi-ui/core';

export class AddParticipantResponse {
  message: BilingualText ;
  type: string;
 
}

export class ParticipantDetails {
  count: number;
  data: ParticipantList[];
}
export class ParticipantList {
  participantName: BilingualText;
  participantType: BilingualText;
  assessmentType: BilingualText;
  assessmentTime: string;
  status: BilingualText;
  nationalID: string;
  personID: number;
  sin: number;
  injuryId?: number;
  disabilityType: BilingualText;
  assessmentRequestId: number;
  regNo: number;
  benefitReqId?: number;
  slot?: BilingualText;
  disbAssmntId?: number;
  assessmentResult?: BilingualText;
  disabilityPercentage?: number;
  participantAttendance?: BilingualText;
  prevDisbAssmntId: number;
  identity?: Array<NIN | Iqama | NationalId | Passport | BorderNumber>;
  documentReferenceNo?:number;
  isSaudi:boolean;
}