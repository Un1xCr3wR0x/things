/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { of } from 'rxjs';
import {
  injuryDetailsTestData,
  injuryFeedbackTestData,
  injuryRejectionTestData,
  injuryStatisticsTestData
} from 'testing';
import { injuryHistoryTestData } from 'testing/test-data';
import { MobileDetails } from '@gosi-ui/core';

export class InjuryMockService {
  reportInjuryService(reportInjuryDetails, socialGroupNumber) {
    if (reportInjuryDetails || socialGroupNumber) {
    }
    return of(1001952056);
  }
  updateBpmTask(routerData, rejectionDetails) {
    if (routerData || rejectionDetails) {
    }
    return of(null);
  }

  setStatus(status) {
    if (status) {
    }
  }
  getModifiedInjuryDetails(registrationNo, socialInsuranceNo, injuryId, transactionNumber) {
    if (registrationNo || socialInsuranceNo || injuryId || transactionNumber) {
    }
    return of(injuryDetailsTestData);
  }
  updateBpmTaskforInspection(routerData, formValue) {
    if (routerData || formValue) {
    }
    return of(null);
  }
  getRejectReasonValidator() {
    return of(null);
  }
  getInspectionList() {
    return of(null);
  }
  updateInjuryService(reportInjuryDetails) {
    if (reportInjuryDetails) {
    }
    return of(1001952056);
  }
  saveEmergencyContactInjury(contactNo: MobileDetails) {
    if (contactNo) {
    }
    return of(10003460536);
  }
  setNavigationIndicator(indicator) {
    if (indicator) {
    }
  }
  saveAllowancePayee(details) {
    if (details) {
    }
    return of({
      english: '',
      arabic: ''
    });
  }
  submitInjury(injurNo) {
    if (injurNo) {
    }
    return of(injuryFeedbackTestData);
  }

  getInjuryStatistics() {
    return of(injuryStatisticsTestData);
  }
  getInjurySummaryStatistics() {
    return of(injuryStatisticsTestData);
  }
  updateInjuryRejection(rejectionDetails, registrationNo, socialInsuranceNo, injuryId, canAddComments) {
    if (rejectionDetails || registrationNo || socialInsuranceNo || injuryId || canAddComments) {
    }
    return of(injuryRejectionTestData);
  }
  getInjuryHistoryDetails() {
    return of(injuryDetailsTestData.injuryDetailsDto);
  }
  getInjuryDetails(registrationNo, socialInsuranceNo, injuryId, modify) {
    if (registrationNo || socialInsuranceNo || injuryId || modify) {
    }
    return of(injuryDetailsTestData);
  }
  getInjuryHistory() {
    return of(injuryHistoryTestData);
  }
  getPersonId() {
    return of('1001923479');
  }
  getInjuryRejectReasonList() {
    return of([null]);
  }
}
