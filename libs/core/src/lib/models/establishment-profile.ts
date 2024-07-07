/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from './bilingual-text';
import { GosiCalendar } from './gosi-calendar';

export class EstablishmentProfile {
  name: BilingualText = new BilingualText();
  city: BilingualText = new BilingualText();
  status: BilingualText = new BilingualText();
  registrationNo: number = undefined;
  recruitmentNo: number = undefined;
  establishmentType: BilingualText = new BilingualText();
  mainEstablishmentRegNo: number = undefined;
  noOfBranches: number = undefined;
  startDate: GosiCalendar = new GosiCalendar();
  closingDate: GosiCalendar = new GosiCalendar();
  nationalityCode: BilingualText = new BilingualText();
  legalEntity: BilingualText = new BilingualText();
  gccEstablishment: boolean;
}
