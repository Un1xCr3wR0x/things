/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  WorkFlowActions,
  RouterData,
  InspectionTypeEnum,
  RouterConstants,
  BilingualText,
  Lov,
  LovList,
  DocumentItem,
  BPMMergeUpdateParamEnum,
  Channel,
  BPMCommentScope,
  CommonIdentity,
  IdentityTypeEnum,
  Role
} from '@gosi-ui/core';
import { Route, InjuryStatus, OHTransactionType, WorkFlowType } from '../enums';
import { OhBPMRequest } from '../models/oh-bpm-request';
import { FormGroup } from '@angular/forms';
import { OhConstants } from '../constants';

/** This method is to navigate to inbox. */

export const setSuccessMessage = function (action: string, routerData: RouterData, isContributor: boolean, isAdmin: boolean) {
  let SuccessKey = '';
  if (action === WorkFlowActions.APPROVE) {
    SuccessKey = 'OCCUPATIONAL-HAZARD.TRANSACTION-APPROVED';
  } else if (action === WorkFlowActions.REJECT) {
    if (routerData && routerData.resourceType === Route.ADD_INJURY) {
      SuccessKey = 'OCCUPATIONAL-HAZARD.TRANSACTION-REJECTED-INJURY';
    } else if (routerData && routerData.resourceType === Route.ADD_COMPLICATION) {
      SuccessKey = 'OCCUPATIONAL-HAZARD.TRANSACTION-REJECTED-COMPLICATION';
    } else if (routerData && routerData.resourceType === Route.ADD_DISEASE) {
      SuccessKey = 'OCCUPATIONAL-HAZARD.TRANSACTION-REJECTED-DISEASE';
    } else {
      SuccessKey = 'OCCUPATIONAL-HAZARD.TRANSACTION-REJECTED';
    }
  } else if (action === WorkFlowActions.RETURN && isContributor && !isAdmin) {
    SuccessKey = 'OCCUPATIONAL-HAZARD.TRANSACTION-RETURNED_CONTRIBUTOR';
  } else if (action === WorkFlowActions.RETURN && !isContributor && isAdmin) {
    SuccessKey = 'OCCUPATIONAL-HAZARD.TRANSACTION-RETURNED_ADMIN';
  } else if (action === WorkFlowActions.RETURN && !isContributor && !isAdmin) {
    SuccessKey = 'OCCUPATIONAL-HAZARD.TRANSACTION-RETURNED';
  } else if (action === WorkFlowActions.SEND_FOR_CLARIFICATION) {
    SuccessKey = 'OCCUPATIONAL-HAZARD.TRANSACTION-CLARIFICATION';
  } else if (action === WorkFlowActions.SEND_FOR_INSPECTION) {
    SuccessKey = 'OCCUPATIONAL-HAZARD.RASED-SUBMIT';
  } else if (action === WorkFlowActions.REQUEST_MEDICAL_REPORTS) {
    SuccessKey = 'OCCUPATIONAL-HAZARD.REQUEST-MEDICAL-REPORTS';
  } else if (action === WorkFlowActions.SUBMIT) {
    SuccessKey = 'OCCUPATIONAL-HAZARD.SUCCESS-MESSAGE';
  } else if (action === WorkFlowActions.RQSTINSPECTION) {
    SuccessKey = 'OCCUPATIONAL-HAZARD.REQUEST-INSPECTION-MESSAGE';
  }

  return SuccessKey;
};

