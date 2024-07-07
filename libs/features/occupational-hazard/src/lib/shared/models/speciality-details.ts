/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from '@gosi-ui/core';
export class specialtyDetails {
  specialty: BilingualText;
  subSpecialty: BilingualTextDupe[];
  isMainSpecialty: boolean;
}

export class BilingualTextDupe {
  arabic: string;
  english: any[];
  code: any;
  sequence: number = undefined;
}
export class bodyPartArray {
  category: BilingualText;
  bodyParts: BilingualText[];
}
