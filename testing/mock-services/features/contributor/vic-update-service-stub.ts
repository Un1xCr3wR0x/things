import { of } from 'rxjs';

export class UpdateVICServiceStub {
  updateVicWage() {
    return of(updateVicWageResponse);
  }

  submitVicWageUpdate() {
    return of({ message: { english: 'Transaction is in progress', arabic: '' } });
  }

  getVicWageUpdateDetails() {
    return of(vicWageUpdateDetails);
  }
}

export const updateVicWageResponse = {
  id: undefined,
  referenceNo: 667371
};

export const vicWageUpdateDetails = {
  purposeOfRegistration: {
    arabic: 'صاحب مهنة',
    english: 'Professional'
  },
  wageSummary: {
    updatedPeriod: {
      startDate: {
        gregorian: new Date('2021-01-01T00:00:00.000Z'),
        hijiri: '1442-05-17'
      },
      occupation: {
        arabic: 'اختصاصي كيمياء وبيئة بحرية',
        english: 'Chemical specialist'
      },
      wageCategory: 36,
      basicWage: 31700,
      coverageTypes: [
        {
          arabic: 'معاشات',
          english: 'Annuity'
        }
      ],
      contributionAmount: 5706.0
    },
    currentPeriod: {
      startDate: {
        gregorian: new Date('2021-01-01T00:00:00.000Z'),
        hijiri: '1442-05-17'
      },
      occupation: {
        arabic: 'اختصاصي كيمياء وبيئة بحرية',
        english: 'Chemical specialist'
      },
      wageCategory: 36,
      basicWage: 31700,
      coverageTypes: [
        {
          arabic: 'معاشات',
          english: 'Annuity'
        }
      ],
      contributionAmount: 5706.0
    }
  },
  formSubmissionDate: {
    gregorian: new Date('2020-12-21T14:46:06.000Z'),
    hijiri: '1442-05-06'
  }
};
