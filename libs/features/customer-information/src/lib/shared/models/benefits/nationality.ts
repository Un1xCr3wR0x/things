import { BilingualText, BorderNumber, GosiCalendar, Iqama, NIN, NationalId, Passport } from "@gosi-ui/core";

export class ModifyNationalityDetails {
    passportNumber: string;
    nationality: string;
    passportIssueDate: Date;
    passportExpiryDate?: Date;
  }

export class NationalityModifyDetails{
  contributorType:string;
  nationality: BilingualText = new BilingualText();
  personIdentities: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  referenceNo:Number;
  uuid:string;
  removeGccId:boolean;
}
export class PersonIdentites{
  idType:string;
  passportNo:string;
  expiryDate: GosiCalendar;
  issueDate:GosiCalendar;
}
  