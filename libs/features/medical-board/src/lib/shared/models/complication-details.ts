/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  TransactionReferenceData,
  DocumentSubmitItem,
  BilingualText,
  GosiCalendar,
  MobileDetails
} from '@gosi-ui/core';
// import { Injury } from './injury-details';
// import { ValidationComments } from './validation-comment';

export class ComplicationDetails {
  allowancePayee: number;
  rejectionReason?: BilingualText = new BilingualText();
  reopenReason: BilingualText = new BilingualText();
  // autoValidationComments?: ValidationComments[];
  autoValidationStatus?: BilingualText = new BilingualText();
  closingDate: GosiCalendar = new GosiCalendar();
  complicationDate: GosiCalendar = new GosiCalendar();
  complicationId?: number = undefined;
  complicationToDeathIndicator = false;
  deathDate?: GosiCalendar = new GosiCalendar();
  complicationLeadsToDeathIndicator?: BilingualText = new BilingualText();
  treatmentCompletionIndicator?: BilingualText = new BilingualText();
  emergencyContactNo?: MobileDetails = new MobileDetails();
  employeeInformedDate: GosiCalendar = new GosiCalendar();
  employerInformedDate: GosiCalendar = new GosiCalendar();
  engagementFormSubmissionDate?: GosiCalendar = new GosiCalendar();
  engagementId?: number = undefined;
  engagementStartDate?: GosiCalendar = new GosiCalendar();
  finalDiagnosis: string = undefined;
  foregoExpenses?: Boolean;
  hasActiveEngagement?: Boolean;
  hasPendingChangeRequest?: Boolean;
  hasRejectionInprogress?: Boolean;
  isComplicationIsInInjuryEstablishment?: Boolean;
  injuryDate: GosiCalendar = new GosiCalendar();
  // injuryDetails?: Injury = new Injury();
  injuryStatus?: BilingualText = new BilingualText();
  reasonForDelay: string = undefined;
  listOfTransactionReferenceData?: TransactionReferenceData[];
  lineOfTreatment: BilingualText = new BilingualText();
  modifyComplicationIndicator? = false;
  tpaCode?: string;
  requiredDocuments?: BilingualText[];
  scanDocuments?: DocumentSubmitItem[];
  status?: BilingualText = new BilingualText();
  reopenAllowedIndicator?: Boolean;
  reopenInitiatedDate: GosiCalendar = new GosiCalendar();
  rejectInitiatedDate?: GosiCalendar = new GosiCalendar();
  treatmentCompleted = false;
  workDisabilityDate?: GosiCalendar = new GosiCalendar();
  workFlowStatus?: number = undefined;
  comments?: string = undefined;
  injuryId: number = undefined;
  injuryNo: number = undefined;
  injuryHour: string = undefined;
  injuryMinute: string = undefined;
  injuryTime: string = undefined;
  establishmentRegNo: number = undefined;
  navigationIndicator?: number = undefined;
  auditStatus: string = undefined;
  parentInjuryRejectionInProgress = false;
  parentInjuryForegoExpenses?: Boolean;
  parentInjuryRejectionReason?: BilingualText = new BilingualText();
};
//   fromJsonToObject(json) {
//     Object.keys(json).forEach(key => {
//       if (key in new Complication() && json[key]) {
//         this[key] = json[key];
//       }
//     });
//     return Object.assign({}, this);
//   }
// }
// export const setResponse = function (object, data) {
//   if (data && object) {
//     Object.keys(object).forEach(item => {
//       if (item in data) {
//         if (data[item]) {
//           if (item === 'treatmentCompleted') {
//             object[item] = data[item]['english'] === 'No' ? false : true;
//           } else {
//             object[item] = data[item];
//           }
//         }
//       }
//     });
//   }
//   return { ...object };
// };
