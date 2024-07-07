export const validatorDetailsMock = {
  assignedCommittee: {
    english: 'string',
    arabic: 'string'
  },
  contributors: [
    {
      contributorId: 123,
      contributorName: {
        english: 'string',
        arabic: 'string'
      },
      dateOfBirth: null,
      excluded: false,
      excludedInModify: false,
      identity: null,
      modified: false,
      nationalId: 123,
      penaltyAmount: 123,
      socialInsuranceNo: 1234,
      totalContributionAmount: 1234,
      violationTypeDescription: {
        english: 'string',
        arabic: 'string'
      },
      vlContributorId: 123,
      vlContModified: false,
      previousViolationRecordDesc: {
        english: 'string',
        arabic: 'string'
      },
      engagementInfo: [
        {
          engagementId: 123,
          joiningDate: null,
          terminationDate: null,
          cancelledEngDuration: null,
          changeTerminationReasonTransaction: 123,
          oldJoiningDate: null,
          updatedJoiningDate: null,
          oldTerminationDate: null,
          updatedTerminationDate: null,
          oldTerminationReason: 'string',
          updatedTerminationReason: 'string',
          oldWage: 123,
          updatedWage: 1223,
          triggerTransactionId: 123,
          isWageCorrected: false,
          isGracePeriodExceeded: false,
          contributionInfo: { contributionAmount: 123, endDate: null, startDate: null },
          joinMonthSaudiContributorCount: 123,
          isViolationHappenedBeforeFiveYears: {
            english: 'string',
            arabic: 'string'
          },
          requestSubmissionDate: null
        }
      ],
      newPenaltyAmount: 123,
      compensated: false,
      previousCancelledEngagementViolation: {
        english: 'string',
        arabic: 'string'
      }
    }
  ],
  dateReported: {
    gregorian: new Date('2020-07-24T08:23:53.000Z'),
    hijiri: '1441-12-03'
  },
  establishmentInfo: {
    registrationNo: 1234,
    name: {
      english: 'string',
      arabic: 'string'
    },
    isClosed: false
  },
  existingTransactionAvailable: 'string',
  existingTransactionId: 124,
  fieldActivityNo: 'string',
  index: 123,
  inspectionInfo: {
    channel: {
      english: 'string',
      arabic: 'string'
    },
    visitId: 'string',
    inspectorComments: 'string',
    rasedRecommendation: {
      english: 'string',
      arabic: 'string'
    }
  },
  isSimisViolation: false,
  modifiedDecisions: [
    {
      dateOfModification: null,
      modificationTransactionId: 123,
      modifiedBy: 'string',
      employeeId: 'string',
      reasonForModification: {
        english: 'string',
        arabic: 'string'
      },
      role: {
        english: 'string',
        arabic: 'string'
      },
      comments: 'string',
      isCancelled: false
    }
  ],
  penaltyAmount: 123,
  penaltyInfo: [
    {
      dateOfModification: null,
      decisionBy: 'string',
      memberId: 'string',
      establishmentProactiveAction: false,
      excludedContributors: [
        {
          contributorId: 123,
          contributorName: {
            english: 'string',
            arabic: 'string'
          },
          compensated: false
        }
      ],
      justification: 'string',
      penaltyAmount: 123,
      role: 'string',
      selectedViolationClass: {
        english: 'string',
        arabic: 'string'
      },
      violatedContributors: [
        {
          compensated: false,
          contributionAmount: 123,
          contributorId: 1234,
          contributorName: {
            english: 'string',
            arabic: 'string'
          },
          violationAmount: 123
        }
      ],
      penaltyCalculationEquation: {
        english: 'string',
        arabic: 'string'
      }
    }
  ],
  referenceNo: 'string',
  repeatedViolation: false,
  repetitionCount: 1,
  violationClass: {
    english: 'string',
    arabic: 'string'
  },
  violationDescription: 'string',
  violationId: 123,
  violationStatus: {
    english: 'string',
    arabic: 'string'
  },
  violationType: {
    english: 'string',
    arabic: 'string'
  },
  violationTypeForRased: 'string',
  totalContributionAmount: 123
};
export const genericErrorViolations = {
  error: {
    code: 'GF-ERR-0001',
    message: {
      english: 'Sorry, a problem has occurred, please try again later.',
      arabic: 'عذرًا، حدثت مشكلة.. فضلًا قم بإعادة المحاولة لاحقًا.'
    }
  }
};
export const MemberDecisionDtoMock = {
  assignedCommitteeUser: 'string',
  committeeMemberOrHead: 'string',
  contributorsDecisionInfoDto: [
    {
      compensated: true,
      contributionAmount: 12,
      contributorId: 12,
      engagementId: 12,
      excluded: true
    }
  ],
  establishmentProactiveAction: false,
  justification: 'string',
  olderThanFiveYears: true,
  penaltyAmount: 12,
  comments: 'APPROVE::',
  commentScope: 'BPM',
  selectedViolationClass: 'string',
  outcome: 'string',
  penaltyCalculationEquation: {
    english: 'string',
    arabic: 'string'
  }
};
export const PenaltyInfoDetails = {
  channel: 'FO',
  contributorRequestDetails: [
    {
      contributionAmount: 100000,
      contributorId: 12345678,
      engagementId: 123455667
    }
  ],
  violationClass: {
    english: 'CANCEL-ENGAGEMENT',
    arabic: ''
  },
  violationType: {
    english: 'CANCEL-ENGAGEMENT',
    arabic: ''
  }
};
export const modifyViolationDetails = {
  channel: 'field-office',
  contributors: [
    {
      contributorId: 12,
      currentPenaltyAmount: 0,
      excluded: true,
      newPenaltyAmount: 0,
      vlContributorId: 12
    }
  ],
  reasonForModification: {
    english: 'Do not Impose penality',
    arabic: ''
  },
  totalCurrentPenaltyAmount: 1234,
  totalNewPenaltyAmount: 1000,
  initiatorName: 'name',
  initiatorRole: 'CSR',
  violationId: 12563365,
  transactionTraceId: null,
  comments: 'string'
};
export const ModifyViolationResponseData = {
  message: {
    english: 'Do not Impose penality',
    arabic: ''
  },
  transactionTraceId: 1234,
  violationId: 3456
};

export const cancelViolationDetails = {
  channel: 'feild-office',
  cancelViolationReason: {
    english: 'Do not Impose penality',
    arabic: ''
  },
  validatorName: 'nme',
  validatorRole: 'v1',
  transactionTraceId: null,
  comments: 'string'
};
export const cancelViolationResponseData = {
  message: {
    english: 'Do not Impose penality',
    arabic: ''
  },
  transactionTraceId: 1234,
  violationId: 3456
};
export const violationClassList = [
  {
    value: {
      english: 'Do not Impose penality',
      arabic: ''
    },
    code: 1343,
    sequence: 1,
    items: []
  },
  {
    value: {
      english: 'Maximum Amount',
      arabic: ''
    },
    code: 1343,
    sequence: 1,
    items: []
  }
];
