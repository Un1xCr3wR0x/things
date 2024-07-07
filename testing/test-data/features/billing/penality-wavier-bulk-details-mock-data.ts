export const PenalityWavierBulkDetailsMockData = {
  waiverType: 'SEGMENT',
  waiverStartDate: {
    gregorian: '2020-10-01T00:00:00.000Z',
    hijiri: '1442-02-14'
  },
  waiverEndDate: {
    gregorian: '2020-10-31T00:00:00.000Z',
    hijiri: '1442-03-14'
  },
  waivedPenaltyPercentage: 0,
  entitySelectionCriteria: null,
  reason: {
    arabic: 'تصحيح أخطاء في البيانات \\ الحساب',
    english: 'Correcting Mistakes of Data / Account'
  },
  reasonOthers: null,
  eventDate: null,
  entityType: 'ESTABLISHMENT',
  comments: null,
  uuid: null,
  selectedCriteria: {
    registrationNo: null,
    sin: null,
    segment: {
      name: {
        arabic: 'المنطقة',
        english: 'Region'
      },
      values: [
        {
          arabic: 'الكويت',
          english: 'Region Kuwait'
        },
        {
          arabic: 'البحرين',
          english: 'Region Bahrain'
        }
      ]
    }
  }
};
