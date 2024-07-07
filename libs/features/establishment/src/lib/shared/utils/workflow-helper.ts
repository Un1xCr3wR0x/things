import { TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Alert, BilingualText, EstablishmentStatusEnum, RouterConstants, TransactionStatus } from '@gosi-ui/core';
import { EstablishmentConstants } from '../constants';
import {
  DocumentTransactionIdEnum,
  EstablishmentErrorKeyEnum,
  EstablishmentRoutesEnum,
  LegalEntityEnum,
  WorkFlowStatusType
} from '../enums';
import { EstablishmentWorkFlowStatus, IEstablishmentProfile, IMofPayment, IProfileAndGroup } from '../models';
import { isEstRegPending, isGovOrSemiGov } from './establishment-util';

export const checksBeforeTransaction = (
  self: IEstablishmentProfile,
  type: WorkFlowStatusType,
  editWarningTemplate: TemplateRef<HTMLElement>
) => {
  let alert = undefined as Alert;
  let heading = undefined as string;
  let route = undefined as string;
  if (type === WorkFlowStatusType.BASICDETAILS) {
    alert = canEditBasicDetails(self.workflowsInProgress, self.isMainRegistered, self.hasDifferentLE);
    alert.details?.length > 0
      ? (heading = 'ESTABLISHMENT.EDIT-ESTABLISHMENT-DETAILS')
      : (route = EstablishmentRoutesEnum.CHANGE_BASIC_DETAILS);
  } else if (type === WorkFlowStatusType.IDENTIFIER) {
    alert = canEditIdentifierDetails(self.workflowsInProgress, self.isMainRegistered, self.hasDifferentLE);
    alert.details?.length > 0
      ? (heading = 'ESTABLISHMENT.EDIT-EST-IDENTIFICATION-DETAILS')
      : (route = EstablishmentRoutesEnum.CHANGE_IDENTIFIER_DETAILS);
  } else if (type === WorkFlowStatusType.BANKDETAILS) {
    alert = canEditBankDetails(
      self.workflowsInProgress,
      ...canEditAnyEstTransaction(self.isMainRegistered, self.hasDifferentLE)
    );
    alert.details?.length > 0
      ? (heading = 'ESTABLISHMENT.EDIT-BANK-ACCOUNT-DETAILS')
      : (route = EstablishmentRoutesEnum.CHANGE_BANK_DETAILS);
  } else if (type === WorkFlowStatusType.ADDRESSDETAILS) {
    alert = canEditAddressDetails(self);
    alert.details?.length > 0
      ? (heading = 'ESTABLISHMENT.EDIT-ADDRESS-DETAILS')
      : (route = EstablishmentRoutesEnum.CHANGE_ADDRESS_DETAILS);
  } else if (type === WorkFlowStatusType.CONTACTDETAILS) {
    alert = getAlerts(...canEditAnyEstTransaction(self.isMainRegistered, self.hasDifferentLE));
    alert.details?.length > 0
      ? (heading = 'ESTABLISHMENT.EDIT-CONTACT-DETAILS')
      : (route = EstablishmentRoutesEnum.CHANGE_CONTACT_DETAILS);
  }
  heading ? showEditWarningModal(self, heading, alert.details, editWarningTemplate) : self.router.navigate([route]);
};
export const canEditAnyEstTransaction = (
  isMainRegistered: boolean,
  hasDifferentLE: boolean
): [string[], BilingualText[]] => {
  const list: [string[], BilingualText[]] = [[], []];
  if (!isMainRegistered) {
    list[0].push('ESTABLISHMENT.ERROR.MAIN-NOT-REGISTERED');
  } else if (hasDifferentLE) {
    list[0].push('ESTABLISHMENT.WARNING.SAME-LE');
  }
  return list;
};
export const canEditEstTransaction = (isMainRegistered: boolean, hasDifferentLE: boolean): string[] => {
  const keys: string[] = [];
  if (!isMainRegistered) {
    keys.push('ESTABLISHMENT.ERROR.MAIN-NOT-REGISTERED');
  } else if (hasDifferentLE) {
    keys.push('ESTABLISHMENT.WARNING.SAME-LE');
  }
  return keys;
};
export const canEditBasicDetails = (
  workflows: EstablishmentWorkFlowStatus[],
  isMainRegistered: boolean,
  hasDifferentLE: boolean
): Alert => {
  const keys = canEditEstTransaction(isMainRegistered, hasDifferentLE);
  if (keys.length === 0) {
    const [alertKeys, alertMessages, paramMap] = workflows?.reduce(
      (keyAndMessage, workflow) => {
        keyAndMessage = checkIntraDomainEstDetails(workflow, keyAndMessage);
        return keyAndMessage;
      },
      [[] as string[], [] as BilingualText[], new Map<number, Object>()]
    );
    return getAlerts(alertKeys, alertMessages, paramMap);
  } else {
    return getAlerts(keys, []);
  }
};
export const canEditAddressDetails = (self: IEstablishmentProfile): Alert => {
  const list = canEditAnyEstTransaction(self.isMainRegistered, self.hasDifferentLE);
  if (
    !self.establishment.crn &&
    !self.establishment.unifiedNationalNumber &&
    !self.establishment.gccCountry &&
    !self.isAppPrivate && !isGovOrSemiGov
  ) {
    list[0].push('ESTABLISHMENT.ERROR.WASEL-ERROR');
  }
  return getAlerts(...list);
};
export const canEditIdentifierDetails = (
  workflows: EstablishmentWorkFlowStatus[],
  isMainRegistered: boolean,
  hasDifferentLE: boolean
): Alert => {
  const keys = canEditEstTransaction(isMainRegistered, hasDifferentLE);
  if (keys.length === 0) {
    const [alertKeys, alertMessages, paramMap] = workflows?.reduce(
      (keyAndMessage, workflow) => {
        keyAndMessage = checkIntraDomainEstDetails(workflow, keyAndMessage);
        return keyAndMessage;
      },
      [[] as string[], [] as BilingualText[], new Map<number, Object>()]
    );
    return getAlerts(alertKeys, alertMessages, paramMap);
  } else {
    return getAlerts(keys, []);
  }
};
const checkIntraDomainEstDetails = (
  workflow: EstablishmentWorkFlowStatus,
  keyAndMessage: [string[], BilingualText[], Map<number, Object>]
) => {
  if (workflow.type === WorkFlowStatusType.LEGALENTITY) {
    keyAndMessage[0].push(warningTemplate + '.LEGAL-ENTITY-WORKFLOW');
    keyAndMessage[2].set(keyAndMessage[0].length - 1, { referenceNo: workflow.referenceNo });
  }
  return keyAndMessage;
};
export const getAlerts = (keys: string[], messages: BilingualText[], messageParams?: Map<number, Object>): Alert => {
  const alert = new Alert();
  alert.message = undefined;
  keys?.forEach((key, index) => {
    alert.details.push({ ...new Alert(), messageKey: key, messageParam: messageParams?.get(index) });
  });
  messages?.forEach(msg => {
    alert.details.push({ ...new Alert(), message: msg });
  });
  return alert;
};

