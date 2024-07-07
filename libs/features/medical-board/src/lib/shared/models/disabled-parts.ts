/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from '@gosi-ui/core';

export class DisabledParts {
  bodypartCategory?: BilingualText;
  bodyParts?: BilingualText[];
  bodyPartsIndex?: number = undefined;
  category?: BilingualText;
}

export class DisabledPart {
  bodypartCategory?: BilingualText;
  bodyParts?: BilingualTextDupe[];
  bodyPartsIndex?: number = undefined;
  category?: BilingualText;
}

export class BilingualTextDupe {
  arabic?: string;
  english?;
  code?;
  sequence?: number = undefined;
}
