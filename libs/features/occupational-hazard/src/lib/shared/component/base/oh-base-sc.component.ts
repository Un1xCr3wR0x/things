import { Location } from '@angular/common';
import { Directive, Inject, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {
  AlertService,
  AppConstants,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  BilingualText,
  DocumentItem,
  DocumentService,
  EstablishmentStatusEnum,
  GosiCalendar,
  Lov,
  LovList,
  MobileDetails,
  Role,
  RouterData,
  TransactionReferenceData,
  WorkFlowActions,
  InspectionTypeEnum,
  TransactionStatus,
  LanguageToken,
  InjuredPerson,
  DisabilityDetails,
  MedicalAssessment,
  PersonWithInjury
} from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OhService } from '../../../shared/services/oh.service';
import { OhConstants } from '../../constants';
import { InjuryStatus, OHTransactionType, ProcessType, WorkFlowType } from '../../enums';
import {
  Complication,
  ComplicationWrapper,
  Contributor,
  Engagement,
  Establishment,
  Injury,
  InjuryStatistics,
  InjuryWrapper,
  Person,
  CalculationWrapper,
  ReceiveClarification,
  DiseaseWrapper,
  EngagementDetails,
  InjuredContributorsDetails,
  InjuredContributorsDTO,
  PreviousMedicalboardAssessments,
  InspectionResponses
} from '../../models';
import { AllowanceWrapper } from '../../models/allowance-details';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  DiseaseService
} from '../../services';
import { ClaimWrapper } from '../../models/claim-wrapper';
import { AuditClaims } from '../../models/audit-claims';
import { InvoiceDetails } from '../../models/invoice-details';
import { Disease } from '../../models/disease-details';
import { DiseaseHistory } from '../../models/disease-history';
import { GroupInjuryWrapper } from '../../models/group-injury-wrapper';
import { GroupInjury } from '../../models/group-injury-details';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PersonalInformation } from '@gosi-ui/features/contributor';
import { RepatriationDto } from '../../models/dead-body-repatriation';
@Directive()
export abstract class OhBaseScComponent extends BaseComponent implements OnInit, OnDestroy {
  referenceNo: number;
  claims: boolean;
  invoiceId: number;
  tpaCode: string;
  previoustpaCode: string;
  //disabilityDetails: disabiliyDtoList;
  injuredContributorList: InjuredContributorsDTO[] = [];
  disabilityDetails: DisabilityDetails;
  invoiceDetails: InvoiceDetails;
  diseaseDetailsWrapper: DiseaseWrapper = new DiseaseWrapper();
  showWorkInspectionError = false;
  batchDetails: InvoiceDetails;
  assessment: MedicalAssessment[];
  medicalAssessment = false;
  tpaComments = [];
  requestedDocuments: BilingualText[];
  engagementDto: EngagementDetails;
  showInspectionError = false;
  processType: string;
  previousBatchDetails: InvoiceDetails;
  @ViewChild('errorTemplate', { static: true })
  errorTemplate: TemplateRef<HTMLElement>;
  assignedRole: string;
  items: Lov[];
  isDocuments = false;
  docItemList: DocumentItem[] = [];
  documentItem: DocumentItem[] = [];
  medicalRecordDocumentItem: DocumentItem;
  tpaRequestedDocs = [];
  contributorRequestedDocs = [];
  commentList: TransactionReferenceData[] = [];
  batchItemId: number;
  reportAllowanceForm: FormGroup;
  reportAllowanceModal: FormGroup;
  rejectedAllowanceList: AuditClaims;
  allowanceDetailsWrapper: ClaimWrapper;
  calculationWrapper: CalculationWrapper;
  receiveClarification: ReceiveClarification[];
  showClarificationButton = true;
  allowanceType: string;
  daysDifference: number;
  differenceinDay: number;
  previousInvoiceId: number;
  fcController = false;
  healthController = false;
  isInvalidWage = false;
  complicationId: number;
  isComplicationResource = false;
  actionName: WorkFlowActions;
  engagementId: number;
  injuryId: number;
  groupInjuryId: number;
  bulkInjuryId: number;
  paramId: number;
  injuryNumber: number;
  groupInjuryRequest: number;
  diseaseId: number;
  isBulkInjury = false;
  isComplication = false;
  diseaseNumber: number;
  isTransferredInjury = false;
  isDisease = false;
  transferInjuryId: number;
  groupInjuryNo: number;
  personId: number;
  registrationNo: number;
  socialInsuranceNo: number;
  description: string;
  iSequence = 0;
  isParentInjuryRejection = false;
  confirmInspectionFlag = false;
  showMailWarning = false;
  isdNo: string;
  returnTpa = false;
  inspectionDate: string;
  canReject = false;
  allowanceDetails: AllowanceWrapper = new AllowanceWrapper();
  canSubmit = false;
  showComments = false;
  injuryReportedReg: string;
  diseaseReportedReg: string;
  complication: Complication;
  disabled = false;
  noOfEngagement: Number;
  documentListLov: LovList;
  contributorDocumentListLov: LovList;
  contributorDocumentListLov$: Observable<LovList>;
  specialityDocList: LovList;
  emptyLovList = new LovList([]);
  contributorRequestedDocuments: BilingualText[] = [];
  requstedDocuments: BilingualText[];
  modifiedInjuryDetails: Injury;
  transientDetails: Injury = new Injury();
  transientComplicationDetails: Complication = new Complication();
  transientDiseaseDetails: Disease = new Disease();
  workDisabilityDate: GosiCalendar = new GosiCalendar();
  transactionKey: OHTransactionType;
  injuryDetailsWrapper: InjuryWrapper = new InjuryWrapper();
  groupInjuryDetailsWrapper: GroupInjuryWrapper = new GroupInjuryWrapper();
  complicationWrapper: ComplicationWrapper = new ComplicationWrapper();
  modifiedcomplicationDetails: Complication = new Complication();
  injuryItemList: DocumentItem[] = [];
  complicationDocumentList: DocumentItem[] = [];
  commentsEstAdmin: string;
  commentAlert = false;
  prohibitInspection = false;
  contributor: Contributor;
  previousMedicalAssessments: PreviousMedicalboardAssessments[] = [];
  isAddressPresent = false;
  isDiseaseContributorExists = false;
  transactionNumber: number;
  latitude: number;
  longitude: number;
  comments: string;
  reimbrejectReasonList: Observable<LovList>;
  rejectReasonList: Observable<LovList>;
  engagement: Engagement;
  establishment: Establishment;
  injuryStatistics: InjuryStatistics = new InjuryStatistics();
  person: Person;
  transferInjury: DiseaseWrapper;
  canReturn = false;
  isContributor: boolean;
  injury: Injury;
  groupInjury: GroupInjury;
  disease: Disease;
  diseaseDetails: any;
  occupationalDetails: any;
  diseaseList: DiseaseHistory[] = [];
  diseaseListWrapper: DiseaseWrapper;
  diseaseJsonList: any;
  diseaseListNew: any;
  diseaseHistoryList: DiseaseHistory[];
  canRequestClarification = false;
  returnToEstAdmin = false;
  canApprove = false;
  canEdit = false;
  idCode: string;
  isdCode: string;
  validator1 = false;
  validator2 = false;
  validator3 = false;
  validator4 = false;
  gosiDoctor = false;
  reopenDisease = false;
  closeDisease =  false;
  complicationDetails: Complication = new Complication();
  injuryDate: GosiCalendar;
  channel: string;
  workflowType: WorkFlowType;
  workflowRequest: string;
  inspectionMsg: string;
  inspectionList: Observable<LovList>;
  documents: DocumentItem[] = [];
  transferdocuments: DocumentItem[];
  isAppPrivate = false;
  isAppPublic = false;
  isIndividualApp = false;
  rejectionAction = '';
  lang = 'en';
  docAlert = false;
  modalRef: BsModalRef;
  transactionReferenceData?: TransactionReferenceData[];
  transactionType: OHTransactionType;
  hasModifyIndicator = false;
  warningMsgForWI = false;
  inspectionRequestdateForWI: string | Date;
  warningMsgForEA = false;
  inspectionRequestdateForEA: string;
  warningMsg: string;
  currentPage = 0;
  pageSize = 5;
  totalSize: number;
  parsedPayload;
  isEstClosed = false;
  injuredPerson: InjuredPerson[] = [];
  injuryComplicationID: number;
  isClosed = false;
  statusAlertKey = '';
  complicationClosingStatus: BilingualText;
  updateResultStatus: BilingualText;
  previousStatus: BilingualText;
  closeComplicationAlert = 'OCCUPATIONAL-HAZARD';
  closingAlert = '';
  isStatusChanged = false;
  isWithDisability: boolean;
  PersonalInformation: PersonalInformation;
  nonOccDocuments: DocumentItem[] = [];
  reasonCode: string;
  modifiedRepatriation: RepatriationDto;
  inspectionDetail: InspectionResponses[]=[];
  nationalId: any;
  injuredPersonDisease:PersonWithInjury[]=[] 
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly establishmentService: EstablishmentService,
    readonly injuryService: InjuryService,
    readonly ohService: OhService,
    readonly router: Router,
    readonly fb: FormBuilder,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly location: Location,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super();
  }
  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
  }
  createInjuryDetailsForm() {
    return this.fb.group({
      taskId: [null],
      user: [null],
      status: [null],
      parentInjuryRejectFlag: [false],
      injuryRejectFlag: [false],
      rejectionIndicator: [null]
    });
  }
  createInjuryModalForm() {
    return this.fb.group({
      comments: [null, { validators: Validators.required }],
      document: this.fb.group({
        english: [''],
        arabic: ['']
      })
    });
  }
  createDiseaseModalForm() {
    return this.fb.group({
      comments: [null],
      document: this.fb.group({
        english: [''],
        arabic: ['']
      }),
      reasonForReturn: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }

  getEstablishment() {
    if (!this.registrationNo) {
      this.registrationNo = this.ohService.getRegistrationNumber();
    }
    this.establishmentService.getEstablishmentDetails(this.registrationNo)?.subscribe(
      response => {
        this.establishment = response;
        if (
          this.establishment?.status.english === EstablishmentStatusEnum.CLOSED ||
          this.establishment?.status.english === EstablishmentStatusEnum.CLOSING_IN_PROGRESS
        ) {
          this.isEstClosed = true;
        }
        this.paramId = this.injuryId;
        if (this.complicationId) {
          this.paramId = this.complicationId;
        }
        /* if (this.diseaseId) {
          this.paramId = this.diseaseId;
        } */
      },
      err => {
        this.showError(err);
      }
    );
  }
  getInspectionDocuments(type, referenceNo) {
    return this.documentService.getRasedDocuments(type, referenceNo).subscribe(docs => {
      if (docs.length > 0) {
        this.isDocuments = true;
        this.warningMsgForWI = true;
        this.documents = this.documents.concat(docs);
      }
    });
  }
  getEngagementOnDate(socialInsuranceNo, injuryId) {
    this.ohService.getPayeeDetails(this.registrationNo, socialInsuranceNo, injuryId, false).subscribe(
      response => {
        if (response?.applicablePayee?.length !== 2) {
          this.disabled = true;
        }
      },
      err => {
        this.showError(err);
      }
    );
    return this.disabled;
  }
  getWorkFlowType(routerData: RouterData, isComments: boolean) {
    if (routerData.resourceType === OhConstants.TRANSACTION_ADD_INJURY) {
      if (!isComments) {
        this.workflowRequest = OhConstants.WORKFLOW_ADD_INJURY;
      } else {
        this.workflowRequest = OHTransactionType.INJ_DOCUMENT_TRANSACTION_KEY;
      }
    } else if (routerData.resourceType === OhConstants.TRANSACTION_ADD_COMPLICATION) {
      this.workflowRequest = OhConstants.WORKFLOW_ADD_COMPLICATION;
    } /* else if (routerData.resourceType === OhConstants.TRANSACTION_ADD_DISEASE) {
      this.workflowRequest = OhConstants.WORKFLOW_ADD_DISEASE;
    } */ else if (routerData.resourceType === OhConstants.TRANSACTION_CLOSE_INJURY) {
      this.workflowRequest = OhConstants.WORKFLOW_CLOSE_INJURY;
    } else if (routerData.resourceType === OhConstants.TRANSACTION_CLOSE_COMPLICATION) {
      this.workflowRequest = OhConstants.WORKFLOW_CLOSE_COMPLICATION;
    } else if (
      routerData.resourceType === OhConstants.TRANSACTION_REJECT_INJURY ||
      routerData.resourceType === OhConstants.TRANSACTION_REJECT_INJURY_TPA
    ) {
      if (!isComments) {
        this.workflowRequest = OhConstants.WORKFLOW_REJECT_INJURY;
      } else {
        this.workflowRequest = OHTransactionType.REJ_INJ_DOC_TRANSACTION_KEY;
      }
    } else if (
      routerData.resourceType === OhConstants.TRANSACTION_REJECT_COMPLICATION ||
      routerData.resourceType === OhConstants.TRANSACTION_REJECT_COMPLICATION_TPA
    ) {
      this.workflowRequest = OhConstants.WORKFLOW_REJECT_COMPLICATION;
    } else if (routerData.resourceType === OhConstants.TRANSACTION_MODIFY_INJURY) {
      this.workflowRequest = OhConstants.WORKFLOW_MODIFY_INJURY;
    } else if (routerData.resourceType === OhConstants.TRANSACTION_MODIFY_COMPLICATION) {
      this.workflowRequest = OhConstants.WORKFLOW_MODIFY_COMPLICATION;
    } else if (routerData.resourceType === OhConstants.TRANSACTION_REOPEN_INJURY) {
      this.workflowRequest = OhConstants.WORKFLOW_REOPEN_INJURY;
    } else if (routerData.resourceType === OhConstants.TRANSACTION_REOPEN_COMPLICATION) {
      this.workflowRequest = OhConstants.WORKFLOW_REOPEN_COMPLICATION;
    } else if (routerData.resourceType === OhConstants.TRANSACTION_ADD_ALLOWANCE) {
      this.workflowRequest = OhConstants.WORKFLOW_ADD_ALLOWANCE;
    } else if (routerData.resourceType === OhConstants.TRANSACTION_ADD_DEADBODY_CLAIMS) {
      this.workflowRequest = OhConstants.WORKFLOW_ADD_DEAD_BODY_REPATRIATION;
    } else if (routerData.resourceType === OhConstants.TRANSACTION_ADD_DIABILITY_CLAIMS) {
      this.workflowRequest = OhConstants.WORKFLOW_ADD_TOTAL_DISABILITY_REPATRIATION;
    } else {
      this.workflowRequest = this.workflowType;
    }
  }
  getComplicationDto() {
    this.complicationService
      .getComplication(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.complicationId, false)
      .subscribe(res => {
        this.complicationDetails = res.complicationDetailsDto;
      });
    return this.complicationDetails;
  }
  getInjurySummaryStatistics() {
    this.injuryService.getInjuryStatistics(this.injuryId).subscribe(response => {
      this.injuryStatistics = response;
    });
  }
  getContributor(value?) {
    this.ohService.setWorkFlowType(this.workflowType);
    if (
      this.ohService.getRegistrationNumber() && this.ohService.getRegistrationNumber().toString() !== 'NULL' &&
      this.ohService.getSocialInsuranceNo() &&
      this.ohService.getSocialInsuranceNo().toString() !== 'null'
    ) {
      this.contributorService
        .getContributor(this.ohService.getRegistrationNumber(), this.ohService.getSocialInsuranceNo())
        .subscribe(
          response => {
            this.contributor = response;
            this.nationalId=response.person?.identity[0]['newNin'];
            this.ohService.assessmentidentityvalue(response.person?.identity[0]['newNin']);
            if (value === true) {
              if (!this.contributor?.person?.contactDetail?.emailId?.primary) {
                this.showMailWarning = true;
              }
            }
          },
          err => {
            this.showError(err);
          }
        );
    }
  }
  getDiseaseContributor(value?) {
    if (
      // this.ohService.getRegistrationNumber() &&
      this.ohService.getSocialInsuranceNo() &&
      this.ohService.getSocialInsuranceNo().toString() !== 'null'
    ) {
      this.contributorService
        .getDiseaseContributor(this.ohService.getRegistrationNumber(), this.ohService.getSocialInsuranceNo())
        .subscribe(
          response => {
            this.contributor = response;
            this.isDiseaseContributorExists = true;
            if (value === true) {
              if (!this.contributor?.person?.contactDetail?.emailId?.primary) {
                this.showMailWarning = true;
              }
            }
          },
          err => {
            this.showError(err);
          }
        );
    }
  }
  getPersonDetails() {
    if (
      this.ohService.getRegistrationNumber() &&
      this.ohService.getSocialInsuranceNo() &&
      this.ohService.getSocialInsuranceNo().toString() !== 'null'
    ) {
      this.contributorService
        .getPerson(this.ohService.getRegistrationNumber(), this.ohService.getSocialInsuranceNo())
        .subscribe(
          response => {
            this.person = response;
            this.contributor = { ...this.contributor, person: response };
            this.isAddressPresent = this.getAddressAvailability(this.person);
          },
          err => {
            this.showError(err);
          }
        );
    }

    /**
     * This method used to get status if address exists
     * @param person
     */
    if (
      this.ohService.getRegistrationNumber() &&
      this.ohService.getSocialInsuranceNo() &&
      this.ohService.getSocialInsuranceNo().toString() !== 'null'
    ) {
      this.contributorService
        .getPerson(this.ohService.getRegistrationNumber(), this.ohService.getSocialInsuranceNo())
        .subscribe(
          response => {
            this.person = response;
            this.contributor = { ...this.contributor, person: response };
            this.isAddressPresent = this.getAddressAvailability(this.person);
          },
          err => {
            this.showError(err);
          }
        );
    }
  }
  /**
   * This method used to get status if address exists
   * @param person
   */
  getAddressAvailability(person: Person): boolean {
    if (person && person.contactDetail && person.contactDetail.addresses) {
      if (person.contactDetail.addresses.length > 0) {
        return true;
      }
    }
    return false;
  }
  hideModal() {
    this.warningMsg = null;
    this.returnTpa = false;
    this.inspectionMsg = null;
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
  resetModal() {
    this.warningMsg = null;
    this.docAlert = false;
    this.tpaRequestedDocs = [];
    this.commentAlert = null;
    this.returnTpa = false;
    this.inspectionMsg = null;
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
  getDisease(document?) {
    const isChangeRequired = false;
    this.diseaseService
      .getDiseaseDetails(
        this.registrationNo,
        this.socialInsuranceNo,
        this.diseaseId,
        this.isAppPublic,
        isChangeRequired
      )
      .pipe(
        tap(res => {
          this.diseaseDetailsWrapper = res;
          this.ohService.setDiseasestatus(this.diseaseDetailsWrapper.diseaseDetailsDto.status);
          this.disease = res.diseaseDetailsDto;
          // this.disease.diseaseDescription = this.disease.diseaseDescriptionArray.join(',');
          this.tpaCode = this.disease.tpaCode;
          this.idCode = this.getISDCodePrefix(this.disease.emergencyContactNo);
          if (this.diseaseDetailsWrapper.isTransferredInjury === true) {
            this.isTransferredInjury = true;
          } else {
            this.isTransferredInjury = false;
          }
        })
      )
      .subscribe(
        () => {
          if (document) {
            this.documentService.getOldDocuments(this.disease.diseaseId).subscribe(documentResponse => {
              this.documents = documentResponse.filter(item => item.documentContent !== null);
              this.documentService
                .getOldDocuments(this.diseaseDetailsWrapper.transferredInjuryid)
                .subscribe(documentResponse => {
                  if (documentResponse) {
                    let docs = documentResponse.filter(item => item.documentContent !== null);
                    if (docs && docs.length > 0) {
                      docs.forEach(element => {
                        this.documents.push(element);
                      });
                    }
                  }
                });
            });
            if(this.documents.length === 0){
              this.documentService
              .getOldDocuments(this.diseaseDetailsWrapper.transferredInjuryid)
              .subscribe(documentResponse => {
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
            if (this.isAppPrivate) {
              this.getRasedDocuments(this.diseaseDetailsWrapper.diseaseDetailsDto);
            }
          }
        },
        err => {
          this.showError(err);
        }
      );
  }
  getEngagement() {
    if (this.engagementId != null) {
      this.contributorService
        .getEngagementDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId)
        .subscribe(
          response => {
            this.engagement = response;
          },
          err => {
            this.showError(err);
          }
        );
    }
  }
  getPerson(allowancePage?, injuryid?) {
    this.contributorService.getPerson(this.registrationNo, this.socialInsuranceNo).subscribe(
      response => {
        this.person = response;
        if (allowancePage) {
          this.getEngagementOnDate(this.socialInsuranceNo, injuryid);
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  getModifiedComplicationDetails() {
    this.complicationService
      .getModifiedComplicationDetails(
        this.registrationNo,
        this.socialInsuranceNo,
        this.injuryId,
        this.complicationId,
        this.transactionNumber
      )
      .subscribe(res => {
        this.modifiedcomplicationDetails = res;
      });
  }
  getModifiedInjuryDetails() {
    this.injuryService
      .getModifiedInjuryDetails(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.transactionNumber)
      .subscribe(res => {
        this.modifiedInjuryDetails = res;
        this.isdNo = this.getISDCodePrefix(this.modifiedInjuryDetails.emergencyContactNo);
        if (this.modifiedInjuryDetails?.injuryHour && this.modifiedInjuryDetails?.injuryMinute) {
          this.modifiedInjuryDetails.injuryTime =
            this.modifiedInjuryDetails.injuryHour !== null
              ? this.modifiedInjuryDetails.injuryHour + ':' + this.modifiedInjuryDetails.injuryMinute
              : null;
        }
      });
  }
  getISDCodePrefix(emergencyNo: MobileDetails): string {
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
  }
  getInjury(document?) {
    if (
      this.registrationNo &&
      this.socialInsuranceNo &&
      this.socialInsuranceNo.toString() !== 'null' &&
      this.injuryId &&
      !isNaN(Number(this.registrationNo)) &&
      this.registrationNo !== 0 &&
      !isNaN(this.socialInsuranceNo) &&
      this.socialInsuranceNo !== 0 &&
      !isNaN(this.injuryId) &&
      this.injuryId !== 0
    ) {
      const isChangeRequired = false;
      this.injuryService
        .getInjuryDetails(
          this.registrationNo,
          this.socialInsuranceNo,
          this.injuryId,
          this.isIndividualApp,
          isChangeRequired
        ).subscribe(
        // .pipe(
        //   tap(
            res => {
              this.injuryDetailsWrapper = res;
              this.ohService.setInjurystatus(this.injuryDetailsWrapper.injuryDetailsDto.injuryStatus);
              this.injuryReportedReg = this.injuryDetailsWrapper.establishmentRegNo.toString();
              this.injury = res.injuryDetailsDto;
              if (this.injury && this.injury.injuryId) {
                if (document) {
                  if (this.bulkInjuryId) {
                    this.documentService
                      .getOldDocuments(this.bulkInjuryId, OHTransactionType.DOCUMENT_TRANSACTION_KEY, null, null)
                      .subscribe(documentResponse => {
                        if (documentResponse) {
                          this.documents = documentResponse.filter(item => item.documentContent !== null);
                        }
                      });
                  } else {
                    this.documentService
                      .getOldDocuments(this.injury.injuryId, null, null, null)
                      .subscribe(documentResponse => {
                        if (documentResponse) {
                          this.documents = documentResponse.filter(item => item.documentContent !== null);
                        }
                      });
                  }
                  if (this.isAppPrivate) {
                    this.getRasedDocuments(this.injuryDetailsWrapper.injuryDetailsDto);
                  }
                }
              }
              const index = this.assessment?.findIndex(val => val.injuryId === this.injury.injuryId);
              index !== -1 ? (this.medicalAssessment = true) : (this.medicalAssessment = false);
              this.tpaCode = this.injury.tpaCode;
              this.injury.injuryTime =
                this.injury.injuryHour != null ? this.injury.injuryHour + ':' + this.injury.injuryMinute : null;
              this.idCode = this.getISDCodePrefix(this.injury.emergencyContactNo);
              this.bulkInjuryId = this.injuryDetailsWrapper.injuryDetailsDto.bulkInjuryId;
              if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
                this.engagementDto = res?.injuryDetailsDto?.engagementDetails;
              }
              if (this.isAppPrivate) {
                this.getRasedDocuments(this.injuryDetailsWrapper.injuryDetailsDto);
              }
            },
            err => {
              this.showError(err);
            }
          // )
        );
    }
  }
  getInjuredContributors() {
    this.injuryService.getInjuredContributorsList(this.groupInjuryId, this.registrationNo).subscribe(
      response => {
        this.injuredContributorList = response;
      },
      err => {
        this.showError(err);
      }
    );
  }
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  routeBack() {
    this.alertService.clearAlerts();
    this.location.back();
  }
  showComment(assignedRole: string, status: string) {
    if (assignedRole === Role.VALIDATOR_2 && status === 'Initiate Rejection') {
      this.showComments = true;
    } else {
      this.showComments = false;
    }
  }
  getRasedDocuments(injurydetails, type?) {
    if (this.injuryId) {
      this.ohService.getOHInspectionDetailsWithInjury(this.injuryId).subscribe(result => {
        if (result[0]?.inspectionRefNo) {
          this.inspectionRequestdateForWI = result[0]?.inspectionRequestdate.gregorian;
          this.getInspectionDocuments(InspectionTypeEnum.OCCUPATIONAL_HAZARD, injurydetails.injuryNo);
        }
        if (result[0]?.inspectionStatus && type === OhConstants.TRANSACTION_REOPEN_INJURY) {
          if (result[0].inspectionStatus === 1001 && result[0]?.inspectionTypeInfo?.type === 'WI') {
            this.showWorkInspectionError = true;
          }
        }
      });
    }
    if (this.diseaseId) {
      this.ohService.getOHInspectionDetailsWithInjury(this.diseaseId).subscribe(result => {
        this.inspectionDetail = result;
        if (result[0]?.inspectionRefNo) {
          this.inspectionRequestdateForWI = result[0]?.inspectionRequestdate.gregorian;
          this.getInspectionDocuments(InspectionTypeEnum.OCCUPATIONAL_HAZARD, injurydetails.diseaseId);
        }
        if (result[0]?.inspectionStatus && type === OhConstants.TRANSACTION_REOPEN_INJURY) {
          if (result[0].inspectionStatus === 1001 && result[0]?.inspectionTypeInfo?.type === 'WI') {
            this.showWorkInspectionError = true;
          }
        }
      });
    }
    this.ohService.getOHInspectionDetailsWithSin(this.socialInsuranceNo).subscribe(res => {
      if (res[0]?.inspectionRefNo) {
        this.inspectionRequestdateForEA = res[0]?.inspectionRequestdate.gregorian;
        this.documentService
          .getRasedDocuments(
            InspectionTypeEnum.EMPLOYEE_AFFAIRS,
            this.registrationNo,
            InspectionTypeEnum.ESTABLISHMENT,
            res[0]?.fieldActivityNumber
          )
          .subscribe(docs => {
            if (docs.length > 0) this.documents = this.documents.concat(docs);
            if (docs?.length > 0) {
              this.warningMsgForEA = true;
            }
          });
      }
      if (res[0]?.inspectionStatus) {
        if (res[0].inspectionStatus === 1001 && res[0]?.inspectionTypeInfo?.type === 'EA') {
          this.showInspectionError = true;
        }
      }
    });
  }
  showSuccessMessage(message) {
    if (message) {
      this.ohService.setTransactionMessage(message);
    }
  }
  decline() {
    this.modalRef.hide();
  }
  confirmCancel() {
    this.modalRef.hide();
    if (this.processType !== ProcessType.ADD) {
      this.ohService.deleteTransactionDetails(this.transactionNumber).subscribe(res => {
        res = res;
        this.alertService.clearAlerts();
      });
    } else if (this.ohService.getIsDisease() && this.diseaseId) {
      if (!this.transactionNumber) {
        this.transactionNumber = 0;
      }
      this.ohService.revertDiseaseTransaction(this.transactionNumber).subscribe(res => {
        res = res;
        this.alertService.clearAlerts();
      });
    }
    const transactionStatus = this.ohService.getTransactionStatus();
    if (transactionStatus?.english === TransactionStatus.DRAFT) {
      this.router.navigate(['home/transactions/list/history']);
    } else {
      this.location.back();
    }
  }
  // Api to fetch disability Details

  getDisability() {
    this.injuryService
      .getDisabilityDetails(this.registrationNo, this.socialInsuranceNo, this.injuryId, this.transactionNumber)
      .subscribe(
        response => {
          this.injuredPerson = response;
        },
        err => {
          this.showError(err);
        }
      );
  }
  getComplicationDisabledParts(injuryComplicationID) {
    this.injuryComplicationID = injuryComplicationID;
    this.injuryService
      .getDisabilityDetails(
        this.registrationNo,
        this.socialInsuranceNo,
        this.injuryComplicationID,
        this.transactionNumber
      )
      .subscribe(
        response => {
          this.injuredPerson = response;
        },
        err => {
          this.showError(err);
        }
      );
  }
  getCompDetails() {
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
        if (this.isClosed === true) {
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
        // if (this.isComplication === true) {
        this.injuryComplicationID = this.complicationWrapper.complicationDetailsDto.complicationId;
        this.getComplicationDisabledParts(this.injuryComplicationID);
        // }
        this.previousStatus = this.complicationWrapper.complicationDetailsDto.status;
        if (this.isClosed === true) {
          if (this.updateResultStatus.english !== this.previousStatus.english) {
            this.isStatusChanged = true;
          }
          this.statusAlertKey = this.closeComplicationAlert + '.COMPLICATION-INFO';
        }
      });
  }
  getPersonInformation(personId) {
    this.ohService.getPersonById(personId).subscribe(data => {
      this.PersonalInformation = data;
    });
  }
}
