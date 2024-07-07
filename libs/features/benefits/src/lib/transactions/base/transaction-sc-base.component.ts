import { Directive, Inject } from '@angular/core';
import {
  AlertService,
  CoreAdjustmentService,
  DocumentItem,
  DocumentService,
  GosiCalendar,
  LookupService,
  Lov,
  RouterData,
  RouterDataToken,
  scrollToTop,
  Role,
  Channel,
  LovList,
  TransactionReferenceData,
  Transaction,
  TransactionStatus
} from '@gosi-ui/core';
import {
  AnnuityResponseDto,
  PersonalInformation,
  PersonBankDetails,
  AttorneyDetailsWrapper,
  BankService,
  BenefitDetails,
  BenefitType,
  BenefitValues,
  CreditBalanceDetails,
  DependentDetails,
  DependentService,
  getServiceType,
  HeirBenefitService,
  isHeirBenefit,
  isJailedBenefit,
  ManageBenefitService,
  PersonConstants,
  DependentHistory,
  SwitchTitle,
  RecalculationEquationDcComponent,
  SanedRecalculation,
  BenefitRecalculation,
  SanedBenefitService,
  BenefitConstants,
  UIPayloadKeyEnum,
  WorkFlowType,
  DisabilityDetails,
  UnemploymentResponseDto,
  UiBenefitsService,
  BenefitPropertyService,
  UITransactionType, HeirStatusType, isHeirLumpsum, DependentHeirConstants
} from '../../shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
@Directive()
export abstract class TransactionBaseScComponent {
  // Local Variables
  transaction: Transaction;
  documents: DocumentItem[];
  annuityBenefitDetails: AnnuityResponseDto;
  benefitType: string;
  isHeirBenefit = false;
  isJailedBenefit = false;
  requestType: string;
  referenceNumber: number;
  transactionId: number;
  transactionKey: string;
  transactionType: string;
  lang = 'en';
  socialInsuranceNo: number;
  benefitrequestId: number;
  notificationDate: GosiCalendar;
  requestDate: GosiCalendar;
  personNameEnglish: string = null;
  personNameArabic: String = null;
  nin: number;
  dependentHistory: DependentHistory;
  dependentDetails: DependentDetails[];
  heirDetails: DependentDetails[];
  creditBalanceDetails: CreditBalanceDetails;
  benefitCalculationDetails: BenefitDetails;
  preSelectedAuthperson: AttorneyDetailsWrapper[];
  authPersonId: number;
  personDetails: PersonalInformation;
  bankDetails: PersonBankDetails;
  role: string;
  bankNameList: Lov;
  calculationModalTitle: SwitchTitle;
  commonModalRef: BsModalRef;
  isSaned: boolean;
  benefitRecalculationDetails: BenefitRecalculation;
  sanedRecalculationDetails: SanedRecalculation;
  benefitDetails: AnnuityResponseDto;
  benefitSanedDetails: UnemploymentResponseDto;
  isDoctor: boolean;
  registrationNo;
  benefitRequestId;
  requestId: number;
  workflowType: WorkFlowType;
  complicationId: number;
  engagementId: number;
  injuryNumber: number;
  repayId: number;
  // Domain variables
  canReturn = false;
  canRequestClarification = false;
  returnToEstAdmin = false;
  canReject = false;
  canEdit = false;
  rolesEnum = Role;
  uiConst = BenefitConstants;
  referenceNo: number;
  channel;
  taskId: string;
  user: string;
  comments;
  transactionRefData: TransactionReferenceData[] = [];
  validatorCanEdit: boolean;
  inspectionList;
  rejectReasonList: Observable<LovList> = new Observable<LovList>(null);
  returnReasonList: Observable<LovList> = new Observable<LovList>(null);
  disabilityDetails;
  isAppPrivate = false;

  constructor(
    readonly documentService: DocumentService,
    readonly manageBenefitService: ManageBenefitService,
    readonly dependentService: DependentService,
    readonly alertService: AlertService,
    readonly bankService: BankService,
    readonly lookUpService: LookupService,
    readonly heirBenefitService: HeirBenefitService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly uiBenefitService: UiBenefitsService,
    readonly modalService: BsModalService,
    readonly router: Router,
    readonly fb: FormBuilder,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly benefitPropertyService: BenefitPropertyService,
    readonly ohService: OhService
  ) {}