export const showEditWarningModal = (
  self: IProfileAndGroup,
  heading: string,
  warningMsg: Alert[],
  editWarningTemplate: TemplateRef<HTMLElement>
) => {
  self.editWarningHeading = heading;
  self.editWarningMsg = warningMsg;
  self.showModal(editWarningTemplate, 'lg', true);
};

export const canEditLegalEntityDetails = (
  self: IEstablishmentProfile,
  workflows: EstablishmentWorkFlowStatus[],
  template: TemplateRef<HTMLElement>,
  draftTemplate: TemplateRef<HTMLElement>
) => {
  let alert: Alert;
  const inProgWorkflows = workflows?.filter(item => !item.isDraft);
  const keys = checkLegalEntityRules(self);
  if (keys.length === 0) {
    const [alertKeys, alertMessages, paramMap] = inProgWorkflows?.reduce(
      (keyAndMessage, workflow) => {
        keyAndMessage = checkIntraDomainForLegalEntity(
          workflow,
          keyAndMessage,
          self.establishment?.legalEntity?.english
        );
        keyAndMessage = checkInterDomainForLegalEntity(
          workflow,
          keyAndMessage,
          self.establishment?.legalEntity?.english
        );
        return keyAndMessage;
      },
      [[] as string[], [] as BilingualText[], new Map<number, Object>()]
    );
    alert = getAlerts(alertKeys, alertMessages, paramMap);
  } else {
    alert = getAlerts(keys, []);
  }
  if (alert?.details?.length > 0) {
    showEditWarningModal(self, 'ESTABLISHMENT.CHANGE-LEGAL-ENTITY', alert.details, template);
  } else {
    self.draftTransaction = getDraftWorkflow(workflows, WorkFlowStatusType.LEGALENTITY);
    if (self.draftTransaction) {
      self.showMedModal(draftTemplate);
    } else {
      self.router.navigate([EstablishmentRoutesEnum.CHANGE_LEGAL_ENTITY]);
    }
  }
};

