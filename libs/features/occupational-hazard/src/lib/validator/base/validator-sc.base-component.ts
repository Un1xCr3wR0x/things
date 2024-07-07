/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 */
import { Location, PlatformLocation } from '@angular/common';
import { Directive, EventEmitter, Inject, Output, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  AnnuityResponseDtos,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BilingualText,
  BPMUpdateRequest,
  Channel,
  CommonIdentity,
  convertToStringDDMMYYYY,
  CoreContributorService,
  DisabilityDetailsDtos,
  DocumentNameList,
  DocumentRequiredList,
  DocumentService,
  EstablishmentStatusEnum,
  getIdentityByType,
  InjuryHistory,
  InjuryHistoryResponse,
  InspectionTypeEnum,
  LanguageToken,
  LovList,
  markFormGroupTouched,
  MedicalAssessmentService,
  NewReportDetails,
  removeDuplicateLovList,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  SpecialtyList,
  TPAReportDetails,
  TransactionReferenceData,
  VicContributorDetails,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, map, tap } from 'rxjs/operators';
import { Injury, InjuryStatus, OhConstants, OHTransactionType, WorkFlowStatus, WorkFlowType } from '../../shared';
import { OhBaseScComponent } from '../../shared/component/base/oh-base-sc.component';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  DiseaseService
} from '../../shared/services';
import {
  checkResourceType,
  createLovList,
  setChangeRequired,
  setDocAlert,
  setInjuryTime,
  setRequestNewTPAReportsWorkflow,
  setReturnToEstAdmin,
  setSuccessMessage,
  setTransactionKey,
  setTransactionType,
  setTransactionTypeForAddInjury,
  setTransactionTypeComp,
  setWorkFlowDataForConfirmation,
  setWorkFlowDataForContributorClarification,
  setWorkFlowDataForHealthInspection,
  setWorkFlowDataForInspection,
  setWorkFlowDataForTpa
} from '../../shared/utils';
import { Body, Content, Request } from '../../shared/models/complication-request';
import { BehaviorSubject, of } from 'rxjs';

import { ContributorBPMRequest } from '@gosi-ui/features/contributor';
import { throwError, noop } from 'rxjs';

