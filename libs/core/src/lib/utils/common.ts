import { AppConstants, ChannelConstants } from '../constants';
import {
  BPMOperators,
  PayloadKeyEnum,
  StatusBadgeTypes,
  TransactionStatus,
  ValidatorStatus,
  WorkFlowActions,
  ItTicketStatusEnum,
  SMSNotificationStatus
} from '../enums';

import { isObject } from './objects';
import { TransactionElementComment } from '@gosi-ui/core/lib/models/transaction-element-comment';
import moment from 'moment';
import { DependentHeirConstants } from '@gosi-ui/features/benefits/lib/shared/constants/dependent-heir-constants';
import { BPMRequest } from '../models/bpm-request';
import { BPMTask } from '../models/bpm-tasks';
import { ListItems, TransactionReferenceData } from '../models/transaction-reference-data';
import { RasedComment, TpaComment, UserComment } from '../models/bpm-comments';
import { BPMUpdateRequest } from '../models/bpm-update-request';
import { ItTicketHistory } from '../models/it-ticket-history';
import { BilingualText } from '../models/bilingual-text';

declare const require;
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export const maleIconLocation = 'assets/icons/man.svg';
export const FemaleIconLocation = 'assets/icons/female.svg';
export const convertToNdigit = function (value, digit = 2) {
  if (value >= 0) {
    digit = digit * -1;
    return ('0' + value).slice(digit);
  }
  return null;
};
// Function to perform common logic for border number, Iqama, Recruitment Number
export const checkSumValidation = function (input: string): boolean {
  const lastDigit = +input.substring(9, 10);
  const digitNine = +input.substring(8, 9);
  const digitEight = +input.substring(7, 8);
  const digitSeven = +input.substring(6, 7);
  const digitSix = +input.substring(5, 6);
  const digitFive = +input.substring(4, 5);
  const digitFour = +input.substring(3, 4);
  const digitThree = +input.substring(2, 3);
  const digitTwo = +input.substring(1, 2);
  const digitOne = +input.substring(0, 1);
  const sumOfDigits = digitNine * 1 + digitSeven * 10 + digitFive * 100 + digitThree * 1000 + digitOne * 10000;

  let twiceTheSum = '' + sumOfDigits * 2;
  if (twiceTheSum.length === 5) {
    twiceTheSum = '0' + twiceTheSum;
  }

  const newDigitOne = +twiceTheSum.substring(0, 1);
  const newDigitTwo = +twiceTheSum.substring(1, 2);
  const newDigitThree = +twiceTheSum.substring(2, 3);
  const newDigitFour = +twiceTheSum.substring(3, 4);
  const newDigitFive = +twiceTheSum.substring(4, 5);
  const newDigitSix = +twiceTheSum.substring(5, 6);
  const newSumOfDigits =
    newDigitSix +
    digitEight +
    newDigitFive +
    digitSix +
    newDigitFour +
    digitFour +
    newDigitThree +
    digitTwo +
    newDigitTwo +
    newDigitOne;

  let eStr = '' + newSumOfDigits;
  if (eStr.length === 1) {
    eStr = '0' + eStr;
  }

  const newSumOfDigits2 = +eStr.substring(0, 1);
  const finalSum = (newSumOfDigits2 + 1) * 10;

  let difference = finalSum - newSumOfDigits;

  const result = '' + difference;
  if (difference > 9) {
    difference = +result.substring(1, 2);
  }
  if (lastDigit === difference) {
    return true;
  } else {
    return false;
  }
};

/**
 * This method is used to style the status badge based on the received status
 * @param txn
 */
