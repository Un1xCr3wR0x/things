/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TemplateRef, Output, EventEmitter, Directive } from '@angular/core';
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
  WorkFlowActions,
  Role,
  SamaVerificationStatus,
  BPMMergeUpdateParamEnum
} from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { WorkFlowType, UIPayloadKeyEnum, BenefitValues, BenefitType, HeirStatus } from '../../enum';
import {
  AnnuityResponseDto,
  BenefitDetails,
  BenefitTypeLabels,
  DependentDetails,
  DependentHistory,
  DisabilityDetails,
  ImprisonmentDetails,
  PersonalInformation,
  ReturnLumpsumDetails,
  UnemploymentResponseDto,
  CreditBalanceDetails,
  PersonAdjustmentDetails,
  DeathNotification,
  EachBenefitHeading,
  HeirAdjustments
} from '../../models';
import { UITransactionType } from '../../enum/ui-tranasction-type';
import { AttorneyDetailsWrapper } from '../../models/attorney-details-wrapper';
import {
  setWorkFlowData,
  isDocumentsValid,
  isHeirBenefit,
  setWorkFlowDataForMerge,
  isJailedBenefit
} from '../../utils/benefitUtil';
import { getHeirPaymentRequestBody } from '../../utils/heirOrDependentUtils';
import { BenefitDetailsHelperComponent } from './benefit-details-helper.base';
@Directive()
export abstract class BenefitDetailBaseComponent extends BenefitDetailsHelperComponent {
  /**Local variables */
  injuryDate: GosiCalendar;
  retirementForm: FormGroup;
  retirementModal: FormGroup;
  rejectReasonList: Observable<LovList> = new Observable<LovList>(null);
  returnReasonList: Observable<LovList> = new Observable<LovList>(null);
  canReject = false;
  showComments = false;
  validatorCanEdit = false;
  docsCanEdit = false;
  uiItemList: DocumentItem[] = [];
  complicationDocumentList: DocumentItem[] = [];
  items: Lov[];
  taskId: string;
  requestType: string;
  // requestHeading: string;
  modifyNonOCC: boolean;
  modifyPension: boolean;
  modifyJailed: boolean;
  modifyHazardous: boolean;
  modifyEarly: boolean;
  modifyHeir: boolean;
  holdHeir: boolean;
  stopHeir: boolean;
  restartHeir: boolean;
  stopWaive: boolean;
  startWaive: boolean;
  user: string;
  documentListLov: LovList;
  requstedDocuments: BilingualText[];
  idCode: string;
  isdCode: string;
  isChangeRequired = false;
  transactionType: UITransactionType;
  transactionRefData: TransactionReferenceData[] = [];
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
  heading: string;
  subHeading: string; //For status change hold, stop, restart, ...etc
  creditBalanceDetails: CreditBalanceDetails;
  personAdjustments: PersonAdjustmentDetails;
  requestId: number;
  samaVerificationStatus = SamaVerificationStatus;

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
      // this.sin = this.socialInsuranceNo;
      this.benefitRequestId = this.requestId;
      this.repayId = +this.routerData.idParams.get(UIPayloadKeyEnum.REPAY_ID);
      this.workflowType = this.routerData.idParams.get(UIPayloadKeyEnum.RESOURCE);
      this.referenceNo = this.routerData.idParams.get(UIPayloadKeyEnum.REFERENCE_NO);
      this.channel = payload.channel;
      this.taskId = this.routerData.taskId;
      this.user = this.routerData.assigneeId;
      this.comments = this.routerData.comments;
      this.transactionRefData = this.routerData.comments;
      if (this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1 && this.channel === Channel.FIELD_OFFICE) {
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
    this.setButtonConditions(routerData.assignedRole);
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
    const workflowData = setWorkFlowData(childCompForm, this.routerData, this.referenceNo);
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
  //Method to fetch the annuity request details  /
  // getAnnuityBenefitDetails(socialInsuranceNo: number, benefitrequestId: number, referenceNo: number) {
  //   this.manageBenefitService
  //     .getAnnuityBenefitRequestDetail(socialInsuranceNo, benefitrequestId, referenceNo)
  //     .subscribe(
  //       res => {
  //         if (res) {
  //           let isModifyBenefit = false;
  //           this.annuityBenefitDetails = res;
  //           this.benefitType = this.annuityBenefitDetails.benefitType.english;
  //           this.isHeirBenefit = isHeirBenefit(this.benefitType);
  //           this.isJailedBenefit = isJailedBenefit(this.benefitType);
  //           //requestType setting from sc comp using routerData subResource
  //           this.setHeading(this.benefitType, this.requestType, this.annuityBenefitDetails.actionType);
  //           if (this.requestType && this.getIsRequestType()) {
  //             isModifyBenefit = true;
  //           }
  //           if (!this.isDoctor) {
  //             if (this.isHeirBenefit) {
  //               this.getHeirDetails(this.socialInsuranceNo, this.requestId, this.referenceNo);
  //             } else if (this.benefitType !== BenefitType.funeralGrant) {
  //               this.getDependentDetails(this.socialInsuranceNo, this.requestId, this.referenceNo);
  //             }
  //             this.getAnnuityEligibilityDetails(this.socialInsuranceNo, this.benefitType);
  //             this.getAnnuityCalculation(this.socialInsuranceNo, benefitrequestId, this.referenceNo);
  //           }
  //
  //           this.getAnnuityEligibilityDetails(this.socialInsuranceNo, this.benefitType);
  //           if (!this.isPension) {
  //             this.contributorDomainService.getContributorByPersonId(this.annuityBenefitDetails.personId).subscribe(
  //               data => {
  //                 if (data.hasVICEngagement) {
  //                   this.manageBenefitService.getContirbutorRefundDetails(this.socialInsuranceNo, true).subscribe(
  //                     response => {
  //                       this.creditBalanceDetails = response;
  //                     },
  //                     err => this.showError(err)
  //                   );
  //                 }
  //               },
  //               err => {
  //                 this.showError(err);
  //               }
  //             );
  //           }
  //           this.dependentService.setDependents([]);
  //           if (this.annuityBenefitDetails.heirBenefitReason) {
  //             this.dependentService.setReasonForBenefit(null, null, null);
  //             if (this.annuityBenefitDetails.deathDate) {
  //               this.dependentService.setReasonForBenefit(
  //                 this.annuityBenefitDetails.deathDate,
  //                 null,
  //                 this.annuityBenefitDetails.heirBenefitReason
  //               );
  //             } else {
  //               this.dependentService.setReasonForBenefit(
  //                 null,
  //                 this.annuityBenefitDetails.missingDate,
  //                 this.annuityBenefitDetails.heirBenefitReason
  //               );
  //             }
  //           }
  //           this.personNameEnglish = this.annuityBenefitDetails.contributorName.english;
  //           this.personNameArabic = this.annuityBenefitDetails.contributorName.arabic;
  //           this.requestDate = this.annuityBenefitDetails.requestDate;
  //           this.notificationDate = this.annuityBenefitDetails.notificationDate;
  //           this.benefitPropertyService.setPaymentMethod(this.annuityBenefitDetails?.paymentMethod?.english);
  //           this.nin = this.annuityBenefitDetails.nin;
  //           this.benefitPropertyService.setNin(this.nin);
  //           this.benefitPropertyService.setPayeeType(this.annuityBenefitDetails?.payeeType?.english);
  //           this.benefitPropertyService.setPersonId(this.annuityBenefitDetails.personId);
  //           this.benefitPropertyService.setPaymentMethod(this.annuityBenefitDetails?.paymentMethod?.english);
  //
  //           if (this.annuityBenefitDetails?.payeeType?.english === BenefitValues.authorizedPerson) {
  //             this.getAuthorizedPersonDetails(isModifyBenefit);
  //             // this.getAttorneyDetailsById();
  //           } else {
  //             if (!this.isDoctor) {
  //               if (this.nin) {
  //                 this.getPersonContactDetails(BenefitValues.contributor);
  //               } else {
  //                 this.getContDetailWithPerid(this.annuityBenefitDetails.personId, BenefitValues.contributor);
  //               }
  //             }
  //             if (this.annuityBenefitDetails.personId) {
  //               this.benefitPropertyService.setPersonId(this.annuityBenefitDetails.personId);
  //               if (!this.isDoctor)
  //                 this.getBankDetails(this.annuityBenefitDetails?.personId?.toString());
  //             }
  //           }
  //         }
  //         if (this.annuityBenefitDetails?.deathNotification)
  //           this.setErrorMsgAndBtnStatus(this.annuityBenefitDetails?.deathNotification);
  //       },
  //       err => {
  //         this.showError(err);
  //       }
  //     );
  // }
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
          this.getDocuments(this.transactionKey, this.transactionType, this.requestId, this.referenceNo);
        }
        this.dependentService.setDependents(this.dependentDetails);
      });
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
      this.alertService.showError(deathNotification?.deathNotificationMessage);
    }
    if (this.routerData.assignedRole === this.rolesEnum.FC_APPROVER) {
      this.disableApprove = deathNotification?.disableFcApprove;
    }
    if (
      this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1 ||
      this.routerData.assignedRole === this.rolesEnum.VALIDATOR_2
    ) {
      this.disableApprove = deathNotification?.disableValidatorApprove;
      this.validatorCanEdit = deathNotification?.disableValidatorModify;
    }
  }
  getDocuments(transactionKey: string, transactionType: string, benefitRequestId: number, referenceNo: number) {
    this.benefitDocumentService
      .getValidatorDocuments(this.socialInsuranceNo, benefitRequestId, referenceNo, transactionKey, transactionType)
      .subscribe(res => {
        this.reqList = res;
        if (isDocumentsValid(this.reqList)) {
          this.documentList = this.reqList;
        }
      });
  }
  // Method to show approve modal  /
  approveTransaction(templateRef: TemplateRef<HTMLElement>) {
    if (!this.disableApprove) {
      this.showModal(templateRef);
    }
  }
  // Show modal for rejection
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  // This method is to show the modal reference
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
  // Show modal for return
  returnTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  // Show modal for return
  requestInspection(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  // This method is used to show the cancellation template on click of cancel
  showCancelTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.commonModalRef = this.modalService.show(template, config);
  }
  getAuthorizedPersonDetails(isModifyBenefit: boolean) {
    if (this.requestId && this.socialInsuranceNo) {
      this.manageBenefitService.getSelectedAuthPerson(this.socialInsuranceNo, this.requestId).subscribe(res => {
        this.preSelectedAuthperson = res;
        if (this.preSelectedAuthperson[0]) {
          if (this.preSelectedAuthperson[0].personId) {
            this.authPersonId = this.preSelectedAuthperson[0].personId;
            this.getBankDetails(this.authPersonId?.toString());
            this.getContDetailWithPerid(this.authPersonId, BenefitValues.authorizedPerson);
            this.benefitPropertyService.setPersonId(this.authPersonId);
          }
        }
      });
    }
  }
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
    this.manageBenefitService.getPersonDetailsWithPersonId(id.toString()).subscribe(personalDetails => {
      this.personDetails = personalDetails;
      this.personDetails.personType = type;
      this.benefitPropertyService.setPayeeNationality(this.personDetails.nationality.english);
      if (!this.isHeirBenefit) this.getPersonAdjustmentDetails(this.personDetails.personId);
    });
  }

  getPersonAdjustmentDetails(personId: number) {
    this.adjustmentService.adjustmentDetails(personId).subscribe(adjustmentDetails => {
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

  setHeading(benefitType: string, requestType: string, actionType: string) {
    //TODO: get resource type (hold, stop, etc)
    this.heading = new BenefitTypeLabels(this.benefitType).getHeading();
    if (requestType === BenefitType.addModifyBenefit) {
      if (benefitType === BenefitType.nonOccPensionBenefitType) {
        this.heading = 'BENEFITS.ADD-MODIFY-NON-OCC-PENSION';
        this.modifyNonOCC = true;
      } else if (benefitType === BenefitType.retirementPension) {
        this.heading = 'BENEFITS.ADD-MODIFY-RETIREMENT-PENSION';
        this.modifyPension = true;
      } else if (benefitType === BenefitType.jailedContributorPension) {
        this.heading = 'BENEFITS.ADD-MODIFY-JAILED-PENSION';
        this.modifyJailed = true;
      } else if (benefitType === BenefitType.hazardousPension) {
        this.heading = 'BENEFITS.ADD-MODIFY-HAZARDOUS-PENSION';
        this.modifyHazardous = true;
      } else if (benefitType === BenefitType.earlyretirement) {
        this.heading = 'BENEFITS.ADD-MODIFY-EARLT-RETIREMENT-PENSION';
        this.modifyEarly = true;
      }
    } else if (requestType === BenefitType.addModifyHeir) {
      if (benefitType === BenefitType.heirMissingPension) {
        this.heading = 'BENEFITS.ADD-MODIFY-HEIR-MISSING-PENSION-PENSION';
        this.modifyHeir = true;
      } else if (benefitType === BenefitType.heirDeathPension2) {
        this.heading = 'BENEFITS.ADD-MODIFY-HEIR-DEATH-PENSION-PENSION';
        this.modifyHeir = true;
      }
    } else if (requestType === BenefitType.stopBenefitWaive) {
      this.heading = 'BENEFITS.STOP-WAIVE';
      this.subHeading = new EachBenefitHeading(this.benefitType).getHeading();
      this.stopWaive = true;
    } else if (requestType === BenefitType.startBenefitWaive) {
      this.heading = 'BENEFITS.START-WAIVE';
      this.subHeading = new EachBenefitHeading(this.benefitType).getHeading();
      this.startWaive = true;
    } else if (actionType && actionType !== HeirStatus.NO_ACTION) {
      // Possible values in enum HeirStatus
      this.subHeading = actionType;
    }
  }

  /** This method is to send the request to inspection.*/
  confirmInspection() {
    this.retirementForm.updateValueAndValidity();
    const workflowData = setWorkFlowDataForMerge(
      this.routerData,
      this.retirementForm,
      WorkFlowActions.SEND_FOR_INSPECTION
    );
    workflowData.updateMap.set(BPMMergeUpdateParamEnum.REGISTRATION_NO, this.annuityResponse?.lastEstablishmentRegNo);
    workflowData.updateMap.set(
      BPMMergeUpdateParamEnum.REGISTRATION_NO_TXN,
      this.annuityResponse?.lastEstablishmentRegNo
    );

    this.saveWorkflow(workflowData);
    this.hideModal();
  }
}
