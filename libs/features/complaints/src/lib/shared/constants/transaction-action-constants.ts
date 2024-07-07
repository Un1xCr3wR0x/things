/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Role, WorkFlowActions } from '@gosi-ui/core';
import { CategoryEnum } from '../enums';

/**
 *
 * This class is to declare complaints module constants.
 *
 * @export
 *
 */
export class ActionSequence {
  public static get GET_ORDER() {
    return [
      WorkFlowActions.RESOLVE,
      WorkFlowActions.RETURN_TO_CUSTOMER,
      WorkFlowActions.RETURN_TO_CUSTOMER_CARE,
      WorkFlowActions.REQUEST_INFORMATION,
      WorkFlowActions.RE_ASSIGN_DEPARTMENT,
      WorkFlowActions.ESCALATE,
      WorkFlowActions.ACKNOWLEDGE,
      WorkFlowActions.DELEGATE,
      WorkFlowActions.PROVIDE_INFORMATION,
      WorkFlowActions.REQUEST_ITSM,
      WorkFlowActions.RESUBMIT,
      WorkFlowActions.REOPEN
    ];
  }
}
export class ResolveConstants {
  public static get RESOLVE_ACTIONS() {
    return [
      {
        value: {
          english: 'Resolve Complaint',
          arabic: 'إقفال الطلب'
        },
        category: CategoryEnum.COMPLAINT
      },
      {
        value: {
          english: 'Resolve Enquiry',
          arabic: 'انهاء الاستفسار'
        },
        category: CategoryEnum.ENQUIRY
      },
      {
        value: {
          english: 'Resolve Appeal',
          arabic: 'إنهاء الاعتراض'
        },
        category: CategoryEnum.APPEAL
      },
      {
        value: {
          english: 'Resolve Plea',
          arabic: 'إنهاء الالتماس'
        },
        category: CategoryEnum.PLEA
      }
    ];
  }
}

