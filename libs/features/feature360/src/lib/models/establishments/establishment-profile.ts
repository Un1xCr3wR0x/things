import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export class EstablishmentProfile {
  molestid: number = undefined;
  molestofficeid: number = undefined;
  nationalunifiedno: number = undefined;
  establishmentid: number = undefined;
  recruitmentnumber: number = undefined;
  commercialregistrationnumber: number = undefined;
  licensenumber: BilingualText = new BilingualText();
  establishmentnamearb: string = undefined;
  establishmentnameeng: string = undefined;
  registrationnumber: number = undefined;
  status: BilingualText = new BilingualText();
  establishmenttype: BilingualText = new BilingualText();
  statusengilsh: string = undefined;
  formsubmissiondate: GosiCalendar = new GosiCalendar();
  legalentityAabic: string = undefined;
  legalentityEnglish: string = undefined;
  establishmentActivityArabic: string = undefined;
  establishmentActivityEnglish: string = undefined;
  locationarabic: string = undefined;
  locationenglish: string = undefined;
  firstname: BilingualText = new BilingualText();
  secondname: BilingualText = new BilingualText();
  thirdname: BilingualText = new BilingualText();
  surname: BilingualText = new BilingualText();
}
