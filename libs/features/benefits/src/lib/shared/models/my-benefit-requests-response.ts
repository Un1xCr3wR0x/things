/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BenefitTransactions } from './benefit-transactions';

export class MyBenefitRequestsResponse {
  benefits: BenefitTransactions[];
  noOfBenefits: number;
  noOfOnHoldBenefits: number;
  noOfactiveBenefits: number;
  noOfStoppedBenefits: number;
  noOfWavedBenefits: number;
}
