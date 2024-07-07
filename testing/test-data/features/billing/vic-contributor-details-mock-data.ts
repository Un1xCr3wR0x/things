/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const vicContributorDetailsMockData = {
  person: {
    personId: '47581',
    personType: 'contributor'
  },
  contributorType: 'active',
  socialInsuranceNo: '124536987',
  active: 'false',
  hasActiveTerminatedOrCancelled: 'false'
};
export const personRequestData = {
  changeRequestList: [
    {
      id: 12345,
      type: 'fixed',
      status: 'WORKFLOW IN VALIDATION',
      oldValue: 'old',
      newValue: 'new',
      referenceNo: 12345,
      submissionDate: {
        gregorian: new Date('2020-03-17T13:00:22.000Z'),
        hijiri: '1441-07-22'
      },
      bankName: {
        english: ' Al Taj',
        arabic: ' '
      }
    }
  ]
};