const transactionStatus = TransactionStatus;
export const statusBadgeType = (statusParam: String) => {
  const status = statusParam?.toUpperCase();
  if (
    status === transactionStatus.COMPLETED.toUpperCase() ||
    status === transactionStatus.APPROVED.toUpperCase() ||
    status === ValidatorStatus.ACTIVE.toUpperCase() ||
    status === transactionStatus.AVAILABLE.toUpperCase() ||
    status === transactionStatus.CURED_WITH_DISABILITY.toUpperCase() ||
    status === DependentHeirConstants.eligibleString.toUpperCase() ||
    status === DependentHeirConstants.eligibleForBackdatedString.toUpperCase() ||
    status === transactionStatus.ASSESSMENT_COMPLETED.toUpperCase() ||
    status === transactionStatus.ASSESSMENT_ACCEPTED_BY_PARTICIPANT.toUpperCase() ||
    status === transactionStatus.APPROVED_BY_GOSI_DOCTOR.toUpperCase()
  ) {
    return StatusBadgeTypes.SUCCESS;
  } else if (
    status === transactionStatus.REJECTED.toUpperCase() ||
    status === transactionStatus.RETURNED.toUpperCase() ||
    status === transactionStatus.RETURN.toUpperCase() ||
    status === ValidatorStatus.BLOCKED.toUpperCase() ||
    status === DependentHeirConstants.notEligibleString.toUpperCase()
  ) {
    return StatusBadgeTypes.DANGER;
  } else if (
    status === transactionStatus.IN_PROGRESS.toUpperCase() ||
    status === transactionStatus.DRAFT.toUpperCase() ||
    status === ValidatorStatus.ON_LEAVE.toUpperCase() ||
    status === transactionStatus.REASSIGNED.toUpperCase() ||
    status === transactionStatus.UNDER_REVIEW.toUpperCase() ||
    status === transactionStatus.AWAITING_ASSESSMENT_SCHEDULING.toUpperCase() ||
    status === transactionStatus.APPEALED_BY_GOSI.toUpperCase() ||
    status === transactionStatus.APPEALED_BY_PARTICIPANT.toUpperCase() ||
    status === transactionStatus.RESCHEDULED.toUpperCase() ||
    status === transactionStatus.RESCHEDULED_NO_SHOW.toUpperCase()
  ) {
    return StatusBadgeTypes.WARNING;
  } else if (status === transactionStatus.CLOSED.toUpperCase()) {
    return StatusBadgeTypes.SECONDARY;
  } else {
    return StatusBadgeTypes.INFO;
  }
};

export function generateBPMTaskListRequest(url: string, bpmRequest: BPMRequest) {
  let finalUrl = `${url}?`;
  if (bpmRequest) {
    if (bpmRequest.join) {
      if (bpmRequest.join.ignoreCase) finalUrl = `${finalUrl}join.ignoreCase=${bpmRequest.join.ignoreCase}&`;
      if (bpmRequest.join.joinOperator) finalUrl = `${finalUrl}join.joinOperator=${bpmRequest.join.joinOperator}&`;
      if (bpmRequest.join.tableName) finalUrl = `${finalUrl}join.tableName=${bpmRequest.join.tableName}&`;
    }
    if (bpmRequest.limit) {
      if (bpmRequest.limit.end) finalUrl = `${finalUrl}limit.end=${bpmRequest.limit.end}&`;
      if (bpmRequest.limit.start) finalUrl = `${finalUrl}limit.start=${bpmRequest.limit.start}&`;
    }
    if (bpmRequest.taskQuery) {
      if (bpmRequest.taskQuery.ordering) {
        if (bpmRequest.taskQuery.ordering.clause) {
          if (bpmRequest.taskQuery.ordering.clause.column)
            finalUrl = `${finalUrl}taskQuery.ordering.clause.column=${bpmRequest.taskQuery.ordering.clause.column}&`;
          if (bpmRequest.taskQuery.ordering.clause.sortOrder)
            finalUrl = `${finalUrl}taskQuery.ordering.clause.sortOrder=${bpmRequest.taskQuery.ordering.clause.sortOrder}&`;
        }
      }
      if (bpmRequest.taskQuery.predicate) {
        if (bpmRequest.taskQuery.predicate.assignmentFilter)
          finalUrl = `${finalUrl}taskQuery.predicate.assignmentFilter=${bpmRequest.taskQuery.predicate.assignmentFilter}&`;
        if (bpmRequest.taskQuery.predicate.predicate) {
          if (bpmRequest.taskQuery.predicate.predicate.clause) {
            bpmRequest.taskQuery.predicate.predicate.clause.forEach((item, index) => {
              finalUrl = `${finalUrl}taskQuery.predicate.predicate.clause[${index}].column.columnName=${item.column.columnName}&`;
              finalUrl = `${finalUrl}taskQuery.predicate.predicate.clause[${index}].operator=${item.operator}&`;
              finalUrl = `${finalUrl}taskQuery.predicate.predicate.clause[${index}].value=${item.value}&`;
            });
          }
        }
      }
    }
  }
  return finalUrl.slice(0, finalUrl.length - 1);
}

