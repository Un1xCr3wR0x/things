import { BilingualText, GosiCalendar } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class SearchParam {
  personIdentifier?: number = null;
  commercialRegistrationNo?: number = null;
  phoneNumber?: number = null;
  licenceNo?: number = null;
  recruitmentNo?: number = null;
  establishmentName?: string = null;
  registrationNo?: number = null;
  unifiedIdentificationNo?: number = null;
  firstName?: string = null;
  secondName?: string = null;
  thirdName?: string = null;
  familyName?: string = null;
  englishName?: string = null;
  oldNationalId?: number = null;
  birthDate?: string = null;
  nationality?: BilingualText = new BilingualText();
  passportNo?: number = null;
  borderNo?: number = null;
  gccId?: number = null;
  nationalityCode?: number = null;
  gccCountryList?: BilingualText[] = [];
  gccCountryCode?: number[] = [];
  registrationStatus?: BilingualText[] = [];
  unifiedEstablishmentId?: number = null;
  unifiedEstablishmentIdPrefix?: number = null;
  establishmentId?: number = null;
  establishmentIdPrefix?: number = null;
  // sin: number = null;
  startDate?: GosiCalendar = new GosiCalendar();
  endDate?: GosiCalendar = new GosiCalendar();
  status?: BilingualText[] = [];
  channel?: BilingualText[] = [];
  transactionId?: BilingualText[] = [];
}
