/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  AnnuityResponseDto,
  AttorneyDetailsWrapper,
  BenefitDetails,
  CreditBalanceDetails,
  DeathNotification,
  DependentDetails,
  DependentHistory,
  DisabilityDetails,
  HeirAdjustments,
  HeirBenefitDetails,
  ImprisonmentDetails,
  PersonAdjustmentDetails,
  PersonBankDetails,
  PersonalInformation,
  ReturnLumpsumDetails,
  TransactionReference,
  UnemploymentResponseDto,
  AttorneyDetails,
  AuthorizationDetailsDto,
  UiApply
} from '../../models';
import {
  BPMMergeUpdateParamEnum,
  BPMUpdateRequest,
  BilingualText,
  Channel,
  DocumentItem,
  GosiCalendar,
  Lov,
  LovList,
  Role,
  RouterConstants,
  RouterData,
  SamaVerificationStatus,
  Transaction,
  TransactionReferenceData,
  TransactionStatus,
  ValidatorStatus,
  WorkFlowActions,
  CommonIdentity,
  checkIqamaOrBorderOrPassport,
  RoleIdEnum
} from '@gosi-ui/core';
import {AnnuityBenefitTypes, BenefitConstants, PersonConstants} from '@gosi-ui/features/benefits/lib/shared/constants';
import {
  BenefitType,
  BenefitValues,
  HeirStatusType, PensionReformEligibility,
  UIPayloadKeyEnum,
  UITransactionType,
  WorkFlowType
} from '../../enum';
import { Directive, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  deepCopy,
  getBenefitType,
  getHeirPaymentRequestBody,
  getServiceType,
  isDocumentsValid,
  isHeirBenefit,
  isHeirLumpsum,
  isJailedBenefit,
  isLumpsumBenefit,
  isOccBenefit,
  isRequest,
  isUiBenefit,
  setWorkFlowData,
  setWorkFlowDataForMerge,
  showErrorMessage
} from '../../utils';

import { BreadcrumbDcComponent } from '@gosi-ui/foundation-theme/src';
import { Observable } from 'rxjs';
import { TransactionDetailsBaseHelper } from './transaction-details-helper.base';
import moment from 'moment';

@Directive()
export abstract class TransactionDetailsBase extends TransactionDetailsBaseHelper {
  /**Local variables */
  injuryDate: GosiCalendar;
  retirementForm: FormGroup;
  retirementModal: FormGroup;
  comments;
  rejectReasonList: Observable<LovList> = new Observable<LovList>(null);
  returnReasonList: Observable<LovList> = new Observable<LovList>(null);
  canReject = false;
  approveComments: boolean;
  showComments = false;
  validatorCanEdit = false;
  docsCanEdit = false;
  isPersonWithoutId = false;
  uiItemList: DocumentItem[] = [];
  complicationDocumentList: DocumentItem[] = [];
  items: Lov[];
  taskId: string;
  requestType: string;
  user: string;
  documentListLov: LovList;
  requstedDocuments: BilingualText[];
  idCode: string;
  isdCode: string;
  isChangeRequired = false;
  transactionType: UITransactionType;
  transactionReference: TransactionReference[];
  transactionRefData: TransactionReferenceData[] = [];
  userName: BilingualText;
  documentList: DocumentItem[];
  reqList: DocumentItem[];
  benefitRequest: UnemploymentResponseDto;
  annuityBenefitDetails: AnnuityResponseDto;
  returnBenefitDetails: ReturnLumpsumDetails;
  notificationDate: GosiCalendar = new GosiCalendar();
  personNameEnglish: string = null;
  personNameArabic: String = null;
  nin: number;
  dependentDetails: DependentDetails[];
  heirDetails: DependentDetails[];
  //Anuity variables
  benefitCalculationDetails: BenefitDetails;
  imprisonmentDetails: ImprisonmentDetails;
  preSelectedAuthperson: AttorneyDetailsWrapper[];
  personDetails: PersonalInformation;
  transactionKey: string;
  // next 3 variables for dummy screen
  isDoctor = false;
  disabilityDetails: DisabilityDetails;
  disabilityForm: FormGroup;
  dependentHistory: DependentHistory;
  /** Output variables */
  requestDate: GosiCalendar;
  isHeirBenefit = false;
  isJailedBenefit = false;
  isOccBenefit = false;
  creditBalanceDetails: CreditBalanceDetails;
  personAdjustments: PersonAdjustmentDetails;
  bankDetails: PersonBankDetails;
  requestId: number;
  samaVerificationStatus = SamaVerificationStatus;
  isJailedLumpsum = false;
  isRPALumpsum = false;
  isEarlyRetirement = false;
  isNonOcc = false;
  isNonOccDisabilityAssessment = false;
  isJailedPension = false;
  isHazardous = false;
  isHeir = false;
  isOcc = false;
  isAddModifyBenefit = false;
  isModifyBackdated: boolean;
  isAddModifyHeir = false;
  isHoldBenefit = false;
  isStopBenefit = false;
  isRestartBenefit = false;
  isStartBenefitWaive = false;
  isStopBenefitWaive = false;
  isBackDated = false;
  setBreadCrumpManually = false;
  enableDirectPayment = false;
  transactionId: number;
  samaReject = false;

  @Input() isTransactionScreen = false;
  @Input() status: BilingualText;
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() samaDisable: EventEmitter<{ disableApprove: boolean; warningDisplay: BilingualText }> = new EventEmitter();
  heirAdjustments: HeirAdjustments = {} as HeirAdjustments;

  @ViewChild('brdcmb', { static: true })
  transactionBreadCrump: BreadcrumbDcComponent;
  @ViewChild('eligibilityCriteria', { static: true })
  eligibilityCriteria: TemplateRef<HTMLElement>;
  oldBenefitDetails: BenefitDetails[];
  eligibilityApiResponse: AnnuityResponseDto;
  validatorTaminaty = false;
  appealLateRequest = false;

