import { BilingualText } from '@gosi-ui/core';

export class EstablishmentDetailsDto {
  establishmentDetails: EstablishmentDetails[] = [];
  inspectionReason?: BilingualText;
}
export class EstablishmentDetails {
  establishmentName?: BilingualText = new BilingualText();
  establishmentRegNo?: number;
}
