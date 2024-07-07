import { BilingualText } from './bilingual-text';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class FieldOfficeDetails {
  fieldOfficeName?: BilingualText = new BilingualText();
  faxId: string;
  latitude: number;
  longitude: number;
  serviceCenter: string;
  telephoneNumber: string;
}
