/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { MobileDetails } from '@gosi-ui/core/lib/models/mobile-details';
import { AppConstants } from '@gosi-ui/core/lib/constants/app-constants';
import { PersonConstants } from '../constants/person-constants';
import { WizardItem } from '@gosi-ui/core/lib/models/wizard-item';
import { AnnuityResponseDto } from '../models/annuity-responsedto';
import { scrollToTop } from '@gosi-ui/core/lib/utils/window';
import { BenefitType } from '../enum/benefit-type';
import { AlertService } from '@gosi-ui/core/lib/services/alert.service';
import { Location } from '@angular/common';
import { WizardService } from '../services/wizard.service';
import { TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal/ngx-bootstrap-modal';
import { AnnuityBenefitTypes, BenefitConstants } from '../constants';
import {
  ActiveBenefits,
  DependentDetails,
  HeirDetailsRequest,
  AnnuityBenefitRequest,
  ImprisonmentDetails,
  PatchPersonBankDetails,
  EligiblePeriods
} from '../models';
import { BenefitValues, ServiceType, HeirStatus } from '../enum';
import { Router } from '@angular/router';
import {
  BPMUpdateRequest,
  RouterData,
  startOfDay,
  GccCountryEnum,
  IdentifierLengthEnum,
  NIN,
  Iqama,
  NationalId,
  Passport,
  BorderNumber,
  CommonIdentity,
  IdentityTypeEnum,
  Lov,
  LovList,
  Name,
  checkIqamaOrBorderOrPassport,
  DocumentItem,
  BPMMergeUpdateParamEnum,
  WorkFlowActions,
  InspectionTypeEnum,
  convertToStringDDMMYYYY,
  BilingualText,
  GosiCalendar,
  CoreBenefitService,
  AddressTypeEnum,
  BPMCommentScope
} from '@gosi-ui/core';
import { DependentService } from '../services/dependent.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { setPaymentDetailsToObjectFromForm } from '@gosi-ui/features/benefits/lib/shared/utils/paymentUtils';
import moment from 'moment';
import { Form } from '../../../../../../../testing/test-data/features/occupational-hazard/injury';
import { analyzeFile } from '@angular/compiler';

export const getISDCodePrefix = function (emergencyNo: MobileDetails) {
  let prefix;
  if (emergencyNo === null || (emergencyNo && emergencyNo.primary === null)) {
    prefix = null;
  } else {
    Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (emergencyNo && key === emergencyNo.isdCodePrimary) {
        prefix = AppConstants.ISD_PREFIX_MAPPING[key];
      }
    });
  }
  return prefix;
};

/** Initializing request benefit form */
export const createRequestBenefitForm = function (isAppPrivate: boolean, fb: FormBuilder): FormGroup {
  let form = fb.group({});
  if (!isAppPrivate) {
    form.addControl('checkBoxFlag', new FormControl(null, Validators.requiredTrue));
  }
  return form;
};

/** Method to make the IBAN number hidden */
export const getIBanHidden = function (iBanNumber: string) {
  const strtoReplace = PersonConstants.IBAN_REPLACEMENT;
  iBanNumber = iBanNumber.substring(0, 2) + strtoReplace;
  return iBanNumber;
};

export const routeBack = function (location: Location) {
  location.back();
};

export const restrictProgressBar = function (
  wizardItems: WizardItem[],
  wizardService: WizardService,
  currentTab: number
) {
  wizardService.restrictProgress(currentTab - 1, wizardItems);
};
export const clearAlerts = function (alertService: AlertService, showOtpError: boolean) {
  alertService.clearAlerts();
  showOtpError = false;
  return showOtpError;
};
export const showModal = function (modalService: BsModalService, modalRef: TemplateRef<HTMLElement>, size?: string) {
  return modalService.show(
    modalRef,
    Object.assign(
      {},
      {
        class: `modal-${size ? size : 'lg'}`,
        backdrop: true,
        ignoreBackdropClick: true
      }
    )
  );
};

export const clearDraftUtil = function (routerData: RouterData) {
  return (routerData.draftRequest = null);
};
export const decline = function (commonModalRef: BsModalRef) {
  commonModalRef.hide();
};

/**
 * To select tab from html
 * @param key constants from BenefitConstants
 * @param currentTab selected tab
 * @param wizardItems
 */
export const isTabSlctdInWizard = function (key: string, currentTab: number, wizardItems: WizardItem[] = []) {
  return currentTab < wizardItems.length && wizardItems[currentTab].key === key ? true : false;
};

export const hideAlert = function (
  currentTab: number,
  wizards: WizardItem[],
  isAppPrivate: boolean,
  benefitsForm: FormGroup,
  isJailed: boolean,
  heirUpdateWarningMsg: boolean
) {
  const uiConst = BenefitConstants;
  let hide = false;
  if (!isAppPrivate) {
    if (isTabSlctdInWizard(uiConst.BENEFIT_DETAILS, currentTab, wizards) && benefitsForm.get('checkBoxFlag').errors) {
      hide = true;
    }
  }
  if (
    isTabSlctdInWizard(uiConst.DEPENDENTS_DETAILS, currentTab, wizards) &&
    isJailed &&
    benefitsForm.get('imprisonmentForm')
  ) {
    if (benefitsForm.get('imprisonmentForm').invalid) {
      hide = true;
    }
  }
  if (heirUpdateWarningMsg) {
    hide = true;
  }
  return hide;
};