export function setCommentResponse(task: BPMTask): TransactionReferenceData[] {
  return assembleCommentsFromBpm(task);
}

export function assembleCommentsFromBpm(task: BPMTask): TransactionReferenceData[] {
  let referenceData: TransactionReferenceData[] = [];

  /** Added as a workaround of the defect 460697 and 515119 */
  if (
    task?.content?.TXNElement?.Body?.Comments &&
    task?.content?.TXNElement?.Body?.Comments?.comment &&
    task?.content?.TXNElement?.Body?.Comments?.comment !== 'NULL'
  ) {
    referenceData.push(assembleFOUserComment(task?.content?.TXNElement?.Body?.Comments));
  }

  if (task?.userComment?.length > 0) {
    task?.userComment?.forEach((comment: UserComment) => {
      referenceData.push(assembleUserComment(comment));
    });
  }
  if (task?.tpaComments?.length > 0) {
    task?.tpaComments?.forEach((comment: TpaComment) => {
      referenceData.push(assembleTpaComment(comment));
    });
  }
  if (task?.rasedComments?.length > 0) {
    task?.rasedComments?.forEach((comment: RasedComment) => {
      referenceData.push(assembleRasedComment(comment));
    });
  }
  if (task.initiatorComment && task.initiatorComment.toString().toLowerCase() !== BPMOperators.NULL.toLowerCase()) {
    const newReference = new TransactionReferenceData();
    newReference.comments = task.initiatorComment.toString();
    const roleMappingJson = require('../../../../../role-mapping.json');
    if (task.initiatorRoleId !== 'NULL' && task.initiatorRoleId !== undefined) {
      newReference.role.english = roleMappingJson.roleFeatures.find(
        item => item.roleNameEnglish.toLowerCase() === task.initiatorRoleId.toString().toLowerCase()
      )?.roleNameEnglish;
      newReference.role.arabic = roleMappingJson.roleFeatures.find(
        item => item.roleNameEnglish.toLowerCase() === task.initiatorRoleId.toString().toLowerCase()
      )?.roleNameArabic;
      if (newReference.role.english === undefined || newReference.role.arabic === undefined) {
        newReference.role = { english: task.initiatorRoleId.toString(), arabic: task.initiatorRoleId.toString() };
      }
    }
    newReference.userName = {
      english: task.initiatorUserId ? task.initiatorUserId.toString() : AppConstants.USER_LABEL.english,
      arabic: task.initiatorUserId ? task.initiatorUserId.toString() : AppConstants.USER_LABEL.arabic
    };
    newReference.createdDate = {
      gregorian: new Date(task.initiatorCommentDate ? task.initiatorCommentDate : null),
      hijiri: undefined
    };
    referenceData.push(newReference);
  }
  referenceData = referenceData.sort((a, b) => {
    const dateOne = moment(b.createdDate.gregorian);
    const dateTwo = moment(a.createdDate.gregorian);
    return dateOne.isAfter(dateTwo) ? 1 : dateOne.isBefore(dateTwo) ? -1 : 0;
  });
  return referenceData;
}