/** This method  to set workflow data For Inspection. */
export const setWorkFlowDataForInspection = function (
  routerData: RouterData,
  reportInjuryForm: FormGroup,
  value?
): OhBPMRequest {
  const workflowData = new OhBPMRequest();
  workflowData.taskId = routerData.taskId;
  workflowData.user = routerData.assigneeId;
  const formData = reportInjuryForm.getRawValue();
  if (formData?.comments) {
    workflowData.comments = formData.comments;
    workflowData.updateMap.set(BPMMergeUpdateParamEnum.COMMENTS, formData.comments);
  }
  if (value === 'reject') {
    workflowData.updateMap.set(BPMMergeUpdateParamEnum.FOREGOEXPENSES, formData?.injuryRejectFlag);
    workflowData.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON, formData.rejectionReason.english);
    workflowData.outcome = formData.status;
  } else if (value === 'request') {
    workflowData.outcome = WorkFlowActions.SEND_FOR_CLARIFICATION;
  } else {
    workflowData.outcome = WorkFlowActions.SEND_FOR_INSPECTION;
    if (formData?.selectedInspection) {
      if (formData.selectedInspection.english === InspectionTypeEnum.EA) {
        workflowData.updateMap.set(BPMMergeUpdateParamEnum.INSPECTIONTYPE, InspectionTypeEnum.EMPLOYEE_AFFAIRS);
      } else if (formData.selectedInspection.english === InspectionTypeEnum.SC) {
        workflowData.updateMap.set(BPMMergeUpdateParamEnum.INSPECTIONTYPE, InspectionTypeEnum.SAFETY_CHECK);
      } else if (formData.selectedInspection.english === InspectionTypeEnum.WI) {
        workflowData.updateMap.set(BPMMergeUpdateParamEnum.INSPECTIONTYPE, InspectionTypeEnum.OCCUPATIONAL_HAZARD);
      }
    }
  }
  workflowData.payload = routerData?.content;
  return workflowData;
};
/** This method  to set workflow data For Inspection. */
export const setWorkFlowDataForHealthInspection = function (
  routerData: RouterData,
  reportInjuryForm: FormGroup,
  value?
): OhBPMRequest {
  const workflowData = new OhBPMRequest();
  workflowData.taskId = routerData.taskId;
  workflowData.user = routerData.assigneeId;
  const formData = reportInjuryForm.getRawValue();
  if (formData?.comments) {
    workflowData.comments = formData.comments;
    workflowData.updateMap.set(BPMMergeUpdateParamEnum.COMMENTS, formData.comments);
  }
  if (value === 'reject') {
    workflowData.updateMap.set(BPMMergeUpdateParamEnum.FOREGOEXPENSES, formData?.injuryRejectFlag);
    workflowData.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON, formData.rejectionReason.english);
    workflowData.outcome = formData.status;
  } else if (value === 'request') {
    workflowData.outcome = WorkFlowActions.SEND_FOR_CLARIFICATION;
  } else {
    workflowData.outcome = WorkFlowActions.APPROVE;
    if (formData?.selectedInspection) {
      if (formData.selectedInspection.english === InspectionTypeEnum.EA) {
        workflowData.updateMap.set(BPMMergeUpdateParamEnum.INSPECTIONTYPE, InspectionTypeEnum.EMPLOYEE_AFFAIRS);
      } else if (formData.selectedInspection.english === InspectionTypeEnum.SC) {
        workflowData.updateMap.set(BPMMergeUpdateParamEnum.INSPECTIONTYPE, InspectionTypeEnum.SAFETY_CHECK);
      } else if (formData.selectedInspection.english === InspectionTypeEnum.WI) {
        workflowData.updateMap.set(BPMMergeUpdateParamEnum.INSPECTIONTYPE, InspectionTypeEnum.OCCUPATIONAL_HAZARD);
      }
    }
  }
  workflowData.payload = routerData?.content;
  return workflowData;
};
export const setWorkFlowDataForContributorClarification = function (
  routerData,
  contributorForm,
  contributorRequestedDocuments?,
  action?
) {
  const workflowData = new OhBPMRequest();
  const payload = JSON.parse(routerData.payload);
  workflowData.taskId = routerData.taskId;
  workflowData.user = routerData.assigneeId;
  workflowData.payload = routerData.content;
  workflowData.outcome = action ? action : WorkFlowActions.REQUEST_CLARIFICATION_FROM_CONTRIBUTOR;
  if (contributorForm?.get('comments')?.value) {
    workflowData.comments = contributorForm?.get('comments').value;
    workflowData.updateMap.set(BPMMergeUpdateParamEnum.COMMENTS, contributorForm.get('comments').value);
  }
  if (contributorRequestedDocuments) {
    workflowData.updateMap.set(BPMMergeUpdateParamEnum.DOCUMENT, contributorRequestedDocuments);
  }
  return workflowData;
};
export const setWorkFlowDataForNewMedicalReports = function (routerData, reportsFormControl) {
  const workflowData = new OhBPMRequest();
  workflowData.taskId = routerData.taskId;
  workflowData.user = routerData.assigneeId;
  workflowData.payload = routerData.content;
  workflowData.outcome = WorkFlowActions.REQUEST_MEDICAL_REPORTS;
  if (reportsFormControl?.get('comments')?.value) {
    workflowData.comments = reportsFormControl?.get('comments').value;
    workflowData.updateMap.set(BPMMergeUpdateParamEnum.COMMENTS, reportsFormControl.get('comments').value);
  }
  return workflowData;
};
/** This method  to set workflow data For Inspection. */
export const setWorkFlowDataForTpa = function (
  routerData: RouterData,
  workflowData: OhBPMRequest,
  tpaRequestedDocs,
  reportInjuryModal: FormGroup,
  transactionNumber: number,
  tpaCode: string
): OhBPMRequest {
  workflowData.taskId = routerData.taskId;
  workflowData.assignedRole = routerData.assignedRole;
  workflowData.user = routerData.assigneeId;
  workflowData.comments = reportInjuryModal.get('comments').value;
  workflowData.updateMap.set(BPMMergeUpdateParamEnum.DOCUMENT, tpaRequestedDocs);
  workflowData.updateMap.set(BPMMergeUpdateParamEnum.COMMENTS, reportInjuryModal.get('comments').value);
  workflowData.updateMap.set(BPMMergeUpdateParamEnum.TPACODE, tpaCode);
  return workflowData;
};
/** This method  to set workflow data For Inspection. */
export const setWorkFlowDataForAllowance = function (
  routerData: RouterData,
  reportAllowanceModal: FormGroup,
  reportAllowancForm: FormGroup,
  workflowRequest: string,
  action?
): OhBPMRequest {
  const workflowData = new OhBPMRequest();
  workflowData.taskId = routerData.taskId;
  workflowData.assignedRole = routerData.assignedRole;
  workflowData.user = routerData.assigneeId;
  const comments = reportAllowanceModal.getRawValue();
  const formData = reportAllowancForm.getRawValue();
  workflowData.comments = formData.comments;
  if (comments) {
    workflowData.workflowType = workflowRequest;
  }
  if (comments.comments) {
    workflowData.comments = comments.comments;
  } else {
    workflowData.comments = formData.comments;
  }
  if (action === WorkFlowActions.REJECT) {
    workflowData.rejectionReason = formData.rejectionReason;
  } else if (action === WorkFlowActions.RETURN && this.requstedDocuments === null) {
    workflowData.returnReason = formData.returnReason;
  }
  workflowData.status = formData.status;
  workflowData.outcome = action;
  return workflowData;
};
/** This method  to set comments for Validator. */
export const setComments = function (routerData: RouterData) {
  let canReject;
  if (routerData && routerData.state && routerData.state === 'RETURN') {
    canReject = false;
  }
  return canReject;
};

