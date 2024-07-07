/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from './bilingual-text';
export class InjuredPerson {
  injuredPerson: PersonWithInjury[];
}

export class PersonWithInjury {
  category: BilingualText;
  bodyParts: BilingualText[];
}