export function assembleTpaComment(comment: TpaComment) {
  const newReference = new TransactionReferenceData();
  newReference.comments = comment.tpaClarificationComments;
  newReference.role = { english: comment.tpaRoleId, arabic: comment.tpaRoleId };
  newReference.userName = { english: comment.tpaUserId, arabic: comment.tpaUserId };
  newReference.createdDate = { gregorian: new Date(comment.tpaUpdatedDate), hijiri: undefined };
  return newReference;
}
export function assembleRasedComment(comment: RasedComment) {
  const newReference = new TransactionReferenceData();
  newReference.comments = comment.rasedInitiatorComment;
  newReference.role = { english: comment.rasedRoleId, arabic: comment.rasedRoleId };
  newReference.userName = { english: comment.rasedUserId, arabic: comment.rasedUserId };
  newReference.createdDate = { gregorian: new Date(comment.rasedUpdatedDate), hijiri: undefined };
  return newReference;
}

/** Added as a workaround of the defect 460697 */

export function assembleFOUserComment(Comments: TransactionElementComment) {
  const newReference = new TransactionReferenceData();
  newReference.comments = Comments.comment;
  newReference.createdDate = { gregorian: new Date(Comments.date), hijiri: undefined };
  newReference.userName = { english: Comments.displayName, arabic: Comments.displayName };
  newReference.role = { english: Comments.userRole, arabic: Comments.userRole };
  return newReference;
}

export function assembleUserComment(comment: UserComment) {
  const comments = comment?.comment?.split(BPMOperators.DELIMITER);
  const newReference = new TransactionReferenceData();
  if (comments?.length > 1) {
    if (comments?.length === 4 || comments?.length === 3) {
      if (comments[0] === WorkFlowActions.REJECT)
        newReference.rejectionReason = { english: comments[2], arabic: comments[1] };
      else if (comments[0] === WorkFlowActions.RETURN) {
        newReference.returnReason = { english: comments[2], arabic: comments[1] };
        newReference.transactionStepStatus = WorkFlowActions.RETURN;
      } else if (comments[0] === WorkFlowActions.SUBMIT || comments[0] === WorkFlowActions.UPDATE) {
        newReference.returnReason = { english: comments[2], arabic: comments[1] };
        newReference.rejectionReason = { english: comments[2], arabic: comments[1] };
      } else if (comments[0] === WorkFlowActions.APPROVE) {
        newReference.comments = comments[1] ? comments[1] : null;
      }
      newReference.comments = comments[3] ? comments[3] : null;
    } else newReference.comments = comments[1] ? comments[1] : null;
  } else {
    if (comment?.comment) {
      newReference.comments = comment.comment;
    }
  }
  newReference.role =
    comment.updatedBy?.type.toLowerCase() === AppConstants.GOSI.toLowerCase()
      ? { english: AppConstants.GOSI_LABEL.english, arabic: AppConstants.GOSI_LABEL.arabic }
      : { english: comment.updatedBy?.type, arabic: comment.updatedBy?.type };
  if (comment.updatedBy?.displayName) {
    newReference.userName =
      comment.updatedBy?.displayName.toString().toLowerCase() === AppConstants.GOSI.toLowerCase()
        ? { english: AppConstants.GOSI_LABEL.english, arabic: AppConstants.GOSI_LABEL.arabic }
        : { english: comment.updatedBy?.displayName, arabic: comment.updatedBy?.displayName };
  } else {
    newReference.userName = { english: comment.updatedBy?.id, arabic: comment.updatedBy?.id };
  }
  newReference.createdDate = { gregorian: new Date(comment.updatedDate), hijiri: undefined };
  return newReference;
}