export class ActionItemListConstants {
  public static get ACTION_ITEMS() {
    return [
      {
        code: 0,
        sequence: 0,
        value: {
          english: 'Escalate',
          arabic: 'تصعيد'
        },
        category: '',
        action: WorkFlowActions.ESCALATE,
        canDocument: true,
        canComment: true,
        canDepartment: false,
        canLocation: false,
        canUser: false,
        isCommentMandatory: false,
        canClerk: false,
        canCategory: true,
        canSubCategory: true,
        buttonLabel: 'ESCALATE'
      },
      {
        code: 1,
        sequence: 1,
        value: {
          english: 'Delegate',
          arabic: 'مفوض'
        },
        category: '',
        action: WorkFlowActions.DELEGATE,
        canDocument: true,
        canComment: true,
        canDepartment: true,
        canLocation: false,
        canUser: false,
        isCommentMandatory: true,
        canClerk: true,
        canCategory: false,
        canSubCategory: false,
        buttonLabel: 'DELEGATE'
      },
      {
        code: 2,
        sequence: 2,
        value: {
          english: 'Resolve Complaint',
          arabic: 'إقفال الطلب'
        },
        category: CategoryEnum.COMPLAINT,
        action: WorkFlowActions.RESOLVE,
        canDocument: true,
        canComment: true,
        canDepartment: false,
        canLocation: false,
        canUser: false,
        isCommentMandatory: true,
        canClerk: false,
        canCategory: false,
        canSubCategory: false,
        canValidateTransactionType: true,
        buttonLabel: 'RESOLVE'
      },
      {
        code: 3,
        sequence: 3,
        value: {
          english: 'Provide Information',
          arabic: 'ادخل معلومات'
        },
        category: '',
        action: WorkFlowActions.PROVIDE_INFORMATION,
        canDocument: true,
        canComment: true,
        canDepartment: false,
        canLocation: false,
        canUser: false,
        isCommentMandatory: true,
        canClerk: false,
        canCategory: false,
        canSubCategory: false,
        buttonLabel: 'PROVIDE-INFO'
      },
      {
        code: 4,
        sequence: 4,
        value: {
          english: 'Request Information',
          arabic: 'تعيين الى إدارة'
        },
        category: '',
        action: WorkFlowActions.REQUEST_INFORMATION,
        canDocument: true,
        canComment: true,
        canDepartment: true,
        canLocation: true,
        canUser: false,
        isCommentMandatory: true,
        canClerk: true,
        canCategory: false,
        canSubCategory: false,
        buttonLabel: 'REQUEST-INFO'
      },
      {
        code: 5,
        sequence: 5,
        value: {
          english: 'Return to Customer',
          arabic: 'إعادة إلى العميل'
        },
        category: '',
        action: WorkFlowActions.RETURN_TO_CUSTOMER,
        canDocument: true,
        canComment: true,
        canDepartment: false,
        canLocation: false,
        canUser: false,
        isCommentMandatory: true,
        canClerk: false,
        canCategory: false,
        canSubCategory: false,
        canValidateTransactionType: true,
        buttonLabel: 'RETURN-CUSTOMER'
      },
      {
        code: 6,
        sequence: 6,
        value: {
          english: 'Return to Customer Care',
          arabic: 'العودة إلى خدمة العملاء'
        },
        category: '',
        action: WorkFlowActions.RETURN_TO_CUSTOMER_CARE,
        canDocument: true,
        canComment: true,
        canDepartment: false,
        canLocation: false,
        canUser: false,
        isCommentMandatory: true,
        canClerk: false,
        canCategory: false,
        canSubCategory: false,
        buttonLabel: 'RETURN-CUSTOMER-CARE'
      },
      {
        code: 7,
        sequence: 7,
        value: {
          english: 'Re-submit',
          arabic: 'إعادة التقديم'
        },
        action: WorkFlowActions.RESUBMIT,
        canDocument: true,
        canComment: true,
        canDepartment: false,
        canLocation: false,
        canUser: false,
        isCommentMandatory: true,
        canClerk: false,
        canCategory: false,
        canSubCategory: false,
        buttonLabel: 'RESUBMIT'
      },
      {
        code: 8,
        sequence: 8,
        value: {
          english: 'Re-Assign to Department',
          arabic: 'إعادة تعيين إلى الإدارة'
        },
        action: WorkFlowActions.RE_ASSIGN_DEPARTMENT,
        canDocument: true,
        canComment: true,
        canDepartment: true,
        canLocation: true,
        canUser: false,
        isCommentMandatory: true,
        canClerk: false,
        canCategory: true,
        canSubCategory: true,
        buttonLabel: 'REASSIGN-DEPARTMENT'
      },
      {
        code: 8,
        sequence: 8,
        value: {
          english: 'Acknowledge',
          arabic: 'إقرار'
        },
        action: WorkFlowActions.ACKNOWLEDGE,
        canDocument: true,
        canComment: true,
        canDepartment: false,
        canLocation: false,
        canUser: false,
        isCommentMandatory: false,
        canClerk: false,
        canCategory: true,
        canSubCategory: true,
        canValidateTransactionType: true,
        buttonLabel: 'ACKNOWLEDGE'
      },
      {
        code: 9,
        sequence: 9,
        value: {
          english: 'Reopen',
          arabic: 'إعادة فتح'
        },
        action: WorkFlowActions.REOPEN,
        canDocument: true,
        canComment: true,
        canDepartment: false,
        canLocation: false,
        canUser: false,
        isCommentMandatory: true,
        canClerk: false,
        canCategory: false,
        canSubCategory: false,
        buttonLabel: 'RE-OPEN'
      }
    ];
  }
}
export class TransactionActionMessageConstants {
  public static get GET_MESSAGE() {
    return [
      {
        action: WorkFlowActions.ESCALATE,
        message: 'TRANSACTION-ESCALATED',
        role: Role.CUSTOMER_CARE_OFFICER
      },
      {
        action: WorkFlowActions.DELEGATE,
        message: 'TRANSACTION-DELEGATED',
        role: Role.DEPARTMENT_HEAD
      },
      {
        action: WorkFlowActions.RESOLVE,
        message: 'TRANSACTION-RESOLVED',
        role: Role.CUSTOMER_CARE_OFFICER
      },
      {
        action: WorkFlowActions.RESOLVE,
        message: 'TRANSACTION-RESOLVED',
        role: Role.CUSTOMER_CARE_SENIOR_OFFICER
      },
      {
        action: WorkFlowActions.PROVIDE_INFORMATION,
        message: 'TRANSACTION-PROVIDED-INFORMATION-DEPT',
        role: Role.DEPARTMENT_CLERK
      },
      {
        action: WorkFlowActions.PROVIDE_INFORMATION,
        message: 'TRANSACTION-PROVIDED-INFORMATION-CSA',
        role: Role.CUSTOMER_CARE_OFFICER
      },
      {
        action: WorkFlowActions.PROVIDE_INFORMATION,
        message: 'TRANSACTION-PROVIDED-INFORMATION-CSS',
        role: Role.CUSTOMER_CARE_SENIOR_OFFICER
      },
      {
        action: WorkFlowActions.REQUEST_INFORMATION,
        message: 'TRANSACTION-REQUEST-INFORMATION-CSA',
        role: Role.CUSTOMER_CARE_OFFICER
      },
      {
        action: WorkFlowActions.REQUEST_INFORMATION,
        message: 'TRANSACTION-REQUEST-INFORMATION-CSA',
        role: Role.CUSTOMER_CARE_SENIOR_OFFICER
      },
      {
        action: WorkFlowActions.REQUEST_INFORMATION,
        message: 'TRANSACTION-REQUEST-INFORMATION-DEPT',
        role: Role.DEPARTMENT_HEAD
      },
      {
        action: WorkFlowActions.RETURN_TO_CUSTOMER,
        message: 'TRANSACTION-RETURN-CUSTOMER',
        role: Role.CUSTOMER_CARE_OFFICER
      },
      {
        action: WorkFlowActions.RETURN_TO_CUSTOMER,
        message: 'TRANSACTION-RETURN-CUSTOMER',
        role: Role.CUSTOMER_CARE_SENIOR_OFFICER
      },
      {
        action: WorkFlowActions.RETURN_TO_CUSTOMER_CARE,
        message: 'TRANSACTION-RETURN-CUSTOMER-CARE',
        role: Role.DEPARTMENT_HEAD
      },
      {
        action: WorkFlowActions.RESUBMIT,
        message: 'TRANSACTION-RESUBMITTED',
        role: Role.EST_ADMIN
      },
      {
        action: WorkFlowActions.REOPEN,
        message: 'TRANSACTION-REOPENED',
        role: Role.EST_ADMIN
      },
      {
        action: WorkFlowActions.RE_ASSIGN_DEPARTMENT,
        message: 'TRANSACTION-REASSIGNED-DEPARTMENT',
        role: Role.CUSTOMER_CARE_OFFICER
      },
      {
        action: WorkFlowActions.RE_ASSIGN_DEPARTMENT,
        message: 'TRANSACTION-REASSIGNED-DEPARTMENT',
        role: Role.CUSTOMER_CARE_SENIOR_OFFICER
      },
      {
        action: WorkFlowActions.ACKNOWLEDGE,
        message: 'TRANSACTION-ACKNOWLEDGED',
        role: Role.CUSTOMER_CARE_OFFICER
      },
      {
        action: WorkFlowActions.ACKNOWLEDGE,
        message: 'TRANSACTION-ACKNOWLEDGED',
        role: Role.CUSTOMER_CARE_SENIOR_OFFICER
      },
      {
        action: WorkFlowActions.ACKNOWLEDGE,
        message: 'TRANSACTION-ACKNOWLEDGED',
        role: Role.DEPARTMENT_HEAD
      }
    ];
  }
}
