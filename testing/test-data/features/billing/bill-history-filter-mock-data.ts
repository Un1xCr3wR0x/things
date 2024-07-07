import { BilingualText } from '@gosi-ui/core';

export const billhistoryFilterMockData = {
  rejectedOHInducator: 'NO',
  adjustmentIndicator: 'yes',
  violtaionIndicator: 'yes',
  paymentStatus: [{ english: 'paid', arabic: '' }],
  billDate: {
    startDate: '2010-06-15',
    endDate: '2010-06-30'
  },
  settlementDate: {
    startDate: '2010-06-15',
    endDate: '2010-06-30'
  },
  amount: 1200,
  maxBillAmount: 1000,
  minBillAmount: 100,
  maxCreditAmount: 1000,
  minCreditAmount: 100,
  maxNoOfEstablishment: 10,
  minNoOfEstablishment: 1,
  maxSaudiCount: 5,
  minSaudiCount: 1,
  maxNonSaudiCount: 5,
  minNonSaudiCount: 1,
  pageNo: 0,
  pageSize: 10,
  maxNoOfActiveContributor: 1,
  minNoOfActiveContributor: 1,
  isSearch: false,
  isFilter: true
};