/** This method  to set comments for Validator. */
export const setClaimType = function (claimType: BilingualText) {
  let type =
    claimType.english === 'Total Disability Repatriation Expenses'
      ? OHTransactionType.TOTAL_DISABILITY_REPATRIATION
      : OHTransactionType.DEAD_BODY_REPATRIATION;
  return type;
};
/** This method  to create Lov list for Validator. */
export const createLovList = function (injuryItemList: DocumentItem[]) {
  let items: Lov[];
  let documentListLov: LovList;
  let iSequence = 0;
  if (injuryItemList.length > 0) {
    items = injuryItemList.map(document => {
      const lov = new Lov();
      lov.display = true;
      lov.value = document.name;
      return lov;
    });
    documentListLov = new LovList(items);
    documentListLov.items.forEach(doc => {
      doc.sequence = iSequence;
      iSequence++;
    });
  }
  return documentListLov;
};

/** This method  to set returnToEstAdmin for Validator. */
export const setReturnToEstAdmin = function (assignedRole) {
  let returnToEstAdmin;
  if (
    assignedRole !== OhConstants.TRANSACTION_MODIFY_INJURY &&
    assignedRole !== OhConstants.TRANSACTION_MODIFY_DISEASE &&
    assignedRole !== OhConstants.TRANSACTION_MODIFY_COMPLICATION
  ) {
    returnToEstAdmin = false;
  }
  return returnToEstAdmin;
};
/** This method  to set returnToEstAdmin for Validator. */
export const setTransactionKey = function (routerData: RouterData): OHTransactionType {
  let transactionKey = OHTransactionType.INJ_DOCUMENT_TRANSACTION_KEY;
  if (
    routerData.resourceType === OhConstants.TRANSACTION_REJECT_INJURY ||
    routerData.resourceType === OhConstants.TRANSACTION_REJECT_COMPLICATION ||
    routerData.resourceType === OhConstants.TRANSACTION_REJECT_COMPLICATION_TPA ||
    routerData.resourceType === OhConstants.TRANSACTION_REJECT_INJURY_TPA
  ) {
    transactionKey = OHTransactionType.REJ_INJ_DOC_TRANSACTION_KEY;
  } else if (
    routerData.resourceType === OhConstants.TRANSACTION_ADD_DISEASE ||
    routerData.resourceType === OhConstants.TRANSACTION_ADD_TRANSFER_INJURY
  ) {
    transactionKey = OHTransactionType.Disease;
  } else if (routerData.resourceType === OhConstants.TRANSACTION_REOPEN_DISEASE) {
    transactionKey = OHTransactionType.REOPEN_DISEASE;
  } else if (routerData.resourceType === OhConstants.TRANSACTION_CLOSE_COMPLICATION) {
    transactionKey = OHTransactionType.CLOSE_COMPLICATION;
  } else if (routerData.resourceType === OhConstants.TRANSACTION_CLOSE_INJURY) {
    transactionKey = OHTransactionType.CLOSE_INJURY;
  } else {
    transactionKey = OHTransactionType.INJ_DOCUMENT_TRANSACTION_KEY;
  }
  return transactionKey;
};

