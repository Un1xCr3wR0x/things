export const contractDetails = [
  {
    id: 161,
    contractType: null,
    startDate: {
      gregorian: new Date('2017-12-11T00:00:00.000Z'),
      hijiri: '1439-03-23'
    },
    endDate: {
      gregorian: new Date('2018-12-11T00:00:00.000Z'),
      hijiri: '1440-04-04'
    },
    status: 'CONTRACT_EXPIRED',
    approvalDate: {
      gregorian: new Date('2018-08-05T13:45:56.000Z'),
      hijiri: '1439-11-23'
    },
    approvedBy: 'APPROVED BY CONTRIBUTOR',
    engagementId: 1560298524,
    cancelDate: undefined,
    rejectionReason: undefined,
    note: null,
    workType: { english: 'DISTANCE_WORKING', arabic: null },
    religion: undefined,
    dateFormat: undefined,
    oldContract: false,
    contractPeriod: {
      years: 2,
      months: 0
    },
    contractClauses: [],
    submissionDate: undefined,
    statusDate: undefined,
    terminationReason: undefined,
    workDetails: undefined,
    authorisedSignatory: undefined
  }
];

export const pendingContracts = {
  pendingContracts: [
    {
      establishmentName: {
        arabic: 'مصنع مياه رذاذ للمياه',
        english: null
      },
      contractType: 'LIMITED_CONTRACT',
      entryDate: {
        gregorian: '2020-07-13T00:00:00.000Z',
        hijiri: '1441-11-22'
      },
      autoRejectionDate: {
        gregorian: '2020-07-13T00:00:00.000Z',
        hijiri: '1441-11-22'
      },
      daysLeft: 0
    },
    {
      establishmentName: {
        arabic: 'مصنع مياه رذاذ للمياه',
        english: null
      },
      contractType: 'LIMITED_CONTRACT',
      entryDate: {
        gregorian: '2020-07-08T00:00:00.000Z',
        hijiri: '1441-11-17'
      },
      autoRejectionDate: {
        gregorian: '2020-07-08T00:00:00.000Z',
        hijiri: '1441-11-17'
      },
      daysLeft: -5
    }
  ]
};

