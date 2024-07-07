/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  DocumentItem,
  Person,
  WizardItem,
  BilingualText,
  Channel,
  ContactDetails,
  CommonIdentity,
  checkIqamaOrBorderOrPassport,
  scrollToTop,
  GosiCalendar,
  NationalityTypeEnum,
  LovList,
  TransactionStatus
} from '@gosi-ui/core';
import { BenefitBaseScComponent } from '../../shared/component/base';
import {
  UIPayloadKeyEnum,
  UITransactionType,
  BenefitType,
  BenefitStatus,
  AttorneyStatus,
  HeirStatus,
  DocumentTypeId,
  PensionReformEligibility
} from '../../shared/enum';
import { BenefitConstants } from '../../shared/constants';
import {
  PersonalInformation,
  ImprisonmentDetails,
  HeirDetailsRequest,
  ReasonBenefit,
  DependentDetails,
  BenefitDetails,
  AttorneyDetailsWrapper,
  DependentTransaction,
  AdjustmentDetailsDto,
  ValidateRequest,
  ValidateHeir,
  HeirHistory,
  ParamId,
  HoldBenefit,
  EachHeirDetail,
  ActiveBenefits,
  BenefitTypeLabels,
  Benefits
} from '../../shared/models';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { FormGroup } from '@angular/forms';
import {
  clearAlerts,
  hideAlert,
  isBankDetailsEntered,
  setRequestDetailsData,
  submitError,
  showErrorMessage,
  isTheseRolesAssigned,
  isHeirBenefit,
  isLumpsumBenefit,
  isOccBenefit,
  isNonoccBenefit,
  isDependentOrHeirWizardPresent,
  getRequestDateFromForm
} from '../../shared/utils/benefitUtil';
import { isOverSeas } from '../../shared/utils/person';
import moment from 'moment-timezone';
import { getInvalidEvents, getValidEvents, setStatusForNicDependents } from '../../shared';
import { Directive, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { BenefitWageDetail } from '../../shared/models/benefit-wage-detail';
import { AnnuityBaseHelperComponent } from './annuity-base-helper';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Directive()
export abstract class AnnuityBaseComponent extends AnnuityBaseHelperComponent {
  deductionPercentage: number;
  personDocumentList: DocumentItem[];
  isAddressavailable = false;
  personalDetails = new Person();
  routeToView: string;
  totalTabs = 2;
  requestDateStr: string;
  transactionKey: string;
  savedPayeType: BilingualText;
  savedPayMethod: BilingualText;
  nin: number;
  callPensionDocsApi = false;
  isEarlyRetirement = false;
  isJailed = false;
  isDoctor = false;
  isNonOcc = false;
  isDisabilityBenefit = false;
  isHazardous = false;
  attorneyDetailsWrapper: AttorneyDetailsWrapper[] = [];
  benefitStatus: string;
  adjustmentDetails: AdjustmentDetailsDto;
  dependentHistory: DependentTransaction[];
  previousDependentHistory: DependentTransaction[];
  benefitsAndWageDetails: BenefitWageDetail;
  heirHistory: HeirHistory[];
  paramId: ParamId;
  jailedPeriods: ImprisonmentDetails[];
  requestDate: GosiCalendar;
  bankSaved = true;
  benefitCalculation: BenefitDetails;
  applyForFirstTime = true;
  wizardItems: WizardItem[] = [];
  heirEligibility: ValidateRequest[] = [];
  page: string;
  heirPersonId: number;
  fromDate: string;
  toDate: string;
  benefitWagePopupRequired: boolean;
  benefitPeriodHistory: HeirHistory;
  isCheque = true;
  heirOldHistory: HeirHistory[];
  benefitStatusEnum = BenefitStatus;
  currentRequestDate: GosiCalendar;
  benefitWageDetail: EachHeirDetail;
  modalRef: BsModalRef;
  activeBenefitsList: ActiveBenefits[];
  headingType: string;
  pensionTransactionId = BenefitConstants.TRANSACTIONID_PENSION;
  singleDepHeirDetails: ValidateRequest;
  heirOrDepUnchanged = false;
  eligibleForDependentAmount: boolean;
  eligibleForPensionReform: boolean;
  isPpaOhDeath: boolean;
  // isAdjustmentAvailable: boolean;

  /** Hide the alert comp in parent HTML, because the child component showing the alert*/
  hideAlertComponent(currentTab: number, wizards: WizardItem[]) {
    const heirUpdateWarningMsg = this.heirBenefitService.getHeirUpdateWarningMsg();
    return hideAlert(currentTab, wizards, this.isAppPrivate, this.benefitsForm, this.isJailed, heirUpdateWarningMsg);
  }

  /** Method to Clear success message*/
  clearSuccessMessage() {
    this.saveApiResp = null;
  }

  /** Apply for Benefit, Calling from every benefit component  */
  applyBenefit(
    tabset: TabsetComponent,
    wiardComp: ProgressWizardDcComponent,
    dependents?: DependentDetails[],
    heirData?: HeirDetailsRequest,
    navigateToPage?: string[],
    isModifyPage?: boolean,
    actionType?: string
  ) {
    this.benefitsForm.markAllAsTouched();
    if (this.benefitsForm.get('checkBoxFlag')) {
      if (
        !this.benefitsForm.get('checkBoxFlag').value &&
        wiardComp.wizardItems[this.currentTab].label === BenefitConstants.BENEFIT_DETAILS
      ) {
        this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
        this.alertService.showWarningByKey('BENEFITS.DECLARE-CHECK-MSG');
        window.scrollTo(0, document.body.scrollHeight);
      } else {
        this.submitRequest(tabset, wiardComp, dependents, heirData, navigateToPage, isModifyPage, actionType);
      }
    } else {
      this.submitRequest(tabset, wiardComp, dependents, heirData, navigateToPage, isModifyPage, actionType);
    }
  }

  submitRequest(
    tabset: TabsetComponent,
    wiardComp: ProgressWizardDcComponent,
    dependents?: DependentDetails[],
    heirData?: HeirDetailsRequest,
    navigateToPage?: string[],
    isModifyPage?: boolean,
    actionType?: string
  ) {
    this.bankSaved = this.checkBankEntered(wiardComp);
    const validRequestDate = this.checkRequestDateValidity(wiardComp);
    const reasonForLateRequest = this.checkReasonRequestValidity(wiardComp);
    const expiryDate = this.manageBenefitService.getCertificateExpiryDate();
    let waiveDetailsPage = false;
    waiveDetailsPage = wiardComp?.wizardItems[this.currentTab].label === BenefitConstants.WAIVE_BENEFIT;
    if ((this.bankSaved && validRequestDate && reasonForLateRequest) || this.isCheque) {
      if (
        (wiardComp.wizardItems[this.currentTab].label === BenefitConstants.DEPENDENTS_DETAILS ||
          wiardComp.wizardItems[this.currentTab].label === BenefitConstants.HEIR_DETAILS ||
          wiardComp.wizardItems[this.currentTab].label === BenefitConstants.MODIFY_DETAILS ||
          waiveDetailsPage) &&
        this.pensionModify &&
        (!isHeirBenefit(this.benefitType) || (isHeirBenefit(this.benefitType) && actionType)) &&
        this.applyForFirstTime &&
        !this.isValidator
      ) {
        //Modify scenario has to create new reference number in first(PUT) call for Dependent
        this.referenceNo = null;
      }
      if (isModifyPage && !actionType) {
        if (isHeirBenefit(this.benefitType)) {
          if (!heirData.anyHeirAddedOrModified) {
            this.heirOrDepUnchanged = true;
          }
        } else if (!dependents || dependents.findIndex(dependent => (dependent.actionType ? true : false)) < 0) {
          this.heirOrDepUnchanged = true;
        }
      }
      this.requestDetails = setRequestDetailsData(
        this.referenceNo,
        this.dependentService,
        this.imprissionmentDetails,
        this.benefitsForm,
        this.benefitType,
        wiardComp.wizardItems[this.currentTab].label === BenefitConstants.BENEFIT_DETAILS,
        this.authPersonId,
        this.isAppPrivate,
        this.isIndividualApp,
        dependents,
        heirData,
        isModifyPage,
        expiryDate
      );
      if (isModifyPage) this.requestDetails.modificationRequestDate = this.requestDetails?.requestDate;
      if (this.isValidator && !actionType && (isHeirBenefit(this.benefitType) || dependents))
        this.requestDetails.validatorEdited = true;
      if (
        wiardComp.wizardItems[this.currentTab].label === BenefitConstants.BENEFIT_DETAILS &&
        this.deductionPercentage
      ) {
        this.requestDetails.deductionPercentage = this.deductionPercentage;
      }
      this.disableSaveAndNext = true;
      if (this.applyForFirstTime && this.isNonOcc && !this.routerData?.assignedRole) {
        this.applyForBenefit(wiardComp, tabset, navigateToPage);
      } else if (this.referenceNo || this.benefitRequestId) {
        if (
          (wiardComp.wizardItems[this.currentTab].label === BenefitConstants.MODIFY_DETAILS ||
            wiardComp.wizardItems[this.currentTab].label === BenefitConstants.HEIR_DETAILS) &&
          this.heirOrDepUnchanged &&
          this.benefitsForm?.get('extendAnnualNotification.selected')?.value
        ) {
          // Story 524070
          // new API "annual-notification" to be called if only annual notification is modified
          // (& if dependents are empty or all dependents are no action)
          // only for add/modify dep and heir
          if (!this.isValidator && this.applyForFirstTime) {
            this.requestDetails.referenceNo = null;
          }
          this.updateBenefitWithAnnualNotif(wiardComp, tabset, navigateToPage);
        } else {
          //if added for Defect 606813 save and next wrking even if no authorized person selected in draft case - Jailed
          if( wiardComp.wizardItems[this.currentTab].label === BenefitConstants.BENEFIT_DETAILS && this.routerData?.draftRequest && this.benefitsForm.get('payeeForm.payeeType.english')?.value === 'Authorized Person' && !this.benefitsForm.get('payeeForm')?.get('authorizationId')?.value) {
            scrollToTop()
            this.alertService.showErrorByKey('BENEFITS.PLEASE-ADD-SELECT_AUTHORIZED-MSG');
            this.disableSaveAndNext = false; // can be removed
          }else{
            this.updateAnnuityBenefit(waiveDetailsPage, wiardComp, tabset, navigateToPage, actionType);
          }
        }
      } else {
        this.applyForBenefit(wiardComp, tabset, navigateToPage);
      }
    } else if (!this.bankSaved && !this.isCheque) {
      this.alertService.showErrorByKey('BENEFITS.ENTER-BANK-DETAILS');
    }
  }

  // validate API, heir history API not required for Hold,stop,restart,waive
  // calculate api not required for hold
  updateAnnuityBenefit(
    waiveDetailsPage: boolean,
    wiardComp: ProgressWizardDcComponent,
    tabset: TabsetComponent,
    navigateToPage?: string[],
    actionType?: string
  ) {
    this.manageBenefitService
      .updateForAnnuityBenefit(this.socialInsuranceNo, this.benefitRequestId, this.benefitType, this.requestDetails)
      .subscribe(
        data => {
          this.disableSaveAndNext = false;
          if (data) {
            this.applyForFirstTime = false;
            this.benefitResponse = data;
            this.referenceNo = data.referenceNo;
            if (
              !this.requestDetails.disabilityDescription &&
              !waiveDetailsPage &&
              wiardComp.wizardItems[this.currentTab].label !== BenefitConstants.BENEFIT_DETAILS
            ) {
              if (actionType !== HeirStatus.HOLD) {
                if (actionType !== HeirStatus.RESTART) {
                  this.getAnnuityCalculation(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
                } else
                  this.getAnnuityCalculation(
                    this.socialInsuranceNo,
                    this.benefitRequestId,
                    this.referenceNo,
                    wiardComp
                  );
              }
              if (
                isHeirBenefit(this.benefitType) &&
                actionType !== HeirStatus.HOLD &&
                actionType !== HeirStatus.STOP &&
                actionType !== HeirStatus.RESTART &&
                actionType !== HeirStatus.START_WAIVE &&
                actionType !== HeirStatus.STOP_WAIVE
              ) {
                this.getHeirEligibilityDetails(
                  this.socialInsuranceNo,
                  { validateHeir: null },
                  this.page,
                  this.benefitRequestId,
                  this.benefitType
                );
                if (!isLumpsumBenefit(this.benefitType)) {
                  this.getHeirHistoryDetails(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
                }
                if (!actionType) {
                  this.getOldHeirHistoryDetails(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
                }
              }
            }
            if (
              !isHeirBenefit(this.benefitType) &&
              !isLumpsumBenefit(this.benefitType) &&
              (wiardComp.wizardItems[this.currentTab].label === BenefitConstants.DEPENDENTS_DETAILS ||
                wiardComp.wizardItems[this.currentTab].label === BenefitConstants.MODIFY_DETAILS)
            ) {
              this.getDependentHistoryDetails(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
              if (this.pensionModify && this.isBackDated) {
                this.getPreviousDependentHistory(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
              }
            }
            if (
              this.pensionModify &&
              wiardComp.wizardItems[this.currentTab].label !== BenefitConstants.BENEFIT_DETAILS
            ) {
              this.getBenefitHistoryDetails(this.socialInsuranceNo, this.benefitRequestId);
            }
            this.benefitDocumentService
              .getReqDocs(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo, true)
              .subscribe(
                response => {
                  if (response.length) {
                    if (this.isHeir) {
                      response = response.filter(doc => doc.documentTypeId !== DocumentTypeId.DECLARATION_DOCUMENT);
                    }
                    this.requiredDocs = response;
                    this.wizardItems = this.wizardService.addWizardItem(
                      wiardComp.wizardItems,
                      new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt')
                    );
                    // this.hasDependentOrHeir = true;
                    this.nextForm(tabset, wiardComp, null, navigateToPage);
                  } else {
                    if (wiardComp) {
                      this.wizardItems = this.wizardService.removeWizardItem(
                        BenefitConstants.UI_DOCUMENTS,
                        wiardComp.wizardItems
                      );
                      // this.hasDependentOrHeir = false;
                    }
                    if (
                      wiardComp.wizardItems[this.currentTab].label === BenefitConstants.BENEFIT_DETAILS &&
                      this.wizardService.isThisLastWizardItem(wiardComp.wizardItems[this.currentTab], this.wizardItems)
                    ) {
                      this.patchBenefitWithCommentsAndNavigate(null, tabset, wiardComp, navigateToPage);
                    } else {
                      this.nextForm(tabset, wiardComp, null, navigateToPage);
                    }
                  }
                },
                err => {
                  submitError(err, this.alertService);
                }
              );
          }
        },
        err => {
          this.disableSaveAndNext = false;
          submitError(err, this.alertService);
        }
      );
  }
  updateBenefitWithAnnualNotif(
    wiardComp: ProgressWizardDcComponent,
    tabset: TabsetComponent,
    navigateToPage?: string[]
  ) {
    this.manageBenefitService
      .updateWithAnnualNotif(this.socialInsuranceNo, this.benefitRequestId, this.benefitType, this.requestDetails)
      .subscribe(
        data => {
          this.disableSaveAndNext = false;
          if (data) {
            this.applyForFirstTime = false;
            this.benefitResponse = data;
            this.referenceNo = data.referenceNo;
            if (data.hideBenefitDetails) {
              this.wizardItems = this.wizardService.removeWizardItem(
                BenefitConstants.BENEFIT_DETAILS,
                wiardComp.wizardItems
              );
            } else {
              this.getAnnuityCalculation(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
              this.getBenefitHistoryDetails(this.socialInsuranceNo, this.benefitRequestId);
              if (isHeirBenefit(this.benefitType)) {
                this.getHeirEligibilityDetails(
                  this.socialInsuranceNo,
                  { validateHeir: null },
                  this.page,
                  this.benefitRequestId,
                  this.benefitType
                );
                if (!isLumpsumBenefit(this.benefitType)) {
                  this.getHeirHistoryDetails(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
                }
                this.getOldHeirHistoryDetails(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
              }
              if (!isHeirBenefit(this.benefitType) && !isLumpsumBenefit(this.benefitType)) {
                this.getDependentHistoryDetails(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
                if (this.pensionModify && this.isBackDated) {
                  this.getPreviousDependentHistory(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
                }
              }
            }

            this.benefitDocumentService
              .getReqDocs(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo, true)
              .subscribe(
                response => {
                  if (response.length) {
                    this.requiredDocs = response;
                    this.wizardItems = this.wizardService.addWizardItem(
                      wiardComp.wizardItems,
                      new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt')
                    );
                    wiardComp.wizardItems = this.wizardItems;
                    // this.hasDependentOrHeir = true;
                    this.nextForm(tabset, wiardComp, null, navigateToPage);
                  } else {
                    if (wiardComp) {
                      this.wizardItems = this.wizardService.removeWizardItem(
                        BenefitConstants.UI_DOCUMENTS,
                        wiardComp.wizardItems
                      );
                      // this.hasDependentOrHeir = false;
                    }
                    this.patchBenefitWithCommentsAndNavigate(null, tabset, wiardComp, navigateToPage);
                  }
                },
                err => {
                  submitError(err, this.alertService);
                }
              );
          }
        },
        err => {
          this.disableSaveAndNext = false;
          submitError(err, this.alertService);
        }
      );
  }
  applyForBenefit(wiardComp: ProgressWizardDcComponent, tabset: TabsetComponent, navigateToPage?: string[]) {
    this.manageBenefitService
      .applyForBenefit(this.socialInsuranceNo, this.isAppPrivate, this.benefitType, this.requestDetails)
      .subscribe(
        data => {
          this.disableSaveAndNext = false;
          if (data) {
            this.applyForFirstTime = false;
            this.benefitResponse = data;
            this.benefitPropertyService.setReferenceNo(this.benefitResponse.referenceNo);
            this.referenceNo = this.benefitResponse.referenceNo;
            this.manageBenefitService.requestId = data.benefitRequestId;
            this.benefitRequestId = data.benefitRequestId;
            this.benefitPropertyService.setAnnuityStatus(BenefitConstants.APPLIED_BENEFIT);
            if (this.benefitResponse.message != null) {
              this.showSuccessMessage(this.benefitResponse.message);
            }
            if (!this.requestDetails.disabilityDescription) {
              this.getAnnuityCalculation(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
            }
            if (
              !isHeirBenefit(this.benefitType) &&
              !isLumpsumBenefit(this.benefitType) &&
              !isOccBenefit(this.benefitType) &&
              this.benefitType !== BenefitType.NonOccDisabilityAssessment
            ) {
              this.getDependentHistoryDetails(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
              if (this.pensionModify && this.isBackDated)
                this.getPreviousDependentHistory(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
            }

            if (
              this.pensionModify &&
              wiardComp.wizardItems[this.currentTab].label !== BenefitConstants.BENEFIT_DETAILS
            ) {
              this.getBenefitHistoryDetails(this.socialInsuranceNo, this.benefitRequestId);
            }
            this.benefitDocumentService
              .getReqDocs(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo, true)
              .subscribe(response => {
                if (response.length) {
                  this.requiredDocs = response;
                  this.wizardItems = this.wizardService.addWizardItem(
                    wiardComp.wizardItems,
                    new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt')
                  );
                  // this.hasDependentOrHeir = true;
                  this.nextForm(tabset, wiardComp, null, navigateToPage);
                } else {
                  if (wiardComp) {
                    this.wizardItems = this.wizardService.removeWizardItem(
                      BenefitConstants.UI_DOCUMENTS,
                      wiardComp.wizardItems
                    );
                    // this.hasDependentOrHeir = false;
                  }
                  if (
                    wiardComp.wizardItems[this.currentTab].label === BenefitConstants.BENEFIT_DETAILS &&
                    this.wizardService.isThisLastWizardItem(wiardComp.wizardItems[this.currentTab], this.wizardItems)
                  ) {
                    this.patchBenefitWithCommentsAndNavigate(null, tabset, wiardComp, navigateToPage);
                  } else {
                    this.nextForm(tabset, wiardComp, null, navigateToPage);
                  }
                }
              });
          }
        },
        err => {
          this.disableSaveAndNext = false;
          submitError(err, this.alertService);
        }
      );
  }

  checkBankEntered(wiardComp: ProgressWizardDcComponent) {
    return this.benefitType !== BenefitType.heirLumpsum && this.benefitType !== BenefitType.heirPension
      ? isBankDetailsEntered(
          this.isAppPrivate,
          this.benefitsForm,
          wiardComp.wizardItems[this.currentTab].label === BenefitConstants.BENEFIT_DETAILS,
          this.isPension
        )
      : true;
  }

  checkRequestDateValidity(wiardComp: ProgressWizardDcComponent) {
    return wiardComp.wizardItems[this.currentTab].label === BenefitConstants.BENEFIT_DETAILS &&
      this.benefitsForm.get('requestDate')
      ? this.benefitsForm.get('requestDate').valid
      : true;
  }

  checkReasonRequestValidity(wiardComp: ProgressWizardDcComponent) {
    return wiardComp.wizardItems[this.currentTab].label === BenefitConstants.BENEFIT_DETAILS &&
      this.benefitsForm.get('reasonForLateRequest')
      ? this.benefitsForm.get('reasonForLateRequest').valid
      : true;
  }

  isLateRequestChanged(): boolean {
    return (
      this.benefitsForm.get('reasonForLateRequest') != null && !this.benefitsForm.get('reasonForLateRequest')?.pristine
    );
  }

  /** Method to fetch heir eligibility details  */
  getHeirEligibilityDetails(
    sin: number,
    data: ValidateHeir,
    page: string,
    benefitRequestId: number,
    benefitType: string
  ) {
    this.heirBenefitService.validateHeir(sin, data, page, benefitRequestId, benefitType).subscribe(
      response => {
        this.heirEligibility = response;
      },
      err => this.showError(err)
    );
  }

  //fetch adjustment details
  getAdjustmentDetails(sin: number, benefitRequestId: number) {
    this.benefitPropertyService.getAdjustmentDetails(sin, benefitRequestId).subscribe(
      res => {
        this.adjustmentDetails = res;
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  // fetch heir history
  getHeirHistoryDetails(sin: number, benefitRequestId: number, transactionTraceId: number) {
    this.paramId = {
      sin: sin,
      benefitRequestId: benefitRequestId,
      transactionTraceId: transactionTraceId
    };
    if(sin && benefitRequestId && transactionTraceId){
      this.heirBenefitService.getHeirHistoryDetails(sin, benefitRequestId, transactionTraceId, false).subscribe(
        res => {
          if (res) {
            this.heirHistory = res;
            res.forEach(eachPeriod => {
              this.benefitPeriodHistory = eachPeriod;
            });
          }
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
    }
  }

  getOldHeirHistoryDetails(sin: number, benefitRequestId: number, transactionTraceId: number) {
    if(sin && benefitRequestId && transactionTraceId){
      this.heirBenefitService.getHeirHistoryDetails(sin, benefitRequestId, transactionTraceId, true).subscribe(
        res => {
          if (res) {
            this.heirOldHistory = res;
            res.forEach(eachPeriod => {
              this.benefitPeriodHistory = eachPeriod;
            });
          }
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
    }
  }

  // fetch dependent history
  getDependentHistoryDetails(sin: number, benefitRequestId: number, referenceNo?: number) {
    this.dependentService.getDependentHistoryDetails(sin, benefitRequestId, referenceNo).subscribe(
      res => {
        this.dependentHistory = res;
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }
  //fetch dependent history without reqid and refno
  getDepHistoryWithoutReqId(sin: number, benefitType: string, reqDate: GosiCalendar) {
    this.dependentService.getDepHistoryWithoutREqId(sin, benefitType, reqDate).subscribe(
      res => {
        this.dependentHistory = res;
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  //fetch previousDependentHistory
  getPreviousDependentHistory(sin: number, benefitRequestId: number, referenceNo?: number) {
    this.dependentService.getDependentHistoryDetails(sin, benefitRequestId, referenceNo, true).subscribe(
      res => {
        this.previousDependentHistory = res;
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  checkValidatorEditFlow() {
    if (this.routerData && this.routerData.assignedRole) {
      this.role = this.routerData.assignedRole;
      if (
        isTheseRolesAssigned(
          [this.rolesEnum.VALIDATOR_1, this.rolesEnum.VALIDATOR_2, this.rolesEnum.FC_APPROVER_ANNUITY, 'Contributor'],
          this.role
        )
      ) {
        this.isValidator = true;
        if (this.routerData.sourceChannel === Channel.GOSI_ONLINE) {
          this.transactionType = UITransactionType.GOL_REQUEST_SANED;
        } else {
          this.transactionType = UITransactionType.FO_REQUEST_SANED;
        }
        this.benefitPropertyService.setAnnuityStatus(BenefitConstants.VAL_EDIT_BENEFIT);
        this.benefitRequestId = +this.routerData.idParams.get(UIPayloadKeyEnum.ID);
        this.socialInsuranceNo = +this.routerData.idParams.get(UIPayloadKeyEnum.SIN);
        if (this.isIndividualApp && (this.manageBenefitService.nin || this.authTokenService.getIndividual())) {
          this.socialInsuranceNo = this.manageBenefitService.nin
            ? this.manageBenefitService.nin
            : this.authTokenService.getIndividual();
        }
        this.referenceNo = +this.routerData.idParams.get(UIPayloadKeyEnum.REFERENCE_NO);
        this.dependentDetails = this.dependentService.getDependents();
        if (this.manageBenefitService.requestDate) {
          this.benefitsForm.addControl(
            'requestDate',
            this.fb.group({
              gregorian: [null],
              hijiri: [null]
            })
          );
          this.benefitsForm.get('requestDate').patchValue(this.manageBenefitService.requestDate);
        }
      }
    } else {
      this.uiBenefitService.setBenefitStatus(BenefitConstants.NEW_BENEFIT);
    }
  }

  getAppliedBenefitDetails(
    benefitRequestId: number,
    socialInsuranceNo: number,
    referenceNo: number,
    isLumpsum = false
  ) {
    this.manageBenefitService
      .getAnnuityBenefitRequestDetail(socialInsuranceNo, benefitRequestId, referenceNo)
      .subscribe(
        response => {
          if (response) {
            if (this.isValidator && !this.routerData?.draftRequest) {
              this.benefitPropertyService
                .validatorEditCall(socialInsuranceNo, benefitRequestId, referenceNo)
                .subscribe();
            }
            this.annuityResponse = response;
            this.eligibleForPensionReform = this.annuityResponse.pensionReformEligibility?.english === PensionReformEligibility.Eligible;
            //TODO: if non occ needs condition check here as this is already getting from benefit history api
            this.lateRequestDetails = response.lateRequestDetails;
            this.lateRequest = response.lateRequestDetails ? true : false;
            this.savedPayMethod = response.paymentMethod;
            this.savedPayeType = response.payeeType;
            this.benefitStatus = response.status?.english;
            this.contributorPersonId = response.personId;
            this.currentRequestDate = response.requestDate;
            const identifier = checkIqamaOrBorderOrPassport(response?.identity);
            if (response.requestDate) {
              if (this.benefitsForm.get('requestDate')) {
                this.benefitsForm.get('requestDate.gregorian').patchValue(response.requestDate?.gregorian);
                this.benefitsForm.get('requestDate.hijiri')?.patchValue(response.requestDate?.hijiri);
                this.benefitsForm.get('requestDate.entryFormat')?.patchValue(response.requestDate?.entryFormat);
              } else {
                this.benefitsForm.addControl(
                  'requestDate',
                  this.fb.group({
                    gregorian: [moment(response.requestDate.gregorian).toDate()],
                    hijiri: [null]
                  })
                );
              }
            }
            // if (this.isPension) {
            this.initialiseTabWizards(this.benefitType, response.eligibleForDependentComponent, isLumpsum);
            this.hasDependentOrHeir = isDependentOrHeirWizardPresent(this.wizardItems);
            if (!this.isHeir && !this.hasDependentOrHeir) {
              if (!this.isAppPrivate) {
                this.requestDateChanged(this.systemRunDate, true);
              } else {
                this.requestDateChanged(response.requestDate, true);
              }
            }
            // }
            if (!this.isJailed && !isHeirBenefit(this.benefitType) && this.hasDependentOrHeir) {
              this.getDependentsBackdated(
                (this.benefitsForm.get('requestDate') as FormGroup).getRawValue(),
                this.benefitRequestId,
                this.referenceNo
              );
            }
            // For validator only
            if (Number(this.getPersonId()) && !this.isAppPrivate) {
              this.getBankDetails(this.getPersonId());
            } else {
              this.manageBenefitService.getPersonIdentifier(identifier?.id).subscribe(personId => {
                this.getBankDetails(personId);
              });
            }
            // if (!this.isAppPrivate) this.getBankDetails(this.getPersonId());
            // this.getPersonDetails(true, response.agentId);
            if (Number(this.getPersonId())) {
              this.getPersonDetails(true, null, response.agentId);
            } else {
              this.manageBenefitService
                .getPersonIdentifier(identifier?.id)
                .subscribe(personId => this.getPersonDetails(null, personId));
            }
            if (response.nin) {
              if (!this.isIndividualApp) {
                this.getPersonContactDetails(response.nin);
              } else {
                this.getProfileContactDetails(response.nin);
              }
            }
            if (isHeirBenefit(response.benefitType.english) && response.heirBenefitReason) {
              this.heirDetailsData = new HeirDetailsRequest();
              this.heirDetailsData.reason = response.heirBenefitReason;
              this.heirDetailsData.eventDate = response.deathDate ? response.deathDate : response.missingDate;
              this.reasonForbenefits = new ReasonBenefit(
                response.deathDate,
                response.missingDate,
                response.heirBenefitReason
              );
            }
            // if (isLumpsumBenefit(response.benefitType.english)) {
            if (this.isIndividualApp) {
              this.getContributorIndividual(this.authTokenService.getIndividual());
            } else {
              this.getContirbutorRefundDetails(response.nin, response.personId);
            }
            // }
            // this.manageBenefitService.getSelectedAuthPerson(socialInsuranceNo, benefitRequestId).subscribe(
            //   person => {
            //     if (person.length) {
            //       this.preSelectedAuthperson = person;
            //       this.authPersonId = person[0].personId;
            //       if (!this.authPersonId) {
            //         this.getBankDetails(person[0].personId.toString());
            //       }
            //     }
            //   },
            //   err => showErrorMessage(err, this.alertService)
            // );
            if (this.isHeir) {
              this.benefitRequestsService
                .getEligibleBenefitByBenefitType(
                  this.socialInsuranceNo,
                  this.benefitType,
                  getRequestDateFromForm(this.benefitsForm)
                )
                .subscribe(res => {
                  this.eligibilityApiResponse = res;
                  this.lateRequest = res.lateRequest;
                });
            }
          }
        },
        err => {
          this.showError(err);
        }
      );
  }

  /**
   * Method to initialise current tab
   * @param currentTab
   */
  initialiseTabWizards(benefitType: string, eligibleDependent = false, lumpsum = false) {
    if (benefitType === BenefitType.heirPension || benefitType === BenefitType.heirLumpsum) {
      this.wizardItems = this.heirBenefitService.getHeirPensionItems();
      const control = this.fb.group({
        requestDate: this.fb.group({
          gregorian: [null],
          hijiri: [null]
        })
      });
      this.benefitsForm.addControl('reportDate', control);
      if (this.wizardItems[0]) {
        this.wizardItems[0].isImage = true;
      }
      if (this.wizardItems[2]) {
        this.wizardItems[2].isImage = true;
      }
    } else if (
      benefitType === BenefitType.jailedContributorPension ||
      benefitType === BenefitType.jailedContributorLumpsum
    ) {
      this.wizardItems = this.wizardService.getJaileditems();
      if (this.wizardItems[0]) {
        this.wizardItems[0].isImage = true;
      }
      if (this.wizardItems[2]) {
        this.wizardItems[2].isImage = true;
      }
    }
    // else if(lumpsum) {
    //   this.wizardItems = this.wizardService.getLumpsumWizardItems(this.isAppPrivate);
    //   this.wizardItems[0].isActive = true;
    //   this.wizardItems[0].isDisabled = false;
    // }
    else {
      this.wizardItems = this.wizardService.getRetirementPensionItems(
        eligibleDependent,
        null,
        false,
        this.isHeir,
        lumpsum
      );
      if (this.wizardItems[1]) {
        this.wizardItems[1].isImage = true;
      }
    }
    if (this.isAppPrivate || this.isIndividualApp) {
      this.wizardItems = this.wizardService.addWizardItem(
        this.wizardItems,
        new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt')
      );
    }
    this.wizardItems[this.currentTab].isActive = true;
    this.wizardItems[this.currentTab].isDisabled = false;
    if (this.currentTab === 2 || this.currentTab === 1) {
      this.wizardItems[0].isDone = true;
    }
    if (!this.isHazardous && !this.isHeir) {
      this.showContactWizard(this.wizardItems);
    }
  }

  /** Method to fetch calculate details when benefit request id is available */
  getAnnuityCalculation(
    sin: number,
    benefitRequestId: number,
    referenceNo: number,
    wiardComp?: ProgressWizardDcComponent
  ) {
    this.manageBenefitService.getBenefitCalculationDetailsByRequestId(sin, benefitRequestId, referenceNo).subscribe(
      calculation => {
        this.benefitCalculation = calculation;
        this.isPpaOhDeath = this.benefitCalculation.isPpaOhDeath;
        if (
          wiardComp &&
          this.benefitCalculation?.heirBenefitDetails.findIndex(
            eachHeir => eachHeir?.adjustmentCalculationDetails?.adjustmentDetails.length
          ) < 0
        ) {
          this.wizardItems = this.wizardService.removeWizardItem(
            BenefitConstants.ADJUSTMENT_DETAILS,
            wiardComp.wizardItems
          );
        }
      },
      err => this.showError(err)
    );
  }

  //This method is to save address details
  saveAddress(personDetails: PersonalInformation, tabset: TabsetComponent, wiardComp: ProgressWizardDcComponent) {
    // personId not to be used in IndApp
    // if (!this.isIndividualApp) {
    let personId;
    if (personDetails.personId) {
      personId = personDetails.personId;
    }
    this.manageBenefitService.updateAddress(personId, personDetails).subscribe(
      () => {
        if (this.wizardService.isThisLastWizardItem(wiardComp.wizardItems[this.currentTab], this.wizardItems)) {
          // Individual app does not have documents page
          this.patchBenefitWithCommentsAndNavigate(null, tabset, wiardComp);
        } else {
          this.nextForm(tabset, wiardComp);
        }
      },
      err => {
        this.showError(err);
      }
    );
    // } else {
    //   this.manageBenefitService.submitPersonalDetails(this.socialInsuranceNo, personDetails).subscribe(
    //     () => {
    //       this.nextForm(tabset, wiardComp);
    //     },
    //     err => {
    //       this.showError(err);
    //     }
    //   );
    // }
  }

  /** Method to update benefit with comments entered*/
  patchBenefitWithCommentsAndNavigate(
    comment: { comments: string },
    tabset: TabsetComponent,
    wizardComp: ProgressWizardDcComponent,
    navigateToPage?: string[]
  ) {
    this.alertService.clearAlerts();
    this.disableSubmitButton = true;
    this.manageBenefitService
      .patchAnnuityBenefit(this.socialInsuranceNo, this.benefitRequestId, comment, this.referenceNo)
      .subscribe(
        data => {
          if (data) {
            this.benefitResponse = data;
            if (
              this.role &&
              (this.role === this.rolesEnum.VALIDATOR_1 ||
                this.role === this.rolesEnum.CUSTOMER_SERVICE_REPRESENTATIVE ||
                this.role === 'Contributor') &&
              !this.routerData.draftRequest
            ) {
              //save work flow and navigate to inbox
              this.saveWorkflowInEdit(comment, this.isLateRequestChanged());
            } else {
              if (this.benefitResponse.message != null) {
                this.showSuccessMessage(this.benefitResponse.message);
                // this.alertService.showSuccess(this.benefitResponse.message);
                this.coreBenefitService.setBenefitAppliedMessage(this.benefitResponse.message);
              }
              this.benefitPropertyService.setReferenceNo(this.benefitResponse.referenceNo);
              this.nextForm(tabset, wizardComp, null, navigateToPage);
            }
          }
        },
        err => {
          this.disableSubmitButton = false;
          showErrorMessage(err, this.alertService);
          this.goToTop();
        }
      );
  }

  setBenefitRequestIdForNonOcc() {
    this.sanedBenefitService
      .getBenefitsWithStatus(this.socialInsuranceNo, ['Active', 'Draft', 'In Progress'])
      .subscribe(response => {
        const nonOcc = response.filter(benefit => isNonoccBenefit(benefit?.benefitType?.english))[0];
        this.benefitRequestId = nonOcc?.benefitRequestId;
        this.currentRequestDate = nonOcc?.requestDate;
        this.lateRequestDetails = nonOcc?.lateRequestDetails;
        this.lateRequest = nonOcc?.lateRequestDetails ? true : false;
        // Defect 574173 : reference number not passed for non occ in put API (updateForAnnuityBenefit), when taken from draft
        if (nonOcc?.referenceNo) this.referenceNo = nonOcc?.referenceNo;

        // this.benefitType = nonOcc?.benefitType?.english;
        //Lumpsum to be handled
        if (
          this.lateRequest &&
          this.isDisabilityBenefit &&
          (nonOcc?.benefitType?.english === BenefitType.NonOccDisabilityBenefitsType ||
            nonOcc?.benefitType?.english === BenefitType.nonOcc)
        ) {
          this.benefitType = BenefitType.NonOccDisabilityBenefitsType;
          this.pensionTransactionId = BenefitConstants.TRANSACTIONID_NON_OCCUPATIONAL_DISABILITY;
        } else if (nonOcc?.benefitType?.english === BenefitType.nonOccPensionBenefitType) {
          this.benefitType = BenefitType.nonOccPensionBenefitType;
          this.pensionTransactionId = BenefitConstants.TRANSACTIONID_NON_OCCUPATIONAL_PENSION;
        } else if (nonOcc?.benefitType?.english === BenefitType.nonOccLumpsumBenefitType) {
          this.benefitType = BenefitType.nonOccLumpsumBenefitType;
          this.pensionTransactionId = BenefitConstants.TRANSACTIONID_NON_OCCUPATIONAL_LUMPSUM;
        }
        this.benefitPropertyService.setBenType(this.benefitType);
        this.headingType = new BenefitTypeLabels(this.benefitType).getHeading();
        this.benefitPropertyService.setBenType(this.benefitType);
      });
  }

  requestDateChanged(date: GosiCalendar, isBenefitDetailsPage = false, templateRef?: TemplateRef<HTMLElement>) {
    this.benefitRequestsService
      .getEligibleBenefitByBenefitType(this.socialInsuranceNo, this.benefitType, date)
      .subscribe(
        res => {
          this.eligibilityApiResponse = res;
          this.eligibleForPensionReform = this.eligibilityApiResponse?.eligibleForPensionReform;
          if (res?.eligible) {
            this.isLateRequest(res, templateRef, isBenefitDetailsPage);
            this.isNotEligible = false;
            this.eligibleForBenefit = true;
            // this.lateRequest = res.lateRequest;
            if (isBenefitDetailsPage) {
              this.getBenefitCalculationByType(this.benefitType, date);
              // if (!this.benefitRequestId) {
              //   this.getDepHistoryWithoutReqId(this.socialInsuranceNo, this.benefitType, date);
              // }
              if (this.isPension && this.isNonOcc) {
                this.getDependentHistoryDetails(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
              } else if (this.isPension) {
                this.getDepHistoryWithoutReqId(this.socialInsuranceNo, this.benefitType, date);
              }
            }
          } else {
            // if (!isLumpsumBenefit(this.benefitType)) {
            //   this.alertService.showWarningByKey('BENEFITS.NOT-ELIGIBLE-PENSION');
            // } else {
            //   this.alertService.showWarningByKey('BENEFITS.NOT-ELIGIBLE-LUMPSUM');
            // }
            this.isNotEligible = true;
            this.eligibleForBenefit = false;
          }
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
  }

  /** Method to fetch benefit calculation details  */
  getBenefitCalculationByType(benefitType: string, reqDate?: GosiCalendar) {
    this.manageBenefitService.getAnnuityBenefitCalculations(this.socialInsuranceNo, benefitType, reqDate).subscribe(
      response => {
        this.benefitCalculation = response;
      },
      err => this.showError(err)
    );
  }

  onKeepDraft() {
    this.hideModal();
    this.location.back();
  }

  onDiscard() {
    this.manageBenefitService
      .deleteTransaction(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo)
      .subscribe(() => {
        this.location.back();
        this.hideModal();
      });
  }

  /** this method is to show other benefits and wage details */
  showBenefitsWagePopup(templateRef: TemplateRef<HTMLElement>, benefitWageDetail: EachHeirDetail) {
    this.benefitWageDetail = benefitWageDetail;
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
  }

  /** this method is to close popup */
  closePopup() {
    this.modalRef.hide();
  }

  navigateToProfile(sin: number) {
    const url = '#' + BenefitConstants.ROUTE_BENEFIT_LIST(null, sin);
    window.open(url, '_blank');
  }

  /** this method is to show ineligibility details */
  showIneligibilityDetails(templateRef: TemplateRef<HTMLElement>, details: ValidateRequest) {
    this.singleDepHeirDetails = details;
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
  }

  loadData(isLumpsum = false) {
    if (this.isValidator) {
      this.currentTab = 0;
      // this.initialiseTabWizards(this.benefitType, true);
      // this.hasDependentOrHeir = isDependentOrHeirWizardPresent(this.wizardItems);
      this.getAppliedBenefitDetails(this.benefitRequestId, this.socialInsuranceNo, this.referenceNo, isLumpsum);
      if (this.isJailed && this.routerData?.selectWizard !== BenefitConstants.BENEFIT_DETAILS) {
        this.dependentService.getImprisonmentDetails(this.socialInsuranceNo, this.benefitRequestId).subscribe(
          res => {
            if (res) {
              this.jailedPeriods = [res];
              this.imprissionmentDetails = res;
              this.dependentService.imprisonmentDetails = res;
            }
          },
          err => {
            this.showError(err);
          }
        );
      }
    } else if (this.socialInsuranceNo) {
      //Not validator
      this.manageBenefitService.getAnnuityBenefits(this.socialInsuranceNo).subscribe(
        data => {
          // this.getPersonDetails();
          if (Number(this.getPersonId())) {
            this.personId = +this.getPersonId();
            this.getPersonDetails();
          } else {
            this.contributorDomainService.getContributorIndividual(this.socialInsuranceNo).subscribe(data => {
              if (data.person?.personId) {
                this.contributorPersonId = data.person?.personId;
                this.getPersonDetails(true, this.contributorPersonId)
              }
            });
          }
          if (Number(this.getPersonId()) && !this.isAppPrivate) {
            this.getBankDetails(this.getPersonId());
          } else {
            this.contributorDomainService.getContributorIndividual(this.socialInsuranceNo).subscribe(data => {
              if (data.person?.personId) {
                this.contributorPersonId = data.person?.personId;
                this.getBankDetails(data.person?.personId);
              }
            });
          }
          this.currentTab = 0;
          const eligible = data.filter(
            eachBenefit =>
              eachBenefit.benefitType.english === this.benefitType && eachBenefit.eligibleForDependentAmount
          );
          this.eligibleForDependentAmount = eligible.length ? true : false;
          this.benefitPropertyService.setEligibleDependentAmount(this.eligibleForDependentAmount);
          this.initialiseTabWizards(this.benefitType, this.eligibleForDependentAmount, isLumpsum);
          if (this.isJailed) {
            if (!this.isValidator) {
              if (data && data.length > 0) {
                data.forEach(benefit => {
                  if (benefit.benefitType.english === this.benefitType) {
                    this.jailedPeriods = benefit.jailedPeriods;
                  }
                });
              }
            }
          } else {
            if (
              this.eligibleForDependentAmount &&
              this.wizardService.isWizardItemAvailable(BenefitConstants.DEPENDENTS_DETAILS, this.wizardItems) &&
              !this.isValidator &&
              !this.isNonOcc
            ) {
              this.getDependents(this.socialInsuranceNo, this.benefitType);
            }
          }
          this.hasDependentOrHeir = isDependentOrHeirWizardPresent(this.wizardItems);
          // this.getBenefitEligibilityByType(this.socialInsuranceNo, this.benefitType, {
          //   gregorian: this.benefitsForm.get('requestDate.gregorian')?.value
          // });
          // Confirm button implemented in benefits page
          // Defect 534112 eligibility check for benefitDetails loading in individual app
          if (!this.isHeir && !this.hasDependentOrHeir && !this.isAppPrivate) {
            this.requestDateChanged(this.systemRunDate, true);
            // if (this.benefitRequestId && this.referenceNo) {
            //   this.getAnnuityCalculation(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
            // } else {
            //   this.getBenefitCalculationByType(this.benefitType);
            // }
          }

          // this.getContirbutorRefundDetails();
          if (this.isHeir) {
            this.benefitRequestsService
              .getEligibleBenefitByBenefitType(
                this.socialInsuranceNo,
                this.benefitType,
                getRequestDateFromForm(this.benefitsForm)
              )
              .subscribe(
                res => {
                  this.eligibilityApiResponse = res;
                  this.lateRequest = res.lateRequest;
                  this.reasonForbenefits = new ReasonBenefit(
                    res.deathDate,
                    res.missingDate,
                    res.heirBenefitRequestReason
                  );
                  // if (res?.retirementEligibility?.eligibleForRetirementBenefit) {
                  //   this.alertService.showWarning(res?.retirementEligibility?.message);
                  //   this.disableSaveAndNext = true;
                  // }
                },
                err => {
                  showErrorMessage(err, this.alertService);
                }
              );
          }
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );

    }
  }
}
