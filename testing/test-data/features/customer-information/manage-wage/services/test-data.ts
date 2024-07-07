import { FormControl, FormGroup } from '@angular/forms';
import { bindToObject, BilingualText } from '@gosi-ui/core';
import { CoveragePeriod, EngagementDetails } from '@gosi-ui/features/contributor';

export const getCurrentEngagementResponse = {
  engagements: [
    {
      engagementId: 1710000020,
      fromJsonToObject: {},
      formSubmissionDate: {
        gregorian: '2002-09-08',
        hijiri: '1427-07-01'
      },
      anyPendingRequest: false,
      leavingDate: {
        gregorian: '2002-09-08',
        hijiri: '1427-07-01'
      },
      joiningDate: {
        gregorian: '2002-09-08',
        hijiri: '1427-07-01'
      },
      contracts: [],
      workType: {
        arabic: '',
        english: ''
      },
      lastModifiedTimeStamp: {
        gregorian: '2002-09-08',
        hijiri: '1427-07-01'
      },

      engagementPeriod: [
        {
          occupation: {
            arabic: 'اختصاصي ماكياج',
            english: 'Make-up specialist'
          },
          startDate: {
            gregorian: new Date('2020-02-01T00:00:00.000Z'),
            hijiri: '1441-06-07'
          },
          endDate: null,
          coverageType: [
            {
              arabic: 'معاشات',
              english: 'Annuity'
            }
          ],
          coverages: [
            {
              converageType: {
                arabic: 'معاشات',
                english: 'Annuity'
              },
              coverage: 100
            }
          ],
          wage: {
            basicWage: 3000.0,
            housingBenefit: 100.0,
            commission: 100.0,
            otherAllowance: 100.0,
            totalWage: 3300.0,
            contributoryWage: 12345
          },
          product: {
            annuityTotal: 123,
            uiTotal: 123,
            ohTotal: 123
          },
          monthlyContributoryWage: 15000
        }
      ]
    }
  ]
};

const engagementList = {
  engagements: [
    {
      engagementId: 1710000020,
      fromJsonToObject: {},
      formSubmissionDate: {
        gregorian: '2002-09-08',
        hijiri: '1427-07-01'
      },
      anyPendingRequest: false,
      leavingDate: {
        gregorian: '2002-09-08',
        hijiri: '1427-07-01'
      },
      contracts: [],
      joiningDate: {
        gregorian: '2002-09-08',
        hijiri: '1427-07-01'
      },
      workType: {
        arabic: '',
        english: ''
      },
      lastModifiedTimeStamp: {
        gregorian: '2002-09-08',
        hijiri: '1427-07-01'
      },
      vicIndicator: true,
      engagementPeriod: [
        {
          occupation: {
            arabic: 'اختصاصي ماكياج',
            english: 'Make-up specialist'
          },
          startDate: {
            gregorian: new Date('2020-02-01T00:00:00.000Z'),
            hijiri: '1441-06-07'
          },
          endDate: {
            gregorian: new Date('2020-03-01T00:00:00.000Z'),
            hijiri: '1441-06-07'
          },
          coverages: [],
          minDate: null,
          lastUpdatedDate: null,
          fromJsonToObject: {},
          coverageType: [
            {
              arabic: 'معاشات',
              english: 'Annuity'
            }
          ],
          wage: {
            basicWage: 3000.0,
            housingBenefit: 100.0,
            commission: 100.0,
            otherAllowance: 100.0,
            totalWage: 3300.0,
            contributoryWage: 12345
          },
          product: {
            annuityTotal: 123,
            uiTotal: 123,
            ohTotal: 123
          },
          monthlyContributoryWage: 15000
        }
      ]
    }
  ]
};
export const engagementsArray = engagementList.engagements;

export const getEngagementResponse = engagementList;

export const overallEngagamentList = engagementsArray.map(eng => bindToObject(new EngagementDetails(), eng));

export const searchEngagementResponse = {
  activeEngagements: engagementsArray,
  overallEngagements: engagementsArray
};