export const isBankDetailsEntered = function (
  isAppPrivate: boolean,
  benefitsForm: FormGroup,
  isBenefitPage: boolean,
  isPension = true
) {
  let valid = true;
  if (isBenefitPage) {
    if (benefitsForm.get('bankAccount')) {
      valid = false;
      if (benefitsForm.get('bankAccount.ibanBankAccountNo') && benefitsForm.get('bankAccount.ibanBankAccountNo').value)
        valid = true;
    } else if (
      benefitsForm.get('payeeForm') &&
      benefitsForm.get('payeeForm.paymentMode').value.english === BenefitValues.BANK
      // (!benefitsForm.get('bankAccount.ibanBankAccountNo') || !benefitsForm.get('bankAccount.ibanBankAccountNo').value)
    ) {
      valid = false;
      if (
        benefitsForm.get('payeeForm.bankAccount.ibanBankAccountNo') &&
        benefitsForm.get('payeeForm.bankAccount.ibanBankAccountNo').value
      )
        valid = true;
    } else {
      valid = true;
    }
  }

  return valid;
};

/** check if dependents/heir is present in wizard items */
export const isDependentOrHeirWizardPresent = function (wizardItems: WizardItem[] = []): boolean {
  let dependentList = [];
  dependentList = wizardItems.filter(
    wizard =>
      wizard.label === BenefitConstants.DEPENDENTS_DETAILS ||
      wizard.label === BenefitConstants.HEIR_DETAILS ||
      wizard.label === BenefitConstants.MODIFY_DETAILS
  );
  return dependentList.length ? true : false;
};