  pensionReformEligibilityEnum = PensionReformEligibility;
  /** This method is to handle the data corresponding to the transation type */
  intialiseTheView(routerData: RouterData) {
    this.uiBenefitService.setRouterData(routerData);
    this.isDoctor = this.routerData.assignedRole === this.rolesEnum.DOCTOR;
    if (routerData.payload) {
      this.setRouterDataValues(routerData);
      this.uiBenefitService.setSocialInsuranceNo(this.socialInsuranceNo);
      this.uiBenefitService.setRegistrationNo(this.registrationNo);
      this.returnLumpsumService.setRepayId(this.repayId);
      this.benefitPropertyService.referenceNo = this.referenceNo;
      this.inspectionList = this.lookUpService.getInspectionType();
    }
    this.rejectReasonList = this.sanedBenefitService.getSanedRejectReasonList();
    this.returnReasonList = this.sanedBenefitService.getSanedReturnReasonList();
    this.setButtonConditions(routerData.assignedRole);
    if(this.channel === Channel.BATCH && this.routerData?.resourceType && isRequest(this.routerData?.resourceType) && this.routerData.assignedRole && this.routerData.assignedRole !== this.rolesEnum.CNT_FC_APPROVER  && this.routerData.assignedRole !== this.rolesEnum.FC_APPROVER_ANNUITY && this.routerData.assignedRole !== this.rolesEnum.FC_APPROVER) this.canReject = true;
    this.manageBenefitService.setValues(this.registrationNo, this.socialInsuranceNo, this.requestId);
    this.trackTransaction(this.referenceNo);
    this.disabilityDetails = new DisabilityDetails();
  }

  setRouterDataValues(routerData: RouterData) {
    const payload = JSON.parse(routerData.payload);
    this.registrationNo = payload.registrationNo;
    this.requestId = +this.routerData.idParams.get(UIPayloadKeyEnum.ID);
    this.socialInsuranceNo = +this.routerData.idParams.get(UIPayloadKeyEnum.SIN);
    this.benefitRequestId = this.requestId;
    this.repayId = +this.routerData.idParams.get(UIPayloadKeyEnum.REPAY_ID);
    this.workflowType = this.routerData.idParams.get(UIPayloadKeyEnum.RESOURCE);
    this.referenceNo = this.routerData.idParams.get(UIPayloadKeyEnum.REFERENCE_NO);
    this.channel = payload.channel;
    this.taskId = this.routerData.taskId;
    this.user = this.routerData.assigneeId;
    this.comments = this.routerData.comments;
    this.transactionRefData = this.routerData.comments;
    this.benefitType = payload?.benefitType;
    this.appealLateRequest = payload?.appealLateRequest;
    if (
      this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1 &&
      (this.channel === Channel.FIELD_OFFICE || (this.channel === Channel.TAMINATY && payload?.titleEnglish === 'Add/Modify Heirs')) &&
      !this.annuityBenefitDetails?.personWithoutIdentifier
    ) {
      this.validatorCanEdit = true; // Validator 1 can edit the transaction
    }
    if (this.channel === Channel.BATCH && this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1) {
      this.enableDirectPayment = true; // Validator 1 can edit the transaction
    }
    if (this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1 && this.channel === Channel.TAMINATY) {
      this.validatorTaminaty = true; // Validator 1 from individual App can edit the checkbox
      //this.validatorCanEdit = true;
    }
    if (
      this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1 &&
      this.channel === Channel.TAMINATY &&
      this.isAddModifyBenefit
    ) {
      // Validator 1 from individual App can edit the checkbox
      this.validatorCanEdit = true;
    }

    if (
      this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1 &&
      // this.channel === Channel.SYSTEM &&
      this.routerData.resourceType === BenefitConstants.TRANSACTION_HEIR_PROACTIVE &&
      this.routerData.idParams.get(UIPayloadKeyEnum.SUB_RESOURCE) ===
      BenefitConstants.TRANSACTION_HEIR_PROACTIVE_SUB_RESOURCE
    ) {
      this.validatorCanEdit = true; // Validator 1 can edit the transaction
    }
  }

  getRejectionReason(childRequestForm: FormGroup) {
    this.rejectReasonList = this.sanedBenefitService.getRejectReasonValidator();
    if (this.workflowType === WorkFlowType.SANED || this.workflowType === WorkFlowType.PROACTIVE_SANED) {
      this.rejectReasonList = this.sanedBenefitService.getSanedRejectReasonValidator();
    }
    childRequestForm.get('rejectionIndicator').setValue(true);
  }

  //Method to approve the transaction.
  confirmApprove(childCompForm: FormGroup, uiPayload?: UiApply) {
    const workflowData = setWorkFlowData(childCompForm, this.routerData, this.referenceNo);
    workflowData.outcome = WorkFlowActions.APPROVE;
    if (
      this.retirementForm &&
      (this.retirementForm.get('adjustmentDetails') || this.retirementForm.get('heirAdjustmentForm'))
    ) {
      const params = this.retirementForm.get('adjustmentDetails')
        ? this.retirementForm.get('adjustmentDetails').value
        : null;
      const reqBody = this.retirementForm.get('heirAdjustmentForm')
        ? getHeirPaymentRequestBody(this.retirementForm.get('heirAdjustmentForm') as FormArray)
        : null;
      this.adjustmentService
        .directPayment(this.socialInsuranceNo, this.referenceNo, this.benefitRequestId, params, reqBody)
        .subscribe(
          () => {
            this.saveWorkflow(workflowData);
          },
          err => {
            this.showError(err);
          }
        );
    } else {
      if (uiPayload) {
        this.sanedBenefitService.updateBenefit(this.socialInsuranceNo, this.benefitRequestId, uiPayload).subscribe(
          data => {

          },
          err => {
            if (err.status === 400 || err.status === 422) {
              showErrorMessage(err, this.alertService);
            }
            if (err.status === 500 || err.status === 404) {
              this.alertService.showWarningByKey('BENEFITS.SUBMIT-FAILED-MSG');
            }
            this.goToTop();
          }
        );
      }


      this.saveWorkflow(workflowData);
      
    }
    this.hideModal();
  }

  //Method to reject the transaction.
  confirmReject(childCompForm: FormGroup, routeBack = true) {
    if (this.routerData?.resourceType !== 'UI Benefit Adjustment') {
      const workflowData = setWorkFlowDataForMerge(this.routerData, childCompForm, WorkFlowActions.REJECT);
      this.saveWorkflow(workflowData, routeBack);
      this.hideModal();
    }
  }

  //Method to reject the transaction.
  confirmReturn(childCompForm: FormGroup, returnRole?: string) {
    let workflowData: BPMUpdateRequest;
    // if (
    //   this.routerData.channel?.toLowerCase() === Channel.TAMINATY.toLowerCase() &&
    //   this.routerData.assignedRole === Role.VALIDATOR_1
    // ) {
    if (returnRole) {
      workflowData = setWorkFlowDataForMerge(this.routerData, childCompForm, WorkFlowActions.RETURN, returnRole);
    } else {
      workflowData = setWorkFlowDataForMerge(this.routerData, childCompForm, WorkFlowActions.RETURN);
    }
    // } else {
    //   workflowData = setWorkFlowData(childCompForm, this.routerData, this.referenceNo);
    // }
    workflowData.outcome = WorkFlowActions.RETURN;
    this.saveWorkflow(
      workflowData,
      true,
      this.routerData
    );
    this.hideModal();
  }

