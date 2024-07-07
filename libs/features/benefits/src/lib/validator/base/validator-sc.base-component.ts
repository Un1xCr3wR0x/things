/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Output, EventEmitter, Directive } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import {
  BilingualText,
  BPMUpdateRequest,
  Channel,
  DocumentItem,
  GosiCalendar,
  Lov,
  LovList,
  RouterConstants,
  RouterData,
  TransactionReferenceData,
  TransactionStatus,
  WorkFlowActions,
  Role,
  SamaVerificationStatus,
  ValidatorStatus,
  BPMMergeUpdateParamEnum
} from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { WorkFlowType, UIPayloadKeyEnum, BenefitValues, BenefitType, HeirStatus } from '../../shared/enum';
import {
  AnnuityResponseDto,
  BenefitDetails,
  DependentDetails,
  DependentHistory,
  DisabilityDetails,
  ImprisonmentDetails,
  PersonalInformation,
  ReturnLumpsumDetails,
  TransactionReference,
  UnemploymentResponseDto,
  CreditBalanceDetails,
  PersonAdjustmentDetails,
  DeathNotification,
  PersonBankDetails,
  HeirAdjustments,
  AttorneyDetailsWrapper,
  HeirBenefitDetails
} from '../../shared/models';
import {
  setWorkFlowData,
  isDocumentsValid,
  isHeirBenefit,
  setWorkFlowDataForMerge,
  getServiceType,
  deepCopy,
  isJailedBenefit,
  isUiBenefit,
  isLumpsumBenefit,
  isOccBenefit,
  showErrorMessage
} from '../../shared/utils/benefitUtil';
import { BenefitConstants, PersonConstants, getHeirPaymentRequestBody, UITransactionType } from '../../shared';
import { ValidatorBaseHelperComponent } from './validator-base-helper';
import * as moment from 'moment';

@Directive()
export abstract class ValidatorBaseScComponent extends ValidatorBaseHelperComponent {
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
  isBackDated = false;
  // currentUrl: string = null;

  @Output() reset: EventEmitter<null> = new EventEmitter();
  heirAdjustments: HeirAdjustments = {} as HeirAdjustments;

  /** This method is to handle the data corresponding to the transation type */
  intialiseTheView(routerData: RouterData) {
    this.uiBenefitService.setRouterData(routerData);
    this.isDoctor = this.routerData.assignedRole === this.rolesEnum.DOCTOR;
    if (routerData.payload) {
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
      if (this.channel === Channel.FIELD_OFFICE && this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1) {
        this.validatorCanEdit = true; // Validator 1 can edit the transaction
      }
      this.uiBenefitService.setSocialInsuranceNo(this.socialInsuranceNo);
      this.uiBenefitService.setRegistrationNo(this.registrationNo);
      this.returnLumpsumService.setRepayId(this.repayId);
      this.benefitPropertyService.referenceNo = this.referenceNo;
      this.inspectionList = this.lookUpService.getInspectionType();
    }
    this.rejectReasonList = this.sanedBenefitService.getSanedRejectReasonList();
    this.returnReasonList = this.sanedBenefitService.getSanedReturnReasonList();
    this.setButtonConditions(routerData.assignedRole,routerData?.resourceType);
    this.manageBenefitService.setValues(this.registrationNo, this.socialInsuranceNo, this.requestId);
    this.trackTransaction(this.referenceNo);
    this.disabilityDetails = new DisabilityDetails();
  }

  getRejectionReason(childRequestForm: FormGroup) {
    this.rejectReasonList = this.sanedBenefitService.getRejectReasonValidator();
    if (this.workflowType === WorkFlowType.SANED || this.workflowType === WorkFlowType.PROACTIVE_SANED) {
      this.rejectReasonList = this.sanedBenefitService.getSanedRejectReasonValidator();
    }
    childRequestForm.get('rejectionIndicator').setValue(true);
  }

