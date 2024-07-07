/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
// import { EmploymentOccupationDetails } from '../models/employment-occupation-details';

import { BilingualText } from './bilingual-text';
import { DocumentSubmitItem } from './document-submit-item';
import { EmployeeWageDetails } from './employment-wage-details';
import { GosiCalendar } from './gosi-calendar';
import { TransactionReferenceData } from '@gosi-ui/core';

/**
 * The wrapper class for personal information.
 *
 * @export
 * @class EmploymentDetails
 */

export class EmploymentDetails {
  approvalDate: GosiCalendar = new GosiCalendar();
  joiningDate: GosiCalendar = new GosiCalendar();
  companyWorkerNumber: string = undefined;
  //'contributorAbroad' is using in  add contributor
  contributorAbroad = false;
  workType: BilingualText = new BilingualText();
  formSubmissionDate: GosiCalendar = new GosiCalendar();
  engagementPeriod: EmployeeWageDetails[] = [];
  scanDocuments: DocumentSubmitItem[] = [];
  student = false;
  prisoner = false;
  transactionReferenceData?: TransactionReferenceData[] = [];
  proactive = false;
  leavingDate: GosiCalendar = new GosiCalendar();
  leavingReason: BilingualText = new BilingualText();
  isContributorActive = false;
  backdatingIndicator: boolean = null;
  penaltyIndicator: boolean = null;

  fromJsonToObject(json: EmploymentDetails) {
    Object.keys(json).forEach(key => {
      if (key in new EmploymentDetails()) {
        if (key === 'engagementPeriod') {
          if (json[key].length > 0) {
            for (let i = 0; i < json[key].length; i++) {
              this.engagementPeriod.push(new EmployeeWageDetails().fromJsonToObject(json[key][i]));
            }
          }
        } else {
          this[key] = json[key];
        }
      }
    });
    return this;
  }
}