  setParams(sin, requestId, referenceNumber) {
    this.socialInsuranceNo = sin;
    this.benefitrequestId = requestId;
    this.referenceNumber = referenceNumber;
  }

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
      //this.uiBenefitService.setIdForValidatorAction(payload.id);
      this.uiBenefitService.setReferenceNum(this.referenceNo);
      this.uiBenefitService.setRegistrationNo(this.registrationNo);
      // this.returnLumpsumService.setRepayId(this.repayId);
      this.benefitPropertyService.referenceNo = this.referenceNo;
      // if (
      //   this.workflowType === WorkFlowType.REQUEST_UNEMPLOYMENT ||
      //   this.routerData.resourceType === BenefitConstants.TRANSACTION_APPROVE_SANED ||
      //   this.routerData.resourceType === BenefitConstants.TRANSACTION_REJECT_SANED ||
      //   this.routerData.resourceType === BenefitConstants.TRANSACTION_REQUEST_INSPECTION
      // ) {
      //   this.transactionType = UITransactionType.APPROVE_SANED;
      // }
      this.inspectionList = this.lookUpService.getInspectionType();
    }
    this.rejectReasonList = this.sanedBenefitService.getSanedRejectReasonList();
    this.returnReasonList = this.sanedBenefitService.getSanedReturnReasonList();
    // this.setButtonConditions(routerData.assignedRole);
    this.manageBenefitService.setValues(this.registrationNo, this.socialInsuranceNo, this.requestId);
    // this.trackTransaction(this.referenceNo);
    this.disabilityDetails = new DisabilityDetails();
  }

  /**
   * Method to get document list
   * @param transactionKey
   * @param transactionType
   * @param businessId
   */
  getDocumentDetails(transactionKey: string, transactionType: string, businessId: number, referenceNumber: number) {
    this.documentService
      .getDocuments(transactionKey, transactionType, businessId, referenceNumber)
      .subscribe(res => (this.documents = res.filter(item => item.documentContent != null)));
  }

  goToTop() {
    scrollToTop();
  }
  //Method to fetch the annuity request details  /
  fetchAnnuityBenefitDetails(socialInsuranceNo: number, benefitrequestId: number, referenceNumber: number) {
    this.manageBenefitService
      .getAnnuityBenefitRequestDetail(socialInsuranceNo, benefitrequestId, referenceNumber)
      .subscribe(
        res => {
          if (res) {
            let isModifyBenefit = false;
            this.annuityBenefitDetails = res;
            this.benefitType = this.annuityBenefitDetails.benefitType.english;
            this.setBenefitTypeParams();
            this.isHeirBenefit = isHeirBenefit(this.benefitType);
            this.isJailedBenefit = isJailedBenefit(this.benefitType);
            //requestType setting from sc comp using routerData subResource

            if (
              this.requestType &&
              (this.requestType === BenefitType.addModifyBenefit ||
                this.requestType === BenefitType.addModifyHeir ||
                this.requestType === BenefitType.holdbenefit ||
                this.requestType === BenefitType.stopbenefit ||
                this.requestType === BenefitType.restartbenefit ||
                this.requestType === BenefitType.startBenefitWaive ||
                this.requestType === BenefitType.stopBenefitWaive)
            ) {
              isModifyBenefit = true;
            }
            if (this.isHeirBenefit) {
              this.fetchHeirDetails(socialInsuranceNo, benefitrequestId, referenceNumber);
            } else if (this.benefitType !== BenefitType.funeralGrant) {
              this.fetchDependentDetails(socialInsuranceNo, benefitrequestId, referenceNumber);
            }

            this.fetchAnnuityEligibilityDetails(socialInsuranceNo, this.benefitType);
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
            this.fetchAnnuityCalculation(this.socialInsuranceNo, benefitrequestId, this.referenceNumber);
            this.nin = this.annuityBenefitDetails.nin;
            this.benefitPropertyService.setNin(this.nin);
            this.benefitPropertyService.setPayeeType(this.annuityBenefitDetails?.payeeType?.english);
            this.benefitPropertyService.setPersonId(this.annuityBenefitDetails.personId);
            this.benefitPropertyService.setPaymentMethod(this.annuityBenefitDetails?.paymentMethod?.english);
            if (this.annuityBenefitDetails?.payeeType?.english === BenefitValues.authorizedPerson) {
              this.fetchAuthorizedPersonDetails(isModifyBenefit);
            } else {
              if (this.nin) {
                this.fetchPersonContactDetails(BenefitValues.contributor);
              } else {
                this.fetchContDetailWithPeriods(this.annuityBenefitDetails.personId, BenefitValues.contributor);
              }
              if (this.annuityBenefitDetails.personId) {
                this.benefitPropertyService.setPersonId(this.annuityBenefitDetails.personId);
                this.getBankDetails(this.annuityBenefitDetails?.personId?.toString(), isModifyBenefit, null);
              }
            }
          }
        },
        err => {
          this.showError(err);
        }
      );
  }
  setBenefitTypeParams() {
    this.transactionType = 'REQUEST_BENEFIT_FO';
    if (this.benefitType === BenefitType.womanLumpsum) {
      this.transactionKey = UITransactionType.REQUEST_WOMAN_LUMPSUM_BENEFIT;
    } else if (this.benefitType === BenefitType.jailedContributorLumpsum) {
      this.transactionKey = UITransactionType.REQUEST_JAILED_LUMPSUM_TRANSACTION;
    } else if (this.benefitType === BenefitType.nonOccLumpsumBenefitType) {
      this.transactionKey = UITransactionType.REQUEST_NON_OCC_LUMPSUM;
    } else if (this.benefitType === BenefitType.hazardousLumpsum) {
      this.transactionKey = UITransactionType.REQUEST_HAZARDOUS_LUMPSUM_TRANSACTION;
    } else if (this.benefitType === BenefitType.heirLumpsum) {
      this.transactionKey = UITransactionType.REQUEST_HEIR_LUMPSUM_TRANSACTION;
    } else if (this.benefitType === BenefitType.occLumpsum) {
      this.transactionKey = UITransactionType.REQUEST_OCC_LUMPSUM_TRANSACTION;
    } else if (this.benefitType === BenefitType.heirLumpsumDeadContributor) {
      this.transactionKey = UITransactionType.REQUEST_HEIR_LUMPSUM_TRANSACTION;
    } else {
      this.transactionKey = UITransactionType.REQUEST_PENSION_LUMPSUM_BENEFIT;
    }
  }
  /**
   * Method to get benefit details
   */
  getBenefits() {
    this.manageBenefitService.getBenefitDetails(this.socialInsuranceNo, this.benefitrequestId).subscribe(res => {
      this.benefitDetails = res;
    });
  }
  getRejectionReason(childRequestForm: FormGroup) {
    this.rejectReasonList = this.sanedBenefitService.getRejectReasonValidator();
    if (this.workflowType === WorkFlowType.SANED || this.workflowType === WorkFlowType.PROACTIVE_SANED) {
      this.rejectReasonList = this.sanedBenefitService.getSanedRejectReasonValidator();
    }
    childRequestForm.get('rejectionIndicator').setValue(true);
  }
  // fetch heir details
  fetchHeirDetails(sin: number, benefitRequestId: number, referenceNumber: number) {
    const status = isHeirLumpsum(this.benefitType)
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
    this.heirBenefitService.getHeirBenefit(sin, benefitRequestId?.toString(), null, status, true).subscribe(
      res => {
        this.dependentDetails = res;
        this.dependentDetails.forEach(eachDep => {
          eachDep.statusAfterValidation = eachDep?.eligibleHeir
            ? DependentHeirConstants.eligible()
            : DependentHeirConstants.notEligible();
        });
        this.dependentService.setDependents(this.dependentDetails);
      }
    )
    // this.heirBenefitService
    //   .getHeirForValidatorScreen(sin, benefitRequestId.toString(), referenceNumber, this.benefitType, null)
    //   .subscribe(res => {
    //     this.dependentDetails = res;
    //     this.dependentService.setDependents(this.dependentDetails);
    //   });
  }
  // fetch dependent details
  fetchDependentDetails(sin: number, benefitRequestId: number, referenceNumber: number) {
    this.dependentService
      .getDependentDetailsById(sin, benefitRequestId?.toString(), referenceNumber, null)
      .subscribe(res => {
        this.dependentDetails = res;
        this.heirDetails = res;
        this.dependentService.setDependents(this.dependentDetails);
      });
  }

  /** method to get reason for benefit*/
  fetchAnnuityEligibilityDetails(sin: number, benefitType: string) {
    this.heirBenefitService.getEligibleBenefitByType(sin, benefitType).subscribe(data => {
      if (data && data.length > 0) {
        if (data[0].refundVicContribution && data[0].startDate) {
          this.manageBenefitService
            .getContirbutorRefundDetails(this.socialInsuranceNo, true, data[0].startDate?.gregorian)
            .subscribe(
              response => {
                this.creditBalanceDetails = response;
              },
              err => this.showError(err)
            );
        }
        if (data[0]?.warningMessages && data[0]?.warningMessages.length > 0) {
          this.alertService.showWarning(data[0]?.warningMessages[0]);
        }
      }
    });
  }
  /** Method to fetch calculate details when benefit request id is available */
  fetchAnnuityCalculation(sin: number, benefitRequestId: number, referenceNumber: number) {
    const referenceNo =
      this.transaction?.status?.english.toUpperCase() === TransactionStatus.COMPLETED.toUpperCase()
        ? null
        : referenceNumber;
    if (sin && benefitRequestId) {
      // referenceNumber as per defect 469089
      this.manageBenefitService
        .getBenefitCalculationDetailsByRequestId(sin, benefitRequestId, referenceNumber)
        .subscribe(calculation => {
          this.benefitCalculationDetails = calculation;
        });
    }
  }
  fetchAuthorizedPersonDetails(isModifyBenefit: boolean) {
    if (this.benefitrequestId && this.socialInsuranceNo) {
      this.manageBenefitService.getSelectedAuthPerson(this.socialInsuranceNo, this.benefitrequestId).subscribe(res => {
        this.preSelectedAuthperson = res;
        if (this.preSelectedAuthperson[0]) {
          if (this.preSelectedAuthperson[0].personId) {
            this.authPersonId = this.preSelectedAuthperson[0].personId;
            this.getBankDetails(this.authPersonId?.toString(), isModifyBenefit);
            this.fetchContDetailWithPeriods(this.authPersonId, BenefitValues.authorizedPerson);
            this.benefitPropertyService.setPersonId(this.authPersonId);
          }
        }
      });
    }
  }
  fetchPersonContactDetails(type: string) {
    const queryParams = `NIN=${this.nin}`;
    this.manageBenefitService.getPersonDetailsApi(queryParams).subscribe(personalDetails => {
      this.personDetails = personalDetails.listOfPersons[0];
      this.personDetails.personType = type;
      this.benefitPropertyService.setPayeeNationality(this.personDetails.nationality.english);
    });
  }
  fetchContDetailWithPeriods(id: number, type: string) {
    this.manageBenefitService.getPersonDetailsWithPersonId(id.toString()).subscribe(personalDetails => {
      this.personDetails = personalDetails;
      this.personDetails.personType = type;
      this.benefitPropertyService.setPayeeNationality(this.personDetails.nationality.english);
    });
  }
  /** Method to fetch bank details of a person*/
  getBankDetails(personId?: string, isModifyBenefit?: boolean, isUI?: boolean) {
    this.bankDetails = new PersonBankDetails();
    const contrId = this.fetchPersonId();
    if (personId) {
      this.authPersonId = +personId;
    } else {
      this.authPersonId = null;
    }
    const id = personId ? personId : contrId;
    if (id) {
      if (isUI) {
        this.benefitType = BenefitType.ui;
      }
      const referenceNumber =
        this.transaction?.status?.english.toUpperCase() === TransactionStatus.COMPLETED.toUpperCase()
          ? null
          : this.referenceNumber;
      const serviceType = this.benefitType ? getServiceType(this.benefitType) : null;
      this.bankService.getBankDetails(+id, referenceNumber, serviceType, isModifyBenefit).subscribe(bankRes => {
        if (bankRes) {
          this.bankDetails = bankRes;
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
      });
    }
  }
  /** Method to open Recalculation wage modal */
  howToCalculate(calculationPeriod) {
    this.commonModalRef = this.modalService.show(
      RecalculationEquationDcComponent,
      Object.assign({}, { class: 'modal-xl' })
    );
    this.commonModalRef.content.sanedRecalculationDetails = calculationPeriod;
    this.commonModalRef.content.benefitCalculationDetails = this.benefitCalculationDetails;
    this.commonModalRef.content.lang = this.lang;
    this.commonModalRef.content.isSaned = this.isSaned;
    this.commonModalRef.content.calculationModalTitle = this.calculationModalTitle;
    if (this.commonModalRef)
      this.commonModalRef.content.closeButtonClicked.subscribe(() => {
        this.commonModalRef.hide();
      });
  }
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  /**  Method to get the person id */
  fetchPersonId() {
    if (this.routerData !== undefined) {
      this.role = this.routerData.assignedRole;
    }
  }
  /** This method is used to fetch Branch look up values for selected bank  */
  getBank(iBanCode) {
    this.lookUpService.getBank(iBanCode).subscribe(
      res => (this.bankNameList = res.items[0]),
      err => this.showError(err)
    );
  }
  getDependentHistory(personId: number) {
    this.dependentService.getDependentHistory(this.socialInsuranceNo, this.benefitrequestId, personId).subscribe(
      history => {
        this.dependentHistory = history;
      },
      err => {
        this.showError(err);
      }
    );
  }

  viewContributorInfo() {
    this.router.navigate([`home/profile/contributor/${this.benefitrequestId}/${this.socialInsuranceNo}/info`]);
  }

  /** Method to navigate to payment history */
  viewPaymentHistory(benefit, benefitType) {
    this.adjustmentService.identifier = this.benefitrequestId;
    this.adjustmentService.benefitType = benefitType;
    this.adjustmentService.benefitDetails = benefit;
    this.router.navigate([BenefitConstants.ROUTE_BENEFIT_MAINTAIN_ADJUSTMENT]);
  }

  viewChangeEngagement(traceId) {
    const newRouterData = {
      ...this.routerData,
      payload: JSON.stringify({
        ...JSON.parse(this.routerData.payload),
        engagementId: this.sanedRecalculationDetails?.engagementId || this.benefitRecalculationDetails?.engagementId,
        registrationNo:
          this.sanedRecalculationDetails?.registrationNo || this.benefitRecalculationDetails?.registrationNo,
        referenceNo:
          this.sanedRecalculationDetails?.modificationRefNo || this.benefitRecalculationDetails?.modificationRefNo
      })
    };
    // this.routerService.setRouterDataTokenOnly(newRouterData);
    // this.router.navigate([`/home/contributor/validator/change-engagement`]);
    this.sanedBenefitService.getTransaction(traceId).subscribe(res => {
      this.router.navigate([`/home/transactions/view/${res.transactionId}/${traceId}`]);
    });
  }

  /** Method  to  navigate  to  View Maintain Adjustment */
  viewMaintainAdjustment(benefitParam) {
    this.adjustmentService.identifier = this.benefitDetails?.personId || this.benefitSanedDetails?.personId;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], { queryParams: { from: benefitParam } });
  }

  /** Method to show calculation details */
  howToCalculateRejoining(period) {
    this.benefitCalculationDetails = period;
    this.calculationModalTitle = { title1: 'BENEFITS.AFTER-RECALCULATION', title2: 'BENEFITS.BEFORE-RECALCULATION' };
    this.howToCalculate(null);
  }

  navigateToInjury(injuryId: number) {
    this.ohService.setRegistrationNo(this.annuityBenefitDetails?.injuryEstablishmentRegNo);
    //this.ohService.setInjuryNumber(this.injuryNo);
    this.ohService.setInjuryId(injuryId);
    //this.ohService.setComplicationId(this.complication.complicationId);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.router.navigate([
      `home/oh/view/${this.annuityBenefitDetails?.injuryEstablishmentRegNo}/${this.socialInsuranceNo}/${injuryId}/injury/info`
    ]);
    this.alertService.clearAlerts();
  }

  /** Method to navigate to EngagementDetails */
  navigateToEngagementDetails() {}
  //getBenefitType() {
  //    if (this.isAddModifyBenefit) {
  //     this.requestType = BenefitType.addModifyBenefit;
  //   } else if (this.isAddModifyHeir) {
  //     this.requestType = BenefitType.addModifyHeir;
  //   } else if (this.isHoldBenefit) {
  //     this.requestType = BenefitType.holdbenefit;
  //   } else if (this.isStopBenefit) {
  //     this.requestType = BenefitType.stopbenefit;
  //   } else if (this.isRestartBenefit) {
  //     this.requestType = BenefitType.restartbenefit;
  //   } else if (this.isStartBenefitWaive) {
  //     this.requestType = BenefitType.startBenefitWaive;
  //   } else if (this.isStopBenefitWaive) {
  //     this.requestType = BenefitType.stopBenefitWaive;
  //   }
  // }
}