/** This method  to set Injury Time for Validator. */
export const setInjuryTime = function (complicationDetailsDto) {
  let complicationTime;
  complicationTime =
    complicationDetailsDto.injuryDetails.injuryHour !== null
      ? complicationDetailsDto.injuryDetails.injuryHour + ':' + complicationDetailsDto.injuryDetails.injuryMinute
      : null;
  return complicationTime;
};
/** This method  to set returnToEstAdmin for Validator. */
export const setTransactionTypeComp = function (routerData: RouterData) {
  let transactionType;
  transactionType =
    routerData.resourceType === OhConstants.TRANSACTION_REJECT_COMPLICATION_TPA ||
    routerData.resourceType === OhConstants.TRANSACTION_REJECT_COMPLICATION
      ? OHTransactionType.REJECT_INJURY
      : OHTransactionType.Complication;
  return transactionType;
};
/** This method  to set workflow data while Confirmation. */

export const setWorkFlowDataForConfirmation = function (
  routerData: RouterData,
  reportInjuryForm: FormGroup,
  reportInjuryModal: FormGroup,
  action: string,
  closingStatus: BilingualText,
  workflowRequest: string,
  requstedDocuments,
  visitingDoctorRequired?: boolean
): OhBPMRequest {
  const workflowData = new OhBPMRequest();
  const payload = JSON.parse(routerData.payload);
  workflowData.taskId = routerData.taskId;
  workflowData.user = routerData.assigneeId;
  const comments = reportInjuryModal.getRawValue();
  const formData = reportInjuryForm.getRawValue();
  if (comments) {
    workflowData.workflowType = workflowRequest;
  }
  if (comments.comments) {
    workflowData.comments = comments.comments;
  } else {
    workflowData.comments = formData.comments;
  }
  if (action === WorkFlowActions.REJECT) {
    workflowData.rejectionReason = formData.rejectionReason;
  } else if (action === WorkFlowActions.RETURN && requstedDocuments === null) {
    workflowData.returnReason = formData.returnReason;
  }
  workflowData.status = formData.status;
  if (
    routerData.resourceType === RouterConstants.TRANSACTION_CLOSE_INJURY ||
    routerData.resourceType === RouterConstants.TRANSACTION_CLOSE_COMPLICATION
  ) {
    workflowData.outcome = WorkFlowActions.APPROVE_WITHOUT;
    workflowData.closingStatus = closingStatus;
    if (workflowData.closingStatus.english === InjuryStatus.CURED_WITH_DISABILITY) {
      workflowData.outcome = WorkFlowActions.APPROVE_WITH;
    } else if (workflowData.closingStatus.english === InjuryStatus.CURED_WITHOUT_DISABILITY) {
      workflowData.outcome = WorkFlowActions.APPROVE_WITHOUT;
    }
  } else {
    workflowData.outcome = action;
  }
  if (
    (payload.channel === Channel.GOSI_ONLINE || payload.channel === Channel.TAMINATY || payload.channel === Channel.TPA) &&
    payload?.isValidator1 === 'TRUE' &&
    action === WorkFlowActions.RETURN &&
    (routerData.initiatorRoleId === 'Admin' || payload.initiatorRoleId === 'Admin' || payload.roleId === 'contributor' || payload.roleId === 'Admin' || payload.roleId === 'Contributor')
  ) {
    workflowData.isExternalComment = true;
    workflowData.commentScope = BPMCommentScope.BPM;
  }
  if (action === 'SUBMIT') {
    workflowData.visitingDocRequired = visitingDoctorRequired;
  }
  return workflowData;
};