const checkInterDomainForLegalEntity = (
  workflow: EstablishmentWorkFlowStatus,
  keyAndMessage: [string[], BilingualText[], Map<number, Object>],
  legalEntity: string
) => {
  if (workflow.type === WorkFlowStatusType.RECEIVE_CONT_PAYMENT) {
    keyAndMessage[1].push(workflow.message);
  }
  if (workflow.type === WorkFlowStatusType.CANCEL_RECEIPT) {
    keyAndMessage[1].push(workflow.message);
  }
  if (workflow.type === WorkFlowStatusType.PENALTY_WAIVER) {
    keyAndMessage[1].push(workflow.message);
  }
  if (workflow.type === WorkFlowStatusType.CREDIT_TRANSFER) {
    keyAndMessage[1].push(workflow.message);
  }
  if (workflow.type === WorkFlowStatusType.INSTALLMENT && legalEntity === LegalEntityEnum.INDIVIDUAL) {
    keyAndMessage[1].push(workflow.message);
  }
  return keyAndMessage;
};

const checkIntraDomainForLegalEntity = (
  workflow: EstablishmentWorkFlowStatus,
  keyAndMessage: [string[], BilingualText[], Map<number, Object>],
  legalEntity: string
) => {
  if (workflow.type === WorkFlowStatusType.LEGALENTITY) {
    keyAndMessage[0].push(warningTemplate + '.LEGAL-ENTITY-WORKFLOW');
    keyAndMessage[2].set(keyAndMessage[0].length - 1, { referenceNo: workflow.referenceNo });
  } else if (workflow.type === WorkFlowStatusType.OWNER) {
    keyAndMessage[0].push(warningTemplate + '.OWNER-WORKFLOW');
    keyAndMessage[2].set(keyAndMessage[0].length - 1, { referenceNo: workflow.referenceNo });
  } else if (workflow.type === WorkFlowStatusType.BASICDETAILS) {
    keyAndMessage[1].push(workflow.message);
  } else if (workflow.type === WorkFlowStatusType.IDENTIFIER) {
    keyAndMessage[1].push(workflow.message);
  } else if (workflow.type === WorkFlowStatusType.DELINK) {
    keyAndMessage[1].push(workflow.message);
  } else if (workflow.type === WorkFlowStatusType.CBM) {
    keyAndMessage[1].push(workflow.message);
  } else if (workflow.type === WorkFlowStatusType.LINK_ESTABLISHMENT) {
    keyAndMessage[1].push(workflow.message);
  } else if (workflow.type === WorkFlowStatusType.MOF_PAYMENT && isGovOrSemiGov(legalEntity)) {
    keyAndMessage[1].push(workflow.message);
  } else if (workflow.type === WorkFlowStatusType.LATE_FEE && isGovOrSemiGov(legalEntity)) {
    keyAndMessage[1].push(workflow.message);
  }
  return keyAndMessage;
};

export const warningTemplate = 'ESTABLISHMENT.WARNING';

const checkLegalEntityRules = (self: IEstablishmentProfile): string[] => {
  const keys: string[] = [];
  if (
    self.establishment.status.english !== EstablishmentStatusEnum.REGISTERED &&
    self.establishment.status.english !== EstablishmentStatusEnum.REOPEN
  ) {
    keys.push(self.establishmentTranslateModule + '.NOT-REGISTERED');
  } else if (
    isEstRegPending(self.establishment) &&
    self.establishmentProfile?.status?.english == EstablishmentStatusEnum.REGISTERED
  ) {
    keys.push(self.establishmentTranslateModule + '.EST-REG-PENDING');
  }
  //If Main Establishment
  else if (self.establishment.registrationNo === self.mainEstablishment.registrationNo) {
    if (self.establishmentProfile.noOfBranches > 1) {
      keys.push(self.establishmentTranslateModule + '.BRANCH-ESTABLISHMENT');
    }
  } else if (
    self.establishment.legalEntity.english === self.mainEstablishment.legalEntity.english &&
    !isGovOrSemiGov(self.establishment.legalEntity.english)
  ) {
    keys.push(self.establishmentTranslateModule + '.SAME-LE');
  }
  return keys;
};

