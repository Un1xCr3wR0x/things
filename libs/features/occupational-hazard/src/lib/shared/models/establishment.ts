/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  BilingualText,
  ContactDetails,
  DocumentSubmitItem,
  GosiCalendar,
  License,
  TransactionReferenceData
} from '@gosi-ui/core';

export class Establishment {
  activityType: BilingualText = new BilingualText();
  name: BilingualText = new BilingualText();
  fieldOfficeName: BilingualText = new BilingualText();
  nationalityCode: BilingualText = new BilingualText();
  establishmentType: BilingualText = new BilingualText();
  legalEntity: BilingualText = new BilingualText();
  registrationNo: number = undefined;
  mainEstablishmentRegNo: number = undefined;
  organizationCategory: BilingualText = new BilingualText();
  recruitmentNo: number = undefined;
  startDate: GosiCalendar = new GosiCalendar();
  contactDetails: ContactDetails = new ContactDetails();
  status: BilingualText = new BilingualText();
  scanDocuments: DocumentSubmitItem[] = [];
  comments?: string = undefined;
  transactionMessage?: BilingualText = new BilingualText();
  transactionReferenceData?: TransactionReferenceData[] = [];
  proactive = false;
  navigationIndicator: number = undefined;
  validatorEdited = false;
  adminRegistered = false;
  transactionTracingId: number = undefined;
  license: License = new License();
  GosiCalendar: GosiCalendar = new GosiCalendar();
  gccCountry? = false;
  city: BilingualText = new BilingualText();
  noOfBranches: number = undefined;
  closingDate: GosiCalendar = new GosiCalendar();
  length: number;
}

