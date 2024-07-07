/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { of } from 'rxjs';
import { contributorTestData, contributorSearchTestData, engagementTestData, personData } from 'testing';

export class ContributorMockService {
  getContributor(registrationNo, socialInsuranceNo) {
    if (registrationNo || socialInsuranceNo) {
    }
    return of(contributorTestData);
  }
  getEngagement(registrationNo) {
    if (registrationNo) {
    }
    return of(engagementTestData);
  }
  getPerson(registrationNo, socialInsuranceNo) {
    if (registrationNo || socialInsuranceNo) {
    }
    return of(personData);
  }
  getEngagementOnDate(socialInsuranceNo, date) {
    if (socialInsuranceNo || date) {
    }
    return of(engagementTestData);
  }
  getEngagementDetails(registrationNo, socialInsuranceNo, engagementId) {
    if (registrationNo || socialInsuranceNo || engagementId) {
    }
    return of(engagementTestData);
  }
  getContributorSearch(searchValue) {
    if (searchValue) {
    }
    return of(contributorSearchTestData);
  }
}
