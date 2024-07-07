/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  BilingualText,
  ContactDetails,
  CRNDetails,
  DocumentSubmitItem,
  EstablishmentPaymentDetails,
  GccEstablishment,
  GosiCalendar,
  License,
  MOLEstablishmentDetails,
  RevisionInfo,
  TransactionReferenceData
} from '@gosi-ui/core';

export class Establishment {
  gccEstablishment: GccEstablishment = new GccEstablishment();
  activityType: BilingualText = new BilingualText();
  name: BilingualText = new BilingualText();
  nationalityCode: BilingualText = new BilingualText();
  establishmentType: BilingualText = new BilingualText();
  legalEntity: BilingualText = new BilingualText();
  registrationNo: number = undefined;
  ppaEstablishment: boolean;
  license: License;
  isEstablishmentRegistered? = false;
  mainEstablishmentRegNo: number = undefined;
  organizationCategory: BilingualText = new BilingualText();
  recruitmentNo: number = undefined;
  startDate: GosiCalendar = new GosiCalendar();
  contactDetails: ContactDetails = new ContactDetails();
  status: BilingualText = new BilingualText();
  scanDocuments: DocumentSubmitItem[] = [];
  comments?: string;
  transactionMessage?: BilingualText;
  transactionReferenceData?: TransactionReferenceData[] = [];
  establishmentAccount: EstablishmentPaymentDetails = new EstablishmentPaymentDetails();
  crn: CRNDetails = new CRNDetails();
  molEstablishmentIds: MOLEstablishmentDetails = new MOLEstablishmentDetails();
  proactive = false;
  navigationIndicator: number = undefined;
  revisionList?: RevisionInfo[] = [];
  validatorEdited = false;
  adminRegistered = false;
  outOfMarket? = false;
  transactionTracingId: number = undefined;
  starred?:boolean=false;
}
