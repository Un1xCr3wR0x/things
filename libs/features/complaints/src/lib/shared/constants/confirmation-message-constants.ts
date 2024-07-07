/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { WorkFlowActions } from '@gosi-ui/core';
import { CategoryEnum } from '../enums';

/**
 *
 * This class is to declare complaints module constants.
 *
 * @export
 * @class ConfirmationMessageConstants
 */
export class ConfirmationMessageConstants {
  public static get CONFIRMATION_MESSAGE() {
    return [
      {
        category: CategoryEnum.COMPLAINT,
        action: WorkFlowActions.RESOLVE,
        message: 'RESOLVE-COMPLAINT-MESSAGE'
      },
      {
        category: CategoryEnum.ENQUIRY,
        action: WorkFlowActions.RESOLVE,
        message: 'RESOLVE-ENQUIRY-MESSAGE'
      },
      {
        category: CategoryEnum.APPEAL,
        action: WorkFlowActions.RESOLVE,
        message: 'RESOLVE-APPEAL-MESSAGE'
      },
      {
        category: CategoryEnum.PLEA,
        action: WorkFlowActions.RESOLVE,
        message: 'RESOLVE-PLEA-MESSAGE'
      },
      {
        category: CategoryEnum.COMPLAINT,
        action: WorkFlowActions.RETURN_TO_CUSTOMER,
        message: 'RETURN-TO-CUSTOMER-COMPLAINT-MESSAGE'
      },
      {
        category: CategoryEnum.ENQUIRY,
        action: WorkFlowActions.RETURN_TO_CUSTOMER,
        message: 'RETURN-TO-CUSTOMER-ENQUIRY-MESSAGE'
      },
      {
        category: CategoryEnum.APPEAL,
        action: WorkFlowActions.RETURN_TO_CUSTOMER,
        message: 'RETURN-TO-CUSTOMER-APPEAL-MESSAGE'
      },
      {
        category: CategoryEnum.PLEA,
        action: WorkFlowActions.RETURN_TO_CUSTOMER,
        message: 'RETURN-TO-CUSTOMER-PLEA-MESSAGE'
      },
      {
        category: CategoryEnum.COMPLAINT,
        action: WorkFlowActions.REQUEST_INFORMATION,
        message: 'REQUEST-INFO-COMPLAINT-MESSAGE'
      },
      {
        category: CategoryEnum.ENQUIRY,
        action: WorkFlowActions.REQUEST_INFORMATION,
        message: 'REQUEST-INFO-ENQUIRY-MESSAGE'
      },
      {
        category: CategoryEnum.APPEAL,
        action: WorkFlowActions.REQUEST_INFORMATION,
        message: 'REQUEST-INFO-APPEAL-MESSAGE'
      },
      {
        category: CategoryEnum.PLEA,
        action: WorkFlowActions.REQUEST_INFORMATION,
        message: 'REQUEST-INFO-PLEA-MESSAGE'
      },
      {
        category: CategoryEnum.COMPLAINT,
        action: WorkFlowActions.ESCALATE,
        message: 'ESCALATE-COMPLAINT-MESSAGE'
      },
      {
        category: CategoryEnum.ENQUIRY,
        action: WorkFlowActions.ESCALATE,
        message: 'ESCALATE-ENQUIRY-MESSAGE'
      },
      {
        category: CategoryEnum.APPEAL,
        action: WorkFlowActions.ESCALATE,
        message: 'ESCALATE-APPEAL-MESSAGE'
      },
      {
        category: CategoryEnum.PLEA,
        action: WorkFlowActions.ESCALATE,
        message: 'ESCALATE-PLEA-MESSAGE'
      },
      {
        category: CategoryEnum.SUGGESTION,
        action: WorkFlowActions.ESCALATE,
        message: 'ESCALATE-SUGGESTION-MESSAGE'
      },
      {
        category: CategoryEnum.COMPLAINT,
        action: WorkFlowActions.RETURN_TO_CUSTOMER_CARE,
        message: 'RETURN-TO-CUSTOMER-CARE-COMPLAINT-MESSAGE'
      },
      {
        category: CategoryEnum.ENQUIRY,
        action: WorkFlowActions.RETURN_TO_CUSTOMER_CARE,
        message: 'RETURN-TO-CUSTOMER-CARE-ENQUIRY-MESSAGE'
      },
      {
        category: CategoryEnum.APPEAL,
        action: WorkFlowActions.RETURN_TO_CUSTOMER_CARE,
        message: 'RETURN-TO-CUSTOMER-CARE-APPEAL-MESSAGE'
      },
      {
        category: CategoryEnum.PLEA,
        action: WorkFlowActions.RETURN_TO_CUSTOMER_CARE,
        message: 'RETURN-TO-CUSTOMER-CARE-PLEA-MESSAGE'
      },
      {
        category: CategoryEnum.SUGGESTION,
        action: WorkFlowActions.RETURN_TO_CUSTOMER_CARE,
        message: 'RETURN-TO-CUSTOMER-CARE-SUGGESTION-MESSAGE'
      },
      {
        category: CategoryEnum.COMPLAINT,
        action: WorkFlowActions.DELEGATE,
        message: 'DELEGATE-COMPLAINT-MESSAGE'
      },
      {
        category: CategoryEnum.ENQUIRY,
        action: WorkFlowActions.DELEGATE,
        message: 'DELEGATE-ENQUIRY-MESSAGE'
      },
      {
        category: CategoryEnum.APPEAL,
        action: WorkFlowActions.DELEGATE,
        message: 'DELEGATE-APPEAL-MESSAGE'
      },
      {
        category: CategoryEnum.PLEA,
        action: WorkFlowActions.DELEGATE,
        message: 'DELEGATE-PLEA-MESSAGE'
      },
      {
        category: CategoryEnum.COMPLAINT,
        action: WorkFlowActions.RESUBMIT,
        message: 'RESUBMIT-COMPLAINT-MESSAGE'
      },
      {
        category: CategoryEnum.ENQUIRY,
        action: WorkFlowActions.RESUBMIT,
        message: 'RESUBMIT-ENQUIRY-MESSAGE'
      },
      {
        category: CategoryEnum.SUGGESTION,
        action: WorkFlowActions.RESUBMIT,
        message: 'RESUBMIT-SUGGESTION-MESSAGE'
      },
      {
        category: CategoryEnum.APPEAL,
        action: WorkFlowActions.RESUBMIT,
        message: 'RESUBMIT-APPEAL-MESSAGE'
      },
      {
        category: CategoryEnum.PLEA,
        action: WorkFlowActions.RESUBMIT,
        message: 'RESUBMIT-PLEA-MESSAGE'
      },
      {
        category: CategoryEnum.COMPLAINT,
        action: WorkFlowActions.PROVIDE_INFORMATION,
        message: 'PROVIDE-INFO-COMPLAINT-MESSAGE'
      },
      {
        category: CategoryEnum.ENQUIRY,
        action: WorkFlowActions.PROVIDE_INFORMATION,
        message: 'PROVIDE-INFO-ENQUIRY-MESSAGE'
      },
      {
        category: CategoryEnum.APPEAL,
        action: WorkFlowActions.PROVIDE_INFORMATION,
        message: 'PROVIDE-INFO-APPEAL-MESSAGE'
      },
      {
        category: CategoryEnum.PLEA,
        action: WorkFlowActions.PROVIDE_INFORMATION,
        message: 'PROVIDE-INFO-PLEA-MESSAGE'
      },
      {
        category: CategoryEnum.SUGGESTION,
        action: WorkFlowActions.ACKNOWLEDGE,
        message: 'ACKNOWLEDGE-SUGGESTION-MESSAGE'
      },
      {
        category: CategoryEnum.SUGGESTION,
        action: WorkFlowActions.RE_ASSIGN_DEPARTMENT,
        message: 'REASSIGN-DEPARTMENT-SUGGESTION-MESSAGE'
      },
      {
        category: CategoryEnum.COMPLAINT,
        action: WorkFlowActions.REOPEN,
        message: 'REOPEN-COMPLAINT-MESSAGE'
      }
    ];
  }
}