export const canEditBankDetails = (
  workflows: EstablishmentWorkFlowStatus[],
  keys: string[] = [],
  messages: BilingualText[] = []
): Alert => {
  const [alertKeys, alertMessages] = workflows?.reduce(
    (keyAndMessage, workflow) => {
      if (workflow.type === WorkFlowStatusType.CREDIT_TRANSFER) {
        keyAndMessage[1].push(workflow.message);
      } else if (workflow.type === WorkFlowStatusType.CREDIT_REFUND_ESTABLISHMENT) {
        keyAndMessage[1].push(workflow.message);
      }
      return keyAndMessage;
    },
    [keys, messages]
  );
  return getAlerts(alertKeys, alertMessages);
};

export const canEditMofPaymentDetails = (
  template: TemplateRef<HTMLElement>,
  workflows: EstablishmentWorkFlowStatus[],
  isRegistered: boolean,
  isLegalEntityDifferent: boolean,
  component: IMofPayment,
  draftTemplate?: TemplateRef<HTMLElement>
) => {
  let alert = new Alert();
  const keys = checkMofBusinessRules(isRegistered, isLegalEntityDifferent);
  if (keys.length === 0) {
    const [alertKeys, alertMessages, paramMap] = workflows
      ?.filter(item => !item.isDraft)
      ?.reduce(
        (keyAndMessage, workflow) => {
          keyAndMessage = checkWorkflowForMof(workflow, keyAndMessage);
          return keyAndMessage;
        },
        [[] as string[], [] as BilingualText[], new Map<number, Object>()]
      );
    alert = getAlerts(alertKeys, alertMessages, paramMap);
  } else {
    alert = getAlerts(keys, []);
  }
  if (alert?.details?.length > 0) {
    component.editWarningMsg = alert.details;
    component.showModal(template, 'lg', true);
  } else {
    component.draftTransaction = getDraftWorkflow(workflows, WorkFlowStatusType.MOF_PAYMENT);
    component.draftTransaction ? component.showMedModal(draftTemplate) : component.goToMofTransaction();
  }
};

export const checkOwnerBusinessRules = (isRegistered: boolean, isLegalEntityDifferent: boolean) => {
  const keys = [];
  if (!isRegistered) {
    keys.push(warningTemplate + '.NOT-REGISTERED');
  }
  if (isLegalEntityDifferent) {
    keys.push(EstablishmentErrorKeyEnum.LEGAL_ENTITY_MISMATCH);
  }
  return keys;
};

export const checkMofBusinessRules = (isRegistered: boolean, isLegalEntityDifferent: boolean) => {
  const keys = [];
  if (!isRegistered) {
    keys.push(warningTemplate + '.NOT-REGISTERED');
  }
  if (isLegalEntityDifferent) {
    keys.push(EstablishmentErrorKeyEnum.LEGAL_ENTITY_MISMATCH);
  }
  return keys;
};

export const checkWorkflowForMof = (
  workflow: EstablishmentWorkFlowStatus,
  keyAndMessage: [string[], BilingualText[], Map<number, Object>]
) => {
  if (workflow.type === WorkFlowStatusType.MOF_PAYMENT) {
    keyAndMessage[1].push(workflow.message);
  } else if (workflow.type === WorkFlowStatusType.LEGALENTITY) {
    keyAndMessage[0].push(warningTemplate + '.LEGAL-ENTITY-WORKFLOW');
    keyAndMessage[2].set(keyAndMessage[0].length - 1, { referenceNo: workflow.referenceNo });
  }
  return keyAndMessage;
};