export const contributorWageResponse = {
  periods: [
    {
      startDate: {
        gregorian: new Date('2020-02-01T00:00:00.000Z'),
        hijiri: '1441-06-07'
      },
      endDate: null,
      coverages: [
        {
          converageType: {
            arabic: 'معاشات',
            english: 'Annuity'
          },
          coverage: 100
        }
      ]
    }
  ],
  currentPeriod: {
    startDate: {
      gregorian: new Date('2020-02-01T00:00:00.000Z'),
      hijiri: '1441-06-07'
    },
    endDate: null,
    coverages: [
      {
        converageType: {
          arabic: 'معاشات',
          english: 'Annuity'
        },
        coverage: 100
      }
    ]
  }
};
export const periodArray = contributorWageResponse.periods.map(period => {
  bindToObject(new CoveragePeriod(), period);
});
export const vicContributionDetails = {
  contributorDetails: contributorWageResponse,
  contributionMonths: 6,
  lastBillPaidDate: { gregorian: '2021-01-31T00:00:00.000Z', hijiri: '1442-06-18' },
  numberOfUnPaidMonths: 0,
  refundableCreditBalance: 1000,
  totalContributionMonths: 4
};
export const getContributoryWageResponse = contributorWageResponse;
export const updateForm: FormGroup = new FormGroup({
  socialInsuranceNo: new FormControl(),
  engagementId: new FormControl(),
  wageDetails: new FormGroup({
    startDate: new FormGroup({
      gregorian: new FormControl(),
      hijiri: new FormControl()
    }),
    wage: new FormGroup({
      basicWage: new FormControl(),
      commission: new FormControl(),
      housingBenefit: new FormControl(),
      otherAllowance: new FormControl(),
      contributoryWage: new FormControl(),
      totalWage: new FormControl()
    }),
    occupation: new FormGroup({
      english: new FormControl(),
      arabic: new FormControl()
    })
  })
});

export const uploadFileRequest = {
  documentContent: 'string',
  documentType: 'string',
  name: { arabic: 'تسلسل الأجور', english: 'Pay Slip Sequence' },
  required: true,
  reuse: true,
  started: true,
  valid: true,
  contentId: 'string',
  fileName: 'string',
  sequenceNumber: 12354,
  uploaded: true,
  isUploading: true,
  size: 'string',
  isContentOpen: true,
  percentageLoaded: 12354,
  icon: 'string',
  businessKey: 'string',
  transactionId: 'string',
  uploadFailed: true,
  isScanning: true
};

export const getActiveContributorResponse = {
  contributors: [
    {
      nationality: {
        arabic: 'السعودية',
        english: 'Saudi Arabia'
      },
      identity: [
        {
          idType: 'NIN',
          newNin: 1234566097,
          oldNin: null,
          oldNinDateOfIssue: null,
          oldNinIssueVillage: null,
          expiryDate: null
        }
      ],
      name: {
        arabic: {
          firstName: 'احزثز',
          secondName: 'احزثز',
          thirdName: 'احزثز',
          familyName: 'احزثز'
        },
        english: {
          name: 'AAA AAA AAA AAA'
        }
      },
      socialInsuranceNo: 422062416,
      engagementId: 1567563410,
      wageDetails: {
        occupation: {
          arabic: 'فيزيائي ميكانيكا',
          english: 'Mechanical Physicist'
        },
        startDate: {
          gregorian: '2020-02-01T00:00:00.000Z',
          hijiri: '1441-06-07'
        },
        wage: {
          basicWage: 2525,
          housingBenefit: 2,
          commission: 1,
          otherAllowance: 0,
          totalWage: 2528,
          contributoryWage: 2528
        },
        lastUpdatedDate: {
          gregorian: '2020-02-19T08:49:51.000Z',
          hijiri: '1441-06-25'
        }
      },
      message: new BilingualText()
    },
    {
      nationality: {
        arabic: 'السعودية',
        english: 'Saudi Arabia'
      },
      identity: [
        {
          idType: 'NIN',
          newNin: 1234566162,
          oldNin: null,
          oldNinDateOfIssue: null,
          oldNinIssueVillage: null,
          expiryDate: null
        }
      ],
      name: {
        arabic: {
          firstName: 'احزثز',
          secondName: 'احزثز',
          thirdName: 'احزثز',
          familyName: 'احزثز'
        },
        english: {
          name: 'AAA AAA AAA AAA'
        }
      },
      socialInsuranceNo: 422063102,
      engagementId: 1567563399,
      wageDetails: {
        occupation: {
          arabic: 'اختصاصي في أعمال الوقاية من الحريق',
          english: 'Fire prevention specialist'
        },
        startDate: {
          gregorian: new Date(),
          hijiri: '1441-06-09'
        },
        wage: {
          basicWage: 45822,
          housingBenefit: 0,
          commission: 0,
          otherAllowance: 0,
          totalWage: 45822,
          contributoryWage: 45000
        },
        lastUpdatedDate: {
          gregorian: '2020-02-19T09:08:22.000Z',
          hijiri: '1441-06-25'
        }
      }
    }
  ],
  numberOfContributors: 2,
  pageNo: 0,
  pageSize: 10
};

export const updateSingleWageResponse = {
  engagementId: 1567563410,
  message: {
    arabic: 'السعودية',
    english: 'error updating'
  },
  socialInsuranceNumber: 422062416
};

export const updateWageResponse = {
  totalRequests: 10,
  noOfFailures: 10,
  noOfSuccess: 0,
  content: [
    {
      engagementId: 1567563410,
      message: {
        arabic: 'السعودية',
        english: 'error updating'
      },
      socialInsuranceNo: 422062416,
      hasError: true
    }
  ]
};
