/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const contributionDetailedBillMockDate = [
  {
    itemizedContribution: [
      {
        person: {
          name: {
            arabic: {
              firstName: 'شاورين',
              familyName: 'راتاناش'
            },
            english: {}
          },
          identity: {
            idType: 'PASSPORT',
            passportNo: 70045,
            expiryDate: null,
            issueDate: null
          },
          nationality: {
            arabic: 'تايلند ',
            english: 'Thailand'
          },
          currentContributoryWage: 30000,
          oldContributoryWage: null
        },
        contributorContribution: {
          contributorShare: {
            annuity: 2700,
            ui: 300
          },
          establishmentShare: {
            annuity: 2700,
            oh: 600,
            ui: 300
          },
          total: 6600
        },
        contributionUnit: 30,
        calculationRate: 1000
      }
    ]
  }
];