export const createDetailForm = function (fb: FormBuilder) {
  let form: FormGroup;
  form = fb.group({
    taskId: [null],
    user: [null],
    status: [null],
    rejectionIndicator: [null]
  });
  return form;
};
export const createModalForm = function (fb: FormBuilder) {
  let form: FormGroup;
  form = fb.group({
    comments: [null, { validators: Validators.required }],
    document: fb.group({
      english: [''],
      arabic: ['']
    })
  });
  return form;
};
export const reDirectUsersToApplyScreen = function (
  requestType: string,
  socialInsuranceNo: number,
  requestId: number,
  annuityBenefitDetails: AnnuityResponseDto,
  coreBenefitService: CoreBenefitService,
  router: Router,
  benefitType: string,
  referenceNo: number,
  paramValue?: string
) {
  if (requestType && requestType != BenefitType.nonOccPensionBenefitType) {
    const activeBenefit = new ActiveBenefits(
      socialInsuranceNo,
      requestId,
      annuityBenefitDetails.benefitType,
      referenceNo
    );
    // const queryParams = {isHeir : isHeirBenefit(benefitType)}
    coreBenefitService.setActiveBenefit(activeBenefit);
    activeBenefit.startDate = annuityBenefitDetails.benefitStartDate;
    activeBenefit.requestDate = annuityBenefitDetails.requestDate;
    if (requestType === BenefitType.addModifyBenefit) {
      router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION]);
    } else if (requestType === BenefitType.addModifyHeir) {
      router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], {
        queryParams: {
          isHeir: isHeirBenefit(benefitType)
        }
      });
    } else if (requestType === BenefitType.holdbenefit) {
      router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], {
        queryParams: {
          actionType: HeirStatus.HOLD,
          isHeir: isHeirBenefit(benefitType)
        }
      });
    } else if (requestType === BenefitType.restartbenefit) {
      router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], {
        queryParams: {
          actionType: HeirStatus.RESTART,
          isHeir: isHeirBenefit(benefitType)
        }
      });
    } else if (requestType === BenefitType.stopbenefit) {
      router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], {
        queryParams: {
          actionType: HeirStatus.STOP,
          isHeir: isHeirBenefit(benefitType)
        }
      });
    } else if (requestType === BenefitType.startBenefitWaive) {
      activeBenefit.waiveStartDate = annuityBenefitDetails.waiveStartDate;
      activeBenefit.notes = annuityBenefitDetails?.notes;
      router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], {
        queryParams: {
          actionType: HeirStatus.START_WAIVE,
          isHeir: isHeirBenefit(benefitType)
        }
      });
    } else if (requestType === BenefitType.stopBenefitWaive) {
      activeBenefit.waiveStopDate = annuityBenefitDetails.waiveStopDate;
      activeBenefit.notes = annuityBenefitDetails?.notes;
      router.navigate([BenefitConstants.ROUTE_MODIFY_PENSION], {
        queryParams: {
          actionType: HeirStatus.STOP_WAIVE,
          isHeir: isHeirBenefit(benefitType)
        }
      });
    }
  } else if (benefitType === BenefitType.hazardousPension || paramValue === 'isHazardous') {
    router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
      queryParams: {
        hazardous: true
      }
    });
  } else if (benefitType === BenefitType.hazardousLumpsum || paramValue === 'isHazardous') {
    router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
      queryParams: {
        hazardous: true
      }
    });
  }
  // jailed
  else if (benefitType === BenefitType.jailedContributorPension || paramValue === 'isJailedPension') {
    router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
      queryParams: {
        jailed: true
      }
    });
  } else if (benefitType === BenefitType.jailedContributorLumpsum || paramValue === 'isJailedPension') {
    router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
      queryParams: {
        jailed: true
      }
    });
  }
  //non occ
  else if (benefitType === BenefitType.nonOccPensionBenefitType || paramValue === 'isNonOcc') {
    router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
      queryParams: {
        nonocc: true
      }
    });
  } else if (benefitType === BenefitType.NonOccDisabilityBenefitsType || paramValue === 'isNonOcc') {
    router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
      queryParams: {
        nonocc: true
      }
    });
  } else if (benefitType === BenefitType.nonOccLumpsumBenefitType || paramValue === 'isNonOcc') {
    router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
      queryParams: {
        nonocc: true
      }
    });
  } else if (benefitType === BenefitType.nonOcc || paramValue === 'isNonOcc') {
    router.navigate([BenefitConstants.ROUTE_REQUEST_DISABILITY_ASSESSMENT], {
      queryParams: {
        nonocc: true
      }
    });
  }
  // early retirement
  else if (benefitType === BenefitType.earlyretirement || paramValue === 'isEarlyRetirement') {
    router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
      queryParams: {
        earlyretirement: true
      }
    });
  }
  //heir benefits
  else if (
    benefitType === BenefitType.heirMissingPension ||
    benefitType === BenefitType.heirDeathPension2 ||
    paramValue === 'isHeir'
  ) {
    router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT], {
      queryParams: {
        heir: true
      }
    });
  } else if (
    benefitType === BenefitType.heirMissingLumpsum ||
    benefitType === BenefitType.heirLumpsumDeadContributor ||
    paramValue === 'isHeir'
  ) {
    router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
      queryParams: {
        heir: true
      }
    });
  } else if (benefitType === BenefitType.retirementPension) {
    router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT]);
  } else if (benefitType === BenefitType.retirementLumpsum) {
    router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM]);
  } else if (benefitType === BenefitType.womanLumpsum) {
    // router.navigate([BenefitConstants.ROUTE_REQUEST_LUMPSUM]);
    router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
      queryParams: {
        womenLumpsum: true
      }
    });
  } else if (benefitType === BenefitType.funeralGrant) {
    router.navigate([BenefitConstants.ROUTE_REQUEST_FUNERAL_GRANT]);
  } else if (benefitType === BenefitType.ui) {
    router.navigate([BenefitConstants.ROUTE_APPLY_BENEFIT]);
  } else if (benefitType === BenefitType.rpaBenefit) {
    // router.navigate([BenefitConstants.ROUTE_REQUEST_LUMPSUM]);
    router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM], {
      queryParams: {
        rpa: true
      }
    });
  }
};
export const setWorkFlowData = function (childCompForm: FormGroup, routerData: RouterData, transactionNumber: number) {
  const data = new BPMUpdateRequest();
  data.taskId = routerData.taskId;
  data.user = routerData.assigneeId;
  data.assignedRole = routerData.assignedRole;
  data.referenceNo = transactionNumber.toString();

  if (childCompForm.get('rejectionReason')) {
    data.rejectionReason = childCompForm.get('rejectionReason').value;
  }
  if (childCompForm.get('comments')) {
    data.comments = childCompForm.get('comments').value;
  }
  if (childCompForm.get('returnReason')) {
    data.returnReason = childCompForm.get('returnReason').value;
  }
  if (childCompForm.get('delayInRequest')) {
    data.bypassLateBenefitRequest =
      childCompForm.get('delayInRequest.bypassTheDelay.english').value === BenefitValues.yes;
    data.updateMap.set(BPMMergeUpdateParamEnum.BENEFIT_LATE_REQUEST_APPROVED, data.bypassLateBenefitRequest);
    data.payload = routerData.content;
  }
  return data;
};
/** This method  to set workflow data For Merge and Update. */
export const setWorkFlowDataForMerge = function (
  routerData: RouterData,
  childCompForm: FormGroup,
  action: WorkFlowActions,
  returnRole?: string
): BPMUpdateRequest {
  const workflowData = new BPMUpdateRequest();
  workflowData.taskId = routerData.taskId;
  workflowData.user = routerData.assigneeId;
  workflowData.assignedRole = routerData.assignedRole;
  const formData = childCompForm.getRawValue();
  workflowData.comments = formData.comments ? formData.comments : 'NULL';
  workflowData.updateMap.set(BPMMergeUpdateParamEnum.COMMENTS, workflowData.comments);
  if (action === WorkFlowActions.REJECT || action === WorkFlowActions.RETURN) {
    if (action === WorkFlowActions.REJECT) {
      workflowData.rejectionReason = formData.rejectionReason;
      workflowData.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON_IN_ENG, workflowData.rejectionReason.english);
      workflowData.updateMap.set(BPMMergeUpdateParamEnum.REJECTION_REASON_IN_ARB, workflowData.rejectionReason.arabic);
    } else {
      workflowData.returnReason = formData.returnReason;
      workflowData.updateMap.set(BPMMergeUpdateParamEnum.RETURN_REASON_IN_ENG, workflowData.returnReason.english);
      workflowData.updateMap.set(BPMMergeUpdateParamEnum.RETURN_REASON_IN_ARB, workflowData.returnReason.arabic);
    }
    workflowData.outcome = action;
    workflowData.comments = formData.comments;
    workflowData.commentScope = BPMCommentScope.BPM;
  } else {
    if (formData?.selectedInspection) {
      if (formData.selectedInspection.english === InspectionTypeEnum.SC) {
        workflowData.updateMap.set(BPMMergeUpdateParamEnum.INSPECTIONTYPE, InspectionTypeEnum.SAFETY_CHECK);
      } else if (formData.selectedInspection.english === InspectionTypeEnum.EA) {
        workflowData.updateMap.set(BPMMergeUpdateParamEnum.INSPECTIONTYPE, InspectionTypeEnum.EMPLOYEE_AFFAIRS);
      } else if (formData.selectedInspection.english === InspectionTypeEnum.WI) {
        workflowData.updateMap.set(BPMMergeUpdateParamEnum.INSPECTIONTYPE, InspectionTypeEnum.OCCUPATIONAL_HAZARD);
      }
      workflowData.outcome = WorkFlowActions.SEND_FOR_INSPECTION;
    }
  }
  workflowData.payload = routerData.content;
  if (returnRole) {
    workflowData.updateMap.set(BPMMergeUpdateParamEnum.RETURN_ROLE, returnRole);
    const newPayload = modifyPayload(workflowData.payload);
    const modifiedWorkflowData = {
      ...workflowData,
      payload: {
        ...newPayload,
        Request: {
          ...newPayload.Request,
          Body: { ...newPayload.Request.Body, returnRole: returnRole }
        }
      }
    };

    return modifiedWorkflowData;
  } else {
    return workflowData;
  }
};

