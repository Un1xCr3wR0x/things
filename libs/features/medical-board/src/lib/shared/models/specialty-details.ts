import { BilingualText } from '@gosi-ui/core';
export class SpecialtyDetails {
  specialty: BilingualText;
  subSpecialty: BilingualTextDupe[];
  isMainSpecialty: boolean;
}

export class BilingualTextDupe {
  arabic: string;
  english = [];
  code;
  sequence: number = undefined;
}