export const canEditLateFeeDetails = (
  self: IEstablishmentProfile,
  workflows: EstablishmentWorkFlowStatus[],
  template: TemplateRef<HTMLElement>
) => {
  let alert: Alert;
  const keys = checkLateFeeRules(self);
  if (keys.length === 0) {
    const [alertKeys, alertMessages, paramMap] = workflows?.reduce(
      (keyAndMessage, workflow) => {
        keyAndMessage = checkInterDomainForLateFee(workflow, keyAndMessage);
        return keyAndMessage;
      },
      [[] as string[], [] as BilingualText[], new Map<number, Object>()]
    );
    alert = getAlerts(alertKeys, alertMessages, paramMap);
  } else {
    alert = getAlerts(keys, []);
  }
  if (alert?.details?.length > 0) {
    showEditWarningModal(self, 'ESTABLISHMENT.MODIFY-LATE-FEE', alert.details, template);
  } else self.router.navigate([EstablishmentRoutesEnum.MODIFY_LATE_FEE]);
};
const checkInterDomainForLateFee = (
  workflow: EstablishmentWorkFlowStatus,
  keyAndMessage: [string[], BilingualText[], Map<number, Object>]
) => {
  if (workflow.type === WorkFlowStatusType.LEGALENTITY) {
    keyAndMessage[0].push(warningTemplate + '.LEGAL-ENTITY-WORKFLOW');
    keyAndMessage[2].set(keyAndMessage[0].length - 1, { referenceNo: workflow.referenceNo });
  }
  if (workflow.type === WorkFlowStatusType.LATE_FEE) {
    keyAndMessage[1].push(workflow.message);
  }
  return keyAndMessage;
};

const checkLateFeeRules = (self: IEstablishmentProfile): string[] => {
  const keys: string[] = [];
  if (
    self.establishment.status.english !== EstablishmentStatusEnum.REGISTERED &&
    self.establishment.status.english !== EstablishmentStatusEnum.REOPEN
  ) {
    keys.push(self.establishmentTranslateModule + '.NOT-REGISTERED');
  }
  return keys;
};

export const canReopenEstablishment = (
  self: IEstablishmentProfile,
  workflows: EstablishmentWorkFlowStatus[],
  template: TemplateRef<HTMLElement>,
  reopenInSameMonth?: boolean
) => {
  let alert = new Alert();
  const keys = checkReopenEligibility(reopenInSameMonth);
  if (keys.length === 0) {
    const [alertKeys, alertMessages, paramMap] = workflows?.reduce(
      (keyAndMessage, workflow) => {
        keyAndMessage = checkFoReopenDependancy(workflow, keyAndMessage);
        return keyAndMessage;
      },
      [[] as string[], [] as BilingualText[], new Map<number, Object>()]
    );
    alert = getAlerts(alertKeys, alertMessages, paramMap);
  } else {
    alert = getAlerts(keys, []);
  }
  if (alert?.details?.length > 0) {
    showEditWarningModal(self, 'ESTABLISHMENT.REOPEN-ESTABLISHMENT', alert.details, template);
  } else self.router.navigate([EstablishmentRoutesEnum.REOPEN_ESTABLISHMENT]);
};

const checkFoReopenDependancy = (
  workflow: EstablishmentWorkFlowStatus,
  keyAndMessage: [string[], BilingualText[], Map<number, Object>]
) => {
  if (workflow.type === WorkFlowStatusType.REOPEN_ESTABLISHMENT) {
    keyAndMessage[0].push(warningTemplate + '.REOPEN_ESTABLISHMNET_WORKFLOW');
    keyAndMessage[2].set(keyAndMessage[0].length - 1, { referenceNo: workflow.referenceNo });
  }
  return keyAndMessage;
};

export const checkReopenEligibility = (reopenInSameMonth: boolean) => {
  const keys = [];
  if (reopenInSameMonth) {
    keys.push(EstablishmentErrorKeyEnum.MULTIPLE_REOPEN);
  }
  return keys;
};

export const checksBeforeAdminTransaction = (
  self: IEstablishmentProfile,
  workflows: EstablishmentWorkFlowStatus[],
  template: TemplateRef<HTMLElement>,
  draftTemp: TemplateRef<HTMLElement>
) => {
  let alert: Alert;
  const keys = checkAdminBusinessRules(self);
  if (keys.length === 0) {
    const adminWorkflows = workflows?.filter(item => !item.isDraft);
    const [alertKeys, alertMessages, paramMap] = adminWorkflows?.reduce(
      (keyAndMessage, workflow) => {
        keyAndMessage = checkInterDomainForAddSuperAdmin(workflow, keyAndMessage);
        return keyAndMessage;
      },
      [[] as string[], [] as BilingualText[], new Map<number, Object>()]
    );
    alert = getAlerts(alertKeys, alertMessages, paramMap);
  } else {
    alert = getAlerts(keys, []);
  }
  handleAddSuperAdminAction(
    self,
    alert,
    workflows,
    template,
    draftTemp,
    self.establishmentProfile.mainEstablishmentRegNo
  );
};