export function setCommentRequest(request: BPMUpdateRequest, bpmUpdateRequest: BPMUpdateRequest) {
  if (bpmUpdateRequest?.rejectionReason || bpmUpdateRequest?.returnReason || bpmUpdateRequest?.comments) {
    request.commentScope = bpmUpdateRequest?.commentScope;
    request.comments = bpmUpdateRequest?.outcome;
  } else {
    request.commentScope = undefined;
  }
  if (bpmUpdateRequest?.rejectionReason) {
    request.comments = `${request?.comments}${BPMOperators.DELIMITER}${bpmUpdateRequest?.rejectionReason?.arabic}${BPMOperators.DELIMITER}${bpmUpdateRequest?.rejectionReason?.english}`;
  }
  if (bpmUpdateRequest?.returnReason) {
    request.comments = `${request?.comments}${BPMOperators.DELIMITER}${bpmUpdateRequest?.returnReason?.arabic}${BPMOperators.DELIMITER}${bpmUpdateRequest?.returnReason?.english}`;
  }
  if (bpmUpdateRequest?.comments) {
    request.comments = `${request?.comments}${BPMOperators.DELIMITER}${bpmUpdateRequest?.comments}`;
  }
  return request;
}

/**
 * Method to assemble ITSM comments
 * @param ticketHistory
 */
export function setTicketCommentResponse(
  ticketHistory: ItTicketHistory[],
  getAllTickets = false
  // resolverComment: ListItems[]
): TransactionReferenceData[] {
  const comments: TransactionReferenceData[] = [];
  let tickets = ticketHistory;
  if (!getAllTickets)
    tickets = ticketHistory.filter(
      item => item.ticketStatus === ItTicketStatusEnum.CLOSED || item.ticketStatus === ItTicketStatusEnum.REOPENED
    );
  tickets.forEach(item => {
    let resolverComments = item.resolverComment;
    if (resolverComments?.length > 0) {
      resolverComments.forEach(items => {
        const comment = new TransactionReferenceData();
        comment.comments = items.itsmResolverComment;
        comment.ticketNumber = item.srNumber;
        comment.ticketStatus = item?.ticketStatus;
        comment.role = { english: item.srNumber, arabic: item.srNumber };
        comment.userName = { english: 'ITSM', arabic: 'بلاغ تقني' };
        const date = new Date(items.createdDate.gregorian);
        const currentDate = new Date();
        date.setHours(date.getHours() + currentDate.getTimezoneOffset() / 60);
        comment.createdDate = { gregorian: date, hijiri: '' };
        comments.push(comment);
      });
    } else {
      const comment = new TransactionReferenceData();
      comment.comments = item.comments;
      comment.ticketNumber = item.srNumber;
      comment.ticketStatus = item?.ticketStatus;
      comment.role = { english: item.srNumber, arabic: item.srNumber };
      comment.userName = { english: 'ITSM', arabic: 'بلاغ تقني' };
      const date = new Date(item.resolvedDate.gregorian);
      const currentDate = new Date();
      date.setHours(date.getHours() + currentDate.getTimezoneOffset() / 60);
      comment.createdDate = { gregorian: date, hijiri: '' };
      comments.push(comment);
    }
  });
  return comments;
}

/**
 * method to set the status badge types
 * @param wrk
 */
