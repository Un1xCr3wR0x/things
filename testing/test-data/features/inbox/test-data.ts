import { BPMTask } from '@gosi-ui/core';

export const inboxResponse = {
  inboxEntries: [
    {
      title: {
        arabic: 'إضافة مدة بأثر رجعي',
        english: 'Backdate Engagement'
      },
      description: {
        arabic: null,
        english: null
      },
      transactionId: 206136,
      activityId: 'ACT26220681471989',
      activityName: {
        arabic: 'رجعي',
        english: 'Approve Contributor'
      },
      message: {
        arabic: null,
        english: null
      },
      category: {
        arabic: null,
        english: null
      },
      taskId: 'e9caa0da-618b-4ae9-b288-e354fa0454eb',
      route: '/test/1234/avijit/45678',
      resourceId: null,
      assigneeId: 'sabin',
      assigneeName: 'sabin',
      assignedRole: 'Validator1',
      assigneeType: 'user',
      assignedDate: {
        gregorian: '2019-11-27T00:00:00.000Z',
        hijiri: '1441-03-30'
      },
      initiatedDate: {
        gregorian: '2019-11-27T00:00:00.000Z',
        hijiri: '1441-03-30'
      },
      dueDate: null,
      type: 'WorkList',
      state: {
        arabic: 'تعيين',
        english: 'ASSIGNED'
      },
      updatedBy: 'workflowsystem',
      viewed: 0,
      createdDate: '2019-11-27T09:40:05.000+0300',
      ecid: null,
      outcome: null,
      subState: null,
      resourceType: null,
      sourceChannel: 'gosi-online',
      priority: 5,
      payload: null,
      processName: null,
      previousOwnerRole: null
    }
  ],
  unViewed: 81,
  pageCount: 1
};
export const getPriorityResponseData = {
  priorityMap: {
    HIGH: 5,
    LOW: 1,
    MEDIUM: 3
  },
  transactionMap: {
    COMPLETED: 10,
    REASSIGNED: 11,
    ASSIGNED: 5
  },
  performanceMap: {
    RETURN: 20,
    REJECT: 10
  },
  totalCount: 20
};
export const bpmResponseData = {
  tasks: [
    {
      taskId: 'e9caa0da-618b-4ae9-b288-e354fa0454eb',
      taskNumber: '1234567890',
      state: 'ASSIGNED',
      assignees: {
        id: '1234567890',
        displayName: {
          arabic: 'رجعي',
          english: 'Approve Contributor'
        },
        type: 'INJURY'
      },
      createdDate: {
        gregorian: '2019-11-27T00:00:00.000Z',
        hijiri: '1441-03-30'
      },
      assignedDate: {
        gregorian: '2019-11-27T00:00:00.000Z',
        hijiri: '1441-03-30'
      },
      workflowPattern: 'ABC',
      dueDate: {
        gregorian: '2019-11-27T00:00:00.000Z',
        hijiri: '1441-03-30'
      },
      updatedDate: {
        gregorian: '2019-11-27T00:00:00.000Z',
        hijiri: '1441-03-30'
      },
      updatedBy: 'VALIDATOR1',
      priority: 3,
      tittleEnglish: 'COMPLAINTS',
      tittleArabic: ' ',
      descriptionEnglish: 'from 1234',
      descriptionArabic: '  ',
      payload: '1234567890',
      assignedRole: 'Validator1',
      transactionId: '123456',
      resourceId: '12345678',
      resourceType: '12345678',
      route: '/test/1234/avijit/45678',
      dateTime: '12-00-2100ZT1234',
      timeTasks: '12345'
    }
  ]
};
export const bpmRequestData = {
  join: {
    ignoreCase: 'TRUE',
    joinOperator: 'EQ',
    tableName: 'WFTask'
  },
  limit: {
    end: '10',
    start: '1'
  },
  taskQuery: {
    ordering: {
      clause: {
        column: 'assigneddate',
        sortOrder: 'DESCENDING'
      }
    },
    predicate: {
      assignmentFilter: 'MY_AND_GROUP',
      predicate: {
        clause: [
          {
            column: {
              columnName: 'state'
            },
            operator: 'EQ',
            value: 'ASSIGNED'
          }
        ]
      }
    }
  }
};
export const statusPriorityResponse = {
  assigneeId: 'string',
  priority: {
    HIGH: 2,
    LOW: 3,
    MEDIUM: 1
  },
  state: {
    COMPLETED: 1,
    REASSIGNED: 2,
    ASSIGNED: 5,
    WITHDRAWN: 0
  },
  totalCount: 8
};
export const taskCountResponse = {
  taskCountResponse: 123
};
export const BPMTaskResponse = {
  taskId: 'c9c649c2-9f08-4be6-b774-cbff8289f82c',
  comments: [],
  taskNumber: 260988,
  state: 'ASSIGNED',
  subState: 'REASSIGNED',
  assignees: { id: 'e0015962', displayName: 'محمد بن سليم العطوي', type: 'user' },
  assigneeId: 'e0015962',
  assigneeName: undefined,
  olaAvailable: undefined,
  registrationNo: undefined,
  olaDueDate: new Date(),
  systemAttributes: {
    assignedDate: new Date(),
    assigneeUsers: {
      id: 'avijit',
      displayName: 'avijit',
      type: 'user'
    },
    createdDate: new Date(),
    customActions: {
      action: 'APPROVE',
      displayName: 'Approve'
    },
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
          type: 'user',
          displayName: 'ehjfg'
        },
        updatedDate: new Date(),
        version: 1,
        versionReason: 'TASK_VERSION_REASON_INITIATED'
      }
    },
    state: 'ASSIGNED',
    systemActions: {
      action: 'CREATE_TODO',
      displayName: 'CREATE_TODO'
    },
    taskId: 'c41a1902-d13e-49c2-805a-81e9df66aa49',
    taskNumber: 206114,
    updatedBy: {
      id: 'workflowsystem',
      type: 'user',
      displayName: 'ehjfg'
    },
    updatedDate: new Date(),
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
  createdDate: new Date(),
  assignedDate: new Date(),
  workflowPattern: 'Participant',
  dueDate: new Date(),
  updatedDate: null,
  updatedBy: 'user',
  priority: 3,
  titleEnglish: '',
  titleArabic: '',
  descriptionEnglish: '',
  descriptionArabic: '',
  payload: '{"assignedRole":"CustomerCareOfficer","id":565015,"route":"NULL"}',
  assignedRole: 'CSA',
  transactionId: '100056432',
  resourceId: '',
  resourceType: 'PARTICIPANT',
  route: 'route',
  title: 'title',
  swimlaneRole: 'CustomerCareOfficer',
  tpaComments: [],
  userComment: [
    {
      comment: 'Dept Head Comment',
      commentScope: 'BPM',
      taskId: '440130',
      updatedBy: { id: 'e0025917', displayName: 'ياسر بن صقر العتيبي', type: 'user' },
      displayName: 'ياسر بن صقر العتيبي',
      id: 'e0025917',
      type: 'user',
      updatedDate: '2021-06-04T08:52:29+03:00'
    }
  ],
  initiatorUserId: null,
  initiatorRoleId: null,
  initiatorCommentDate: null,
  initiatorComment: null,
  dateTime: 'time',
  timeTasks: 'task',
  valueNow: 1,
  customActions: null,
  previousOutcome: 'ESCALATE',
  returnToCustomerUser: 'CSA',
  olaDuration: 'T24',
  referenceNo: '1234',
  content: null,
  channel: null,
  mergeJsonToObject(firstJson: BPMTask, secondJson: BPMTask) {
    Object.keys(new BPMTask()).forEach(key => {
      this[key] = firstJson[key] ? firstJson[key] : secondJson[key];
    });
    return this;
  }
};
