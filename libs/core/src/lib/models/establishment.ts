/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { RelationshipManager } from '@gosi-ui/features/establishment/lib/shared/models/relationship-manager';
import { BilingualText } from './bilingual-text';
import { ContactDetails } from './contact-details';
import { CRNDetails } from './crn-details';
import { DocumentSubmitItem } from './document-submit-item';
import { EngagementInfoDetails } from './engagement-info-details';
import { EstablishmentPaymentDetails } from './establishment-payment-details';
import { GccEstablishment } from './gcc-establishment';
import { GosiCalendar } from './gosi-calendar';
import { License } from './license';
import { MainCrn } from './main-crn';
import { MainEstablishmentInfo } from './main-establishment';
import { MOLEstablishmentDetails } from './mol-establishment-details';
import { Person } from './person';
import { ReopenEstablishment } from './re-open-details';
import { RevisionInfo } from './revision-info';
import {FlagDetails} from "@gosi-ui/features/establishment/lib/shared";

export class Establishment {
  activityType: BilingualText = new BilingualText();
  name: BilingualText = new BilingualText();
  fieldOfficeName: BilingualText = new BilingualText();
  nationalityCode: BilingualText = new BilingualText();
  establishmentType: BilingualText = new BilingualText();
  legalEntity: BilingualText = new BilingualText();
  registrationNo: number = undefined;
  departmentNumber: number = undefined;
  lawType: BilingualText = new BilingualText();
  ppaEstablishment = false;
  mainEstablishmentRegNo: number = undefined;
  organizationCategory: BilingualText = new BilingualText();
  recruitmentNo: number = undefined;
  startDate: GosiCalendar = new GosiCalendar();
  establishmentManager: RelationshipManager = new RelationshipManager();
  contactDetails: ContactDetails = new ContactDetails();
  status: BilingualText = new BilingualText();
  crStatus?: BilingualText = new BilingualText();
  scanDocuments: DocumentSubmitItem[] = [];
  comments?: string = undefined;
  transactionMessage?: BilingualText = new BilingualText();
  proactive = false;
  proactiveStatus?: number = undefined;
  navigationIndicator: number = undefined;
  revisionList?: RevisionInfo[] = [];
  validatorEdited = false;
  adminRegistered = false;
  transactionTracingId: number = undefined;
  gccEstablishment: GccEstablishment = new GccEstablishment();
  license: License = new License();
  establishmentAccount: EstablishmentPaymentDetails = new EstablishmentPaymentDetails();
  crn: CRNDetails = new CRNDetails();
  mainCrn: MainCrn = new MainCrn();
  molEstablishmentIds: MOLEstablishmentDetails = new MOLEstablishmentDetails();
  reopenEstablishment?: ReopenEstablishment = new ReopenEstablishment();
  gccCountry? = false;
  registrationCompleted = false;
  unifiedNationalNumber?: number = undefined;
  outOfMarket? = false;
  closeDate?: GosiCalendar;
  terminationRequestDate?: GosiCalendar;
  engagementInfo: EngagementInfoDetails = new EngagementInfoDetails();
  mainEstablishment?: MainEstablishmentInfo = new MainEstablishmentInfo(); //only when main info is queried for.
  gosiRegistrationDate?: GosiCalendar = new GosiCalendar();
  molFileStatus?: BilingualText = new BilingualText();
  onePartner? = false;
  paymentMethod?: BilingualText = new BilingualText();
  closureRequestDate?: GosiCalendar = new GosiCalendar();
  mciVerifiedDate?: GosiCalendar = new GosiCalendar();
  authorisedPerson?: Person = new Person();
  closureDateAfterReopen?: GosiCalendar = new GosiCalendar();
  starred?: boolean = false;
  blockTransactionFlags?: FlagDetails[] = [];
}
