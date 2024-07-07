/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText } from './bilingual-text';

export class GccEstablishment {
  country: BilingualText;
  registrationNo: string = undefined;
  gccCountry: boolean;
  gccProactive: boolean;

  constructor() {
    this.country = new BilingualText();
    this.gccCountry = true;
    this.gccProactive = false;
  }
}
