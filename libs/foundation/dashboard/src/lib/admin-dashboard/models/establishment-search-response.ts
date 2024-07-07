import { Establishment, ListItems } from '@gosi-ui/core';
import { BillHistoryWrapper } from '../../shared';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class EstablishmentSearchResponse {
  totalRecords: number;
  listOfEstablishmentDetails: EstablishmentList[] = [];
}

export class EstablishmentList extends Establishment {
  billDetails: BillHistoryWrapper = new BillHistoryWrapper();
  isCertificateEligible: boolean = null;
  isCertificateLoading: boolean;
  isBalanceLoading: boolean;
  isAuthorized = false;
  isCertificateAuthorized = false;
  isBillDashboardAuthorized = false;
}

export class EstablishmentStarredList{
  registrationNumbers:number[]=[]
}