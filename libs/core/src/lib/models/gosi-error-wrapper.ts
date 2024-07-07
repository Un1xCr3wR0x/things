/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from './bilingual-text';

export class GosiErrorWrapper {
  error: GosiError = new GosiError();
}

class GosiError {
  code: string = undefined;
  message: BilingualText = new BilingualText();
  details: BilingualText[] = [];
  key: string;
  status?: string = undefined;
}