/* this method to set transactionType for Reject TRansactions*/
export const setTransactionType = function (routerData: RouterData) {
  let resourceType =
    routerData.resourceType === OhConstants.TRANSACTION_REJECT_INJURY ||
    routerData.resourceType === OhConstants.TRANSACTION_REJECT_INJURY_TPA
      ? OHTransactionType.REJECT_INJURY
      : OHTransactionType.Injury;
  return resourceType;
};


// this method to set transaction type for ADD_INJURY transactions depending on government sector that attend the accedint.
export const setTransactionTypeForAddInjury = function (governmentSector) {


  console.log(governmentSector);

  let index = governmentSector?.indexOf(' ');
  let value = (index != -1) ? governmentSector?.substr(0, index)?.toUpperCase() : governmentSector?.toUpperCase();

  let resourceType;

  if(OHTransactionType.Traffic.includes(value)) {

    resourceType = OHTransactionType.Traffic;

  } else if(OHTransactionType.Police.includes(value)) {

    resourceType =OHTransactionType.Police;

  } else if(OHTransactionType.Civil_Defense.includes(value)) {

    resourceType =OHTransactionType.Civil_Defense;

  }else if(OHTransactionType.Red_Crescent.includes(value)) {

    resourceType =OHTransactionType.Red_Crescent;

  } else {

    resourceType =OHTransactionType.No_Sector;

  }
  

      return resourceType;
};