export const contractAtValidator = {
  contracts: [
    {
      id: 1520657,
      startDate: {
        gregorian: '2020-08-01T00:00:00.000Z',
        hijiri: '1441-12-11'
      },
      status: 'DRAFT',
      type: 'LIMITED_CONTRACT',
      extendProbationPeriod: true,
      probationPeriodInDays: 10,
      engagementId: 638744000,
      workType: 'PART_TIME',
      workingDays: 5,
      workingHrs: 40,
      restDaysPerWeek: 2,
      annualLeaveInDays: 25,
      maritalStatus: {
        arabic: 'متزوج',
        english: 'Married'
      },
      dateFormat: 'H',
      contractClauses: []
    }
  ]
};
export const bankDetailsByPersonId = {
  isNonSaudiIBAN: true,
  ibanBankAccountNo: 'SA595504ASG66086110DS519',
  bankName: {
    arabic: 'BSFR',
    english: 'BSFR'
  },
  bankCode: null,
  verificationStatus: 'Sama Not Verified',
  approvalStatus: 'Sama Verification Pending',
  bankAddress: null,
  swiftCode: null,
  comments: null
};
export const bankDetailsByPerson = {
  bankAccountList: [
    {
      isNonSaudiIBAN: true,
      ibanBankAccountNo: 'SA595504ASG66086110DS519',
      bankName: {
        arabic: 'BSFR',
        english: 'BSFR'
      },
      bankCode: null,
      verificationStatus: 'Sama Not Verified',
      approvalStatus: 'Sama Verification Pending',
      bankAddress: null,
      swiftCode: null,
      comments: null
    }
  ]
};
export const bankDetailsByIBAN = {
  sequence: 0,
  value: {
    arabic: 'البنك السعودي الفرنسي   ',
    english: 'BSFR'
  }
};
export const violationRequest = {
  joiningDate: {
    gregorian: '2020-08-02T04:33:09.000Z',
    hijiri: '1441-12-12'
  },
  leavingDate: {
    gregorian: '2020-11-02T04:33:09.000Z',
    hijiri: '1442-03-16'
  },
  leavingReason: {
    arabic: 'مدة بأثر رجعي',
    english: 'Backdated Engagement'
  },
  violationSubType: {
    arabic: 'Modify Joining Date',
    english: 'Modify Joining Date'
  },
  violationType: {
    arabic: '',
    english: 'modify engagement'
  },
  engagementId: 1569360106
};
export const inspectionTask = {
  task: {
    title: 'e-inspection-prj',
    payload: {
      Request: {
        Body: {
          SocialInsuranceNo: 372129344,
          RegistrationNo: 501584916,
          id: 10037,
          requestId: 10037,
          resource: 'Violate engagement',
          channel: 'gosi-online',
          referenceNo: 985586,
          initiatorComment: 'NULL',
          violationType: 'Register cancel engagement violation'
        },
        Header: {
          CorrelationId: '185a6cc9-432f-4c8a-9ef0-18f06458cf64',
          BusinessContext: '/establishment/501584916/contributor/372129344/violation-request/10037'
        }
      },
      TXNElement: {
        Body: {
          AssignedUser: {
            '@type': 'def:string',
            TEXT: 'avijit'
          },
          AppRole: 'NULL',
          AssignedRole: 'Validator1',
          EstAdminUser: 'NULL',
          TitleEnglish: 'Cancel Engagement-E-inspection',
          TitleArabic: 'الغاء مدة الاشتراك- التفتيش الإلكتروني',
          DescriptionEnglish: 'Contributor Number : 372129344 at Establishment 501584916',
          DescriptionArabic: 'رقم المشترك : 372129344 لدى منشأة رقم : 501584916',
          Route: '/contributor',
          previousOutcome: 'SENDFORINSPECTION'
        }
      }
    },
    taskDefinitionURI: 'Ameen/e-inspection-prj!2.1/EInsValReturnedHT',
    ownerRole: 'e-inspection-prj.ProcessOwner',
    priority: 3,
    identityContext: 'jazn.com',
    processInfo: {
      instanceId: 60156,
      processId: 'EInspectionProcess',
      processName: 'EInspectionProcess'
    },
    systemAttributes: {
      assignedDate: '2021-01-11T12:36:46+03:00',
      assigneeUsers: {
        id: 'avijit',
        displayName: 'avijit',
        type: 'user'
      },
      createdDate: '2021-01-11T12:36:46+03:00',
      customActions: [
        {
          action: 'APPROVE',
          displayName: 'Approve'
        },
        {
          action: 'REJECT',
          displayName: 'Reject'
        },
        {
          action: 'RETURN',
          displayName: 'RETURN'
        },
        {
          action: 'SUBMIT',
          displayName: 'Submit'
        }
      ],
      digitalSignatureRequired: false,
      fromUser: {
        type: 'user'
      },
      hasSubTasks: false,
      inShortHistory: true,
      isGroup: false,
      numberOfTimesModified: 1,
      passwordRequiredOnUpdate: false,
      pushbackSequence: 'INITIAL_ASSIGNEES;1',
      secureNotifications: false,
      shortHistory: {
        task: {
          state: 'ASSIGNED',
          updatedBy: {
            id: 'workflowsystem',
            type: 'user'
          },
          updatedDate: '2021-01-11T12:36:46+03:00',
          version: 1,
          versionReason: 'TASK_VERSION_REASON_INITIATED'
        }
      },
      state: 'ASSIGNED',
      systemActions: [
        {
          action: 'CREATE_TODO',
          displayName: 'CREATE_TODO'
        },
        {
          action: 'VIEW_PROCESS_HISTORY',
          displayName: 'VIEW_PROCESS_HISTORY'
        },
        {
          action: 'VIEW_TASK',
          displayName: 'VIEW_TASK'
        },
        {
          action: 'VIEW_TASK_HISTORY',
          displayName: 'VIEW_TASK_HISTORY'
        },
        {
          action: 'START_TASK',
          displayName: 'START_TASK'
        },
        {
          action: 'ESCALATE',
          displayName: 'ESCALATE'
        },
        {
          action: 'VIEW_SUB_TASKS',
          displayName: 'VIEW_SUB_TASKS'
        },
        {
          action: 'CUSTOM',
          displayName: 'CUSTOM'
        },
        {
          action: 'UPDATE',
          displayName: 'UPDATE'
        },
        {
          action: 'UPDATE_ATTACHMENT',
          displayName: 'UPDATE_ATTACHMENT'
        },
        {
          action: 'UPDATE_COMMENT',
          displayName: 'UPDATE_COMMENT'
        },
        {
          action: 'INFO_REQUEST',
          displayName: 'INFO_REQUEST'
        },
        {
          action: 'REASSIGN',
          displayName: 'REASSIGN'
        },
        {
          action: 'SUSPEND',
          displayName: 'SUSPEND'
        },
        {
          action: 'DECOMPOSE_TASK',
          displayName: 'DECOMPOSE_TASK'
        },
        {
          action: 'DELEGATE',
          displayName: 'DELEGATE'
        }
      ],
      taskId: 'c41a1902-d13e-49c2-805a-81e9df66aa49',
      taskNumber: 206114,
      updatedBy: {
        id: 'workflowsystem',
        type: 'user'
      },
      updatedDate: '2021-01-11T12:36:46+03:00',
      version: 1,
      versionReason: 'TASK_VERSION_REASON_INITIATED',
      taskDefinitionId: 'Ameen/e-inspection-prj!2.1/EInsValReturnedHT',
      taskDefinitionName: 'EInsValReturnedHT',
      workflowPattern: 'Participant',
      isTestTask: false,
      participantName: 'default.DefaultPerformer',
      reviewers: {
        id: 'e-inspection-prj.ProcessReviewer',
        displayName: 'NULL',
        type: 'application_role'
      },
      assignees: {
        id: 'avijit',
        displayName: 'avijit',
        type: 'user'
      },
      rootTaskId: 'c41a1902-d13e-49c2-805a-81e9df66aa49',
      systemStringActions: 'PUSH_BACK,sharePayload',
      stage: 'Stage1',
      isTemplateTask: false,
      taskViewContext: 'Action Required',
      taskNamespace: 'http://xmlns.oracle.com/enrollment-collection-app/e-inspection-prj/EInsValReturnedHT',
      actionDisplayName: 'Assigned',
      componentType: 'Workflow',
      activityName: 'Validator Returned Approval',
      activityId: 'ACT30547268946685',
      thread: 0,
      parentThread: -1,
      swimlaneRole: 'RegistrationAndContributionsOperationsOfficer',
      timersSuspended: false,
      isDecomposedTask: false,
      formName: 'default',
      imageUrl: 'http://bpmapp01.gosi.ins:8050/integration/services/bpmImage',
      hiddenAttributes: {
        isCreatorHidden: false,
        creatorCustomText: 'NULL'
      }
    },
    systemMessageAttributes: {
      numberAttribute1: 0.0,
      numberAttribute2: 0.0,
      numberAttribute3: 0.0,
      numberAttribute4: 0.0,
      numberAttribute5: 0.0,
      numberAttribute6: 0.0,
      numberAttribute7: 0.0,
      numberAttribute8: 0.0,
      numberAttribute9: 0.0,
      numberAttribute10: 0.0,
      protectedNumberAttribute1: 0.0,
      protectedNumberAttribute2: 0.0,
      protectedNumberAttribute3: 0.0,
      protectedNumberAttribute4: 0.0,
      protectedNumberAttribute5: 0.0,
      protectedNumberAttribute6: 0.0,
      protectedNumberAttribute7: 0.0,
      protectedNumberAttribute8: 0.0,
      protectedNumberAttribute9: 0.0,
      protectedNumberAttribute10: 0.0
    },
    callback: {
      id: 'EInspectionProcess/HumanTasks.EInsValReturnedHT.reference',
      converstationId: 'urn:8561615f-53f0-11eb-bc4f-5254008d1972'
    },
    isPublic: false,
    sca: {
      applicationName: 'Ameen',
      componentName: 'EInsValReturnedHT',
      compositeDN: 'Ameen/e-inspection-prj!2.1*soa_1aa3a56c-b449-4060-b6d3-05af1eab60f8',
      compositeInstanceId: 60031,
      compositeName: 'e-inspection-prj',
      compositeVersion: 2.1,
      ecId: '0be93ffa-fff5-480d-83c8-ff2724b204a4-00008189',
      parentComponentInstanceId: 'bpmn:60156',
      parentComponentInstanceRefId: '60156-ACT30547268946685-EInspectionProcess_try.2-6',
      compositeCreatedTime: '2021-01-11T12:29:01.9+03:00',
      componentInstanceId: 60179,
      flowId: 60010,
      scaPartitionId: 10002
    },
    applicationContext: 'OracleBPMProcessRolesApp',
    taskDefinitionId: 'Ameen/e-inspection-prj!2.1/EInsValReturnedHT',
    correlationId: 'c41a1902-d13e-49c2-805a-81e9df66aa49',
    mdsLabel: 'soa_e5a294fd-b101-49a2-a54e-87b25b68db53',
    ownerRoleDisplayName: 'e-inspection-prj.Process Owner',
    customAttributes: 'NULL'
  }
};
