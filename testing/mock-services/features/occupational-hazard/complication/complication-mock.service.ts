import { MobileDetails } from '@gosi-ui/core';
import { of } from 'rxjs';
import {
  complicationDetailsTestData,
  complicationFeedbackTestData,
  complicationTransactionReferenceData
} from 'testing';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ComplicationMockService {
  setComments(comments) {
    if (comments) {
    }
  }
  getComplicationHistory(socialInsuranceNo, injuryNo) {
    if (socialInsuranceNo || injuryNo) {
    }
    return of(complicationDetailsTestData);
  }
  getComplication(injuryHistoryDetails, index) {
    if (injuryHistoryDetails || index) {
    }
    return of(complicationDetailsTestData);
  }

  getComments(ohId, sin, regNo, transactionId) {
    return of(complicationTransactionReferenceData);
  }
  getComplicationDetails(registrationNo, socialInsuranceNo, injuryId, complicationId) {
    if (registrationNo || socialInsuranceNo || injuryId || complicationId) {
    }
    return of(complicationDetailsTestData);
  }
  saveComplication(reportedComplicationDetails) {
    if (reportedComplicationDetails) {
    }
    return of(1001951409);
  }
  getModifiedComplicationDetails(registrationNo, socialInsuranceNo, injuryId, complicationId, transactionNumber) {
    if (registrationNo || socialInsuranceNo || injuryId || complicationId || transactionNumber) {
    }
    return of(complicationDetailsTestData);
  }
  saveEmergencyContact(emergencyContact: MobileDetails) {
    if (emergencyContact) {
    }
    return of(1001923479);
  }
  submitComplication(injuryId, complicationId, comments, actionflag) {
    if (injuryId || complicationId || comments || actionflag) {
    }
    return of(complicationFeedbackTestData);
  }
}