export function statusBadge(status: string) {
  if (
    status.toUpperCase() === TransactionStatus.COMPLETED.toUpperCase() ||
    status.toUpperCase() === TransactionStatus.APPROVED.toUpperCase() ||
    status.toUpperCase() === TransactionStatus.RESUBMITTED.toUpperCase() ||
    status.toUpperCase() === TransactionStatus.INITIATED.toUpperCase() ||
    status.toUpperCase() === TransactionStatus.SUBMIT.toUpperCase() ||
    status.toUpperCase() === TransactionStatus.RESOLVED.toUpperCase() ||
    status.toUpperCase() === TransactionStatus.DELEGATED.toUpperCase() ||
    status.toUpperCase() === TransactionStatus.REASSIGNED_TO_DEPT.toUpperCase()
  ) {
    return StatusBadgeTypes.SUCCESS;
  } else if (status.toUpperCase() === TransactionStatus.REJECTED.toUpperCase()) {
    return StatusBadgeTypes.DANGER;
  } else if (
    status.toUpperCase() === TransactionStatus.IN_PROGRESS.toUpperCase() ||
    status.toUpperCase() === TransactionStatus.DRAFT.toUpperCase() ||
    status.toUpperCase() === TransactionStatus.PENDING.toUpperCase()
  ) {
    return StatusBadgeTypes.WARNING;
  } else {
    return StatusBadgeTypes.INFO;
  }
}
/**
 * method to set the status badge types For Notification SMS
 * @param wrk
 */
export function SMSNotificationBadge(status: string) {
  if (status.toUpperCase() === SMSNotificationStatus.SENT.toUpperCase()) {
    return StatusBadgeTypes.SUCCESS;
  } else if (status.toUpperCase() === SMSNotificationStatus.FAILED.toUpperCase()) {
    return StatusBadgeTypes.DANGER;
  } else {
    return StatusBadgeTypes.INFO;
  }
}

export function removeEscapeChar(str: string, maxLength = null) {
  if (str) {
    let newStr = str.replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/\t/g, ' ').trim();
    if (window?.TextDecoder && window?.TextEncoder)
      if (maxLength) {
        const enco = new window.TextEncoder();
        const deco = new window.TextDecoder('utf-8');
        const uint8 = enco.encode(newStr);
        if (uint8.length > maxLength) {
          const section = uint8.slice(0, maxLength);
          newStr = deco.decode(section);
          if (newStr.includes('�')) newStr = newStr.replace(/[�]/g, '');
        }
      }
    return newStr;
  }
}

/**
 * Function for remove null values from task payload
 * @param payload
 */
export function removeTaskNullValues(payload) {
  if (payload) {
    Object.keys(payload).forEach(key => {
      if (!isObject(payload[key]) && key === PayloadKeyEnum.ITSM_COMMENT) delete payload[key];
      else if (
        !isObject(payload[key]) &&
        payload[key] === BPMOperators.NULL &&
        key !== PayloadKeyEnum.ROLE_ID &&
        key !== PayloadKeyEnum.USER_ID &&
        key !== PayloadKeyEnum.INITIATOR_COMMENT
      )
        delete payload[key];
      else if (typeof payload[key] === 'object') {
        payload[key] = removeTaskNullValues(payload[key]);
      }
    });
  }
  return payload;
}

/**
 * Function for build merge and update payload
 * @param payload
 * @param keys
 * @param index
 * @param value
 */
export function buildMergePayload(payload, keys, index, value) {
  if (checkKeyExists(payload, keys[index]) && index < keys.length - 1) {
    payload[keys[index]] = buildMergePayload(payload[keys[index]], keys, index + 1, value);
  }
  if (keys.length - 1 === index) {
    payload[keys[keys.length - 1]] = value;
  }
  return payload;
}

/**
 * Method to check key exists in json
 * @param json
 * @param key
 */
export function checkKeyExists(json, key) {
  return Object.keys(json)?.includes(key);
}

/**
 * Methog to get channel bilingual text
 * @param value
 */
export function getChannel(value: string): BilingualText {
  const channel = ChannelConstants?.CHANNELS_FILTER_TRANSACTIONS?.find(item => item.value === value);
  return channel ? { arabic: channel?.arabic, english: channel?.english } : null;
}

export function getTranslationKey(label: string): string {
  const translationMappingJson = require('../../../../../translation-mapping.json');
  const translationItem = translationMappingJson.translationMapping.find(
    item => item.label.toLowerCase() === label.toLowerCase()
  );
  return translationItem ? translationItem.key : null;
}
