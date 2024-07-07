import { BilingualText, GosiCalendar } from "@gosi-ui/core";

export class PersonDetailsDTO {
    nationality: BilingualText;
    identifier: any;
    nameEng: string;
    nameArb: string;
    gender: BilingualText;
    dob: GosiCalendar = new GosiCalendar();
}


export class SaveDetails {
    newNin: any;
    dob: GosiCalendar;
    uuid: string;
  }
export class SimisDocDetails{
    microFinches: MicroFinches[];
}
  export class MicroFinches {
    microfincheInfoId: number;
    contributorId: number;
    boxNumber: string;
    microFincheNumber: number;
    microFincheRow: string;
    microfincheColumn: number;
    coverCode: number;
    userId: number;
    transactionCode: string;
    transactionDate: GosiCalendar = new GosiCalendar();
    sin: number;
    fieldOffice: number;
    docSize: number;
  }
