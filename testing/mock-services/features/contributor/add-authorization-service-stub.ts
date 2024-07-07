import { of } from 'rxjs';

export class AddAuthorizationServiceStub {
  getAttorneyDetails() {
    return of(attorneyDetails);
  }

  getCustodianDetails() {
    return of(custodianDetails);
  }
}

export const attorneyDetails = {
  responseCode: true,
  responseMessage: 'Succeeded',
  attorneyNumber: '422489856',
  attorneyStatus: 'معتمدة',
  attorneyType: 'الرواتب والمستحقات',
  agent: {
    fullName: 'فتحية الشربيني',
    id: '1075169373',
    gender: 'Female',
    isValid: true,
    nationality: {
      arabic: 'السعودية',
      english: 'Saudi Arabia'
    }
  },
  authorizerList: [
    {
      fullName: 'خديجة خالد',
      id: '1078177639',
      gender: 'Female',
      isValid: true,
      nationality: {
        arabic: 'السعودية',
        english: 'Saudi Arabia'
      }
    }
  ],
  issueDate: {
    gregorian: '2021-03-22',
    hijiri: '1442-08-09'
  },
  endDate: {
    gregorian: '2022-03-12',
    hijiri: '1443-08-09'
  },
  attorneyText: 'test'
};

export const custodianDetails = {
  custodyNumber: 40712535,
  custodian: {
    id: 1001627262,
    fullName: 'سعاد كمال',
    sex: 'FEMALE',
    nationality: {
      arabic: 'السعودية',
      english: 'Saudi Arabia'
    },
    dateOfBirth: {
      gregorian: '1968-09-23T00:00:00.000Z',
      hijiri: '1388-07-01'
    }
  },
  minorList: [
    {
      relation: {
        arabic: 'بنت',
        english: 'Daughter'
      },
      isStillMinor: true,
      id: 1145692263,
      fullName: 'فاطمة عبدالله',
      sex: 'FEMALE',
      nationality: {
        arabic: 'السعودية',
        english: 'Saudi Arabia'
      },
      dateOfBirth: {
        gregorian: '2009-02-26T00:00:00.000Z',
        hijiri: '1430-03-01'
      }
    }
  ],
  custodyDate: {
    gregorian: '2019-02-26T00:00:00.000Z',
    hijiri: '1440-06-21'
  },
  custodyStatus: 'معتمد',
  responseMessage: 'SUCCESS',
  responseCode: true
};
