import { of } from 'rxjs';
import { TransactionFeedback, BilingualText } from '@gosi-ui/core';

export class AddVICServiceStub {
  saveVICPerson() {
    return of(savePersonResponse);
  }

  updateVICPerson() {
    return of(true);
  }

  saveHealthRecordDetails() {
    return of(new TransactionFeedback());
  }

  saveVicEngagement() {
    return of(saveVICEngagementResponse);
  }

  updateVicEngagement() {
    return of(saveVICEngagementResponse);
  }

  submitVicRegistration() {
    return of(new TransactionFeedback());
  }

  getVicEngagementDetails() {
    return of(vicEngagementDetailsResponse);
  }
}

export const savePersonResponse = {
  socialInsuranceNo: 423965266,
  approvalStatus: ''
};

export const saveVICEngagementResponse = {
  backDatedEngagementId: null,
  contributoryWage: null,
  coverageType: [],
  id: 1584364810,
  message: new BilingualText(),
  referenceNo: 664704
};

export const vicEngagementDetailsResponse = {
  doctorVerificationStatus: 'Not applicable',
  engagementPeriod: [
    {
      basicWage: 45000,
      contributionAmount: 10000,
      coverageType: [
        {
          arabic: 'معاشات',
          english: 'Annuity'
        }
      ],
      occupation: {
        arabic: 'اختصاصي ماكياج',
        english: 'Make-up specialist'
      },
      wageCategory: 40
    }
  ],
  formSubmissionDate: {
    gregorian: '2020-11-21',
    hijiri: '1440-07-05'
  },
  healthRecords: [
    {
      healthRecordId: 1016,
      description: {
        arabic: 'هل سبق وأن كنت منوم في أحد الجهات العلاجية؟',
        english: 'Have you ever stayed in the hospital?'
      },
      remarkType: 'Mandatory',
      choice: ''
    }
  ],
  joiningDate: {
    gregorian: '2020-11-20T12:50:58.000Z',
    hijiri: '1442-04-05'
  },
  purposeOfRegistration: {
    english: 'Professional',
    arabic: 'صاحب مهنة '
  }
};

export const noActiveEstablishmentError = {
  error: {
    code: 'CON-ERR-5232',
    message: {
      english: 'No active establishment',
      arabic: 'No active establishment'
    }
  }
};
