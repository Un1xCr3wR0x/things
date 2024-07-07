export const benefitContributorData = {
  contributorId: 1018411784,
  contributorName: {
    arabic: 'احمد صمع احمد الجمعان ',
    english: 'Ahmed Samaa Ahmed Aljamaan'
  },
  requestDate: {
    gregorian: new Date('2021-04-10T00:00:00.000Z'),
    hijiri: '1442-08-28',
    entryFormat: 'GREGORIAN'
  },
  terminationReason: {
    arabic: 'إستقالة',
    english: 'Resigned'
  },
  terminationDate: {
    gregorian: new Date('2021-12-01T00:00:00.000Z'),
    hijiri: '1443-04-26',
    entryFormat: 'GREGORIAN'
  },
  personId: 1032956541,
  nin: 1102200530,
  dateOfBirth: {
    gregorian: new Date('1998-12-02T00:00:00.000Z'),
    hijiri: '1419-08-13',
    entryFormat: 'GREGORIAN'
  },
  age: 23,
  appealReason: null,
  type: {
    arabic: 'التعويض الأول',
    english: 'Saned first request'
  },
  startDate: null,
  endDate: null,
  reasonDescription: null,
  selectedEligiblePeriod: null,
  noContributionMonths: null
};
export const benefitSanedRecalculationData = {
  recalculationGroupedPeriods: [
    {
      startDate: { gregorian: new Date('2021-05-01T00:00:00.000Z'), entryFormat: 'GREGORIAN' },
      endDate: { gregorian: new Date('2021-08-31T00:00:00.000Z'), entryFormat: 'GREGORIAN' },
      recalcPeriods: [
        {
          uiType: 1031,
          period: 1,
          startDate: { gregorian: new Date('2021-05-01T00:00:00.000Z'), entryFormat: 'GREGORIAN' },
          endDate: { gregorian: new Date('2021-08-31T00:00:00.000Z'), entryFormat: 'GREGORIAN' },
          adjustmentAmount: -8000.0,
          reCalculation: {
            beforeRecalculation: {
              finalAverageMonthlyContributoryWage: null,
              totalUIContributionMonths: null,
              terminationDate: {
                gregorian: new Date('2021-03-30T00:00:00.000Z'),
                hijiri: '1442-08-17',
                entryFormat: 'GREGORIAN'
              },
              initialMonthsBenefitAmount: 2000,
              remainingMonthsBenefitAmount: 2000,
              uiType: 1031,
              uiPeriod: 1,
              benefitSuspendDate: null,
              benefitSuspensionReasons: null,
              benefitStatus: { arabic: 'يصرف', english: 'Active' },
              totalBenefitAmount: 24000,
              paidMonths: 8
            },
            afterRecalculation: {
              finalAverageMonthlyContributoryWage: 3000.0,
              totalUIContributionMonths: 15,
              terminationDate: {
                gregorian: new Date('2021-03-30T00:00:00.000Z'),
                hijiri: '1442-08-17',
                entryFormat: 'GREGORIAN'
              },
              initialMonthsBenefitAmount: 2000.0,
              remainingMonthsBenefitAmount: 2000.0,
              uiType: 1031,
              uiPeriod: 1,
              benefitSuspendDate: { gregorian: new Date('2021-08-31T00:00:00.000Z'), entryFormat: 'GREGORIAN' },
              benefitSuspensionReasons: [{ arabic: 'Active contributor', english: 'Active contributor' }],
              benefitStatus: { arabic: 'موقوف', english: 'Stopped' },
              totalBenefitAmount: 8000.0,
              paidMonths: 3
            }
          },
          revisedStatus: { arabic: 'المعدل', english: 'Modified' },
          revisedUiType: null,
          revisedPeriod: null,
          requestDate: { gregorian: new Date('2021-04-10T00:00:00.000Z'), hijiri: '1442-08-28', entryFormat: null }
        }
      ]
    }
  ],
  modificationRefNo: 1037411,
  engagementModifications: [],
  adjustments: [
    {
      adjustmentType: { arabic: 'مدين', english: 'Debit' },
      uiType: 1031,
      adjustmentReason: {
        arabic: 'صرف بالزيادة: مبلغ المنفعة الأساسي',
        english: 'Excess payment: Benefit basic amount'
      },
      adjustmentAmount: 8000.0,
      uiPeriodStartDate: { gregorian: new Date('2021-05-01T00:00:00.000Z'), entryFormat: 'GREGORIAN' },
      uiPeriodStopDate: { gregorian: new Date('2021-08-31T00:00:00.000Z'), entryFormat: 'GREGORIAN' },
      adjustmentPercentage: 10.0
    }
  ],
  totalAdjustmentAmount: -8000.0,
  previousAdjustmentAmount: 0,
  directPaymentStatus: false,
  hasOverlappingEngagements: false,
  engagementId: 1573486216,
  registrationNo: 200087070,
  recalculationType: 'Add Engagement'
};
export const benefitRecalculationData = {
  adjustments: [
    {
      adjustmentType: { arabic: 'مدين', english: 'Debit' },
      adjustmentReason: {
        arabic: 'صرف بالزيادة: مبلغ المنفعة الأساسي',
        english: 'Excess payment: Benefit basic amount'
      },
      adjustmentAmount: 8000.0,
      benefitPeriodStartDate: { gregorian: new Date('2021-05-01T00:00:00.000Z'), entryFormat: 'GREGORIAN' },
      benefitPeriodStopDate: { gregorian: new Date('2021-08-31T00:00:00.000Z'), entryFormat: 'GREGORIAN' },
      adjustmentPercentage: 10.0
    }
  ],
  directPaymentStatus: true,
  engagementId: 0,
  engagementModifications: [
    {
      endDate: {
        entryFormat: 'GREGORIAN',
        gregorian: new Date('2021-08-31T00:00:00.000Z'),
        hijiri: 'yyyy-MM-dd'
      },
      months: 0,
      newWage: 0,
      previousWage: 0,
      startDate: {
        entryFormat: 'GREGORIAN',
        gregorian: new Date('2021-05-01T00:00:00.000Z'),
        hijiri: 'yyyy-MM-dd'
      },
      status: {
        arabic: 'Cancel',
        english: 'Cancel'
      }
    }
  ],
  hasOverlappingEngagements: true,
  modificationRefNo: 123456,
  netAdjustmentAmount: 10,
  newBenefitDetails: {
    benefitConversionType: 'lumpsumToPension',
    lumpsumToPension: {
      adjustmentDetails: {
        additionalContribution: {
          additionalContributionAmount: 0,
          additionalContributionMonths: 0,
          deductionAmount: 0,
          deductionPercent: 0,
          endDate: {
            entryFormat: 'GREGORIAN',
            gregorian: new Date('2021-08-01T00:00:00.000Z'),
            hijiri: 'yyyy-MM-dd'
          },
          paymentAmount: 0,
          recoveryPeriodMonths: 0,
          startDate: {
            entryFormat: 'GREGORIAN',
            gregorian: new Date('2021-05-01T00:00:00.000Z'),
            hijiri: 'yyyy-MM-dd'
          }
        },
        netAdjustmentAmount: 0,
        returnAmount: 0
      },
      amw: 10,
      benefitType: {
        arabic: 'Retirement Pension',
        english: 'Retirement Pension'
      },
      paymentDetails: {
        bankName: {
          arabic: 'string',
          english: 'string'
        },
        iban: 'string',
        payeeType: {
          arabic: 'string',
          english: 'string'
        },
        paymentMethod: {
          arabic: 'string',
          english: 'string'
        }
      },
      pensionAmount: 0,
      requestDate: {
        entryFormat: 'GREGORIAN',
        gregorian: new Date('2021-05-01T00:00:00.000Z'),
        hijiri: 'yyyy-MM-dd'
      },
      totalAnnuityContributionMonths: 0
    },
    pensionToLumpsum: {
      benefitAmount: 0,
      benefitType: {
        arabic: 'Retirement Pension',
        english: 'Retirement Pension'
      },
      finalAverageMonthlyContributoryWage: 0,
      totalAnnuityContributionMonths: 0
    },
    revisedBenefitTypes: ['lumpsumToPension', 'pensionToLumpsum']
  },
  previousAdjustmentAmount: 10,
  reCalculation: {
    afterRecalculation: {
      benefitAmount: 0,
      benefitEndDate: {
        entryFormat: 'GREGORIAN',
        gregorian: new Date('2021-08-01T00:00:00.000Z'),
        hijiri: 'yyyy-MM-dd'
      },
      benefitStartDate: {
        entryFormat: 'GREGORIAN',
        gregorian: new Date('2021-05-01T00:00:00.000Z'),
        hijiri: 'yyyy-MM-dd'
      },
      dependentComponentAmount: 0,
      finalAverageMonthlyContributoryWage: 0,
      totalContributionMonths: 0
    },
    beforeRecalculation: {
      benefitAmount: 0,
      benefitEndDate: {
        entryFormat: 'GREGORIAN',
        gregorian: new Date('2021-08-01T00:00:00.000Z'),
        hijiri: 'yyyy-MM-dd'
      },
      benefitStartDate: {
        entryFormat: 'GREGORIAN',
        gregorian: new Date('2021-05-01T00:00:00.000Z'),
        hijiri: 'yyyy-MM-dd'
      },
      dependentComponentAmount: 0,
      finalAverageMonthlyContributoryWage: 0,
      totalContributionMonths: 0
    }
  },
  reEmploymentDetails: {
    periods: [
      {
        adjustmentAmount: 10,
        endDate: {
          entryFormat: 'GREGORIAN',
          gregorian: new Date('2021-08-31T00:00:00.000Z'),
          hijiri: 'yyyy-MM-dd'
        },
        monthlyWage: 10,
        months: 10,
        reCalculation: {
          afterRecalculation: {
            benefitAmount: 10,
            benefitEndDate: {
              entryFormat: 'GREGORIAN',
              gregorian: new Date('2021-08-31T00:00:00.000Z'),
              hijiri: 'yyyy-MM-dd'
            },
            benefitStartDate: {
              entryFormat: 'GREGORIAN',
              gregorian: new Date('2021-05-01T00:00:00.000Z'),
              hijiri: 'yyyy-MM-dd'
            },
            dependentComponentAmount: 10,
            finalAverageMonthlyContributoryWage: 10,
            totalContributionMonths: 10
          },
          beforeRecalculation: {
            benefitAmount: 20,
            benefitEndDate: {
              entryFormat: 'GREGORIAN',
              gregorian: new Date('2021-08-31T00:00:00.000Z'),
              hijiri: 'yyyy-MM-dd'
            },
            benefitStartDate: {
              entryFormat: 'GREGORIAN',
              gregorian: new Date('2021-05-01T00:00:00.000Z'),
              hijiri: 'yyyy-MM-dd'
            },
            dependentComponentAmount: 10,
            finalAverageMonthlyContributoryWage: 10,
            totalContributionMonths: 10
          }
        },
        startDate: {
          entryFormat: 'GREGORIAN',
          gregorian: new Date('2021-05-01T00:00:00.000Z'),
          hijiri: 'yyyy-MM-dd'
        }
      }
    ]
  },
  recalculationType: 'Re-employment',
  registrationNo: 0,
  totalAdjustmentAmount: 10
};
