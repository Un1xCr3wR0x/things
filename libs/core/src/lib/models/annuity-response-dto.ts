import { BilingualText, 
    BorderNumber, 
    GosiCalendar,
    Iqama,
    NationalId,
    NIN,
    Passport } from "@gosi-ui/core";

export class AnnuityResponseDto {
    constructor() {}
  benefitType: BilingualText;
  beneficiaryBenefitStatus: BilingualText;
  requestDate: GosiCalendar;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  deathDate: GosiCalendar;
  personId: number;
}