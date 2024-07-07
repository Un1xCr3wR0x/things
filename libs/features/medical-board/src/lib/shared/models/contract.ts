import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class Contracts {
  mbProfessionalId: number;
  contractId: number;
  transactionTraceId: number;
  contractType: BilingualText;
  specialty: BilingualText;
  subSpecialty: BilingualText[];
  medicalBoardType: undefined;
  region: BilingualText[];
  hospital: BilingualText;
  fees: number;
  feesPerVisit: BilingualText;
  status: BilingualText;
  startDate: GosiCalendar;
  endDate: GosiCalendar;
  resourceType?: string;
  terminationDate:GosiCalendar = new GosiCalendar();
  terminateReason:BilingualText;
  transientMBType:BilingualText;
  transientModifyFrees:number;
  comments:'';
  commentsDto = {
    comments: undefined
  };
  jobSector: BilingualText[];
  govtEmployee: boolean;
}