export const modifyPayload = function (modifiiedPayload) {
  return modifiiedPayload;
};

export const bindQueryParamsToForm = function (routerData: RouterData, childForm: FormGroup) {
  if (routerData) {
    childForm.get('taskId').setValue(routerData.taskId);
    childForm.get('user').setValue(routerData.assigneeId);
  }
};
export const setRequestDetailsData = function (
  referenceNo: number,
  dependentService: DependentService,
  imprisonmentDetails: ImprisonmentDetails,
  benefitsForm: FormGroup,
  benefitType: string,
  isBenefitPage: boolean,
  authPersonId: number,
  isAppPrivate: boolean,
  isIndividualApp: boolean,
  dependents?: DependentDetails[],
  heirData?: HeirDetailsRequest,
  isModifyPage?: boolean,
  expiryDate?: GosiCalendar
) {
  const requestParams = new AnnuityBenefitRequest();
  requestParams.referenceNo = referenceNo ? referenceNo : null;
  requestParams.dependents = dependents ? dependents : null;
  // heirData shouldn't be passed for add/modify heir..details are passed in seperate APIs for each heir
  requestParams.heirRequestDetails = heirData ? heirData : null;
  requestParams.imprisonmentDetails = dependentService.getImprisonment()
    ? dependentService.getImprisonment()
    : imprisonmentDetails;
  const formValue = benefitsForm.getRawValue();
  if (benefitsForm.get('requestDate') && benefitsForm.get('requestDate.gregorian').value) {
    requestParams.requestDate = formValue['requestDate'];
    requestParams.requestDate.gregorian = startOfDay(requestParams.requestDate.gregorian);
  }
  if (benefitsForm.get('notificationDetails') && benefitsForm.get('notificationDetails').value.gregorian) {
    requestParams.notificationDate = benefitsForm.get('notificationDetails').value;
    requestParams.notificationDate.gregorian = startOfDay(requestParams.notificationDate.gregorian);
  }
  if (isModifyPage) {
    requestParams.modificationRequestDate = requestParams.requestDate;
    if (benefitsForm.get('extendAnnualNotification') && benefitsForm.get('extendAnnualNotification.date')?.value) {
      requestParams.nextNotificationDate = benefitsForm.get('extendAnnualNotification.date').value;
      requestParams.nextNotificationDate.gregorian = startOfDay(requestParams.nextNotificationDate.gregorian);
    }
    if (
      benefitsForm.get('extendAnnualNotification') &&
      benefitsForm.get('extendAnnualNotification.currentDate')?.value
    ) {
      requestParams.notificationDate = benefitsForm.get('extendAnnualNotification.currentDate').value;
      requestParams.notificationDate.gregorian = startOfDay(requestParams.notificationDate.gregorian);
    }
  }

  if (benefitsForm.get('disabilityDescription')) {
    requestParams.disabilityDescription = benefitsForm.get('disabilityDescription').value;
  }
  if (benefitsForm.get('waiveBenefit')) {
    requestParams.action = benefitsForm.get('waiveBenefit.action').value;
    requestParams.notes = benefitsForm.get('waiveBenefit.notes')?.value;
  }
  if (benefitsForm.get('extendAnnualNotification.comments')) {
    requestParams.notes = benefitsForm.get('extendAnnualNotification.comments')?.value;
  }
  if (benefitsForm.get('reasonForLateRequest'))
    requestParams.lateRequestReason = benefitsForm.get('reasonForLateRequest').get('reason').value;
  //To save payment details, for heir bank details for individual heirs
  if (!isHeirBenefit(benefitType)) {
    //Payments form check is done before
    if (isBenefitPage) {
      // Payment is in benefits page
      if ((isAppPrivate || isIndividualApp) && benefitsForm.get('payeeForm')) {
        setPaymentDetailsToObjectFromForm(benefitsForm, requestParams, authPersonId, expiryDate);
      }
      if (benefitsForm.get('bankAccount') && benefitsForm.get('bankAccount').value) {
        // For GOL(public) and Private
        const savedBankDetails = new PatchPersonBankDetails();
        savedBankDetails.bankCode = benefitsForm.get('bankAccount.bankCode').value;
        savedBankDetails.bankName = benefitsForm.get('bankAccount.bankName').value;
        savedBankDetails.ibanBankAccountNo = benefitsForm.get('bankAccount.ibanBankAccountNo').value;
        requestParams.bankAccount = savedBankDetails;
      }
    } else {
      if (!isAppPrivate && benefitType === BenefitType.womanLumpsum) {
        const savedBankDetails = new PatchPersonBankDetails();
        savedBankDetails.bankCode = benefitsForm.get('bankAccount.bankCode').value;
        savedBankDetails.bankName = benefitsForm.get('bankAccount.bankName').value;
        savedBankDetails.ibanBankAccountNo = benefitsForm.get('bankAccount.ibanBankAccountNo').value;
        requestParams.bankAccount = savedBankDetails;
      }
    }
  }

  if (benefitsForm.get('adjustmentDetails')) {
    //TODO:implement get api param names
    // this.adjustmentForm = this.fb.group({
    //   putBenefitHold: [false],
    //   allowDirectPayment: [false]
    // });
  }

  return requestParams;
};
export const showErrorMessage = function (err: HttpErrorResponse, alertService: AlertService) {
  if (err.error.details && err.error.details.length > 0) {
    alertService.showError(null, err.error.details);
  } else {
    alertService.showError(err.error.message);
  }
};
export const submitError = function (err: HttpErrorResponse, alertService: AlertService) {
  if (err.status === 400 || err.status === 422) {
    showErrorMessage(err, alertService);
  }
  if (err.status === 500 || err.status === 404) {
    alertService.showErrorByKey('BENEFITS.SUBMIT-FAILED-MSG');
  }
  scrollToTop();
};
/**
 * Method to set the gcc max length
 * @param nationality
 */