  //This method is used to confirm cancellation of transaction
  confirmCancel() {
    this.commonModalRef.hide();
    this.reset.emit();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  // Method to get the token from local storage
  // getPersonId(): string {
  //   return this.benefitRequest ? this.benefitRequest.personId?.toString() : null;
  // }
  //Method to sae workflow details.
  saveWorkflow(data: BPMUpdateRequest, routeBack = true, routerData = new RouterData()) {
    let nonOccSectionManagerApproval = false;
    if (
      data.outcome === WorkFlowActions.APPROVE &&
      (data.assignedRole === Role.SM || data.assignedRole === Role.BOSH) &&
      this.benefitType === BenefitType.NonOccDisabilityBenefitsType
    ) {
      nonOccSectionManagerApproval = true;
    }
    this.manageBenefitService
      .updateAnnuityWorkflow(data, false, nonOccSectionManagerApproval, routerData)
      .subscribe(
        () => {
          if (data.outcome === WorkFlowActions.APPROVE) {
            this.alertService.showSuccessByKey('BENEFITS.REQUEST_STATUS_APPROVED');
          } else if (data.outcome === WorkFlowActions.REJECT) {
            this.alertService.showSuccessByKey('BENEFITS.REQUEST_STATUS_REJECTED');
          } else if (data.outcome === WorkFlowActions.RETURN) {
            this.alertService.showSuccessByKey('BENEFITS.REQUEST_STATUS_RETURNED');
          } else if (data.outcome === WorkFlowActions.SEND_FOR_INSPECTION) {
            this.alertService.showSuccessByKey('BENEFITS.REQUEST_STATUS_INSPECTION');
          }
          if (
            data.outcome === WorkFlowActions.APPROVE &&
            (data.assignedRole === Role.SM || data.assignedRole === Role.BOSH)
          ) {
            this.manageBenefitService
              .updateLateRequest(
                this.socialInsuranceNo,
                this.benefitRequestId,
                data.bypassLateBenefitRequest,
                this.referenceNo
              )
              .subscribe(
                () => {
                  if (routeBack) {
                    this.router.navigate([RouterConstants.ROUTE_INBOX]);
                  }
                },
                err => {
                  this.showError(err);
                }
              );
          } else {
            if (routeBack) {
              this.router.navigate([RouterConstants.ROUTE_INBOX]);
            }
          }
        },
        err => {
          if (err.status === 400 || err.status === 422) {
            this.alertService.showError(err.error.message);
          }
          if (err.status === 500 || err.status === 404) {
            this.alertService.showErrorByKey('BENEFITS.SUBMIT-FAILED-MSG');
          }
        }
      );
  }

  /* To get Requested Documents from Validator*/
  receiveDocumentList(documentList) {
    this.requstedDocuments = documentList;
  }

  setBenefitRelatedValues(transaction: Transaction) {
    this.channel = transaction.channel.english;
    this.referenceNo = transaction.transactionRefNo;
    this.transactionId = transaction.transactionId;
    this.socialInsuranceNo = this.isIndividualApp ? this.authTokenService.getIndividual() : transaction.params.SIN;
    this.benefitRequestId = transaction.params.BENEFIT_REQUEST_ID;
    this.requestId = this.benefitRequestId;
    // if (this.transactionId === Number(302024)) {
    //   this.heirAccordianPresent = true;
    //   this.isModificationDetailsPresent = true;
    //   this.isStartBenefit = true;
    // }
    // this.businessId = this.transaction.params.BUSINESS_ID;
    // this.requestId = +this.routerData.idParams.get(UIPayloadKeyEnum.ID);
    // this.getDocuments(this.transactionName, this.transactionType, this.referenceNumber);
    if (this.status?.english === 'Completed') {
      this.referenceNo = null;
    }
    const roles = this.menuService.getRoles();
    if (
      this.isHeir &&
      this.isIndividualApp &&
      roles.length === 1 &&
      roles.find(item => item === RoleIdEnum.GUEST.toString())
    ) {
      //TODO: accessing Heir transaction screen for guest user is not permitted for now
      return;
    }
    this.getAnnuityBenefitDetails(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo, false);
  }

  //Method to fetch the annuity request details  /
  getAnnuityBenefitDetails(
    socialInsuranceNo: number,
    benefitRequestId: number,
    referenceNo: number,
    chckEligibility = true
  ) {
    this.manageBenefitService
      .getAnnuityBenefitRequestDetail(socialInsuranceNo, benefitRequestId, referenceNo)
      .subscribe(
        res => {
          let isModify = false;
          if (this.requestType && this.getIsModify()) {
            isModify = true;
          }
          if ((this.isNonOcc || this.isOcc) && res?.isAppealed && !res?.resultPublished) {
            this.disableApprove = true;
            this.alertService.showWarning(res?.warningMessage);
          }
          // disable validator approve if personWithoutIdentifier is true. (Defect 564955)
          if (res?.personWithoutIdentifier && isModify) {
            this.disableApprove = true;
            this.isPersonWithoutId = true;
          }
          if (chckEligibility && isRequest(this.routerData?.resourceType) && !isOccBenefit(res.benefitType?.english) && this.routerData?.resourceType !== 'Modify Benefit') {
            this.benefitRequestsService
              .getEligibleBenefitByBenefitType(
                socialInsuranceNo,
                getBenefitType(res.benefitType.english),
                res.requestDate,
                res.deathDate,
                res.missingDate,
                benefitRequestId
              )
              .subscribe(
                eligibilityResponse => {
                  //US: 524388
                  if (eligibilityResponse && !eligibilityResponse.eligible) {
                    this.eligibilityApiResponse = res;
                    this.confirmReject(
                      this.fb.group({
                        rejectionReason: this.fb.group({
                          arabic: ['غير مؤهل للمنفعة'],
                          english: ['Ineligible for the benefit']
                        }),
                        comments: 'Ineligible for the benefit’ (غير مؤهل للمنفعة)'
                      }),
                      false
                    );
                    this.showModal(this.eligibilityCriteria, { class: 'modal-lg', ignoreBackdropClick: true });
                  } else {
                    // eligible
                    this.annuityBenefitDetails = res;
                    this.status = this.annuityBenefitDetails.status;
                    this.personNameEnglish = this.annuityBenefitDetails.contributorName.english;
                    this.personNameArabic = this.annuityBenefitDetails.contributorName.arabic;
                    // CLM BANK API INTEGRATION CHANGED
                    if (this.annuityBenefitDetails?.bankAccount)
                      this.setBankDetails(this.annuityBenefitDetails?.bankAccount);
                    this.initialize(socialInsuranceNo, benefitRequestId);
                    this.getLumpSumSystemRunDate();
                  }
                },
                err => {
                  showErrorMessage(err, this.alertService);
                }
              );
          } else {
            // eligibility is not checking
            this.annuityBenefitDetails = res;
            this.personNameEnglish = this.annuityBenefitDetails.contributorName.english;
            this.personNameArabic = this.annuityBenefitDetails.contributorName.arabic;
            // CLM BANK API INTEGRATION CHANGED
            if (this.annuityBenefitDetails?.bankAccount) this.setBankDetails(this.annuityBenefitDetails?.bankAccount);
            this.initialize(socialInsuranceNo, benefitRequestId);
            this.getLumpSumSystemRunDate();
          }
        },
        err => {
          this.showError(err);
        }
      );
  }

  getLumpSumSystemRunDate() {
    this.manageBenefitService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
      if (this.systemRunDate?.gregorian) {
        this.getPersonDetails(this.annuityBenefitDetails.personId, this.annuityBenefitDetails.agentId);
      }
    });
  }

  getPersonDetails(personId, agentId?: number) {
    this.manageBenefitService.getPersonDetailsWithPersonId(personId).subscribe(personalDetails => {
      const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(personalDetails.identity);
      this.manageBenefitService.setNin(idObj?.id);
      if (!this.isHeir) {
        this.getAttorneyByIdentifier(idObj?.id, agentId);
      }
    });
  }

  setAnnuityBenefitRelatedValues(benefitRequestId, socialInsuranceNo, referenceNo) {
    let isModifyBenefit = false;
    const payload = this.routerData?.payload ? JSON.parse(this.routerData?.payload) : null;
    this.benefitType = this.annuityBenefitDetails.benefitType.english;
    this.status = this.annuityBenefitDetails.status;
    this.isHeirBenefit = isHeirBenefit(this.benefitType);
    this.isJailedBenefit = isJailedBenefit(this.benefitType);
    this.isOccBenefit = isOccBenefit(this.benefitType);
    //requestType setting from sc comp using routerData subResource
    this.setHeading(this.benefitType, this.requestType, this.annuityBenefitDetails.actionType);
    if (this.setBreadCrumpManually) this.setBreadCrump();
    // this.getContributorPersonDetails(this.annuityBenefitDetails?.agentId);
    if (this.requestType && this.getIsRequestType()) {
      isModifyBenefit = true;
    }
    if (!this.isDoctor) {
      if (this.isHeirBenefit) {
        const referenceNumber = this.referenceNo;
        if (this.status?.english === 'Completed') {
          referenceNo = null;
        }
        const heirStatuses = isHeirLumpsum(this.benefitType)
          ? [
            HeirStatusType.ACTIVE,
            HeirStatusType.STOPPED,
            HeirStatusType.ON_HOLD,
            HeirStatusType.WAIVED_TOWARDS_GOSI,
            HeirStatusType.WAIVED_TOWARDS_HEIR,
            HeirStatusType.PAID_UP
          ]
          : [
            HeirStatusType.ACTIVE,
            HeirStatusType.STOPPED,
            HeirStatusType.ON_HOLD,
            HeirStatusType.WAIVED_TOWARDS_GOSI,
            HeirStatusType.WAIVED_TOWARDS_HEIR
          ];
        if (this.requestType === BenefitType.addModifyHeir) {
          this.heirBenefitService
            .getHeirBenefit(socialInsuranceNo, benefitRequestId.toString(), referenceNo, heirStatuses, true)
            .subscribe(
              res => {
                this.dependentDetails = res;
                this.checkSamaRejected();
                this.showDeathNotification();
                this.dependentService.setDependents(this.dependentDetails);
              },
              err => {
                showErrorMessage(err, this.alertService);
              }
            );
        } else {
          this.getHeirDetails(this.socialInsuranceNo, this.requestId, referenceNumber);
        }
      } else if (this.benefitType !== BenefitType.funeralGrant) {
        this.getDependentDetails(socialInsuranceNo, benefitRequestId, referenceNo);
      }
      if (payload?.subResource !== BenefitValues.holdHeir && !this.annuityBenefitDetails?.hideBenefitDetails) {
        this.getAnnuityCalculation(
          socialInsuranceNo,
          benefitRequestId,
          this.status?.english === 'Completed' ? null : referenceNo
        );
      }
    }
    if (this.annuityBenefitDetails?.status?.english !== ValidatorStatus.ACTIVE)
      this.getAnnuityEligibilityDetails(socialInsuranceNo,(this.benefitType === 'Non Occupational Disability Benefit' && this.isTransactionScreen) ? null : this.benefitType);
    if (!this.startWaive && !this.stopWaive) {
      if (!this.isIndividualApp) {
        this.contributorDomainService.getContributorByPersonId(this.annuityBenefitDetails?.personId).subscribe(
          data => {
            if (data.hasVICEngagement) {
              const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(this.annuityBenefitDetails?.identity);
              this.manageBenefitService.getContributorCreditBalance(idObj?.id).subscribe(
                response => {
                  this.creditBalanceDetails = response;
                }
                //err => this.showError(err)
              );
            }
          },
          err => {
            this.showError(err);
          }
        );
      } else {
        this.contributorDomainService.getContributorIndividual(this.authTokenService.getIndividual()).subscribe(
          data => {
            if (data.hasVICEngagement) {
              const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(this.annuityBenefitDetails?.identity);
              this.manageBenefitService.getContributorCreditBalance(idObj?.id).subscribe(
                response => {
                  this.creditBalanceDetails = response;
                }
                //err => this.showError(err)
              );
            }
          },
          err => {
            this.showError(err);
          }
        );
      }
    }
    this.dependentService.setDependents([]);
    if (this.annuityBenefitDetails.heirBenefitReason) {
      this.dependentService.setReasonForBenefit(null, null, null);
      if (this.annuityBenefitDetails.deathDate) {
        this.dependentService.setReasonForBenefit(
          this.annuityBenefitDetails.deathDate,
          null,
          this.annuityBenefitDetails.heirBenefitReason
        );
      } else {
        this.dependentService.setReasonForBenefit(
          null,
          this.annuityBenefitDetails.missingDate,
          this.annuityBenefitDetails.heirBenefitReason
        );
      }
    }
    this.personNameEnglish = this.annuityBenefitDetails.contributorName.english;
    this.personNameArabic = this.annuityBenefitDetails.contributorName.arabic;
    this.requestDate = this.annuityBenefitDetails.requestDate;
    this.notificationDate = this.annuityBenefitDetails.notificationDate;
    this.benefitPropertyService.setPaymentMethod(this.annuityBenefitDetails?.paymentMethod?.english);
    this.nin = this.annuityBenefitDetails.nin;
    this.benefitPropertyService.setNin(this.nin);
    this.benefitPropertyService.setPayeeType(this.annuityBenefitDetails?.payeeType?.english);
    this.benefitPropertyService.setPersonId(this.annuityBenefitDetails.personId);
    this.benefitPropertyService.setPaymentMethod(this.annuityBenefitDetails?.paymentMethod?.english);

    if (!this.isHeirBenefit) {
      if (this.annuityBenefitDetails?.payeeType?.english === BenefitValues.authorizedPerson) {
        // this.getAuthorizedPersonDetails(isModifyBenefit);
        this.authPersonId = this.annuityBenefitDetails.agentId;
        // this.getBankDetails(this.authPersonId?.toString());
        this.setBankDetails(this.annuityBenefitDetails.bankAccount);
        this.getContDetailWithPerid(this.authPersonId, BenefitValues.authorizedPerson);
        // this.benefitPropertyService.setPersonId(this.authPersonId);
      } else {
        if (!this.isDoctor) {
          // this.getBankDetails(this.annuityBenefitDetails?.personId?.toString());
          this.setBankDetails(this.annuityBenefitDetails?.bankAccount);
        }
      }
    }

    // else {
    if (!this.isDoctor) {
      if (this.nin) {
        this.getPersonContactDetails(BenefitValues.contributor);
      } else {
        this.getContDetailWithPerid(this.annuityBenefitDetails.personId, BenefitValues.contributor);
      }
    }
    if (this.annuityBenefitDetails?.deathNotification)
      this.setErrorMsgAndBtnStatus(this.annuityBenefitDetails?.deathNotification);
    if (this.annuityBenefitDetails?.isDirectPayment || this.annuityBenefitDetails?.isHold) {
      const adjustmentDetailsForm = this.fb.group({
        holdBenefit: [this.annuityBenefitDetails.isHold],
        initiateDirectPayment: [this.annuityBenefitDetails.isDirectPayment]
      });
      if (this.retirementForm.get('adjustmentDetails')) {
        this.retirementForm.get('adjustmentDetails').patchValue(adjustmentDetailsForm.value);
      } else {
        this.retirementForm.addControl('adjustmentDetails', adjustmentDetailsForm);
      }
    }
    // if (this.annuityBenefitDetails.personId) {
    //   this.benefitPropertyService.setPersonId(this.annuityBenefitDetails.personId);
    //   if (!this.isDoctor)
    //     this.getBankDetails(this.annuityBenefitDetails?.personId?.toString(), isModifyBenefit);
    // }
    // }
  }

  getAuthorizedPersonListOfHeir(heirList: DependentDetails[]) {
    heirList.forEach(heir => {
      this.manageBenefitService.getPersonDetailsWithPersonId(heir.personId.toString()).subscribe(personDetails => {
        const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(personDetails.identity);
        this.manageBenefitService.getAttorneyDetails(idObj.id).subscribe(res => {
          if (!res) return;
          heir.authorizedPersonDetails = <AttorneyDetailsWrapper[]>[];
          heir.guardianPersonDetails = <AttorneyDetailsWrapper[]>[];
          this.setAuthorizedPersonDetails(heir.authorizedPersonDetails, heir.guardianPersonDetails, res);
          if (!this.isCertificateExpired) this.setCertificateExpiryDateOfHeir(heir);
        });
      });
    });
    if (this.isCertificateExpired) this.setCertificateIssue(this.isCertificateExpired);
  }

  setCertificateExpiryDateOfHeir(heir) {
    if (!heir) return;
    if (heir.payeeType === BenefitValues.guardian) {
      this.isCertificateExpired =
        heir.authorizedPersonDetails.findIndex(authPerson => authPerson.personId === heir.guardianPersonId) < 0;
    }
    if (heir.payeeType === BenefitValues.authorizedPerson) {
      this.isCertificateExpired =
        heir.authorizedPersonDetails.findIndex(authPerson => authPerson.personId === heir.authorizedPersonId) < 0;
    }
  }

  checkSamaRejected() {
    const index = this.dependentDetails.findIndex(eachHierBank => eachHierBank?.bankAccount?.disableApprove === true);
    if (index >= 0) {
      this.samaDisable.emit({
        disableApprove: true,
        warningDisplay: this.dependentDetails[index]?.bankAccount?.bankWarningMessage
      });
    }
  }

  setAuthorizedPersonDetails(
    authorizedPersonDetails: AttorneyDetailsWrapper[],
    guardianPersonDetails: AttorneyDetailsWrapper[],
    authorizationDetails: AuthorizationDetailsDto
  ) {
    authorizationDetails.authorizationList.forEach(val => {
      if (
        val.authorizationType?.english === 'Attorney' &&
        (!val?.endDate || moment().diff(moment(val?.endDate?.gregorian), 'days') < 0) &&
        val?.isBeneficiarysAuthorisedPerson &&
        val.isActive
      ) {
        const authorizedPersonDetail = new AttorneyDetailsWrapper();
        //setting attorney details
        // authorizedPersonDetail.attorneyDetails.authorizationDetailsId = val.authorizationNumber;
        authorizedPersonDetail.personId = val?.agent?.id ? Number(val?.agent?.id) : null;
        authorizedPersonDetail.name = val?.agent?.name;
        authorizedPersonDetail.identity = val?.agent?.identity;
        if (!authorizedPersonDetail.attorneyDetails) authorizedPersonDetail.attorneyDetails = new AttorneyDetails();
        authorizedPersonDetail.attorneyDetails.certificateNumber = val?.authorizationNumber;
        authorizedPersonDetail.attorneyDetails.certificateExpiryDate = val?.endDate;
        authorizedPersonDetails.push(authorizedPersonDetail);
      } else if (
        val.authorizationType?.english === 'Custody' &&
        (!val?.endDate || moment().diff(moment(val?.endDate?.gregorian), 'days') < 0) &&
        val.isActive
      ) {
        const authorizedPersonDetail = new AttorneyDetailsWrapper();
        authorizedPersonDetail.personId = val?.custodian?.id ? Number(val?.custodian?.id) : null;
        authorizedPersonDetail.name = val.custodian?.name;
        authorizedPersonDetail.identity = val.custodian?.identity;
        if (!authorizedPersonDetail.attorneyDetails) authorizedPersonDetail.attorneyDetails = new AttorneyDetails();
        authorizedPersonDetail.attorneyDetails.certificateNumber = val?.authorizationNumber;
        authorizedPersonDetail.attorneyDetails.certificateExpiryDate = val?.endDate;
        guardianPersonDetails.push(authorizedPersonDetail);
      }
    });
  }

  setBreadCrump() {
    if (this.route.routeConfig && this.transactionBreadCrump) {
      this.route.routeConfig.data = { breadcrumb: this.getBreadCrumpHeading() };
      this.transactionBreadCrump.breadcrumbs = this.transactionBreadCrump.buildBreadCrumb(this.route.root);
    }
  }

  getBreadCrumpHeading() {
    if (isLumpsumBenefit(this.benefitType)) {
      if (
        !this.isNonOcc &&
        !this.isJailedLumpsum &&
        !this.isHazardous &&
        !this.isHeir &&
        !this.isOcc &&
        !this.isRPALumpsum
      ) {
        return 'BENEFITS.LUMPSUM-BENEFIT-HEADING';
      }
      if (this.isNonOcc) {
        return 'BENEFITS.NONOCC-LUMPSUM-BENEFIT-HEADING';
      }
      if (this.isJailedLumpsum) {
        return 'BENEFITS.REQUEST-JAILED-LUMPSUM-BENEFIT';
      }
      if (this.isHazardous) {
        return 'BENEFITS.REQUEST-HAZARDOUS-LUMPSUM-BENEFIT';
      }
      if (this.isHeir) {
        return 'BENEFITS.REQUEST-HEIR-LUMPSUM-BENEFIT';
      }
      if (this.isOcc) {
        return 'BENEFITS.REQ-OCC-LUMPSUM-DISABILITY-BENEFIT';
      }
      if (this.isRPALumpsum) {
        return 'BENEFITS.REQUEST-RPA-LUMPSUM-BENEFIT';
      }
    } else {
      if (!this.subHeading && !this.stopWaive && !this.startWaive) return this.heading;
      if (
        this.subHeading &&
        !this.stopWaive &&
        !this.startWaive &&
        (this.isHoldBenefit || this.isRestartBenefit) &&
        this.isHeir
      )
        return this.heading;
    }
  }

  getIsRequestType() {
    return (
      this.requestType === BenefitType.addModifyBenefit ||
      this.requestType === BenefitType.addModifyHeir ||
      this.requestType === BenefitType.holdbenefit ||
      this.requestType === BenefitType.stopbenefit ||
      this.requestType === BenefitType.restartbenefit ||
      this.requestType === BenefitType.startBenefitWaive ||
      this.requestType === BenefitType.stopBenefitWaive
    );
  }

  // waive and stop not required for Defect 564955
  getIsModify() {
    return (
      this.requestType === BenefitType.addModifyBenefit ||
      this.requestType === BenefitType.addModifyHeir ||
      this.requestType === BenefitType.holdbenefit ||
      this.requestType === BenefitType.restartbenefit
    );
  }

  // fetch heir details
  getHeirDetails(sin: number, benefitRequestId: number, referenceNo: number, requestScreen = false) {
    this.heirBenefitService
      .getHeirForValidatorScreen(sin, benefitRequestId?.toString(), referenceNo, this.benefitType, null, requestScreen)
      .subscribe(res => {
        this.dependentDetails = res;
        this.checkSamaRejected();
        this.route.queryParams.subscribe(params => {
          if (
            params.restart === 'true' &&
            this.dependentDetails
              .filter(dependent => dependent.actionType === 'RESTART')
              .some(dependentItem => dependentItem.disabled)
          ) {
            this.validatorCanEdit = false;
          }
        });
        if (
          this.routerData.resourceType === BenefitConstants.TRANSACTION_HEIR_PROACTIVE &&
          this.routerData.idParams.get(UIPayloadKeyEnum.SUB_RESOURCE) ===
          BenefitConstants.TRANSACTION_HEIR_PROACTIVE_SUB_RESOURCE &&
          res.findIndex(dep => !dep.validEvent) !== -1
        ) {
          this.disableApprove = true;
          this.alertService.showErrorByKey('BENEFITS.HEIRS-MISSING-INFO');
        }
        this.showDeathNotification();
        this.dependentService.setDependents(this.dependentDetails);
        this.getAuthorizedPersonListOfHeir(this.dependentDetails);
      });
  }

  // fetch dependent details
  getDependentDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.dependentService
      .getDependentDetailsById(sin, benefitRequestId?.toString(), referenceNo, null)
      .subscribe(res => {
        this.dependentDetails = res;
        this.checkSamaRejected();
        this.heirDetails = res;
        if (this.dependentDetails.length > 0) {
          // this.getDocuments(
          //   this.transactionKey,
          //   this.transactionType,
          //   this.requestId,
          //   this.referenceNo,
          //   this.isBackDated
          // );
          this.route.queryParams.subscribe(params => {
            if (
              params.restart === 'true' &&
              this.dependentDetails
                .filter(dependent => dependent.actionType === 'RESTART')
                .some(dependentItem => dependentItem.disabled)
            ) {
              this.validatorCanEdit = false;
            }
          });
        }
        this.showDeathNotification();
        this.dependentService.setDependents(this.dependentDetails);
      });
  }

  showDeathNotification() {
    if (!this.annuityBenefitDetails?.deathNotification) {
      const indexOfDeathNotification = this.dependentDetails.findIndex(dependent =>
        dependent.deathNotification ? true : false
      );
      if (indexOfDeathNotification >= 0) {
        this.setErrorMsgAndBtnStatus(this.dependentDetails[indexOfDeathNotification].deathNotification);
      }
    }
  }

  /** Method to fetch calculate details when benefit request id is available */
  getAnnuityCalculation(sin: number, benefitRequestId: number, referenceNo: number) {
    this.manageBenefitService
      .getBenefitCalculationDetailsByRequestId(sin, benefitRequestId, referenceNo)
      .subscribe(calculation => {
        this.benefitCalculationDetails = calculation;
      });
  }

  approveTransaction(templateRef: TemplateRef<HTMLElement>, approvingAnnualNotification = false) {
    if (!this.disableApprove) {
      if (
        this.isHeirBenefit &&
        !approvingAnnualNotification &&
        !this.benefitCalculationDetails?.eligibleHeirsPresent &&
        !this.isHoldBenefit &&
        !this.isStopBenefit &&
        !this.isRestartBenefit &&
        !this.isStartBenefitWaive &&
        !this.isStopBenefitWaive
      ) {
        this.alertService.showErrorByKey('BENEFITS.NO-ELIGIBLE-HEIRS');
      } else {
        this.showModal(templateRef);
      }
    }
  }

  setErrorMsgAndBtnStatus(deathNotification: DeathNotification) {
    if (deathNotification?.deathNotificationMessage && !this.isTransactionScreen) {
      this.alertService.showWarning(deathNotification?.deathNotificationMessage);
    }
    if (this.routerData.assignedRole === this.rolesEnum.FC_APPROVER) {
      this.disableApprove = deathNotification?.disableFcApprove;
    }
    if (
      this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1 ||
      this.routerData.assignedRole === this.rolesEnum.VALIDATOR_2
    ) {
      this.disableApprove = deathNotification?.disableValidatorApprove;
      this.validatorCanEdit = !deathNotification?.disableValidatorModify;
    }
  }

  getDocuments(
    transactionKey: string,
    transactionType: string,
    benefitRequestId: number,
    referenceNo: number,
    isBackDated = false
  ) {
    this.benefitDocumentService
      .getValidatorDocuments(
        this.socialInsuranceNo,
        benefitRequestId,
        referenceNo,
        transactionKey,
        transactionType,
        isBackDated
      )
      .subscribe(res => {
        this.reqList = res;
        if (isDocumentsValid(this.reqList)) {
          this.documentList = this.reqList;
        }
      });
  }

  getTransactionCompletedDocuments() {
    this.documentService.getAllDocuments(null, this.referenceNo, this.benefitRequestId).subscribe(docs => {
      this.reqList = docs;
      if (isDocumentsValid(this.reqList)) {
        this.documentList = this.reqList;
      }
    });
  }

  // Method to track transaction of Validator 1
  trackTransaction(referenceNo: number) {
    if (this.comments) {
      this.transactionReference = this.comments;
      if (this.comments.length > 0) {
        const transRefData = [];
        this.comments.forEach(data => {
          if (data.comments !== null) {
            transRefData.push(data);
          }
        });
        this.userName = this.comments[0].userName;
      }
      // todo: KP need to revisit transaction step status check
      this.transactionReference.forEach(item => {
        if (
          item &&
          item.role?.english === 'First Validator' &&
          item.transactionStepStatus?.toLowerCase() === 'validator submit'
        ) {
          if (item.transactionStatus?.toLowerCase() === TransactionStatus.COMPLETED.toLowerCase()) {
            if (this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1) {
              this.approveComments = true;
              return;
            } else {
              this.approveComments = false;
            }
          } else if (item?.transactionStatus?.toLowerCase() === TransactionStatus.IN_PROGRESS.toLowerCase()) {
            if (this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1) {
              this.disableApprove = true;
              return;
            } else {
              this.disableApprove = false;
            }
          }
        }
      });
    }
  }

  // getAuthorizedPersonDetails(isModifyBenefit: boolean) {
  //   if (this.requestId && this.socialInsuranceNo) {
  //     this.manageBenefitService.getSelectedAuthPerson(this.socialInsuranceNo, this.requestId).subscribe(res => {
  //       this.preSelectedAuthperson = res;
  //       if (this.preSelectedAuthperson[0]) {
  //         if (this.preSelectedAuthperson[0].personId) {
  //           this.authPersonId = this.preSelectedAuthperson[0].personId;
  //           this.getBankDetails(this.authPersonId?.toString());
  //           this.getContDetailWithPerid(this.authPersonId, BenefitValues.authorizedPerson);
  //           this.benefitPropertyService.setPersonId(this.authPersonId);
  //         }
  //       }
  //     });
  //   }
  // }

  getPersonContactDetails(type: string) {
    const queryParams = `NIN=${this.nin}`;
    this.manageBenefitService.getPersonDetailsApi(queryParams).subscribe(personalDetails => {
      this.personDetails = personalDetails.listOfPersons[0];
      this.personDetails.personType = type;
      this.benefitPropertyService.setPayeeNationality(this.personDetails.nationality.english);
      if (!this.isHeirBenefit) this.getPersonAdjustmentDetails(this.personDetails.personId);
    });
  }

  getContDetailWithPerid(id: number, type: string) {
    this.manageBenefitService.getPersonDetailsWithPersonId(id?.toString()).subscribe(personalDetails => {
      this.personDetails = personalDetails;
      this.personDetails.personType = type;
      this.benefitPropertyService.setPayeeNationality(this.personDetails.nationality.english);
      if (!this.isHeirBenefit && type !== BenefitValues.authorizedPerson)
        this.getPersonAdjustmentDetails(this.personDetails.personId);
    });
  }

  getPersonAdjustmentDetails(personId: number) {
    this.adjustmentService.adjustmentDetails(personId, this.socialInsuranceNo).subscribe(adjustmentDetails => {
      if (this.isHeirBenefit) {
        this.heirAdjustments[personId] = adjustmentDetails;
      } else {
        this.personAdjustments = adjustmentDetails;
      }
    });
  }

  /** method to get reason for benefit*/
  getAnnuityEligibilityDetails(sin: number, benefitType?: string) {
    this.heirBenefitService.getEligibleBenefitByType(sin, benefitType).subscribe(data => {
      if (data && data.length > 0) {
        if (data[0]?.hasActiveCommercialRegistry && benefitType === BenefitType.earlyretirement) {
          this.alertService.showWarningByKey('BENEFITS.ACTIVE-COMMERCIAL-WARNING');
        }
        if (data[0]?.warningMessages && data[0]?.warningMessages.length > 0) {
          this.alertService.showWarning(data[0]?.warningMessages[0]);
        }
      }
    });
  }

  getDependentHistory(personId: number) {
    this.dependentService.getDependentHistory(this.socialInsuranceNo, this.requestId, personId).subscribe(
      history => {
        this.dependentHistory = history;
      },
      err => {
        this.showError(err);
      }
    );
  }

  /** This method is to send the request to inspection.*/
  confirmInspection() {
    this.retirementForm.updateValueAndValidity();
    const workflowData = setWorkFlowDataForMerge(
      this.routerData,
      this.retirementForm,
      WorkFlowActions.SEND_FOR_INSPECTION
    );
    workflowData.updateMap.set(
      BPMMergeUpdateParamEnum.REGISTRATION_NO,
      this.annuityBenefitDetails?.lastEstablishmentRegNo
    );
    workflowData.updateMap.set(
      BPMMergeUpdateParamEnum.REGISTRATION_NO_TXN,
      this.annuityBenefitDetails?.lastEstablishmentRegNo
    );
    this.saveWorkflow(workflowData);
    this.hideModal();
  }

  // /** Method to fetch bank details of a person*/
  // getBankDetails(personId?: string, isModifyBenefit?: boolean, isUI?: boolean) {
  //   const contrId = this.getPersonId();
  //   if (personId && personId !== contrId) {
  //     this.authPersonId = +personId;
  //   } else {
  //     this.authPersonId = null;
  //   }
  //   const id = personId ? personId : contrId;
  //   if (isUI) {
  //     this.benefitType = BenefitType.ui;
  //   }
  //   // const serviceType = this.benefitType ? getServiceType(this.benefitType) : null;
  //   // // CLM BANK API INTEGRATION CHANGED
  //   // this.bankService.getBankDetails(+id, this.referenceNo, serviceType, isModifyBenefit).subscribe(bankRes => {
  //   //   if (bankRes) this.setBankDetails(bankRes);
  //   // });
  //   if(this.annuityBenefitDetails?.bankAccount) this.setBankDetails(this.annuityBenefitDetails?.bankAccount);
  // }
  //
  setBankDetails(bankRes: PersonBankDetails = new PersonBankDetails()) {
    this.bankDetails = deepCopy(bankRes);
    if (bankRes) {
      this.samaReject = bankRes.disableApprove;
      // if (bankRes.bankWarningMessage) {
      //   this.alertService.showWarning(bankRes.bankWarningMessage);
      // }
      if (this.bankDetails.isNonSaudiIBAN === false) {
        if (this.bankDetails.approvalStatus === PersonConstants.SAUDI_IBAN_VERIFICATION_STATUS) {
          this.bankDetails.isIbanVerified = false;
        }
        if (this.bankDetails.ibanBankAccountNo !== null) {
          this.getBank(this.bankDetails.ibanBankAccountNo.slice(4, 6));
        }
      } else {
        if (this.bankDetails.approvalStatus === PersonConstants.NONSAUDI_IBAN_VERIFICATION_STATUS) {
          this.bankDetails.isIbanVerified = false;
        }
      }
    }
  }

  samaDisableVal(disableDto) {
    this.samaReject = disableDto?.disableApprove;
    if (disableDto?.warningDisplay) this.alertService.showWarning(disableDto?.warningDisplay);
  }

  navigateToInjury(injuryId: number) {
    this.ohService.setRegistrationNo(this.annuityBenefitDetails?.injuryEstablishmentRegNo);
    // this.ohService.setInjuryNumber(this.injuryNumber);
    this.ohService.setInjuryId(injuryId);
    this.ohService.setComplicationId(this.annuityBenefitDetails?.complicationId);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    if (this.annuityBenefitDetails?.complicationId) {
      this.router.navigate([
        `/home/oh/view/${this.annuityBenefitDetails?.injuryEstablishmentRegNo}/${this.socialInsuranceNo}/${injuryId}/${this.annuityBenefitDetails?.complicationId}/complication/info`
      ]);
    } else {
      this.router.navigate(
        [
          `home/oh/view/${this.annuityBenefitDetails?.injuryEstablishmentRegNo}/${this.socialInsuranceNo}/${injuryId}/injury/info`
        ],
        { state: { navigatedFrom: this.router.url } }
      );
    }
    this.alertService.clearAlerts();
  }

  navigateToBenefitsHistory() {
    this.manageBenefitService.socialInsuranceNo = this.socialInsuranceNo;
    this.contributorService.selectedSIN = this.socialInsuranceNo;
    if (isUiBenefit(this.benefitType)) {
      this.router.navigate([BenefitConstants.ROUTE_SANED_BENEFIT_HISTORY], {
        queryParams: {
          uihistory: true
        }
      });
      // } else if (isNonoccBenefit(this.benefitType)) {
      //   this.router.navigate([BenefitConstants.ROUTE_SANED_BENEFIT_HISTORY], {
      //     queryParams: {
      //       occupational: true
      //     }
      //   });
      // For non occ, View Benefit History hyperlink redirect should user to annuities history instead of saned benefit history
      // Defect 463879
    } else if (isOccBenefit(this.benefitType)) {
      this.router.navigate([BenefitConstants.ROUTE_SANED_BENEFIT_HISTORY], {
        queryParams: {
          occ: true
        }
      });
    } else {
      this.router.navigate([BenefitConstants.ROUTE_SANED_BENEFIT_HISTORY], {
        queryParams: {
          annuity: true
        }
      });
      this.manageBenefitService.setIsValidator(true);
    }
  }
  navigateToTranscationHistory(personId: number){
    this.router.navigate([`home/profile/individual/internal/${personId}/transaction-history`]);
  }
  viewContributorDetails() {
    if (!this.isIndividualApp) {
      this.routerData.stopNavigationToValidator = true;
      this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.socialInsuranceNo)], {
        state: { loadPageWithLabel: 'BENEFITS' }
      });
    } else {
      this.router.navigateByUrl(`home/benefits/individual`);
    }
  }

  navigateToAdjustmentDetailsHeir(event: HeirBenefitDetails) {
    this.adjustmentPaymentService.identifier = event?.personId ? event?.personId : this.annuityBenefitDetails.personId;
    this.adjustmentPaymentService.socialNumber = event?.sin ? event?.sin : this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], { queryParams: { from: '' } });
  }

  // navigateToPrevAdjustmentHeir(event: HeirBenefitDetails) {
  //   // this.adjustmentPaymentService.identifier = this.annuityBenefitDetails.personId;
  //   this.adjustmentPaymentService.identifier = event?.personId;
  //   this.adjustmentPaymentService.socialNumber = event?.sin;
  //   this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], { queryParams: { from: '' } });
  // }
  initialize(socialInsuranceNo, benefitRequestId) {
    //Defect 521542
    if (
      (isLumpsumBenefit(this.annuityBenefitDetails.benefitType.english) ||
        this.annuityBenefitDetails.benefitType.english === BenefitType.funeralGrant) &&
      this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1 &&
      this.annuityBenefitDetails?.lateRequestDetails &&
      !this.annuityBenefitDetails?.lateRequestDetails?.bypass &&
      this.annuityBenefitDetails.fcApproveDisable
    ) {
      this.disableApprove = true;
    }
    // defect 525339
    //Defect 610776 channel FO condition is removed
    if (
      this.routerData.assignedRole !== this.rolesEnum.DOCTOR &&
      this.routerData.assignedRole !== 'BenefitOperationSectionHead' &&
      this.routerData.assignedRole !== this.rolesEnum.SM &&
      this.annuityBenefitDetails?.lateRequestDetails &&
      (!this.annuityBenefitDetails?.lateRequestDetails?.bypass ||
        this.annuityBenefitDetails?.lateRequestDetails?.delayedMonths > 60)
    ) {
      this.canReturn = true;
    }
    // Story 345564 overlapping engmnt implementation 4.1.1
    if (this.annuityBenefitDetails?.hasOverlappingEngagements) {
      this.coreBenefitService.getOverlappedEngmt(socialInsuranceNo).subscribe(
        res => {
          // if(res[0]?.inspectionTypeInfo?.status === 'Initiated'){
          //   this.disableApprove = true;
          // }
        },
        err => {
          this.showError(err);
        }
      );
    }
    //TODO: called from validaror sc and also called from child screen directly hence multiple api calls
    this.setAnnuityBenefitRelatedValues(benefitRequestId, this.socialInsuranceNo, this.referenceNo);
  }
}
