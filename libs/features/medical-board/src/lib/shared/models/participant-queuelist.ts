import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class ParticipantQueueList {
    inviteeId: number;
    name: BilingualText = new BilingualText();
    assessmentType:BilingualText = new BilingualText();
    specialty: BilingualText = new BilingualText();
    location: BilingualText[] = [];
    noOfDaysInQueue: number;
    mobileNumber: string;
    isdCode: string;
    identityNumber: number = undefined;
    idType: string;
    participantId: number
    disabilityType: string;
    participantType: BilingualText[] = [];
    subSpecialty:BilingualText[] = [];
    socInsuranceNo: number;
    createdTimeStamp: GosiCalendar;
    primarySpecialty:  BilingualText[] = [];
    secondarySpecialty: BilingualText[] = [];
    medicalBoard: string;
  }