  //Method to approve the transaction.
  confirmApprove(childCompForm: FormGroup) {
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
      this.saveWorkflow(workflowData);
    }
    this.hideModal();
  }

  //Method to reject the transaction.
  confirmReject(childCompForm: FormGroup) {
     const workflowData = setWorkFlowDataForMerge(this.routerData, childCompForm, WorkFlowActions.REJECT);
     this.saveWorkflow(workflowData);
     this.hideModal();
  }

  //Method to reject the transaction.
  confirmReturn(childCompForm: FormGroup) {
    const workflowData = setWorkFlowDataForMerge(this.routerData, childCompForm, WorkFlowActions.RETURN);
    //const workflowData = setWorkFlowData(childCompForm, this.routerData, this.referenceNo);
    workflowData.outcome = WorkFlowActions.RETURN;
    this.saveWorkflow(workflowData);
    this.hideModal();
  }

  //This method is used to confirm cancellation of transaction
  confirmCancel() {
    this.commonModalRef.hide();
    this.reset.emit();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  // Method to get the token from local storage
  getPersonId(): string {
    return this.benefitRequest ? this.benefitRequest.personId?.toString() : null;
  }

  //Method to sae workflow details.
  saveWorkflow(data: BPMUpdateRequest) {
    this.manageBenefitService.updateAnnuityWorkflow(data).subscribe(
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
                this.router.navigate([RouterConstants.ROUTE_INBOX]);
              },
              err => {
                this.showError(err);
              }
            );
        } else {
          this.router.navigate([RouterConstants.ROUTE_INBOX]);
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

  getLumpSumSystemRunDate() {
    this.manageBenefitService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
      if (this.systemRunDate?.gregorian) {
        this.getPersonDetails(this.annuityBenefitDetails.agentId, this.annuityBenefitDetails.personId);
      }
    });
  }

  //Method to fetch the annuity request details  /
  getAnnuityBenefitDetails(socialInsuranceNo: number, benefitrequestId: number, referenceNo: number) {
    this.manageBenefitService
      .getAnnuityBenefitRequestDetail(socialInsuranceNo, benefitrequestId, referenceNo)
      .subscribe(
        res => {
          if (res) {
            let isModifyBenefit = false;
            this.annuityBenefitDetails = res;
            this.benefitType = this.annuityBenefitDetails.benefitType.english;
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
            this.isHeirBenefit = isHeirBenefit(this.benefitType);
            this.isJailedBenefit = isJailedBenefit(this.benefitType);
            this.isOccBenefit = isOccBenefit(this.benefitType);
            this.dependentService.setDependents([]);
            //requestType setting from sc comp using routerData subResource
            this.setHeading(this.benefitType, this.requestType, this.annuityBenefitDetails.actionType);
            if (this.requestType && this.getIsRequestType()) {
              isModifyBenefit = true;
            }
            this.benefitRequestsService
              .getEligibleBenefitByBenefitType(
                socialInsuranceNo,
                this.benefitType,
                this.requestDate,
                this.annuityBenefitDetails.deathDate,
                this.annuityBenefitDetails.missingDate,
                benefitrequestId
              )
              .subscribe(
                res => {
                  //US: 524388
                  // this.eligibilityApiResponse = res;
                  // this.lateRequest = res.lateRequest;
                  // this.reasonForbenefits = new ReasonBenefit(
                  //   res.deathDate,
                  //   res.missingDate,
                  //   res.heirBenefitRequestReason
                  // );
                },
                err => {
                  showErrorMessage(err, this.alertService);
                }
              );

            if (this.annuityBenefitDetails?.deathNotification)
              this.setErrorMsgAndBtnStatus(this.annuityBenefitDetails?.deathNotification);
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
            this.getLumpSumSystemRunDate();
            // disable validator 1 edit if disableValidatorEdit is true (for mb assessment cases)
            if (this.annuityBenefitDetails?.disableValidatorEdit && this.requestType === BenefitType.addModifyBenefit) {
              this.validatorCanEdit = false;
            }
            if (
              isLumpsumBenefit(this.benefitType) &&
              this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1 &&
              this.annuityBenefitDetails?.lateRequestDetails &&
              !this.annuityBenefitDetails?.lateRequestDetails?.bypass
            ) {
              this.disableApprove = true;
            }

            // this.getContributorPersonDetails(this.annuityBenefitDetails?.agentId);

            if (!this.isDoctor) {
              if (this.isHeirBenefit) {
                //For modify use api with request id
                if (this.requestType === BenefitType.addModifyHeir) {
                  this.heirBenefitService
                    .getHeirBenefit(socialInsuranceNo, benefitrequestId.toString(), this.referenceNo, null, false)
                    .subscribe(
                      res => {
                        this.dependentDetails = res;
                        this.showDeathNotification();
                        this.dependentService.setDependents(this.dependentDetails);
                      },
                      err => {
                        showErrorMessage(err, this.alertService);
                      }
                    );
                } else {
                  this.getHeirDetails(this.socialInsuranceNo, this.requestId, this.referenceNo);
                }
              } else if (this.benefitType !== BenefitType.funeralGrant) {
                this.getDependentDetails(this.socialInsuranceNo, this.requestId, this.referenceNo);
              }
              this.getAnnuityCalculation(this.socialInsuranceNo, benefitrequestId, this.referenceNo);
            }
            if (this.annuityBenefitDetails?.status?.english !== ValidatorStatus.ACTIVE)
              this.getAnnuityEligibilityDetails(this.socialInsuranceNo, this.benefitType);
            if (!this.startWaive && !this.stopWaive && isLumpsumBenefit(this.benefitType)) {
              if (!this.isIndividualApp) {
                this.contributorDomainService.getContributorByPersonId(this.annuityBenefitDetails.personId).subscribe(
                  data => {
                    if (data.hasVICEngagement) {
                      this.manageBenefitService.getContirbutorRefundDetails(this.socialInsuranceNo, true).subscribe(
                        response => {
                          this.creditBalanceDetails = response;
                        },
                        err => this.showError(err)
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
                      this.manageBenefitService
                        .getContirbutorRefundDetails(this.authTokenService.getIndividual(), true)
                        .subscribe(
                          response => {
                            this.creditBalanceDetails = response;
                          },
                          err => this.showError(err)
                        );
                    }
                  },
                  err => {
                    this.showError(err);
                  }
                );
              }
            }
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

            if (this.annuityBenefitDetails?.payeeType?.english === BenefitValues.authorizedPerson) {
              // this.getAuthorizedPersonDetails(isModifyBenefit);
              this.authPersonId = this.annuityBenefitDetails.agentId;
              this.getBankDetails(this.authPersonId?.toString());
              this.getContDetailWithPerid(this.authPersonId, BenefitValues.authorizedPerson);
              this.benefitPropertyService.setPersonId(this.authPersonId);
            } else {
              if (!this.isDoctor) {
                this.getBankDetails(this.annuityBenefitDetails?.personId?.toString());
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
            // if (this.annuityBenefitDetails.personId) {
            //   this.benefitPropertyService.setPersonId(this.annuityBenefitDetails.personId);
            //   if (!this.isDoctor)
            //     this.getBankDetails(this.annuityBenefitDetails?.personId?.toString(), isModifyBenefit);
            // }
            // }
          }
        },
        err => {
          this.showError(err);
        }
      );
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

  // fetch heir details
  getHeirDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.heirBenefitService
      .getHeirForValidatorScreen(sin, benefitRequestId?.toString(), referenceNo, this.benefitType, null)
      .subscribe(res => {
        this.dependentDetails = res;
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
        this.showDeathNotification();
        this.dependentService.setDependents(this.dependentDetails);
      });
  }

  // fetch dependent details
  getDependentDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.dependentService
      .getDependentDetailsById(sin, benefitRequestId?.toString(), referenceNo, null)
      .subscribe(res => {
        this.dependentDetails = res;
        this.heirDetails = res;
        if (this.dependentDetails.length > 0) {
          this.getDocuments(
            this.transactionKey,
            this.transactionType,
            this.requestId,
            this.referenceNo,
            this.isBackDated
          );
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

  setErrorMsgAndBtnStatus(deathNotification: DeathNotification) {
    if (deathNotification?.deathNotificationMessage) {
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
      if (!this.isHeirBenefit) this.getPersonAdjustmentDetails(this.personDetails.personId, this.socialInsuranceNo);
    });
  }

  getContDetailWithPerid(id: number, type: string) {
    this.manageBenefitService.getPersonDetailsWithPersonId(id.toString()).subscribe(personalDetails => {
      this.personDetails = personalDetails;
      this.personDetails.personType = type;
      this.benefitPropertyService.setPayeeNationality(this.personDetails.nationality.english);
      if (!this.isHeirBenefit && type !== BenefitValues.authorizedPerson)
        this.getPersonAdjustmentDetails(this.personDetails.personId, this.socialInsuranceNo);
    });
  }

  getPersonAdjustmentDetails(personId: number, sin: number) {
    this.adjustmentService.adjustmentDetails(personId, sin).subscribe(adjustmentDetails => {
      if (this.isHeirBenefit) {
        this.heirAdjustments[personId] = adjustmentDetails;
      } else {
        this.personAdjustments = adjustmentDetails;
      }
    });
  }

  /** method to get reason for benefit*/
  getAnnuityEligibilityDetails(sin: number, benefitType: string) {
    this.heirBenefitService.getEligibleBenefitByType(sin, benefitType).subscribe(data => {
      if (data && data.length > 0) {
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
    this.retirementForm?.updateValueAndValidity();
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
  //   const serviceType = this.benefitType ? getServiceType(this.benefitType) : null;
  //   this.bankService.getBankDetails(+id, this.referenceNo, serviceType, isModifyBenefit).subscribe(bankRes => {
  //     if (bankRes) this.setBankDetails(bankRes);
  //   });
  // }
  //
  // setBankDetails(bankRes: PersonBankDetails = new PersonBankDetails()) {
  //   this.bankDetails = deepCopy(bankRes);
  //   if (this.bankDetails.isNonSaudiIBAN === false) {
  //     if (this.bankDetails.approvalStatus === PersonConstants.SAUDI_IBAN_VERIFICATION_STATUS) {
  //       this.bankDetails.isIbanVerified = false;
  //     }
  //     if (this.bankDetails.ibanBankAccountNo !== null) {
  //       this.getBank(this.bankDetails.ibanBankAccountNo.slice(4, 6));
  //     }
  //   } else {
  //     if (this.bankDetails.approvalStatus === PersonConstants.NONSAUDI_IBAN_VERIFICATION_STATUS) {
  //       this.bankDetails.isIbanVerified = false;
  //     }
  //   }
  // }

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
    }
  }

  viewContributorDetails() {
    this.routerData.stopNavigationToValidator = true;
    this.routerData.assignedRole = null;
    // this.router.navigate([`home/profile/contributor/${this.socialInsuranceNo}/info`]);
    if (!this.isIndividualApp) {
      this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.socialInsuranceNo)], {
        state: { loadPageWithLabel: 'BENEFITS' }
      });
    } else {
      this.router.navigateByUrl(`home/benefits/individual`);
    }
  }

  navigateToAdjustmentDetailsHeir(event: HeirBenefitDetails) {
    this.adjustmentPaymentService.identifier = event?.personId;
    this.adjustmentPaymentService.socialNumber = event?.sin;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], { queryParams: { from: '' } });
  }

  // navigateToPrevAdjustmentHeir(event: HeirBenefitDetails) {
  //   this.adjustmentPaymentService.identifier = event?.personId;
  //   this.adjustmentPaymentService.socialNumber = event?.sin;
  //   this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], { queryParams: { from: '' } });
  // }
}
