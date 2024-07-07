import { BilingualText } from './bilingual-text';
import { Person } from './person';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ReopenEstablishment {
  contentId: String[];
  reopenReason: BilingualText = new BilingualText();
  periodOfReopening: number = undefined;
  person: Person;
  referenceNo: number;
  navigationIndicator: number;
}