export const setGccIdMaxLength = function (nationality: string) {
  let gccIdLength = 0;
  switch (nationality) {
    case GccCountryEnum.KUWAIT: {
      gccIdLength = IdentifierLengthEnum.KUWAIT_ID;
      break;
    }
    case GccCountryEnum.BAHRAIN: {
      gccIdLength = IdentifierLengthEnum.BAHRAIN_ID;
      break;
    }
    case GccCountryEnum.UAE: {
      gccIdLength = IdentifierLengthEnum.UAE_ID;
      break;
    }
    case GccCountryEnum.OMAN: {
      gccIdLength = IdentifierLengthEnum.OMAN_ID;
      break;
    }
    case GccCountryEnum.QATAR: {
      gccIdLength = IdentifierLengthEnum.QATAR_ID;
      break;
    }
  }
  return gccIdLength;
};
/**
 * This method is to return iqama or border or passport based on priority else null
 * @param identities
 */
export const checkIqamaOrGCCOrNIN = function (
  identities: Array<NIN | Iqama | NationalId | Passport | BorderNumber>
): CommonIdentity | null {
  let iqamaObj = null;
  let ninObj = null;
  let nationalIdObj = null;

  identities.forEach(identity => {
    if (identity.idType === IdentityTypeEnum.IQAMA) {
      identity = <Iqama>identity;
      iqamaObj = new CommonIdentity();
      iqamaObj.idType = IdentityTypeEnum.IQAMA;
      if (identity.iqamaNo) {
        iqamaObj.id = identity.iqamaNo;
      }
    } else if (identity.idType === IdentityTypeEnum.NATIONALID) {
      identity = <NationalId>identity;
      nationalIdObj = new CommonIdentity();
      nationalIdObj.idType = IdentityTypeEnum.NATIONALID;
      if (identity.id) {
        nationalIdObj.id = identity.id;
      }
    } else if (identity.idType === IdentityTypeEnum.NIN) {
      identity = <NIN>identity;
      ninObj = new CommonIdentity();
      ninObj.idType = IdentityTypeEnum.NIN;
      if (identity.newNin) {
        ninObj.id = identity.newNin;
      }
    }
  });
  if (ninObj?.id) {
    return ninObj;
  } else if (nationalIdObj?.id) {
    return nationalIdObj;
  } else if (iqamaObj?.id) {
    return iqamaObj;
  }
};
export const getIdLabel = function (idObj: CommonIdentity) {
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
/**
 * Method to check if all the documents are valid and uploaded
 * @param documents
 */
export const isDocumentsValid = (documents: DocumentItem[]): boolean => {
  let isValid = false;
  documents.forEach(document => {
    if (!document.documentContent || document.documentContent === null || document.documentContent === 'NULL') {
      document.uploadFailed = true;
    } else {
      isValid = true;
      document.uploadFailed = false;
    }
  });
  return isValid;
};
export const populateHeirDropDownValues = function (heirDetails: DependentDetails[] = []): BehaviorSubject<LovList> {
  const list: Lov[] = [];
  const heirList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(null);
  heirDetails.forEach(heir => {
    if (heir.relationship?.english !== BenefitValues.unborn) {
      const nameInEnglish = heir.name?.english?.name?.toString();
      const nameInArabic = getArabicFullName(heir.name);
      list.push({
        value: {
          english: nameInEnglish,
          arabic: nameInArabic
        },
        code: heir.personId,
        sequence: 0
      });
      heirList.next(new LovList(list));
    }
  });
  return heirList;
};
export const getArabicFullName = function (name: Name = new Name()) {
  let arabicName = '';
  if (name.arabic) {
    if (name.arabic.firstName) {
      arabicName += name.arabic.firstName + ' ';
    }
    if (name.arabic.secondName) {
      arabicName += name.arabic.secondName + ' ';
    }
    if (name.arabic.thirdName) {
      arabicName += name.arabic.thirdName + ' ';
    }
    if (name.arabic.familyName) {
      arabicName += name.arabic.familyName;
    }
  }
  return arabicName;
};

export const deepCopy = function <T extends object>(source: T): T {
  return JSON.parse(JSON.stringify(source));
};

export const isTheseRolesAssigned = function (roles: string[] = [], asssignedRole: string): boolean {
  if (roles.indexOf(asssignedRole) !== -1) return true;
  else return false;
};

/**
 * This method to mark all the fields in a form as touched and dirty
 * @param formGroup
 * @param data
 */
export const markFormGroupTouched = function (formGroup: FormGroup) {
  if (formGroup) {
    var vals = Object.keys(formGroup.controls).map(function (key) {
      return formGroup.controls[key];
    });
    vals.forEach((control: FormGroup) => {
      control.markAsTouched();
      control.markAsDirty();
      if (control.controls) {
        markFormGroupTouched(control);
      }
    });
  }
};

export const getIdRemoveNullValue = function (
  identities: Array<NIN | Iqama | NationalId | Passport | BorderNumber>
): CommonIdentity | null {
  return checkIqamaOrBorderOrPassport(removeNullFromIdentities(identities));
};

export const removeNullFromIdentities = function (
  identities: Array<NIN | Iqama | NationalId | Passport | BorderNumber>
): Array<NIN | Iqama | NationalId | Passport | BorderNumber> {
  const notNullIdenties: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  identities?.forEach(identity => {
    Object.keys(identity).forEach(key => {
      if (
        key === 'passportNo' ||
        key === 'newNin' ||
        key === 'iqamaNo' ||
        key === 'borderNo' ||
        key === 'oldNin' ||
        key === 'id'
      ) {
        if (identity[key]) notNullIdenties.push(identity);
      }
    });
  });
  return notNullIdenties;
};

export const getImprissionmentDetailsFromForm = function (form: FormGroup): ImprisonmentDetails {
  const imprissionmentDetails = new ImprisonmentDetails();
  imprissionmentDetails.enteringDate = form.get('enteringDate').value === '' ? null : form.get('enteringDate').value;
  imprissionmentDetails.releaseDate = form.get('releaseDate').value;
  imprissionmentDetails.prisoner = form.get('prisoner').value;
  imprissionmentDetails.hasCertificate = form.get('hasCertificate.english').value === 'Yes';
  return imprissionmentDetails;
};
export const checkAddressDetails = function (contributorPaymentDetails: DependentDetails) {
  let overseascount = 0;
  let otheraddresscount = 0;
  contributorPaymentDetails?.contactDetail?.addresses.forEach(address => {
    if (address?.type !== AddressTypeEnum.OVERSEAS) {
      overseascount = overseascount + 1;
    } else {
      otheraddresscount = otheraddresscount + 1;
    }
  });
  if (overseascount === 0) {
    contributorPaymentDetails.enableEditAddress = false;
  } else if (overseascount !== 0) {
    contributorPaymentDetails.enableEditAddress = true;
  } else if (overseascount !== 0 && otheraddresscount !== 0) {
    contributorPaymentDetails.enableEditAddress = true;
  }
};
export const getServiceType = function (benefitType) {
  let serviceType = '';
  switch (benefitType) {
    case BenefitType.heirPension: //HEIR_PENSION:
      serviceType = ServiceType.HEIR_PENSION_BENEFIT;
      break;
    case BenefitType.heirDeathPension2:
      serviceType = ServiceType.HEIR_PENSION_BENEFIT;
      break;
    case BenefitType.heirLumpsum: // HEIR_LUMPSUM:
      serviceType = ServiceType.HEIR_LUMPSUM_BENEFIT;
      break;
    case BenefitType.retirementPension: // OLDAGE_RETIREMENT_PENSION:
      serviceType = ServiceType.RETIREMENT_PENSION_BENEFIT;
      break;
    case BenefitType.retirementPensionType: // OLDAGE_RETIREMENT_PENSION:
      serviceType = ServiceType.RETIREMENT_PENSION_BENEFIT;
      break;
    case BenefitType.hazardousPension: //HAZARDOUS_PENSION:
      serviceType = ServiceType.RETIREMENT_PENSION_BENEFIT;
      break;
    case BenefitType.earlyretirement: // EARLY_RETIREMENT:
      serviceType = ServiceType.RETIREMENT_PENSION_BENEFIT;
      break;
    case BenefitType.retirementLumpsum: // OLDAGE_RETIREMENT_LUMPSUM:
      serviceType = ServiceType.RETIREMENT_LUMPSUM_BENEFIT;
      break;
    case BenefitType.retirementLumpsumType: // OLDAGE_RETIREMENT_LUMPSUM:
      serviceType = ServiceType.RETIREMENT_LUMPSUM_BENEFIT;
      break;
    case BenefitType.hazardousLumpsum: // HAZARDOUS_LUMPSUM:
      serviceType = ServiceType.RETIREMENT_LUMPSUM_BENEFIT;
      break;
    case BenefitType.womanLumpsum: // WOMAN_LUMP_SUM:
      serviceType = ServiceType.WOMAN_LUMPSUM_BENEFIT;
      break;
    case BenefitType.nonOccPensionBenefitType: // NON_OCCUPATIONAL_PENSION:
      serviceType = ServiceType.NON_OCC_PENSION_BENEFIT;
      break;
    case BenefitType.nonOccLumpsumBenefitType: // NON_OCCUPATIONAL_LUMPSUM:
      serviceType = ServiceType.NON_OCC_LUMPSUM_BENEFIT;
      break;
    case BenefitType.occLumpsum: // OCCUPATIONAL_LUMPSUM:
      serviceType = ServiceType.OCC_LUMPSUM_BENEFIT;
      break;
    case BenefitType.occPension: // OCCUPATIONAL_PENSION:
      serviceType = ServiceType.OCC_PENSION_BENEFIT;
      break;
    case BenefitType.jailedContributorPension: // JAILED_PENSION:
      serviceType = ServiceType.JAILED_CONTRIBUTOR_PENSION_BENEFIT;
      break;
    case BenefitType.jailedContributorLumpsum: // JAILED_LUMPSUM:
      serviceType = ServiceType.JAILED_CONTRIBUTOR_LUMPSUM_BENEFIT;
      break;
    case BenefitType.ui: // Unemployment:
      serviceType = ServiceType.UNEMPLOYMENT_BENEFIT;
      break;
    case BenefitType.funeralGrant: // Unemployment:
      serviceType = ServiceType.FUNERAL_GRANT_BENEFIT;
      break;
    default:
      serviceType = ServiceType.RETIREMENT_PENSION_BENEFIT;
      break;
  }
  return serviceType;
};

export const notIsHeir = function (benefitType: string) {
  return (
    benefitType === BenefitType.retirementPension ||
    benefitType === BenefitType.earlyretirement ||
    benefitType === BenefitType.hazardousPension ||
    benefitType === BenefitType.jailedContributorPension ||
    benefitType === BenefitType.nonOccPensionBenefitType ||
    benefitType === BenefitType.ui ||
    benefitType === BenefitType.funeralGrant ||
    benefitType === BenefitType.hazardousLumpsum ||
    benefitType === BenefitType.jailedContributorLumpsum ||
    benefitType === BenefitType.nonOccLumpsumBenefitType ||
    benefitType === BenefitType.retirementLumpsum ||
    benefitType === BenefitType.womanLumpsum ||
    benefitType === BenefitType.occLumpsum ||
    benefitType === BenefitType.occPension ||
    benefitType === BenefitType.oldAgeWomenPension ||
    benefitType === BenefitType.oldAgeWomenLumpsum ||
    benefitType === BenefitType.nonSaudiLumpsum ||
    benefitType === BenefitType.rpaBenefit
  );
};

export const isHeirBenefit = function (benefitType: string) {
  return (
    benefitType === BenefitType.heirLumpsumDeadContributor ||
    benefitType === BenefitType.heirDeathPension2 ||
    benefitType === BenefitType.heirDeathPension ||
    benefitType === BenefitType.heirMissingPension ||
    benefitType === BenefitType.heirMissingLumpsum ||
    benefitType === BenefitType.heirLumpsum ||
    benefitType === BenefitType.heirPension ||
    benefitType === BenefitType.heirBenefit
  );
};

export const isLumpsumBenefit = function (benefitType: string) {
  return (
    benefitType === BenefitType.jailedContributorLumpsum ||
    benefitType === BenefitType.lumpsum ||
    benefitType === BenefitType.retirementLumpsum ||
    benefitType === BenefitType.returnLumpsum ||
    benefitType === BenefitType.womanLumpsum ||
    benefitType === BenefitType.hazardousLumpsum ||
    benefitType === BenefitType.occLumpsum ||
    benefitType === BenefitType.nonOccLumpsumBenefitType ||
    benefitType === BenefitType.heirLumpsum ||
    benefitType === BenefitType.heirMissingLumpsum ||
    benefitType === BenefitType.heirLumpsumDeadContributor ||
    benefitType === BenefitType.nonSaudiLumpsum ||
    benefitType === BenefitType.rpaBenefit ||
    benefitType === BenefitType.oldAgeWomenLumpsum
  );
};
export const isHeirLumpsum = function (benefitType: string) {
  return (
    benefitType === BenefitType.heirLumpsum ||
    benefitType === BenefitType.heirLumpsumDeadContributor ||
    benefitType === BenefitType.heirMissingLumpsum
  );
};
export const isHeirPension = function (benefitType: string) {
  return (
    benefitType === BenefitType.heirBenefit ||
    benefitType === BenefitType.heirPension ||
    benefitType === BenefitType.heirDeathPension ||
    benefitType === BenefitType.heirDeathPension2 ||
    benefitType === BenefitType.heirMissingPension
  );
};
export const isOccNonOcc = function (benefitType: string) {
  return (
    benefitType === BenefitType.oh ||
    benefitType === BenefitType.occBenefit ||
    benefitType === BenefitType.occPension ||
    benefitType === BenefitType.occLumpsum ||
    benefitType === BenefitType.nonOcc ||
    benefitType === BenefitType.nonOccLumpsumBenefitType ||
    benefitType === BenefitType.nonOccPensionBenefit ||
    // benefitType === BenefitType.NonOccDisabilityAssessment ||
    benefitType === BenefitType.nonOccPensionType ||
    benefitType === BenefitType.NonOccDisabilityBenefitsType ||
    benefitType === BenefitType.nonOccPensionBenefitType
  );
};
export const isJailedBenefit = function (benefitType: string) {
  return benefitType == BenefitType.jailedContributorLumpsum || benefitType == BenefitType.jailedContributorPension;
};

export const isUiBenefit = function (benefitType: string) {
  return benefitType === BenefitType.ui;
};

export const isNonoccBenefit = function (benefitType: string) {
  return (
    benefitType === BenefitType.nonOcc ||
    benefitType === BenefitType.nonOccLumpsumBenefitType ||
    benefitType === BenefitType.nonOccPensionBenefit ||
    benefitType === BenefitType.nonOccPensionType ||
    benefitType === BenefitType.NonOccDisabilityBenefitsType ||
    benefitType === BenefitType.nonOccPensionBenefitType
  );
};

export const isOccBenefit = function (benefitType: string) {
  return (
    benefitType === BenefitType.oh ||
    benefitType === BenefitType.occBenefit ||
    benefitType === BenefitType.occPension ||
    benefitType === BenefitType.occLumpsum
  );
};

export const getHeirBenefitType = function (isPension: boolean, reason = '', benefitType: string): string {
  let newBenefitType = benefitType;
  if (reason === BenefitValues.missingContributor || reason === BenefitValues.ohMissingContributor) {
    if (isPension) {
      newBenefitType = BenefitType.heirMissingPension;
    } else {
      newBenefitType = BenefitType.heirMissingLumpsum;
    }
  } else if (reason === BenefitValues.deathOfTheContributor || reason === BenefitValues.ohDeathOfTheContributor) {
    if (isPension) {
      newBenefitType = BenefitType.heirDeathPension2;
    } else {
      newBenefitType = BenefitType.heirLumpsumDeadContributor;
    }
  }

  return newBenefitType;
};

export const calendarWithStartOfDay = function (calendar: GosiCalendar): GosiCalendar {
  return {
    hijiri: calendar?.hijiri ? calendar?.hijiri : null,
    gregorian: calendar?.gregorian ? startOfDay(calendar?.gregorian) : null
  };
};

export const getEligiblePeriodLov = function (period: EligiblePeriods) {
  const lovItem = new Lov();
  const startDate = period.startDate ? convertToStringDDMMYYYY(moment(period.startDate.gregorian).toString()) : '';
  const endDate = period.endDate ? convertToStringDDMMYYYY(moment(period.endDate.gregorian).toString()) : '';
  const bilingual = new BilingualText();
  bilingual.english = startDate + '-' + endDate;
  bilingual.arabic = startDate + '-' + endDate;
  lovItem.value = bilingual;
  return lovItem.value;
};

export const getRequestDateFromForm = function (form: FormGroup): GosiCalendar {
  const formValue = form.getRawValue();
  if (formValue && formValue.requestDate) {
    return formValue.requestDate;
  } else {
    return new GosiCalendar();
  }
};

export const getUrlAndQueryParamsFromString = function (urlWithOrWithoutQueryParam: string): any {
  let [url, query] = urlWithOrWithoutQueryParam.split('?');
  return {
    url: url,
    queryParams: query
      ? (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce((params, param) => {
          let [key, value] = param.split('=');
          params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
          return params;
        }, {})
      : {}
  };
};

export const isRequest = function (resourceType: string) {
  // const modifyRequests = [
  //   'Modify Benefit',
  //   'Repay Benefit',
  //   'Adjustment Modification',
  //   'Heir Adjustment Modification',
  //   'Adjustment Repayment',
  //   'Benefit Adjustment',
  //   'Third Party Adjustment Modification',
  //   'Modify Third Party Adjustment',
  //   'Modify Payee',
  //   'Hold Benefit',
  //   'Stop Benefit',
  //   'Funeral Grant',
  //   'Restart Benefit',
  //   'Remove Bank Commitment',
  //   'Modify Bank Account',
  //   'Cancel Request Occupational Benefit'
  // ];
  if (!AnnuityBenefitTypes.ModifyBenefits.includes(resourceType)) {
    return true;
  } else {
    return false;
  }
};

export const getBenefitType = function (benefitType: string) {
  if (isHeirPension(benefitType)) {
    return BenefitType.heirPension;
  } else if (isHeirLumpsum(benefitType)) {
    return BenefitType.heirLumpsum;
  } else {
    return benefitType;
  }
};

export const isModifyBenefit = function (resourceType: string) {
  if (AnnuityBenefitTypes.ModifyBenefits.includes(resourceType)) {
    return true;
  } else {
    return false;
  }
};

export const isRequiredField = function (form_group: FormGroup = new FormGroup({}), field: string = '') {
  const form_field = form_group.get(field);
  if (!form_field?.validator) {
    return false;
  }

  const validator = form_field?.validator({} as AbstractControl);
  return validator && validator?.required;
};

export const isDeathByPpaOhInjury = function (
  heirBenefit: string,
  eligibleForPensionReform: boolean,
  isPpaOhDeath: boolean
) {
  return (heirBenefit === BenefitType.heirPension || heirBenefit === BenefitType.heirLumpsum) &&
    eligibleForPensionReform &&
    isPpaOhDeath
    ? true
    : false;
};

export const isRequestSaned = function (benefitType: string, eligibleForPensionReform: boolean) {
  return benefitType === BenefitType.ui && eligibleForPensionReform ? true : false;
};
