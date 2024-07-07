/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  BilingualText,
  ContactDetails,
  GosiCalendar,
  DocumentSubmitItem,
  RevisionInfo,
  TransactionReferenceData
} from '@gosi-ui/core';

import { EstablishmentPaymentDetails } from './establishment-payment-details';
import { GccEstablishment } from './gcc-establishment';
import { CRNDetails } from './crn-details';
import { MOLEstablishmentDetails } from './mol-establishment-details';
import { License } from './license';
import { EngagementInfo } from './engagement-info';
import { Ids } from './einpectionIds';
import { FlagDetails } from '@gosi-ui/features/establishment';
export class Establishment {
  gccEstablishment: GccEstablishment = new GccEstablishment();
  activityType: BilingualText = new BilingualText();
  name: BilingualText = new BilingualText();
  nationalityCode: BilingualText = new BilingualText();
  establishmentType: BilingualText = new BilingualText();
  legalEntity: BilingualText = new BilingualText();
  registrationNo: number = undefined;
  license: License = new License();
  mainEstablishmentRegNo: number = undefined;
  ppaEstablishment: boolean = false;
  organizationCategory: BilingualText = new BilingualText();
  recruitmentNo: number = undefined;
  startDate: GosiCalendar = new GosiCalendar();
  contactDetails: ContactDetails = new ContactDetails();
  establishmentContactDetails?: ContactDetails = new ContactDetails();
  status: BilingualText = new BilingualText();
  scanDocuments: DocumentSubmitItem[] = [];
  comments?: string = undefined;
  transactionMessage?: BilingualText = new BilingualText();
  transactionReferenceData?: TransactionReferenceData[] = [];
  establishmentAccount: EstablishmentPaymentDetails = new EstablishmentPaymentDetails();
  crn: CRNDetails = new CRNDetails();
  molEstablishmentIds: MOLEstablishmentDetails = new MOLEstablishmentDetails();
  proactive = false;
  navigationIndicator: number = undefined;
  revisionList?: RevisionInfo[] = [];
  engagementInfo: EngagementInfo;
  gccCountry = false;
  outOfMarket = false;
  blockTransactionFlags?: FlagDetails[] = [];
  establishmentName: BilingualText = new BilingualText();
  unifiedNationalNumber: Ids;
  hrsdEstablishmentId: Ids;
  commercialRegistrationNumber: Ids;
  ownerId: Ids;
  gosiRegistrationNumber: Ids;
  jobScaleType?: number;

  fromJsonToObject(json: Establishment) {
    Object.keys(json).forEach(key => {
      if (key in new Establishment()) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
