/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { GosiCalendar, BilingualText } from '@gosi-ui/core';
import { ImprisonmentDetails } from './imprisonment-details';
import { HeirDetailsRequest } from './heir-details-request';
import { DependentDetails } from './dependent-details';
import { PersonBankDetails, PatchPersonBankDetails } from '@gosi-ui/features/benefits/lib/shared';

export class AnnuityBenefitRequest {
  authorizedPersonId?: number;
  certificateExpiryDate?: GosiCalendar;
  payee?: BilingualText;
  dependents?: DependentDetails[];
  heirRequestDetails: HeirDetailsRequest;
  paymentMode?: BilingualText;
  requestDate: GosiCalendar;
  disabilityDate?: GosiCalendar;
  disabilityDescription?: string;
  referenceNo: number;
  deductionPercentage?: number;
  authorizationDetailsId?: number;
  imprisonmentDetails?: ImprisonmentDetails;
  bankAccount?: PatchPersonBankDetails;
  lateRequestReason?: string;
  action?: string;
  notes?: string;
  revisedBenefitType?: string;
  modificationRequestDate?: GosiCalendar;
  notificationDate?: GosiCalendar;
  nextNotificationDate?: GosiCalendar;
  validatorEdited?: boolean;
  authorizationId?: number;
  isPpaOhDeath?: boolean;

  constructor() {
    this.dependents = null;
    this.authorizedPersonId = null;
    this.authorizationDetailsId = null;
    this.deductionPercentage = null;
    this.payee = null;
    this.bankAccount = null;
    this.authorizationId = null;
  }
}