export const handleAddSuperAdminAction = (
  component: IProfileAndGroup,
  alert: Alert,
  workflows: EstablishmentWorkFlowStatus[],
  warningTemp: TemplateRef<HTMLElement>,
  draftTemp: TemplateRef<HTMLElement>,
  regNo: number
) => {
  if (alert?.details?.length > 0) {
    showEditWarningModal(component, 'ESTABLISHMENT.REGISTER-BRANCH-MANAGER', alert.details, warningTemp);
  } else {
    component.draftTransaction = getDraftWorkflow(workflows, WorkFlowStatusType.ADD_SUPER_ADMIN);
    if (component.draftTransaction) {
      component.showMedModal(draftTemp);
    } else {
      component.router.navigate([EstablishmentConstants.ROUTE_REGISTER_SUPER_ADMIN(regNo)]);
    }
  }
};
export const checkInterDomainForAddSuperAdmin = (
  workflow: EstablishmentWorkFlowStatus,
  keyAndMessage: [string[], BilingualText[], Map<number, Object>]
) => {
  if (workflow.type === WorkFlowStatusType.ADD_SUPER_ADMIN) {
    keyAndMessage[1].push(workflow.message);
  }
  if (workflow.type === WorkFlowStatusType.CBM) {
    keyAndMessage[1].push(workflow.message);
  }
  return keyAndMessage;
};

const checkAdminBusinessRules = (self: IEstablishmentProfile): string[] => {
  const keys: string[] = [];
  if (self.establishment.status.english !== EstablishmentStatusEnum.REGISTERED) {
    keys.push(self.establishmentTranslateModule + '.NOT-REGISTERED');
  }
  return keys;
};

export const getDraftWorkflow = (items: EstablishmentWorkFlowStatus[], type: WorkFlowStatusType) =>
  items.find(item => item.transactionStatus == TransactionStatus.DRAFT && item.isSameLoggedInUser && item.type === type);

export const goToResumeTransaction = (router: Router, referenceNo: number, transactionId: number) => {
  router.navigateByUrl(RouterConstants.ESTABLISHMENT_RESUME_ROUTE(referenceNo, transactionId), {
    skipLocationChange: true
  });
};

export const navigateWithTransactionId = (router: Router, transactionId: string, registrationNo: number) => {
  switch (transactionId) {
    case DocumentTransactionIdEnum.REG_ESTABLISHMENT: {
      router.navigate([EstablishmentRoutesEnum.REGISTER_ESTABLISHMENT]);
      break;
    }
    case DocumentTransactionIdEnum.CHANGE_OWNER: {
      router.navigate([EstablishmentRoutesEnum.CHANGE_OWNER]);
      break;
    }
    case DocumentTransactionIdEnum.PAYMENT_TYPE_CHANGE_ESTABLISHMENT: {
      router.navigate([EstablishmentRoutesEnum.MODIFY_MOF_PAYMENT]);
      break;
    }
    case DocumentTransactionIdEnum.CHANGE_LEGAL_ENTITY: {
      router.navigate([EstablishmentRoutesEnum.CHANGE_LEGAL_ENTITY]);
      break;
    }
    case DocumentTransactionIdEnum.ADD_SUPER_ADMIN: {
      router.navigate([EstablishmentConstants.ROUTE_REGISTER_SUPER_ADMIN(registrationNo)]);
      break;
    }
    case DocumentTransactionIdEnum.REPLACE_SUPER_ADMIN: {
      router.navigate([EstablishmentConstants.REPLACE_SUPER_ADMIN_ROUTE(registrationNo)]);
      break;
    }
    case DocumentTransactionIdEnum.MOL_REGISTRATION: {
      router.navigate([EstablishmentConstants.REGISTER_PROACTIVE_ROUTE(registrationNo)]);
      break;
    }
  }
};