@Directive()
export abstract class ValidatorBaseScComponent extends OhBaseScComponent {
  /*Local Varibles*/
  @Output() canceled: EventEmitter<null> = new EventEmitter();
  isBenefitNonOcc = false;
  reopenDetails: any;
  establishmentIds?: string;
  diseaseDescriptionValue: string;
  diseaseClosingStatus: BilingualText;
  isAdmin = false;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly ohService: OhService,
    readonly injuryService: InjuryService,
    readonly establishmentService: EstablishmentService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly contributorService: ContributorService,
    readonly workflowService: WorkflowService,
    readonly fb: FormBuilder,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly authTokenService: AuthTokenService,
    readonly coreMedicalAssessmentService: MedicalAssessmentService
  ) {
    super(
      language,
      alertService,
      contributorService,
      documentService,
      establishmentService,
      injuryService,
      ohService,
      router,
      fb,
      complicationService,
      diseaseService,
      location,
      appToken
    );
    pLocation.onPopState(() => {
      this.hideModal();
    });
  }
  benefitType: string;
  showNonOCCDisability = false; //  to show for NON occ details
  reportInjuryForm: FormGroup;
  reportInjuryModal: FormGroup;
  reportDiseaseModal: FormGroup;
  decompressedString: string;
  injury: Injury = new Injury();
  businessTransaction: OHTransactionType;
  content: Content = new Content();
  comment: TransactionReferenceData[];
  isContributor = false;
  roleId: string;
  selectedGovernmentSector: any;
  adminInjury: boolean = false;
  allowanceFlag: boolean = false;
  allowanceFlagVal: boolean = false;
  allowanceFlagReturn: boolean = false;
  allowanceFlagVal2: boolean = false;
  allowanceFlagVal3: boolean = false;
  allowanceFlagVal4: boolean = false;
  allowancePaymentForm: FormGroup;
  payeeT: number;
  activeBenefitDetails: AnnuityResponseDtos;
  isReturn = false;
  injuryReassessment = false;
  complicationReassessment = false;
  mbAssessmentRequestId: number;
  benefitRequestId: number;
  heirDisabilityAssessment = false;
  dependentDisabilityAssessment = false;
  dependentDisabilityReAssessment = false;
  nonOccDisabilityReassessment = false;
  nonOCCAssessmentAndReassessment = false;
  heirDisabilityReassessment: boolean;
  isWithDisability = false;
  injuryClosingStatus: BilingualText;
  InjuryHistoryResponse: InjuryHistoryResponse;
  injuryHistoryList: InjuryHistory[];
  contributorDetails: VicContributorDetails = new VicContributorDetails();
  disabilityDetailsDto: DisabilityDetailsDtos = new DisabilityDetailsDtos();
  parentForm: FormGroup = new FormGroup({});
  mainSpecialtyerror = OhConstants.SELECT_MAIN_SPECIALTY();
  specialityError = OhConstants.MIN_SPECIALITY_ERROR_MESSAGE();
  duplicateErrror = OhConstants.DUPLICATE_SPECILAITY();
  duplicateBodyPart = OhConstants.DUPLICATE_BODY_PART();
  nullCategory = OhConstants.NULL_CATEGORY();
  specialtyArray: SpecialtyList[];
  url: string;
  updateStatus: BilingualText;
  primaryIdentity: CommonIdentity = new CommonIdentity();
  identifier: number;
  personIdentifier: number;
  reassessmentComments: string;
  assessmentRequestId: number;
  isTpa = false;
  isEarlyReassessment = false;
  reportsFormControl = new FormGroup({});
  medicalReportsArray = [];
  // requestReportsForm: FormArray = new FormArray([]);
  contributorFormControl: FormGroup;
  rejectReasonLovList$: LovList;
  tpaReports: TPAReportDetails = new TPAReportDetails();
  reportDetails: NewReportDetails;
  isHeadingAdded;
  disabilityassessmentId: number;
  businessTransactionKey = 'NON_OCC_DISAB_ASSESSMENT';
  complicationIndicator: boolean = false;
  repatriation: boolean = false;
  injuryNo: number;
  intialiseTheView(routerData: RouterData) {
    // let request = content.request;
    if (routerData && routerData.taskId) {
      this.alertService.clearAlerts();
      this.reportInjuryForm = this.createInjuryDetailsForm();
      this.reportInjuryModal = this.createInjuryModalForm();
      this.reportDiseaseModal = this.createDiseaseModalForm();
      this.bindQueryParamsToForm(routerData);
      this.ohService.setRouterData(routerData);
      const resourceTypeInjury = this.routerData.resourceType;
      const channelInjury = this.routerData.channel;
      const payload = JSON.parse(this.routerData.payload);
      const assignedRole = payload.assignedRole;
      if (resourceTypeInjury === 'Injury' && channelInjury === 'taminaty' && assignedRole === 'Admin') {
        this.adminInjury = true;
      }
      if (!this.adminInjury && this.routerData.previousOwnerRole !== 'AdminInjury') {
        this.content = routerData.content as Content;
        this.content.Request = this.content.Request as Request;
        this.content.Request.Body = this.content.Request.Body as Body;
        this.roleId = this.content.Request.Body.roleId;
        if (this.roleId) this.isContributor = this.roleId?.toLocaleLowerCase() === 'contributor' ? true : false;
        if (this.roleId) this.isAdmin = this.roleId?.toLocaleLowerCase() === 'admin' ? true : false;
      } else {
        this.roleId = this.routerData.payload.roleId;
        this.isContributor = false;
      }

      if (routerData.payload) {
        const payload = JSON.parse(routerData.payload);
        const isValidator1 = payload?.isValidator1;
        const isValidator2 = payload?.isValidator2;
        this.validator1 = isValidator1 === 'TRUE' ? true : false;
        this.setValues(routerData);
        this.comment = this.routerData.comments;
        this.validator2 = isValidator2 === 'TRUE' ? true : false;
        if (isValidator1 === 'FALSE' && assignedRole === OhConstants.OCCUPATIONAL_HAZARD_OPERATIONS_OFFICER) {
          this.validator2 = true;
        }
        this.personIdentifier = payload.identifier;
        // if (payload.resourceType === WorkFlowActions.OCC_DISABILITY_REASSESSMENT) {
        //   this.injuryReassessment = true;
        // }
        if (
          this.routerData.resourceType === WorkFlowActions.CLOSE_INJURY_TPA ||
          this.routerData.resourceType === WorkFlowActions.CLOSE_COMPLICATION_TPA
        ) {
          this.isTpa = true;
        }
        if (payload?.benefitRequestId) this.benefitRequestId = payload.benefitRequestId; // to assign benefit request id form bpm api
        this.reportInjuryForm.get('rejectionIndicator').setValue(false);
        this.transactionKey = setTransactionKey(this.routerData);
        if (this.repatriation) {
          this.rejectReasonList = this.injuryService.getRepatriationRejectReasonList()
        } else {
          this.rejectReasonList = this.injuryService.getInjuryRejectReasonList(
            this.workflowType,
            this.routerData.resourceType
          );
        }
        this.reimbrejectReasonList = this.injuryService.getReimbRejectReasonList();
        const resourceType = checkResourceType(this.workflowType, this.routerData);
        if (resourceType) {
          this.inspectionList = this.injuryService.getInspectionList();
          if (!isNaN(Number(this.registrationNo))) {
            this.ohService.setRegistrationNo(this.registrationNo);
            this.getContributor();
          }
          // if (this.isWithDisability) {
          if (!isNaN(Number(this.registrationNo))) {
            this.ohService.setRegistrationNo(this.registrationNo);
            this.getEstablishment();
          }
          // }
          if (this.routerData.resourceType !== OhConstants.TRANSACTION_CLOSE_INJURY) this.getInjuryDetails();
          // this.getDisability(); //to get Disability details
          this.getInjurySummaryStatistics();
        }
        this.complicationScenarios(payload);
        this.diseaseScenarios(payload);
        this.setButtonConditions(payload.assignedRole);
      }
      this.setButtonConditions(routerData.assignedRole);
      this.ohService.setValues(this.registrationNo, this.socialInsuranceNo, this.injuryId);
      this.ohService.setDiseaseId(this.diseaseId);
      switch (routerData.resourceType) {
        case OhConstants.TRANSACTION_MODIFY_COMPLICATION:
          {
            this.injuryServiceCall();
          }
          break;
        case OhConstants.TRANSACTION_REOPEN_COMPLICATION:
          {
            this.injuryServiceCall();
          }
          break;
        case OhConstants.TRANSACTION_CLOSE_COMPLICATION:
          {
            // if (this.isWithDisability) {
            if (!isNaN(Number(this.registrationNo))) {
              this.ohService.setRegistrationNo(this.registrationNo);
              this.getEstablishment();
              // }
            }
            this.getComplicationDetails();
          }
          break;
      }
      this.getContributor();
    } else {
      this.alertService.clearAlerts();
      this.navigateToInbox();
    }
    this.reportsFormControl = this.createReportsFormGroup();
    this.contributorFormControl = this.createContributorFormGroup();
    // if (
    //   this.routerData.resourceType === WorkFlowActions.MB_BENEFIT_ASSESSMENT ||
    //   this.routerData.resourceType === WorkFlowActions.NON_OCC_DISABILITY_REASSESSMENT ||
    //   routerData.resourceType === RouterConstants.TRANSACTION_BENEFIT_DEPENDENT_DISABILITY_REASSESSMENT ||
    //   routerData.resourceType === RouterConstants.TRANSACTION_MB_HEIR_DISABILITY_REASSESSMENT
    // ) {
    //   this.isBenefitNonOcc = true;
    // }
  }
  initializeMbFormdetails() {
    this.reportsFormControl = this.createReportsFormGroup();
    this.contributorFormControl = this.createContributorFormGroup();
    this.reportInjuryForm = this.createInjuryDetailsForm();
    this.reportInjuryModal = this.createInjuryModalForm();
    this.bindQueryParamsToForm(this.routerData);
  }
  injuryServiceCall() {
    if (!isNaN(Number(this.registrationNo))) {
      this.ohService.setRegistrationNo(this.registrationNo);
      this.getEstablishment();
    }
    this.getComplicationDetails();
    this.getInjurySummaryStatistics();
  }
  complicationScenarios(payload) {
    if (
      this.workflowType === WorkFlowType.COMPLICATION ||
      this.routerData.resourceType === OhConstants.TRANSACTION_MODIFY_COMPLICATION ||
      this.routerData.resourceType === OhConstants.TRANSACTION_REOPEN_COMPLICATION ||
      this.routerData.resourceType === OhConstants.TRANSACTION_CLOSE_COMPLICATION ||
      this.complicationIndicator
    ) {
      this.inspectionList = this.injuryService.getInspectionList();
      this.injuryId = payload.injuryId;

      // for deadbody complication
      if (this.complicationIndicator) {
        // this.injuryId = 30717300;
        this.complicationId = payload.id;
        this.injuryId = payload?.injuryIdentifier;
        this.injuryNo = payload?.injuryNo;
      }

      this.isComplication = true;
      this.transactionType = OHTransactionType.Complication;
      this.getComplicationDetails();
      this.getContributor();
    } else if (
      this.workflowType === WorkFlowType.REJECT_COMPLICATION ||
      this.routerData.resourceType === OhConstants.TRANSACTION_REJECT_COMPLICATION_TPA
    ) {
      this.injuryId = payload.injuryNo;
      this.getContributor();
      this.getComplicationDetails();
      this.rejectReasonList = this.injuryService.getRejectReasonValidator();
      this.reportInjuryForm.get('rejectionIndicator').setValue(true);
      this.transactionType = OHTransactionType.Complication;
    }
  }
  diseaseScenarios(payload) {   
    if (
      this.workflowType === WorkFlowType.DISEASE ||
      this.routerData.resourceType === OhConstants.TRANSACTION_MODIFY_DISEASE ||
      this.routerData.resourceType === OhConstants.TRANSACTION_REOPEN_DISEASE ||
      this.routerData.resourceType === OhConstants.TRANSACTION_CLOSE_DISEASE ||
      this.routerData.resourceType === OhConstants.TRANSACTION_ADD_TRANSFER_INJURY ||
      this.routerData.resourceType === OhConstants.TRANSACTION_CLOSE_DISEASE
    ) {
      if (
        payload.resource === 'Disease' ||
        payload.resource === 'Reopen Disease' ||
        payload.resource === 'Close Disease TPA'
      ) {
        this.diseaseId = payload.diseaseId;
        this.getDiseaseDetails();
      } else {
        if (payload.resource === 'Transfer Injury') {
          this.getInjuryDetails();
        }
        this.getTransferDiseaseId();
      }
      this.transactionType = OHTransactionType.Disease;
      
    } else if (
      this.workflowType === WorkFlowType.REJECT_DISEASE ||
      this.routerData.resourceType === OhConstants.TRANSACTION_REJECT_DISEASE_TPA
    ) {
      this.diseaseId = payload.diseaseId ? payload.diseaseId : payload.id;      
      this.getDiseaseDetails();
      this.rejectReasonList = this.injuryService.getRejectReasonValidator();
      this.reportInjuryForm.get('rejectionIndicator').setValue(true);
      this.transactionType = OHTransactionType.Disease;
    }
    this.getDiseaseContributor();
  }

  setValues(routerData) {
    const payload = JSON.parse(routerData.payload);
    this.registrationNo = payload.registrationNo;
    this.getWorkFlowType(this.routerData, true);
    this.socialInsuranceNo = payload.socialInsuranceNo;
    if (
      payload.resource === 'Modify Complication' ||
      payload.resource === 'Complication' ||
      payload.resource === 'Disease' ||
      payload.resource === 'Close Complication TPA' ||
      payload.resource === 'Reopen Complication' ||
      payload.resource === 'OH Rejection Complication' ||
      payload.resource === 'OH Rejection Complication TPA'
    ) {
      this.complicationId = payload.id;
      this.injuryId = payload.injuryId;
      this.isComplicationResource = true;
      this.isBulkInjury = false;
      if (payload.diseaseId) {
        this.diseaseId = payload.diseaseId ? payload.diseaseId : payload.id;
        this.ohService.setDiseaseId(payload.diseaseId);
      }
    } else {
      if (payload.id && payload.id !== 'NULL') {
        this.injuryId = payload.id;
      }
      this.isComplication = false;
      if (payload.bulkInjuryRequestId && payload.bulkInjuryRequestId !== 'NULL') {
        this.isBulkInjury = true;
        this.bulkInjuryId = payload.bulkInjuryRequestId;
      }
    }
    if (payload.resource === 'Transfer Injury') {
      this.isTransferredInjury = true;
      this.injuryId = payload.transferInjuryId;
    }
    if (payload.resource === 'Complication') {
      this.isComplication = true;
    }
    if (payload.resource === 'Disease') {
      this.isDisease = true;
    }
    this.channel = payload.channel;
    this.workflowType = payload.resource;
    this.transactionNumber = payload.referenceNo;
    this.personIdentifier = payload.identifier;
    this.mbAssessmentRequestId = payload.assessmentRequestId;
    // if (this.mbAssessmentRequestId) {
    //   this.getcomplicationReassessmentDetails(this.mbAssessmentRequestId);
    // }
    this.ohService.setComplicationId(payload.id);

    this.ohService.setRegistrationNo(this.registrationNo);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.ohService.setIdForValidatorAction(payload.id);
    if (this.socialInsuranceNo && this.diseaseId) {
      this.getPreviousMedicalBoardAssessments();
    } 
    if (this.routerData.state === WorkFlowActions.RETURN) {
      this.isReturn = true;
      this.socialInsuranceNo = payload.socialInsuranceNo;
      this.registrationNo = payload.registrationNo;
      if(!this.isTransferredInjury)
      {
        this.injuryId = this.isComplication ? payload.injuryId : payload.id;
      }
      this.mbAssessmentRequestId = payload.assessmentRequestId;
      this.ohService.setRegistrationNo(this.registrationNo);
      this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
      if (!isNaN(Number(this.registrationNo)) && this.registrationNo !== 0) {
        this.ohService.setRegistrationNo(this.registrationNo);
        this.getEstablishment();
      }

      if (!isNaN(Number(this.injuryId)) && this.injuryId !== 0) {
        this.getInjuryDetails(); //to get injury details for returned  and reassessment transaction
      } // this.getEstablishment(); // to get establishment details for returned and reassessment  transaction
      if (
        !isNaN(Number(this.registrationNo)) &&
        this.registrationNo !== 0 &&
        !isNaN(Number(this.socialInsuranceNo)) &&
        this.socialInsuranceNo !== 0
      ) {
        this.ohService.setRegistrationNo(this.registrationNo);
        this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
        this.getContributor();
      }
    }
  }
  setInspectionMessage(selectedInspection) {
    this.prohibitInspection = false;
    this.inspectionMsg = null;
    this.warningMsg = null;
    if (selectedInspection === InspectionTypeEnum.EA) {
      if (this.warningMsgForEA) {
        this.warningMsg = 'OCCUPATIONAL-HAZARD.RASED-WARNING-EA';
        this.inspectionDate = convertToStringDDMMYYYY(this.inspectionRequestdateForEA);
      }
      if (this.establishment.status.english === EstablishmentStatusEnum.CLOSED) {
        this.prohibitInspection = true;
        this.inspectionMsg = 'OCCUPATIONAL-HAZARD.RASED-PROHIBIT-CLOSED';
      }
      if (this.establishment.status.english === EstablishmentStatusEnum.CLOSING_IN_PROGRESS) {
        this.prohibitInspection = true;
        this.inspectionMsg = 'OCCUPATIONAL-HAZARD.RASED-PROHIBIT-INPROGRESS';
      }
    }
    if (selectedInspection === InspectionTypeEnum.WI) {
      if (this.warningMsgForWI) {
        this.warningMsg = 'OCCUPATIONAL-HAZARD.RASED-WARNING-WI';
        this.inspectionDate = convertToStringDDMMYYYY(this.inspectionRequestdateForWI.toString());
      }
      if (this.establishment.status.english === EstablishmentStatusEnum.CLOSED) {
        this.prohibitInspection = true;
        this.inspectionMsg = 'OCCUPATIONAL-HAZARD.RASED-PROHIBIT-CLOSED';
      }
    }
  }
  bindQueryParamsToForm(routerData: RouterData) {
    if (this.routerData) {
      this.reportInjuryForm.get('taskId').setValue(routerData.taskId);
      this.reportInjuryForm.get('user').setValue(routerData.assigneeId);
    }
  }
   getPreviousMedicalBoardAssessments() {
    this.diseaseService.getPreviousAssessmentDetails(this.socialInsuranceNo, this.diseaseId).subscribe(
      res => {
        this.previousMedicalAssessments = res;
      },
      err => {
        this.previousMedicalAssessments = [];
        this.showError(err);
      }
    );
  } 
  getComplicationDetails() {
    const isChangeRequired = setChangeRequired(this.routerData);
    if (this.registrationNo && this.socialInsuranceNo && this.injuryId && this.complicationId) {
      this.complicationService
        .getComplication(
          this.registrationNo,
          this.socialInsuranceNo,
          this.complicationIndicator ? this.injuryNo : this.injuryId,
          this.complicationId,
          isChangeRequired
        )
        .subscribe(
          res => {
            this.complicationWrapper = res;
            this.isClosed = this.ohService.getIsClosed();
            if (this.isClosed) {
              this.complicationClosingStatus = this.ohService.getClosingstatus();
              this.updateResultStatus = this.complicationClosingStatus;
            } else {
              if (this.complicationWrapper.complicationDetailsDto) {
                this.complicationClosingStatus = this.complicationWrapper.complicationDetailsDto.status;
                this.previousStatus = this.complicationClosingStatus;
              }
            }
            if (this.complicationClosingStatus?.english === InjuryStatus.CURED_WITH_DISABILITY) {
              this.isWithDisability = true;
            } else this.isWithDisability = false;
            if (this.isComplication) {
              this.injuryComplicationID = this.complicationWrapper.complicationDetailsDto.complicationId;
              // this.getComplicationDisabledParts();
            }
            this.previousStatus = this.complicationWrapper.complicationDetailsDto.status;
            if (this.isClosed) {
              if (this.updateResultStatus.english !== this.previousStatus.english) {
                this.isStatusChanged = true;
              }
              this.statusAlertKey = this.closeComplicationAlert + '.COMPLICATION-INFO';
            }
            if (
              this.complicationWrapper.complicationDetailsDto.parentInjuryRejectionInProgress === false &&
              (this.routerData.resourceType === OhConstants.TRANSACTION_ADD_COMPLICATION ||
                this.routerData.resourceType === OhConstants.TRANSACTION_REOPEN_COMPLICATION)
            ) {
              this.isParentInjuryRejection = true;
            }
            if (
              this.routerData.resourceType === OhConstants.TRANSACTION_MODIFY_COMPLICATION ||
              this.routerData.resourceType === OhConstants.TRANSACTION_REOPEN_COMPLICATION
            ) {
              this.transientComplicationDetails = this.complicationWrapper.complicationDetailsDto;
              !this.complicationReassessment ? (this.complicationDetails = this.getComplicationDto()) : null;
              // !this.complicationReassessment ? this.getModifiedComplicationDetails() : null;
              this.getModifiedComplicationDetails();
              this.isdCode = this.getISDCodePrefix(this.modifiedcomplicationDetails.emergencyContactNo);
            } else {
              this.complicationDetails = this.complicationWrapper.complicationDetailsDto;
              this.idCode = this.getISDCodePrefix(this.complicationDetails.emergencyContactNo);
            }
            this.isdCode = this.getISDCodePrefix(res.complicationDetailsDto.emergencyContactNo);
            this.engagementId = this.complicationDetails.engagementId;
            this.tpaCode = this.complicationDetails.tpaCode;
            if (this.complicationDetails && this.complicationDetails.injuryDetails) {
              this.ohService.setInjuryId(this.complicationDetails.injuryDetails.injuryId);
              this.complicationDetails.injuryDetails.injuryTime = setInjuryTime(res.complicationDetailsDto);
            }
            this.getEngagement();
            this.transactionType = setTransactionTypeComp(this.routerData);
            if (this.routerData.resourceType === OhConstants.TRANSACTION_CLOSE_INJURY || this.isComplicationResource) {
              this.documentFetch(this.complicationId, this.transactionNumber);
            }
            const complicationStatus = this.complicationDetails.workFlowStatus;
            this.setShowComments(complicationStatus, this.rejectionAction, this.routerData.assignedRole);
            this.idCode = this.getISDCodePrefix(this.injury.emergencyContactNo);
            // to get occupation for close complication with cured with disability
            this.complicationId = this.complicationWrapper.complicationDetailsDto.complicationId;
            // if (this.registrationNo && this.socialInsuranceNo && this.complicationId) {
            //   /// this.injuryId = this.complicationId;
            //   this.getInjuryDetails();
            // }
          },
          err => {
            this.showError(err);
          }
        );
    }
  }

  /**This method to get transferdiseaseId */
  getTransferDiseaseId() {
    this.diseaseService.getTransferDiseaseId(this.socialInsuranceNo, this.injuryId).subscribe(
      response => {
        this.transferInjury = response;
        this.diseaseId = this.transferInjury.diseaseId;
        this.getDiseaseDetails();
      },
      err => {
        this.showError(err);
      }
    );
  }

   getDiseaseDetails() {
    const isChangeRequired = setChangeRequired(this.routerData);
    this.diseaseService
      .getDiseaseDetails(
        this.registrationNo,
        this.socialInsuranceNo,
        this.diseaseId,
        this.isAppPublic,
        isChangeRequired
      )
      ?.subscribe(
        res => {
          this.diseaseDetailsWrapper = res;
          if (this.routerData.resourceType === OhConstants.TRANSACTION_MODIFY_DISEASE) {
            this.transientDiseaseDetails = this.diseaseDetailsWrapper.diseaseDetailsDto;
            this.diseaseDetails = this.getDiseaseDetails();
          } else {
            this.diseaseDetails = this.diseaseDetailsWrapper.diseaseDetailsDto;
            this.occupationalDetails = this.diseaseDetailsWrapper.diseaseOccupationDurationDto;
            this.reopenDetails = this.diseaseDetailsWrapper.reOpenDiseaseDto;
            this.establishmentIds = this.diseaseDetailsWrapper?.diseaseDetailsDto?.establishmentId?.toString();
            this.idCode = this.getISDCodePrefix(this.diseaseDetails.emergencyContactNo);
          }
          this.isdCode = this.getISDCodePrefix(res.diseaseDetailsDto.emergencyContactNo);
          this.engagementId = this.diseaseDetails?.engagements;
          this.tpaCode = this.diseaseDetails?.tpaCode;
          if (this.diseaseDetails && this.diseaseDetails) {
            this.ohService.setDiseaseId(this.diseaseDetails.diseaseId);
          }
          this.diseaseClosingStatus=this.ohService.getClosingstatus();
          if(this.diseaseClosingStatus===undefined){
            this.diseaseClosingStatus = this.diseaseDetails?.diseaseStatus;
          }
          this.getRasedDocuments(this.diseaseDetailsWrapper.diseaseDetailsDto, this.routerData.resourceType); 
          this.getEngagement();
          this.transactionType = OHTransactionType.Disease;
          // this.transactionType = setTransactionTypeComp(this.routerData);
          this.documentFetch(this.diseaseId, this.transactionNumber);
          // const diseaseStatus = this.diseaseDetails?.workFlowStatus;
          // this.setShowComments(diseaseStatus, this.rejectionAction, this.routerData.assignedRole);
          this.idCode = this.getISDCodePrefix(this.disease?.emergencyContactNo);
          if (this.diseaseDetails?.diseaseDescriptionArray) {
            this.diseaseDetails.diseaseDescription = this.diseaseDetails?.diseaseDescriptionArray?.join(',');
          }
        },
        err => {
          this.showError(err);
        }
      );
  } 
  hideModal() {
    this.resetModal();
    this.reportInjuryModal?.reset();
    this.reportDiseaseModal?.reset();
  }
  returnAction(reportInjuryModal) {
    const action = WorkFlowActions.RETURN;
    this.reportInjuryForm.get('taskId').setValue(this.routerData.taskId);
    this.reportInjuryForm.get('user').setValue(this.routerData.assigneeId);
    this.reportInjuryForm.get('status').setValue('RETURN');
    if (reportInjuryModal && reportInjuryModal.valid) {
      this.updateConfirmation(action);
    } else {
      this.validateComments(reportInjuryModal);
    }
  }
  validateComments(reportInjuryModal) {
    this.commentsEstAdmin = reportInjuryModal.get('comments').value;
    if (this.commentsEstAdmin === null || this.commentsEstAdmin.length < 0) {
      this.commentAlert = true;
      markFormGroupTouched(reportInjuryModal);
    }
  }
  navigateToInbox(action?: string) {
    const SuccessMessage = setSuccessMessage(action, this.routerData, this.isContributor, this.isAdmin);
    if (SuccessMessage) {
      this.alertService.showSuccessByKey(SuccessMessage);
    }
    if (SuccessMessage && this.assessmentRequestId) {
      const successMessage = {
        english: 'Thank you for uploading the documents, GOSI will send the details of the medical committee date',
        arabic: 'نشكركم على رفع المستندات، وسيتم إرسال تفاصيل موعد اللجنة الطبية لكم.'
      };
      this.alertService.showSuccess(successMessage);
    }
    this.routerData.fromJsonToObject(new RouterData());
    if (this.allowanceFlag) {
      this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }
  /**
   * For BPM api Return Transaction
   */
  confirmReturn() {
    const action = WorkFlowActions.RETURN;
    const workflowData = this.setReturnWorkflowData(this.routerData, action);
    this.saveWorkflow(workflowData);
    this.hideModal();
  }
  /**
   * For BPM api reject Transaction
   */
  confirmReject() {
    const action = WorkFlowActions.REJECT;
    this.reportInjuryForm.get('status').setValue('REJECT');
    this.updateConfirmation(action);
  }
  /**
   * For BPM api approve Transaction
   */
  confirmApprove(assessmentReqId?) {
    if (assessmentReqId) {
      this.assessmentRequestId = assessmentReqId;
    }
    const action = WorkFlowActions.APPROVE;
    this.reportInjuryForm.get('status').setValue('APPROVE');
    this.updateConfirmation(action);
  }
  confirmHealthInspectionBPM() {
    const action = WorkFlowActions.RQSTINSPECTION;
    this.reportInjuryForm.get('status').setValue('RQSTINSPECTION');   
    this.updateDiseaseConfirmation(action, this.reportDiseaseModal);
  }
  confirmBPMApprove(visitingDoctorRequired: boolean, nonOCCAssessmentAndReassessment: boolean, payload?) {
    const action = WorkFlowActions.SUBMIT;
    this.reportInjuryForm.get('status').setValue('SUBMIT');
    this.updateConfirmation(action, visitingDoctorRequired, nonOCCAssessmentAndReassessment, payload);
  }
  confirmInspection(requestTpaData?, action?) {
    this.reportInjuryForm.updateValueAndValidity();
    let workflowData = setWorkFlowDataForInspection(this.routerData, this.reportInjuryForm);
    if (requestTpaData !== null) {
      workflowData = requestTpaData;
    }
    this.workflowService.mergeAndUpdateTask(workflowData).subscribe(
      () => {
        this.navigateToInbox(action);
        this.hideModal();
      },
      err => {
        this.showError(err);
        this.hideModal();
      }
    );
  }

  confirmRasedHealthInspection(requestTpaData?, action?) {
    this.reportInjuryForm.updateValueAndValidity();
    let workflowData = setWorkFlowDataForHealthInspection(this.routerData, this.reportInjuryForm);
    if (requestTpaData !== null && requestTpaData !== undefined) {
      workflowData = requestTpaData;
    }
    const additionalData = {
      establishmentId: this.establishmentIds
    };
    const parsedPayload = this.routerData.content;
    const newPayload = this.modifyPayload(parsedPayload, additionalData);
    const modifiedRequest = {
      ...workflowData,
      payload: {
        ...newPayload,
        Request: {
          ...newPayload.Request,
          Body: { ...newPayload.Request.Body, establishmentId: this.establishmentIds }
        }
      }
    };
    modifiedRequest.payload.TXNElement.Body.establishmentId = this.establishmentIds;
    this.workflowService.mergeAndUpdateTask(modifiedRequest).subscribe(
      () => {
        this.navigateToInbox(action);
        this.hideModal();
      },
      err => {
        this.showError(err);
        this.hideModal();
      }
    );
  }
  saveHealthInspection(establishmentDto) {
    this.alertService.clearAlerts();
    if (establishmentDto) {
      this.ohService.inspectionAction(establishmentDto, this.socialInsuranceNo, this.diseaseId).subscribe(
        () => {
          this.hideModal();
        },
        err => {
          this.showError(err);
        }
      );
    }
  }
  doctorSubmit(healthInspectionDetails) {
    this.alertService.clearAlerts();
    if (healthInspectionDetails) {
      this.ohService.doctorSubmit(healthInspectionDetails, this.socialInsuranceNo, this.diseaseId).subscribe(
        () => {
          this.confirmApprove();
          this.hideModal();
        },
        err => {
          this.showError(err);
        }
      );
    }
  }

  updateConfirmation(
    action,
    visitingDoctorRequired?,
    nonOCCAssessmentAndReassessment?,
    rejectEarlyReassessment?,
    reasonCode?,
    payload?
  ) {
    this.nonOCCAssessmentAndReassessment = nonOCCAssessmentAndReassessment;
    this.reportInjuryForm.updateValueAndValidity();
    this.getWorkFlowType(this.routerData, false);
    const closingStatus = this.ohService.getClosingstatus();
    const workflowData = setWorkFlowDataForConfirmation(
      this.routerData,
      this.reportInjuryForm,
      this.reportInjuryModal,
      action,
      closingStatus,
      this.workflowRequest,
      this.requstedDocuments,
      visitingDoctorRequired
    );
    if (this.repatriation) {
      workflowData.isExternalComment = true;
    }
    if (this.requstedDocuments) {
      const DocumentList = new DocumentRequiredList();
      DocumentList.requiredDocumentsList = this.requstedDocuments;
      this.ohService.validatorAction(DocumentList, this.allowanceFlagVal).subscribe(
        () => {},
        err => {
          this.showError(err);
        }
      );
    }
    if (this.allowanceFlag && action === WorkFlowActions.APPROVE) {
      if (this.allowancePaymentForm?.valid) {
        const injury = {
          allowancePayee: this.payeeT,
          delayByEmployer: this.allowancePaymentForm.get('delayByEmployer').value
        };
        this.hideModal();
        this.injuryService
          .submitInjury(this.injuryId, false, this.reportInjuryForm.get('comments').value, injury)
          .subscribe(response => {
            this.workflowService.updateTaskWorkflow(workflowData).subscribe(
              () => {
                this.navigateToInbox(action);
                this.hideModal();
              },
              err => {
                this.showError(err);
                this.hideModal();
              }
            );
          });
      } else {
        this.hideModal();
        this.allowancePaymentForm?.markAllAsTouched();
        this.alertService.showMandatoryErrorMessage();
      }
    } else if (nonOCCAssessmentAndReassessment) {
      const additionalData = {
        visitingDocRequired: workflowData.visitingDocRequired
      };
      const parsedPayload = this.routerData.content;
      const newPayload = this.modifyPayload(parsedPayload, additionalData);
      const modifiedRequest = {
        ...workflowData,
        payload: {
          ...newPayload,
          Request: {
            ...newPayload.Request,
            Body: { ...newPayload.Request.Body, visitingDocRequired: workflowData.visitingDocRequired }
          }
        },
        visitingDocRequired: workflowData.visitingDocRequired
      };
      modifiedRequest.payload.TXNElement.Body.visitingDocRequired = workflowData.visitingDocRequired;
      this.workflowService.mergeAndUpdateTask(modifiedRequest).subscribe(
        () => {
          const successMessage = this.getSuccessMessage(modifiedRequest.outcome);
          this.alertService.showSuccessByKey(successMessage, null, 20);
          this.navigateToInbox();
          this.hideModal();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else if (rejectEarlyReassessment) {
      const additionalData = { rejectReason: reasonCode };
      const parsedPayload = this.routerData.content;
      const newPayload = this.modifyPayload(parsedPayload, additionalData);
      const modifiedRequest = {
        ...workflowData,
        payload: {
          ...newPayload,
          Request: {
            ...newPayload.Request,
            Body: { ...newPayload.Request.Body, rejectReason: newPayload.rejectReason }
          }
        },
        rejectReason: newPayload.rejectReason
      };
      modifiedRequest.payload.TXNElement.Body.rejectReason = newPayload.rejectReason;
      this.workflowService.mergeAndUpdateTask(modifiedRequest).subscribe(
        () => {
          const successMessage = this.getSuccessMessage(modifiedRequest.outcome);
          this.alertService.showSuccessByKey(successMessage, null, 20);
          this.navigateToInbox();
          this.hideModal();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      this.workflowService.updateTaskWorkflow(workflowData).subscribe(
        () => {
          this.navigateToInbox(action);
          this.hideModal();
        },
        err => {
          this.showError(err);
          this.hideModal();
        }
      );
    }
  }

  updateDiseaseConfirmation(action, reportInjuryModal) {
    this.reportInjuryForm.updateValueAndValidity();
    this.getWorkFlowType(this.routerData, false);
    const closingStatus = this.ohService.getClosingstatus();
    const workflowData = setWorkFlowDataForConfirmation(
      this.routerData,
      this.reportInjuryForm,
      reportInjuryModal,
      action,
      closingStatus,
      this.workflowRequest,
      this.requstedDocuments
    );
    if (this.requstedDocuments) {
      const DocumentList = new DocumentRequiredList();
      DocumentList.requiredDocumentsList = this.requstedDocuments;
      this.ohService.validatorAction(DocumentList).subscribe(
        () => {},
        err => {
          this.showError(err);
        }
      );
    }
    this.workflowService.updateTaskWorkflow(workflowData).subscribe(
      () => {
        this.navigateToInbox(action);
        this.hideModal();
      },
      err => {
        this.showError(err);
        this.hideModal();
      }
    );
  }

  // for reassessment transaction  BPM api fix
  modifyPayload(originalPayload, additionalData) {
    return { ...originalPayload, ...additionalData };
  }
  receiveDocumentList(documentList) {
    this.requstedDocuments = documentList;
    if (this.complicationDocumentList.length > 0 && documentList.length > 0) {
      this.docAlert = setDocAlert(this.complicationDocumentList, documentList);
    } else if (this.documents.length > 0 && documentList.length > 0) {
      this.docAlert = setDocAlert(this.documents, documentList);
    } else if (documentList.length === 0) {
      this.docAlert = false;
    }
    if (this.documents.length > 0 && documentList.length > 0) {
      this.docAlert = setDocAlert(this.documents, documentList);
    }
    this.requstedDocuments = documentList.map(({ sequence, ...item }) => item);
    const tpaDocs = new DocumentNameList();
    this.requstedDocuments.forEach(item => (tpaDocs.docName = item.english));
    if (tpaDocs.docName) {
      this.tpaRequestedDocs.push(tpaDocs);
    }
  }
  selectContributorDocuments(documentList) {
    this.contributorRequestedDocs = [];
    // const contributorDocs = new DocumentNameList();
    // if (documentList?.value) this.contributorRequestedDocuments.push(documentList?.value);
    // contributorDocs.docName = documentList?.value?.english;
    // if (contributorDocs.docName) {
    //   this.contributorRequestedDocs.push(contributorDocs);
    // }
    this.contributorRequestedDocs = documentList.map(val => {
      return { english: val.english, arabic: val.arabic };
    });
  }
  getContributorDocumentList() {
    const transactionId = OHTransactionType.REQUEST_CLARIFICATION_FROM_CONTRIBUTOR;
    const type = 'MEDICAL_BOARD';
    this.documentService
      .getRequiredDocuments(transactionId, type)
      .pipe(map(docs => this.documentService.removeDuplicateDocs(docs)))
      .subscribe(documentResponse => {
        if (documentResponse && documentResponse?.length > 0) {
          this.contributorDocumentListLov = createLovList(documentResponse);
          // remove the duplicate Lov list of values in lov list
          this.contributorDocumentListLov = removeDuplicateLovList(this.contributorDocumentListLov);
          this.contributorDocumentListLov$ = of(this.contributorDocumentListLov);
        }
      });
  }
  requestedDocumentList(returnTpa?) {
    let type = this.transactionType;
    if (returnTpa) {
      type = OHTransactionType.REQUEST_CLARIFICATION;
    }
    if (this.repatriation) {
      this.documentService
        .getRequiredDocuments(OhConstants.REPATRIATION_TRANSACTION_KEY, OhConstants.REPATRIATION_TRANSACTION_KEY)
        .pipe(map(docs => this.documentService.removeDuplicateDocs(docs)))
        .subscribe(documentResponse => {
          this.injuryItemList = documentResponse;
          if (this.returnToEstAdmin) {
            this.injuryItemList = this.injuryItemList.filter(
              documentItem => documentItem.name.english !== 'Occupational Hazard Processes Form'
            );
          }
          if (this.injuryItemList.length > 0) {
            this.documentListLov = createLovList(this.injuryItemList);
          }
        });
    } else {
      this.documentService
        .getRequiredDocuments(this.transactionKey, type)
        .pipe(map(docs => this.documentService.removeDuplicateDocs(docs)))
        .subscribe(documentResponse => {
          this.injuryItemList = documentResponse;
          if (this.returnToEstAdmin) {
            this.injuryItemList = this.injuryItemList.filter(
              documentItem => documentItem.name.english !== 'Occupational Hazard Processes Form'
            );
          }
          if (this.isContributor) {
            this.injuryItemList = this.injuryItemList.filter(
              documentItem => documentItem.name.english.toLocaleLowerCase() !== 'iqama'
            );
          }
          if (this.injuryItemList.length > 0) {
            this.documentListLov = createLovList(this.injuryItemList);
          }
          // if (this.injuryItemList?.length > 0) {
          //   this.documentListLov = createLovList(this.injuryItemList);
          // }
        });
    }
  }
  getInjuryDetails(isEarlyReassessment?) {
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.socialInsuranceNo = this.authTokenService.getIndividual();
    }
    const isChangeRequired = setChangeRequired(this.routerData);
    if (
      !isNaN(Number(this.registrationNo)) &&
      this.registrationNo !== 0 &&
      !isNaN(this.socialInsuranceNo) &&
      this.socialInsuranceNo !== 0 &&
      !isNaN(this.injuryId) &&
      this.injuryId !== 0
    ) {
      this.injuryService
        .getInjuryDetails(
          this.registrationNo,
          this.socialInsuranceNo,
          this.injuryId,
          this.isIndividualApp,
          isChangeRequired
        )
        .subscribe(
          response => {
            this.injuryDetailsWrapper = response;
            // this.isEarlyReassessment = isEarlyReassessment;
            isEarlyReassessment
              ? null
              : this.getRasedDocuments(this.injuryDetailsWrapper.injuryDetailsDto, this.routerData.resourceType);
            this.isClosed = this.ohService.getIsClosed();
            if (this.isClosed) {
              this.injuryClosingStatus = this.ohService.getClosingstatus();
            } else {
              this.injuryClosingStatus = this.injuryDetailsWrapper.injuryDetailsDto.injuryStatus;
              this.previousStatus = this.injuryClosingStatus;
            }
            //To show disability details only if <cured with disabiity>
            if (
              this.injuryClosingStatus?.english === InjuryStatus.CURED_WITH_DISABILITY ||
              this.complicationClosingStatus?.english === InjuryStatus.CURED_WITH_DISABILITY
            ) {
              this.isWithDisability = true;
            } else this.isWithDisability = false;
            if (this.injuryDetailsWrapper.injuryDetailsDto?.initiatedBy === 2005) {
              const payload = JSON.parse(this.routerData?.payload);
              if (payload?.isValidator1 === 'TRUE') {
                this.allowanceFlagVal = true;
              } else if (payload?.isValidator2 === 'TRUE') {
                this.allowanceFlagVal2 = true;
              } else if (payload.assignedRole === Role.OH_INSURANCE_DIRECTOR) {
                this.allowanceFlagVal3 = true;
              } else if (payload.assignedRole === Role.OH_FCAPPROVER || payload.assignedRole === Role.OH_FCAPPROVER1) {
                this.allowanceFlagVal4 = true;
              }
            }
            this.getRasedDocuments(this.injuryDetailsWrapper.injuryDetailsDto, this.routerData.resourceType);
            if (isChangeRequired) {
              this.getInjury(false);
              this.getModifiedInjuryDetails();
              const injuryStatus = this.injuryDetailsWrapper.injuryDetailsDto.workFlowStatus;
              this.setShowComments(injuryStatus, this.rejectionAction, this.routerData.assignedRole);
              this.transientDetails = this.injuryDetailsWrapper.injuryDetailsDto;

              this.selectedGovernmentSector = this.injuryDetailsWrapper.injuryDetailsDto.governmentSector.english;
              console.log(this.selectedGovernmentSector);
              this.transactionType = setTransactionTypeForAddInjury(this.selectedGovernmentSector);

              if (this.modifiedInjuryDetails?.emergencyContactNo)
                this.isdCode = this.getISDCodePrefix(this.modifiedInjuryDetails?.emergencyContactNo);
            } else {
              this.injury = this.injuryDetailsWrapper.injuryDetailsDto;
              this.tpaCode = this.injury.tpaCode;
              this.setShowComments(this.injury.workFlowStatus, this.rejectionAction, this.routerData.assignedRole);
              this.engagementId = this.injury.engagementId;
              this.injuryDate = this.injury.injuryDate;
              if (
                this.routerData.resourceType === OhConstants.TRANSACTION_ADD_INJURY ||
                this.routerData.resourceType === OhConstants.TRANSACTION_ADD_DEADBODY_CLAIMS
              ) {
                this.getEngagement();

                this.selectedGovernmentSector = this.injuryDetailsWrapper?.injuryDetailsDto?.governmentSector?.english;
                console.log(this.selectedGovernmentSector);
                this.transactionType = setTransactionTypeForAddInjury(this.selectedGovernmentSector);
              }
              if (this.allowanceFlagReturn) {
                this.allowancePaymentForm.get('delayByEmployer').setValue(this.injury.delayByEmployer);
                this.allowancePaymentForm.get('delayByEmployer').disable();
                if (this.allowancePaymentForm && this.allowancePaymentForm !== undefined) {
                  if (this.injury.allowancePayee === 2) {
                    this.allowancePaymentForm.get('payeeType.english').setValue('Contributor');
                    this.allowancePaymentForm.get('payeeType.arabic').setValue(' مشترك');
                  } else if (this.injury.allowancePayee === 1) {
                    this.allowancePaymentForm.get('payeeType.english').setValue('Establishment');
                    this.allowancePaymentForm.get('payeeType.arabic').setValue('منشأة');
                  }
                  this.allowancePaymentForm.get('payeeType').disable();
                }

                this.allowancePaymentForm.updateValueAndValidity();
              }
            }
            this.idCode = this.getISDCodePrefix(this.injury.emergencyContactNo);
            this.injury.injuryTime =
              this.injury.injuryHour !== null ? this.injury.injuryHour + ':' + this.injury.injuryMinute : null;
          },
          err => {
            this.showError(err);
          }
        );
    }
    this.transactionType = setTransactionType(this.routerData);
    // this.returnTpa = true; //to do for request contributor lov
    if (this.isTpa) {
      this.requestedDocumentList(this.returnTpa);
    }
    //to do for request contributor lov
    this.initializeMap();
    const medicalBoardResource = [
      'Close Injury TPA',
      'Occupational Disability Assessment',
      'Occupational Disability Reassessment'
    ];
    if (medicalBoardResource.findIndex(data => data === this.routerData.resourceType) === -1) {
      this.documentFetch(this.injuryId, this.transactionNumber);
    }

    //DocumentFetch api has been called for every scenarios and it is inside injury api so removed
    // if ((this.injuryReassessment || this.complicationReassessment) && !this.isEarlyReassessment) {
    //   this.documentFetch(this.mbAssessmentRequestId, this.transactionNumber);
    // } else if (
    //   (!this.isReturn && !this.injuryReassessment && !this.complicationReassessment) ||
    //   !this.isEarlyReassessment
    // ) {
    //   this.documentFetch(this.injuryId, this.transactionNumber);
    // }
  }
  initializeMap() {
    this.latitude = Number(this.injuryDetailsWrapper.injuryDetailsDto.latitude);
    this.longitude = Number(this.injuryDetailsWrapper.injuryDetailsDto.longitude);
  }
  documentFetch(ohId, referenceNo, isMbbenefitDoc?) {
    if (this.isBulkInjury) {
      referenceNo = null;
      this.documentService
        .getOldDocuments(this.bulkInjuryId, OHTransactionType.DOCUMENT_TRANSACTION_KEY, null, referenceNo)
        .subscribe(documentResponse => {
          if (documentResponse) {
            this.complicationDocumentList = documentResponse.filter(item => item.documentContent !== null);
            this.documents = documentResponse.filter(item => item.documentContent !== null);
            this.documentService.getOldDocuments(ohId, null, null, referenceNo).subscribe(documentResponse => {
              if (documentResponse) {
                let docs = documentResponse.filter(item => item.documentContent !== null);
                if (docs && docs.length > 0) {
                  docs.forEach(element => {
                    this.documents.push(element);
                  });
                }
              }
            });
          }
        });
    } else if (
      !isNaN(Number(this.diseaseId)) &&
      this.diseaseId !== 0 &&
      !this.isComplication &&
      this.routerData.resourceType !== WorkFlowActions.CLOSE_INJURY_TPA &&
      this.routerData.resourceType !== WorkFlowActions.CLOSE_COMPLICATION_TPA &&
      this.routerData.resourceType !== OhConstants.TRANSACTION_MB_OCC_DISABILITY_ASSESSMENT &&
      this.routerData.resourceType !== OhConstants.TRANSACTION_MB_OCC_DISABILITY_REASSESSMENT &&
      this.routerData.resourceType !== OhConstants.TRANSACTION_NON_OCC_DISABILITY_REASSESSMENT
    ) {
      this.businessTransaction = this.reopenDisease ? OHTransactionType.REOPEN_DISEASE : OHTransactionType.Disease;
      if(this.closeDisease){
        this.businessTransaction = OHTransactionType.CLOSE_DISEASE;
      }
      this.documentService
        .getOldDocuments(ohId, this.businessTransaction, null, referenceNo)
        .subscribe(documentResponse => {
          if (documentResponse) {
            this.complicationDocumentList = documentResponse.filter(item => item.documentContent !== null);
            if (this.isTransferredInjury) {
              this.transferdocuments = documentResponse.filter(item => item.documentContent !== null);
              this.transferdocuments.forEach(element => {
                this.documents.push(element);
              });
            } else {
              this.documents = documentResponse.filter(item => item.documentContent !== null);
            }
          }
        });
    } else if (isMbbenefitDoc) {
      this.documentService.getAllDocuments(ohId, referenceNo).subscribe(documentResponse => {
        if (documentResponse) {
          this.complicationDocumentList = documentResponse.filter(item => item.documentContent !== null);
          const benefitMbDoc = documentResponse.filter(item => item.documentContent !== null);
          this.documents = [...this.documents, ...benefitMbDoc];
          // this.nonOccDocuments = this.documents = documentResponse.filter(item => item.documentContent !== null);
          // if (
          //   this.routerData.resourceType === WorkFlowActions.MB_BENEFIT_ASSESSMENT
          // ) {
          //   const payload = JSON.parse(this.routerData.payload);
          //   this.getNonOccDocs(payload?.referenceNo);
          // }
        }
      });
    } else {
      this.documentService.getAllDocuments(ohId, referenceNo).subscribe(documentResponse => {
        if (documentResponse) {
          this.complicationDocumentList = documentResponse.filter(item => item.documentContent !== null);
          this.documents = documentResponse.filter(item => item.documentContent !== null);
        }
      });
    }
  }
  setButtonConditions(assignedRole) {
    if (
      this.workflowType === WorkFlowType.REJECT_INJURY ||
      this.routerData.resourceType === OhConstants.TRANSACTION_REJECT_INJURY_TPA
    ) {
      this.rejectReasonList = this.injuryService.getRejectReasonValidator();
      this.reportInjuryForm.get('rejectionIndicator').setValue(true);
    } else if (
      this.routerData.resourceType === OhConstants.TRANSACTION_MODIFY_INJURY ||
      this.routerData.resourceType === OhConstants.TRANSACTION_MODIFY_COMPLICATION
    ) {
      this.rejectReasonList = this.injuryService.getRejectReasonValidator();
      this.reportInjuryForm.get('rejectionIndicator').setValue(false);
    }
    const validatorActions = this.routerData.customActions;
    validatorActions.forEach(action => {
      if (action === WorkFlowActions.APPROVE || WorkFlowActions.APPROVE_WITH || WorkFlowActions.APPROVE_WITHOUT) {
        this.canApprove = true;
      }
      if (action === WorkFlowActions.REJECT) {
        this.canReject = true;
      }
      if (action === WorkFlowActions.RETURN) {
        this.canReturn = true;
      }
      if (action === WorkFlowActions.SEND_FOR_CLARIFICATION) {
        this.canRequestClarification = true;
      }
    });
    if (this.routerData.channel === 'field-office' && this.routerData.resourceType === 'Add dead body repatriation') {
      this.canReject = true;
      this.canReturn = true;
    }
    if (assignedRole === Role.INSURANCE_DIRECTOR) {
      this.validator3 = true;
    } else if (assignedRole === Role.FC_CONTROLLER) {
      this.validator4 = true;
    } else if (
      this.validator1 &&
      (assignedRole === OhConstants.OCCUPATIONAL_HAZARD_OPERATIONS_OFFICER ||
        assignedRole === Role.VALIDATOR_1 ||
        assignedRole === Role.OH_OFFICER)
    ) {
      this.validator1 = true;
      this.canReturn = false;
      this.channel === Channel.FIELD_OFFICE ? this.setReturnToEst(assignedRole) : (this.returnToEstAdmin = true);
    } else if (
      this.validator2 &&
      (assignedRole === OhConstants.OCCUPATIONAL_HAZARD_OPERATIONS_OFFICER || assignedRole === Role.VALIDATOR_2)
    ) {
      this.validator2 = true;
      this.canReturn = true;
    } else if (assignedRole === Role.WORK_INJURIES_AND_OCCUPATIONAL_DISEASES_DOCTOR) {
      this.gosiDoctor = true;
      if (this.routerData.resourceType === OhConstants.TRANSACTION_REOPEN_DISEASE) {
        this.reopenDisease = true;
      }
      if (this.routerData.resourceType === OhConstants.TRANSACTION_CLOSE_DISEASE) {
        this.closeDisease = true;
      }
    } else if (assignedRole === Role.OH_FCAPPROVER) {
      this.fcController = true;
    } else if (assignedRole === Role.SAFETY_HEALTH_ENGINEER) {
      this.healthController = true;
    }
  }
  setReturnToEst(assignedRole) {
    this.canEdit = true;
    this.returnToEstAdmin = setReturnToEstAdmin(assignedRole);
  }
  setShowComments(workFlowStatus: WorkFlowStatus, status: string, assignedRole) {
    if (workFlowStatus) {
      this.showComment(assignedRole, status);
    }
  }
  setEditOption() {
    if (this.channel === Channel.FIELD_OFFICE && this.validator1) {
      this.canEdit = true;
    } else {
      this.canEdit = false;
    }
  }
  getBenefitsDescription(socialInsuranceNo, benefitRequestId) {
    this.ohService.getAnnuityBenefitRequestDetail(socialInsuranceNo, benefitRequestId).subscribe(
      response => {
        if (response) {
          this.activeBenefitDetails = response;
          this.description = response.disabilityDescription;
          this.benefitType = this.activeBenefitDetails.benefitType.english;
          this.getPersonInformation(this.disabilityDetails.personId);
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  getContributorDetails(socialInsuranceNo: number) {
    this.ohService.getContirbutorDetails(socialInsuranceNo).subscribe(
      response => {
        if (response) {
          this.contributorDetails = response;
          this.getNinIqamaGccId();
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  forNonOccApiValues() {
    const payload = JSON.parse(this.routerData.payload);
    this.benefitRequestId = payload.benefitRequestId;
    this.socialInsuranceNo = payload.socialInsuranceNo;
    this.getContributorDetails(this.socialInsuranceNo);
    this.getBenefitsDescription(this.socialInsuranceNo, this.benefitRequestId);
  }
  forOCCReassessmentApi() {
    const payload = JSON.parse(this.routerData.payload);
    this.socialInsuranceNo = payload.socialInsuranceNo;
    this.injuryId = this.disabilityDetails?.injuryId ? this.disabilityDetails?.injuryId : payload?.injuryId;
    this.registrationNo = payload.registrationNo;
    this.transactionNumber = payload.referenceNo;
    if (this.socialInsuranceNo && this.injuryId && this.registrationNo) {
      this.disabilityDetails && this.disabilityDetails.ohType === 0 ? this.getInjuryDetails() : null;
      this.ohService.setRegistrationNo(this.registrationNo);
      this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
      this.getContributor();
      if (this.isWithDisability) {
        if (!isNaN(Number(this.registrationNo))) {
          this.ohService.setRegistrationNo(this.registrationNo);
          this.getEstablishment();
        }
      }
      this.disabilityDetails.ohType === 0 ? this.getDisability() : null; //to get Disability details
    }
    if (this.routerData.resourceType === 'Occupational Disability Assessment') {
      this.documentFetch(null, this.disabilityDetails?.referenceNo);
    }
  }
  heirDisabilityApi() {
    const payload = JSON.parse(this.routerData.payload);
    this.benefitRequestId = payload.benefitRequestId;
    this.socialInsuranceNo = payload.socialInsuranceNo;
    this.getContributorDetails(this.socialInsuranceNo);
    this.getBenefitsDescription(this.socialInsuranceNo, this.benefitRequestId);
  }
  /** Method to get success message. */
  getSuccessMessage(action: string) {
    let message: string;
    switch (action) {
      case WorkFlowActions.SUBMIT:
      case WorkFlowActions.APPROVE_WITHOUT:
        message = OhConstants.SUCCESS_MESSAGE;
        break;
      case WorkFlowActions.RETURN:
        message = 'OCCUPATIONAL-HAZARD.RETURN-SUCCESS-MESSAGE';
        break;
      case WorkFlowActions.REJECT:
        message = 'OCCUPATIONAL-HAZARD.TRANSACTION-REJECTED';
        break;
    }
    return message;
  }
  // getcomplicationReassessmentDetails(mbAssessmentRequestId) {
  //   this.ohService.getDisabilityDetails(this.personIdentifier, mbAssessmentRequestId).subscribe(
  //     res => {
  //       this.disabilityDetails = res;
  //       this.specialtyArray = this.disabilityDetails.specialtyList;
  //       const disabilityType = this.disabilityDetails.disabilityType.english;
  //       this.getDisabilityAssessmentRoute(disabilityType); // for assessment transactions
  //       this.getDisabilityReassessmentRoute(disabilityType); // for reassessment transactions
  //       this.isHeadingAdded = true;
  //       if (this.disabilityDetails?.referenceNo) {
  //         this.documentFetch(null, this.disabilityDetails?.referenceNo, true);
  //       }
  //       if (this.routerData.resourceType === WorkFlowActions.OCC_DISABILITY_REASSESSMENT) {
  //         this.disabilityDetails.ohType === 2 ? (this.complicationReassessment = true) : null;
  //         if (
  //           this.complicationReassessment  &&
  //           this.disabilityDetails &&
  //           this.disabilityDetails.complicationInjuryId &&
  //           this.disabilityDetails.complicationInjuryId !== 0
  //         ) {
  //           this.injuryId = this.disabilityDetails.injuryNumber; // for getting complication injurydetails
  //           this.complicationId = this.disabilityDetails.injuryId;
  //           // !this.complicationReassessment ? this.getModifiedComplicationDetails() : null;
  //           if (res && this.disabilityDetails.injuryId && this.complicationId) {
  //             this.getComplicationDetails();
  //           }
  //           this.getContributor();
  //           if (
  //             this.socialInsuranceNo &&
  //             this.registrationNo &&
  //             this.injuryId &&
  //             this.transactionNumber &&
  //             this.disabilityDetails.ohType == 2
  //           ) {
  //             this.injuryId = this.disabilityDetails.injuryId;
  //             // this.injuryId = this.disabilityDetails.injuryId; // for injury reassessment injury id is passing complicationinjuryid
  //             this.getDisability();
  //           }
  //           this.getEstablishment();
  //         }
  //       }
  //       if (
  //         this.routerData.state === WorkFlowActions.RETURN &&
  //         this.disabilityDetails &&
  //         this.disabilityDetails.ohType === 2
  //       ) {
  //         this.injuryId = this.disabilityDetails.injuryNumber; // for getting complication injurydetails
  //         this.complicationId = this.disabilityDetails.injuryId;
  //         if (res && this.injuryId && this.complicationId) {
  //           this.getComplicationDetails();
  //           this.getContributor();
  //           this.getEstablishment();
  //           if (this.socialInsuranceNo && this.registrationNo && this.injuryId && this.transactionNumber) {
  //             // this.injuryId = this.disabilityDetails.complicationInjuryId; //Ffor injury reassessment injury id is passing complicationinjuryid
  //             this.injuryId = this.disabilityDetails.injuryId;
  //             this.getDisability();
  //           }
  //         }
  //         this.getCompDetail();
  //       }
  //     },
  //     err => {
  //       this.alertService.showError(err.error?.message);
  //     }
  //   );
  // }
  // for assessment details route
  getDisabilityAssessmentRoute(disabilityType?, disabilityAssessmentId?) {
    if (
      (this.routerData.resourceType === WorkFlowActions.MB_BENEFIT_ASSESSMENT ||
        this.routerData.resourceType === WorkFlowActions.REQUEST_CLARIFICATION ||
        this.routerData.resourceType === WorkFlowActions.ASSIGN_ASSESSMENT_TO_GOSI_DOCTOR) &&
      disabilityType === 'Dependent Disability'
    ) {
      this.dependentDisabilityAssessment = true;
      this.heirDisabilityApi();
      // if (this.routerData.resourceType === WorkFlowActions.REQUEST_CLARIFICATION) {
      //   this.documentFetch(this.benefitRequestId, null);
      // } else {
      //   const payload = JSON.parse(this.routerData.payload);
      //   this.getMBBenefitDocument(payload); //get MB and benefit doc
      // }
      this.getNonOccDocuments(disabilityAssessmentId);
    } else if (
      (this.routerData.resourceType === WorkFlowActions.MB_BENEFIT_ASSESSMENT ||
        this.routerData.resourceType === WorkFlowActions.REQUEST_CLARIFICATION ||
        this.routerData.resourceType === WorkFlowActions.ASSIGN_ASSESSMENT_TO_GOSI_DOCTOR) &&
      disabilityType === 'Non-Occupational Disability'
    ) {
      this.showNonOCCDisability = true;
      this.forNonOccApiValues();
      // if (this.routerData.resourceType === WorkFlowActions.REQUEST_CLARIFICATION) {
      //   this.documentFetch(this.benefitRequestId, null);
      // } else {
      //   const payload = JSON.parse(this.routerData.payload);
      //   this.getMBBenefitDocument(payload); //get MB and benefit doc
      // }
      this.getNonOccDocuments(disabilityAssessmentId);
    } else if (
      (this.routerData.resourceType === WorkFlowActions.MB_BENEFIT_ASSESSMENT ||
        this.routerData.resourceType === WorkFlowActions.REQUEST_CLARIFICATION ||
        this.routerData.resourceType === WorkFlowActions.ASSIGN_ASSESSMENT_TO_GOSI_DOCTOR) &&
      disabilityType === 'Heir Disability'
    ) {
      this.heirDisabilityAssessment = true;
      this.heirDisabilityApi();
      // if (this.routerData.resourceType === WorkFlowActions.REQUEST_CLARIFICATION) {
      //   this.documentFetch(this.benefitRequestId, null);
      // } else {
      //   const payload = JSON.parse(this.routerData.payload);
      //   this.getMBBenefitDocument(payload); //get MB and benefit doc
      // }
      this.getNonOccDocuments(disabilityAssessmentId);
    }
  }
  // For Reassessement details route
  getDisabilityReassessmentRoute(disabilityType?, assessmentId?) {
    if (
      ((this.routerData.resourceType === WorkFlowActions.OCC_DISABILITY_REASSESSMENT ||
        this.routerData.resourceType === 'Occupational Disability Assessment' ||
        this.routerData.resourceType === WorkFlowActions.REQUEST_CLARIFICATION) &&
        disabilityType === WorkFlowActions.OCC_DISABILITY_REASSESSMENT) ||
      disabilityType === 'Occupational Disability Assessment'
    ) {
      this.forOCCReassessmentApi();
    } else if (
      (this.routerData.resourceType === WorkFlowActions.NON_OCC_DISABILITY_REASSESSMENT ||
        this.routerData?.resourceType === WorkFlowActions.DEPENDENT_DISABILITY_REASSESSMENT ||
        this.routerData.resourceType === WorkFlowActions.ASSIGN_ASSESSMENT_TO_GOSI_DOCTOR ||
        this.routerData.resourceType === WorkFlowActions.REQUEST_CLARIFICATION) &&
      disabilityType === 'Dependent Disability Reassessment'
    ) {
      this.dependentDisabilityReAssessment = true;
      this.heirDisabilityApi();
    } else if (
      (this.routerData.resourceType === WorkFlowActions.NON_OCC_DISABILITY_REASSESSMENT ||
        this.routerData.resourceType === WorkFlowActions.ASSIGN_ASSESSMENT_TO_GOSI_DOCTOR ||
        this.routerData.resourceType === WorkFlowActions.REQUEST_CLARIFICATION) &&
      disabilityType === 'Non-Occupational Disability Reassessment'
    ) {
      this.nonOccDisabilityReassessment = true;
      this.forNonOccApiValues();
    } else if (
      (this.routerData.resourceType === WorkFlowActions.HEIR_DISABILITY_REASSESSMENT ||
        this.routerData.resourceType === WorkFlowActions.ASSIGN_ASSESSMENT_TO_GOSI_DOCTOR ||
        this.routerData.resourceType === WorkFlowActions.REQUEST_CLARIFICATION) &&
      disabilityType === 'Heir Disability Reassessment'
    ) {
      this.heirDisabilityReassessment = true;
      this.heirDisabilityApi();
    }
    // To fetch document for ReAssessments including injury and complication
    if (
      this.injuryReassessment ||
      this.complicationReassessment ||
      this.nonOccDisabilityReassessment ||
      this.dependentDisabilityReAssessment ||
      this.heirDisabilityReassessment
    ) {
      this.getNonOccDocuments(assessmentId);
      // this.mbAssessmentRequestId && this.transactionNumber
      //   ? this.documentFetch(this.mbAssessmentRequestId, this.transactionNumber, true)
      //   : null;
    }
  }
  previousOhDetails() {
    this.router.navigate([`/home/oh/injury/history/${this.socialInsuranceNo}/true`]);
  }
  confirmNonOccDisability() {}

  getCompDetail() {
    if (this.isReturn) {
      this.injuryId = this.disabilityDetails?.injuryNumber; // for getting complication injurydetails
      this.complicationId = this.disabilityDetails?.injuryId;
    }
    // this.complicationId = this.disabilityDetails?.injuryId;
    const isChangeRequired = false;
    this.complicationService
      .getComplication(
        this.registrationNo,
        this.socialInsuranceNo,
        this.injuryId,
        this.complicationId,
        isChangeRequired
      )
      .subscribe(response => {
        this.complicationWrapper = response;
        this.complicationWrapper.complicationDetailsDto.injuryDetails.injuryTime =
          this.complicationWrapper.complicationDetailsDto.injuryDetails.injuryHour +
          ':' +
          this.complicationWrapper.complicationDetailsDto.injuryDetails.injuryMinute;
        this.isClosed = this.ohService.getIsClosed();
        if (this.isClosed) {
          this.complicationClosingStatus = this.ohService.getClosingstatus();
          // this.updateStatus = this.complicationClosingStatus;
        } else {
          if (this.complicationWrapper.complicationDetailsDto) {
            this.complicationClosingStatus = this.complicationWrapper.complicationDetailsDto.status;
            this.previousStatus = this.complicationClosingStatus;
          }
        }
        if (this.complicationClosingStatus?.english === InjuryStatus.CURED_WITH_DISABILITY) {
          this.isWithDisability = true;
        } else this.isWithDisability = false;
        if (this.isComplication) {
          this.injuryComplicationID = this.complicationWrapper.complicationDetailsDto.complicationId;
          this.getComplicationDisabledParts(this.injuryComplicationID);
        }
        this.previousStatus = this.complicationWrapper.complicationDetailsDto.status;
        if (this.isClosed) {
          if (this.updateStatus.english !== this.previousStatus.english) {
            this.isStatusChanged = true;
          }
          this.statusAlertKey = this.closeComplicationAlert + '.COMPLICATION-INFO';
        }
        // to get occupation for close complication with cured with disability
        this.complicationId = this.complicationWrapper.complicationDetailsDto.complicationId;
        // if (this.registrationNo && this.socialInsuranceNo && this.complicationId) {
        //   // this.injuryId = this.complicationId;
        //   this.getInjuryDetails();
        // }
      });
  }
  getDisabilityFormValue() {
    return (this.parentForm?.get('bodyPartsList') as FormArray)?.value;
  }
  /**
   * To get complication details from injury id
   */
  // to get complication id use injury id in this scenario other ecenarion injury no is used
  getComplication() {
    this.complicationService.getComplicationHistory(this.socialInsuranceNo, this.injuryId).subscribe(
      res => {
        this.InjuryHistoryResponse = res;
        if (this.injuryHistoryList) {
          const injuryArr = res.injuryHistory;
          injuryArr.forEach(injury => {
            this.injuryComplicationID = injury.injuryId;
          });
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  // To Find Duplicate or same array of values and show erroe message for specialty
  hasDuplicateValue(specialtyArray: SpecialtyList[]) {
    // Show error message for only speciality is added and there is no subspeciality
    const duplicateSet = new Set();
    specialtyArray?.forEach(val => {
      if (val.subSpecialty === null || val.subSpecialty === undefined) {
        const hasOnlySpecialty = JSON.stringify(val.specialty);
        if (duplicateSet.has(hasOnlySpecialty)) {
          return true;
        }
        duplicateSet.add(hasOnlySpecialty);
      }
      return false;
    });
    // for removing isMainSpecialty field and check if duplicate values are there
    const withoutIsMainSpec = specialtyArray.map(item => {
      return {
        specialty: item.specialty,
        subSpecialty: item.subSpecialty
      };
    });
    const newArray = new Set();
    for (const eachSpecialityArray of withoutIsMainSpec) {
      const eachSpec = JSON.stringify(eachSpecialityArray);
      if (newArray.has(eachSpec)) {
        return true;
      }
      newArray.add(eachSpec);
    }
    return false;
  }
  // To Find Duplicate or same array of values and show erro message for Body Parts

  hasDuplicateBodyParts() {
    this.disabilityDetailsDto.bodyPartsList = this.getDisabilityFormValue();
    const newArray = new Set();
    for (const eachBP of this.disabilityDetailsDto.bodyPartsList) {
      const bpEach = JSON.stringify(eachBP);
      if (newArray.has(bpEach)) {
        return true;
      }
      newArray.add(bpEach);
    }
    return false;
  }
  getNinIqamaGccId() {
    this.primaryIdentity =
      this.contributor?.person?.identity != null
        ? getIdentityByType(this.contributor.person.identity, this.contributor.person.nationality.english)
        : this.contributorDetails?.person?.identity
        ? getIdentityByType(this.contributorDetails.person.identity, this.contributorDetails.person.nationality.english)
        : null;

    this.identifier = this.primaryIdentity !== null ? this.primaryIdentity.id : this.socialInsuranceNo;
  }
  /**
   * For BPM api Return Transaction
   */
  isCuredWithoutDisabMB() {
    const action = WorkFlowActions.APPROVE_WITHOUT;
    const workflowData = this.setReturnWorkflowData(this.routerData, action);
    this.saveWorkflow(workflowData);
    this.hideModal();
  }
  /** Method to set workflow details. */
  setReturnWorkflowData(routerData: RouterData, action: string): ContributorBPMRequest {
    const datas = new ContributorBPMRequest();
    if (this.reportInjuryModal?.get('comments')) datas.comments = this.reportInjuryModal.get('comments').value;
    datas.taskId = routerData.taskId;
    datas.user = routerData.assigneeId;
    datas.outcome = action;
    if (routerData.resourceType === RouterConstants.TRANSACTION_EARLY_REASSESSMENT) {
      datas.isExternalComment = true;
    }
    return datas;
  }

  /**
   * Method to save workflow details.
   * @param data workflow data
   */
  saveWorkflow(data: BPMUpdateRequest): void {
    this.workflowService
      .updateTaskWorkflow(data)
      .pipe(
        tap(() => {
          this.alertService.showSuccessByKey(this.getSuccessMessage(data.outcome));
          this.router.navigate([RouterConstants.ROUTE_INBOX]);
          this.hideModal();
        }),
        catchError(err => {
          this.handleError(err, false);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to navigate to inbox on error during view initialization. */
  handleError(error, flag: boolean): void {
    this.alertService.showError(error.error.message);
    if (flag) this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  requestTpaClose() {
    this.returnTpa = true;
    const workflowData = setWorkFlowDataForInspection(this.routerData, this.reportInjuryForm, 'request');
    const dataforCloseInjury = setWorkFlowDataForTpa(
      this.routerData,
      workflowData,
      this.tpaRequestedDocs,
      this.reportInjuryModal,
      this.transactionNumber,
      this.tpaCode
    );
    if (this.reportInjuryModal && this.reportInjuryModal?.valid) {
      this.confirmInspection(dataforCloseInjury, WorkFlowActions.SEND_FOR_CLARIFICATION);
    } else {
      this.validateComments(this.reportInjuryModal);
    }
  }
  //Form for only comments in request reports
  createReportsFormGroup(): FormGroup {
    return this.fb.group({
      comments: [null, { validators: Validators.required }]
    });
  }
  askContributors(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
    this.contributorFormControl?.reset();
  }
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.returnTpa = true;
    this.reportInjuryModal.get('comments').setValidators(Validators.required);
    this.transactionKey = setTransactionKey(this.routerData);
    this.transactionKey ? this.requestedDocumentList(this.returnTpa) : null;
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  cancel() {
    this.canceled.emit();
    this.modalRef.hide();
  }

  createContributorFormGroup(): FormGroup {
    return this.fb.group({
      requestedDocuments: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: ''
      }),
      comments: [null, { validators: Validators.required }]
    });
  }
  requestContributorClose() {
    if (this.contributorFormControl.invalid) {
      markFormGroupTouched(this.contributorFormControl);
    } else {
      //The below code is for api to send details of requested documents and comments
      const workflowData = setWorkFlowDataForContributorClarification(
        this.routerData,
        this.contributorFormControl,
        this.contributorRequestedDocs
      );
      /** The below code is to save selected documents on transaction return */
      if (this.contributorRequestedDocs?.length) {
        const documentList = new DocumentRequiredList();
        documentList.requiredDocumentsList = this.contributorRequestedDocs;
        const payload = JSON.parse(this.routerData.payload);
        this.mbAssessmentRequestId = payload?.assessmentRequestId;
        this.referenceNo = payload?.referenceNo;
        this.getNinIqamaGccId();
        if (this.routerData && this.routerData.resourceType)
          this.ohService
            .saveContributorDocuments(
              documentList,
              this.routerData.resourceType,
              this.registrationNo,
              this.socialInsuranceNo,
              this.injuryId,
              this.identifier,
              this.mbAssessmentRequestId,
              this.referenceNo
            )
            .subscribe(() => {
              workflowData.isExternalComment = true;
              this.workflowService.mergeAndUpdateTask(workflowData).subscribe(
                () => {
                  this.navigateToInbox(WorkFlowActions.SUBMIT);
                  this.hideModal();
                },
                err => {
                  this.showError(err);
                  this.hideModal();
                }
              );
            });
      }
    }
  }
  confirmTPAReport(reportDetailsDto) {
    const workflowData = setRequestNewTPAReportsWorkflow(
      this.routerData,
      this.reportsFormControl,
      reportDetailsDto,
      this.tpaCode,
      'request'
    );
    // workflowData.payload = this.routerData.content;
    // const tpaReports = {
    //   tpaReports: reportDetailsDto
    // };
    // const newPayload = this.modifyPayload(parsedPayload, tpaReports);
    // const modifiedRequest = {
    //   ...workflowData,
    //   payload: {
    //     ...newPayload,
    //     Request: {
    //       ...newPayload.Request,
    //       Body: { ...newPayload.Request.Body, tpaReports: reportDetailsDto }
    //     }
    //   },
    //   tpaReports: reportDetailsDto
    // };
    // modifiedRequest.payload.TXNElement.Body.tpaReports = reportDetailsDto;
    this.confirmReportsFromTPA(workflowData, WorkFlowActions.REQUEST_MEDICAL_REPORTS); // BPM payload
  }
  confirmReportsFromTPA(workflowData?, action?) {
    this.workflowService.mergeAndUpdateTask(workflowData).subscribe(
      () => {
        this.navigateToInbox(WorkFlowActions.SUBMIT);
        this.hideModal();
      },
      err => {
        this.showError(err.error.message);
        this.hideModal();
      }
    );
  }
  getNonOccDocuments(disabilityAssessmentId) {
    this.coreMedicalAssessmentService
      .getMedicalBoardDocuments(this.personIdentifier, disabilityAssessmentId)
      .subscribe(documentsResponse => {
        if (documentsResponse.length > 0) {
          this.documents = documentsResponse?.filter(item => item.documentContent !== null);
        }
      });
  }
  // get document for both mb and benefits
  getMBBenefitDocument(payload) {
    const documentList = [payload?.referenceNo, this.disabilityDetails?.referenceNo];
    documentList.forEach(value => this.documentFetch(null, value, true));
  }
  confirmRejectWithReason(rejectEarlyReassessment, reasonCode) {
    const action = WorkFlowActions.REJECT;
    this.updateConfirmation(action, null, null, rejectEarlyReassessment, reasonCode);
  }
}
