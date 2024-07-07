/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { EngagementPeriod } from './engagement-period';
import { PendingContractTransaction } from './pending-contract-transaction';
import { PeriodDifference } from './period-difference';
import { TransactionRefDetails } from './transaction-ref-details';
import { ContractDetails } from './contract-details';
import { EEngagementPeriod } from './e-engagement-period';

/** The wrapper class for engagement details. */
export class EEngagementDetails {
  companyWorkerNumber: string = undefined;
  engagementPeriod: EEngagementPeriod[] = [];
  joiningDate: GosiCalendar = new GosiCalendar();
  leavingDate: GosiCalendar = new GosiCalendar();
  leavingReason:  BilingualText = new BilingualText();;
  penaltyIndicator = false;
  proactive = false;
  workType: BilingualText = new BilingualText();
  formSubmissionDate?: GosiCalendar = new GosiCalendar();
  isContributorActive?: boolean;
  isActive?: boolean;


  // fromJsonToObject(json) {
  //   Object.keys(json).forEach(key => {
  //     if (key in new EEngagementDetails()) {
  //       if (key === 'engagementPeriod') {
  //         if (json[key]?.length > 0) {
  //           for (let i = 0; i < json[key].length; i++) {
  //             this.engagementPeriod.push(new EngagementPeriod().fromJsonToObject(json[key][i]));
  //           }
  //         }
  //       } else if (key === 'engagementDuration') {
  //         this[key] = new PeriodDifference().fromJsonToObject(json[key]);
  //       } else {
  //         this[key] = json[key];
  //       }
  //     }
  //   });
  //   return this;
  // }
}
