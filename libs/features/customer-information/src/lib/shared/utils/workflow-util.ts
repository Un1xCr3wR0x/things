import { HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { BilingualText, BpmHeaders, BPMUpdateRequest, RouterData, WorkFlowActions } from '@gosi-ui/core';

interface BPM {
  body: BPMUpdateRequest;
  headers: HttpHeaders;
}

export const approveMessage = (): BilingualText => {
  return { english: 'Transaction is approved.', arabic: 'تم اعتماد المعاملة.' };
};
export const rejectMessage = (): BilingualText => {
  return { english: 'Transaction is rejected.', arabic: 'تم رفض المعاملة.' };
};

export const returnMessage = (): BilingualText => {
  return { english: 'Transaction is returned.', arabic: 'تم إعادة المعاملة' };
};

export function assembleBpmRequest(
  routerData: RouterData,
  outcome: WorkFlowActions,
  form?: FormGroup,
  comments?: string
): BPM {
  const request = new BPMUpdateRequest();
  request.referenceNo = routerData.transactionId.toString();
  request.comments = comments || form?.get('comments')?.value;
  request.outcome = outcome;
  request.rejectionReason = form?.get('rejectionReason')?.value;
  request.returnReason = form?.get('returnReason')?.value;
  request.taskId = routerData.taskId;
  request.user = userRole(routerData);
  return { body: request, headers: assembleHttpHeaders(assembleBpmHeaders(routerData)) };
}

export function assembleHttpHeaders(headers: BpmHeaders): HttpHeaders {
  return Object.keys(headers)?.reduce((headerMap, key, index) => {
    if (index === 0) {
      return headerMap.set(key, headers[key]);
    } else {
      return headerMap.append(key, headers[key]);
    }
  }, new HttpHeaders());
}

export function userRole(taskDetails?: RouterData): string {
  return taskDetails.assigneeId;
}

/**
 * Method to assemble the BPM Headers
 * @param estRouterData
 */
export function assembleBpmHeaders(routerData: RouterData): BpmHeaders {
  return {
    bpmTaskId: routerData.taskId,
    workflowUser: userRole(routerData)
  };
}