/* this method to set documentAlert for all Transactions*/
export const setDocAlert = function (DocumentList, requstedDocuments) {
  let docAlert = false;
  DocumentList.forEach(item => {
    for (let i = 0; i < requstedDocuments.length; i++) {
      if (item.name.english === requstedDocuments[i].english) {
        docAlert = true;
      }
    }
  });
  return docAlert;
};
/* this method to set transactionTYpe for REject TRansactions*/
export const setChangeRequired = function (routerData: RouterData) {
  let changeRequired = false;
  if (
    routerData.resourceType === OhConstants.TRANSACTION_MODIFY_DISEASE ||
    routerData.resourceType === OhConstants.TRANSACTION_REOPEN_DISEASE ||
    routerData.resourceType === OhConstants.TRANSACTION_CLOSE_DISEASE
  ) {
    changeRequired = true;
  } else if (
    routerData.resourceType === OhConstants.TRANSACTION_MODIFY_COMPLICATION ||
    routerData.resourceType === OhConstants.TRANSACTION_REOPEN_COMPLICATION ||
    routerData.resourceType === OhConstants.TRANSACTION_OCC_DISABILITY_REASSESSMENT
  ) {
    changeRequired = true;
  } else {
    changeRequired =
      routerData.resourceType === OhConstants.TRANSACTION_MODIFY_INJURY ||
      routerData.resourceType === OhConstants.TRANSACTION_REOPEN_INJURY
        ? true
        : false;
  }
  return changeRequired;
};
export const checkResourceType = function (workflowType, routerData) {
  let injuryType;
  if (
    workflowType === WorkFlowType.INJURY ||
    workflowType === WorkFlowType.COMPLICATION ||
    routerData.resourceType === OhConstants.TRANSACTION_MODIFY_INJURY ||
    routerData.resourceType === OhConstants.TRANSACTION_REOPEN_INJURY ||
    routerData.resourceType === OhConstants.TRANSACTION_REJECT_INJURY ||
    routerData.resourceType === OhConstants.TRANSACTION_REJECT_INJURY_TPA ||
    routerData.resourceType === OhConstants.TRANSACTION_CLOSE_INJURY || 
    routerData.resourceType === OhConstants.TRANSACTION_ADD_DEADBODY_CLAIMS
  ) {
    injuryType = true;
  } else {
    injuryType = false;
  }
  return injuryType;
};
export const getIdentityLabel = function (idObj: CommonIdentity) {
  let label = '';
  if (idObj.idType === IdentityTypeEnum.NIN) {
    label = 'BENEFITS.NIN';
  } else if (idObj.idType === IdentityTypeEnum.IQAMA) {
    label = 'BENEFITS.IQAMA-NUMBER';
  } else if (idObj.idType === IdentityTypeEnum.PASSPORT) {
    label = 'BENEFITS.PASSPORT-NO';
  } else if (idObj.idType === IdentityTypeEnum.NATIONALID) {
    label = 'BENEFITS.GCC-NIN';
  } else if (idObj.idType === IdentityTypeEnum.BORDER) {
    label = 'BENEFITS.BORDER-NO';
  }
  return label;
};

export const setRequestNewTPAReportsWorkflow = function (
  routerData,
  reportsFormControl: FormGroup,
  tpaReports,
  tpaCode?,
  value?
): OhBPMRequest {
  const workflowData = new OhBPMRequest();
  workflowData.taskId = routerData.taskId;
  workflowData.user = routerData.assigneeId;
  workflowData.isExternalComment = true;
  const formData = reportsFormControl.getRawValue();
  if (formData && formData.comments) {
    workflowData.comments = formData.comments;
    workflowData.updateMap.set(BPMMergeUpdateParamEnum.COMMENTS, formData.comments);
  }
  // if (tpaReports) {
  //   workflowData.tpaReports = tpaReports;
  // }
  if (value === 'request') {
    workflowData.outcome = WorkFlowActions.REQUEST_MEDICAL_REPORTS;
  }
  workflowData.updateMap.set(BPMMergeUpdateParamEnum.TPACODE, tpaCode);
  workflowData.payload = routerData.content;
  return workflowData;
};
