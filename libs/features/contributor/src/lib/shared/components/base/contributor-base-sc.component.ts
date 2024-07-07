/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, Inject, OnDestroy } from '@angular/core';
import {
  AlertService,
  BaseComponent,
  BorderNumber,
  CalendarService,
  DocumentItem,
  DocumentService,
  GosiCalendar,
  IdentityTypeEnum,
  Iqama,
  Lov,
  LovList,
  NIN,
  NationalId,
  Passport,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionReferenceData,
  WorkFlowActions,
  WorkflowService,
  convertToHijriFormat,
  scrollToTop
} from '@gosi-ui/core';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, noop, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ContributorConstants } from '../../constants';
import { SubmitActions } from '../../enums';
import {
  Contributor,
  ContributorBPMRequest,
  EngagementDetails,
  Establishment,
  PersonalInformation,
  pensionReformEligibility
} from '../../models';
import { gradeDetails } from '../../models/jobGradeDetails';
import { ContributorService, EngagementService, EstablishmentService, ManageWageService } from '../../services';

const gccIdentites = [IdentityTypeEnum.PASSPORT, IdentityTypeEnum.IQAMA, IdentityTypeEnum.NATIONALID];
const nonSaudiIdentites = [IdentityTypeEnum.PASSPORT, IdentityTypeEnum.IQAMA, IdentityTypeEnum.BORDER];
const saudiIdentites = [IdentityTypeEnum.NIN];

@Directive()
export abstract class ContributorBaseScComponent extends BaseComponent implements OnDestroy {
  /** Identifier variables */
  registrationNo: number;
  socialInsuranceNo: number;
  personId: number;
  engagementId: number;

  /** Object/Class variables. */
  contributor: Contributor;
  person: PersonalInformation;
  engagement: EngagementDetails;
  currentEngagement: EngagementDetails;
  engagements: EngagementDetails[];
  establishment: Establishment;
  documents: DocumentItem[] = [];
  transactionRefData: TransactionReferenceData[] = [];
  isApiTriggered = false;
  isModifyCoverage = false;
  ppaEstablishment: boolean;

  /** Local vaiables */
  legalEntity: string;
  contributorType: string;
  modalRef: BsModalRef;
  referenceNo: number;
  isEditMode = false;
  uuid: string;
  isUnifiedProfile: boolean; //To identify whether transaction is initiated from unified profile.
  isPpa: boolean; //To identify whether engagement is ppa.
  jobScaleList$: Observable<LovList>;
  civilianJobScale: number;
  jobClassLov: Lov[] = [];
  jobRankLov: Lov[] = [];
  jobGradeLov: Lov[] = [];
  jobClassCivilTypeLov = new Lov();
  jobRankListLov = new Lov();
  jobGradeApiResponse: gradeDetails[];
  PPACalendarShiftDate: string;
  maxHijiriDateForPPA: string;
  minGregorianDateForPpa: Date;
  hijiriDate: string;
  disableCalendarForPpa: boolean;
  sysDate: GosiCalendar;

  draftNeeded: boolean;
  contractId: number;

  pensionReformEligibility: pensionReformEligibility;
  isPREligible: boolean;
  isPrivate: any;

  /** Creates an instance on ContributorBaseScComponent */
  constructor(
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly manageWageService: ManageWageService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly calendarService: CalendarService
  ) {
    super();
  }

  /**
   * Method to fetch establishment details if registration no is valid
   * @param registrationNo
   */
  getEstablishmentDetails(registrationNo: number): Observable<Establishment> {
    return this.establishmentService.getEstablishmentDetails(registrationNo).pipe(
      tap((res: Establishment) => {
        this.registrationNo = Number(registrationNo);
        this.legalEntity = res.legalEntity.english;
        this.establishment = res;
        this.isPpa = res?.ppaEstablishment;
      }),
      catchError(err => {
        this.showError(err);
        return throwError(err);
      })
    );
  }

  /**
   * Method to fetch contributor details.
   * @param registrationNo registration number
   * @param socialInsuranceNo social insurance number
   */
  getContributorDetails(
    registrationNo: number,
    socialInsuranceNo: number,
    options?: Map<string, boolean>
  ): Observable<Contributor> {
    if (socialInsuranceNo && registrationNo) {
      return this.contributorService.getContributor(registrationNo, socialInsuranceNo, options).pipe(
        tap((res: Contributor) => {
          this.socialInsuranceNo = socialInsuranceNo;
          this.contributor = res;
          this.person = res.person;
          this.contributorType = res.contributorType;
        }),
        catchError(err => {
          this.showError(err);
          return throwError(err);
        })
      );
    }
  }

  /** Method to get contributor details with sin.*/
  getContributorDetailsBySin(socialInsuranceNo: number, options?: Map<string, boolean>) {
    return this.contributorService.getContributorBySin(socialInsuranceNo, options).pipe(
      tap((res: Contributor) => {
        this.socialInsuranceNo = socialInsuranceNo;
        this.contributor = res;
        this.person = res.person;
        this.contributorType = res.contributorType;
      }),
      catchError(err => {
        this.showError(err);
        return throwError(err);
      })
    );
  }
  /**
   * Method to fetch engagement details.
   * @param registrationNo registration number
   * @param socialInsuranceNo social insurance number
   * @param engagementId engagement id
   * @param engagementType engagement type
   */
  getEngagementDetails(
    registrationNo: number,
    socialInsuranceNo: number,
    engagementId: number,
    engagementType?: string,
    determineCoverage?: boolean
  ): Observable<EngagementDetails> {
    return this.engagementService
      .getEngagementDetails(registrationNo, socialInsuranceNo, engagementId, engagementType, determineCoverage)
      .pipe(
        tap(() => (this.engagementId = engagementId)),
        catchError(err => {
          this.showError(err);
          return throwError(err);
        })
      );
  }

  //Method to set identity objects
  getIdentityType(type: IdentityTypeEnum): NIN | Iqama | NationalId | Passport | BorderNumber {
    if (type === IdentityTypeEnum.NIN) {
      return new NIN();
    } else if (type === IdentityTypeEnum.IQAMA) {
      return new Iqama();
    } else if (type === IdentityTypeEnum.NATIONALID) {
      return new NationalId();
    } else if (type === IdentityTypeEnum.PASSPORT) {
      return new Passport();
    } else if (type === IdentityTypeEnum.BORDER) {
      return new BorderNumber();
    }
    return null;
  }

  // method to set gcc identities
  setGccIdentity() {
    const idTypes = this.contributor.person.identity.map(item => item.idType);
    if (this.contributorType === 'GCC Contributor') {
      gccIdentites.forEach(idType => {
        if (idTypes.indexOf(idType) === -1) {
          this.contributor.person.identity.push(this.getIdentityType(idType));
        }
      });
    } else if (this.contributorType !== 'GCC Contributor' && this.contributorType !== 'engagement') {
      nonSaudiIdentites.forEach(idType => {
        if (idTypes.indexOf(idType) === -1) {
          this.contributor.person.identity.push(this.getIdentityType(idType));
        }
      });
    } else {
      saudiIdentites.forEach(idType => {
        if (idTypes.indexOf(idType) === -1) {
          this.contributor.person.identity.push(this.getIdentityType(idType));
        }
      });
    }
  }

  /** Method to set keys for view. */
  setKeysForView(): void {
    if (this.isEditMode) this.initializeFromToken();
    else this.initializeFromWageService();
  }

  /** Method to initialize keys from token. */
  initializeFromToken(): void {
    this.referenceNo = this.routerDataToken.transactionId;
    const payload = JSON.parse(this.routerDataToken.payload);
    if (payload) {
      this.registrationNo = Number(payload.registrationNo);
      this.socialInsuranceNo = Number(payload.socialInsuranceNo);
      this.engagementId = Number(payload.engagementId);
      if (payload.resource) {
        if (payload.resource === RouterConstants.TRANSACTION_MODIFY_COVERAGE) this.isModifyCoverage = true;
      }
    }
    this.transactionRefData = this.routerDataToken.comments;
  }

  /** Method to initialize keys from route. */
  initializeFromWageService(): void {
    this.isPpa = this.manageWageService.isPpa;
    this.isUnifiedProfile = this.manageWageService.unifiedProfileIndicator;
    this.registrationNo = this.manageWageService.registrationNo;
    this.socialInsuranceNo = this.manageWageService.socialInsuranceNo;
    this.engagementId = this.manageWageService.engagementId;
    this.referenceNo = this.manageWageService.referenceNo;
    this.draftNeeded = this.manageWageService.draftNeeded;
    this.contractId = this.manageWageService.contractId;
  }

  /**
   * Method to set alert if a service call fails (Use this as common method for all failed service calls under this feature)
   * @param errorMessage
   */
  showError(error) {
    this.isApiTriggered = false;
    if (error?.error) {
      scrollToTop();
      this.alertService.showError(error.error.message, error.error.details);
    }
  }

  /** Method to set mandatory fields validation (Use this as common method for all under this feature). */
  showMandatoryFieldsError() {
    this.isApiTriggered = false;
    scrollToTop();
    this.alertService.showMandatoryErrorMessage();
  }

  /** Method to set mandatory documents validation (Use this as common method for all under this feature). */
  showMandatoryDocumentsError() {
    this.isApiTriggered = false;
    scrollToTop();
    this.alertService.showMandatoryDocumentsError();
  }

  /** Method to fetch required documents for the transaction. */
  getRequiredDocuments(
    businessKey: number,
    docTransactionId: string,
    docTransactionType: string | string[],
    isRefreshRequired = false,
    referenceNo?: number
  ) {
    this.documentService.getRequiredDocuments(docTransactionId, docTransactionType).subscribe(res => {
      this.documents = this.documentService.removeDuplicateDocs(res);
      if (isRefreshRequired) {
        this.documents.forEach(doc =>
          this.refreshDocument(
            doc,
            businessKey,
            docTransactionId,
            typeof docTransactionType === 'string' ? docTransactionType : null,
            referenceNo
          )
        );
      }
    });
  }

  /** Method to refresh documents after scan. */
  refreshDocument(
    doc: DocumentItem,
    businessKey: number,
    docTransactionId: string,
    docTransactionType: string,
    referenceNo?: number,
    uuid?: string
  ) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          businessKey,
          docTransactionId,
          docTransactionType,
          referenceNo,
          null,
          uuid,
          doc.sequenceNumber
        )
        .subscribe(res => (doc = res));
    }
  }

  /** Method to delete any document scanned or uploaded when the transaction is cancelled. */
  deleteDocumentsOnCancel(referenceNo: number) {
    this.documents.forEach(doc => {
      if (doc.documentContent)
        this.documentService
          .deleteDocument(
            this.engagementId,
            doc.name.english,
            referenceNo,
            null,
            doc.sequenceNumber,
            null,
            doc.documentTypeId
          )
          .subscribe(noop);
    });
  }

  /** Method to assemble workflow payload. */
  assembleWorkflowPayload(token: RouterData, comments: string, isDoctor?: boolean): ContributorBPMRequest {
    const data = new ContributorBPMRequest();
    data.taskId = token.taskId;
    data.user = token.assigneeId;
    data.outcome = isDoctor ? WorkFlowActions.APPROVE : SubmitActions.SUBMIT;
    data.comments = comments;
    return data;
  }

  /** Method to check whether atleast one optional document is scanned.
   * @param docList document list
   */
  checkOptionalDocuments(docList: DocumentItem[]): boolean {
    let isSuccess = false;
    for (const documentItem of docList) {
      if (ContributorConstants.DOCUMENT_OTHER.indexOf(documentItem.name.english) === -1) {
        if (documentItem.documentContent) isSuccess = true;
      }
    }
    this.markMandatoryDocuments(docList, isSuccess);
    return isSuccess;
  }

  /** Method to mark mandatory documents that is not scanned. */
  markMandatoryDocuments(docList: DocumentItem[], flag: boolean): void {
    for (const documentItem of docList) {
      if (ContributorConstants.DOCUMENT_OTHER.indexOf(documentItem.name.english) === -1) {
        if (!documentItem.documentContent) {
          if (!flag && documentItem.required) documentItem.uploadFailed = true;
          else documentItem.uploadFailed = false;
        }
      }
    }
  }

  /** This method is to hide the modal reference. */
  hideModal() {
    this.modalRef?.hide();
  }
  getJobClass(jobClassValue?: number, jobRankValue?: number) {
    this.jobScaleList$.subscribe(jobScale => {
      if (jobScale) {
        this.civilianJobScale = this.establishment?.jobScaleType;
        // jobScale.items.filter(res => {
        //   return res.value.english === 'Civil Job class';
        // })[0]?.code;
        //Job Class List For PPA
        this.contributorService.getJobClass(this.civilianJobScale).subscribe(val => {
          let selectedJobCLassLov: Lov = new Lov();
          this.jobClassLov = [];
          val.forEach((eachJobType, index) => {
            const lov = new Lov();
            lov.code = eachJobType?.jobClassCode;
            lov.value = eachJobType?.jobClassName;
            lov.sequence = index;
            this.jobClassLov.push(lov);
            if (jobClassValue === eachJobType?.jobClassCode) {
              selectedJobCLassLov = lov;
            }
          });
          if (selectedJobCLassLov?.code || selectedJobCLassLov?.code === 0) {
            this.jobClassListChangeForPPA(selectedJobCLassLov, jobRankValue);
          }
        });
      }
    });
  }
  //Job Rank List For PPA
  jobClassListChangeForPPA(data: Lov, selectedRank?: number) {
    this.jobClassCivilTypeLov = data;
    this.contributorService.getRank(this.civilianJobScale, this.jobClassCivilTypeLov?.code).subscribe(res => {
      this.jobRankLov = [];
      let selectedJobRankLov: Lov = new Lov();
      res.forEach((eachRankType, index) => {
        const lov = new Lov();
        lov.code = eachRankType?.jobRankCode;
        lov.value = eachRankType?.jobRankName;
        lov.sequence = index;
        this.jobRankLov.push(lov);
        if (selectedRank === eachRankType?.jobRankCode) {
          selectedJobRankLov = lov;
        }
      });
      if (selectedJobRankLov?.code || selectedJobRankLov?.code === 0) {
        this.jobRankListChangeForPPA(selectedJobRankLov);
      }
    });
  }
  //Job Grade List For PPA
  jobRankListChangeForPPA(data: Lov) {
    this.jobRankListLov = data;
    this.contributorService
      .getGrade(this.civilianJobScale, this.jobClassCivilTypeLov?.code, this.jobRankListLov?.code)
      .subscribe(res => {
        this.jobGradeLov = [];
        this.jobGradeApiResponse = res;
        res.forEach((eachGradeType, index) => {
          const lov = new Lov();
          lov.value = eachGradeType?.jobGradeName;
          lov.sequence = index;
          lov.code = parseInt(eachGradeType?.jobGradeCode);
          this.jobGradeLov.push(lov);
        });
      });
  }
  getCalenderDataForPPAEst() {
    this.contributorService.getSystemParams().subscribe(item => {
      item.forEach(calendarShift => {
        if (calendarShift.name === 'PPA_CALENDAR_SHIFT_DATE') {
          this.PPACalendarShiftDate = moment(calendarShift.value).format('YYYY-MM-DD');
          this.minGregorianDateForPpa = new Date(this.PPACalendarShiftDate);
          //max hijiri date based on PPACalendarShiftDate
          const hijiriDateForPPA = moment(this.PPACalendarShiftDate).subtract(1, 'days');
          this.calendarService.getHijiriDate(hijiriDateForPPA).subscribe(res => {
            this.maxHijiriDateForPPA = convertToHijriFormat(res.hijiri);
          });
          //enable gregorian calendar based on current date and system parameter date
          if (this.sysDate?.gregorian)
            if (moment(this.sysDate?.gregorian).isBefore(moment(this.PPACalendarShiftDate))) {
              this.disableCalendarForPpa = true;
            } else {
              this.disableCalendarForPpa = false;
            }
          this.calendarService.getHijiriDate(this.sysDate?.gregorian).subscribe(hijiriDate => {
            this.hijiriDate = convertToHijriFormat(hijiriDate.hijiri);
            this.sysDate.hijiri = this.hijiriDate;
          });
        }
      });
    });
  }
  getTodaysDate() {
    this.calendarService.getSystemRunDate().subscribe(res => {
      this.sysDate = res;
    });
  }

  /**Method to destroy value set in service */
  ngOnDestroy(): void {
    this.manageWageService.socialInsuranceNo = null;
    this.manageWageService.engagementId = null;
  }
  /** Method to check pension-reform-eligibility. */
  checkEligibility(nin) {
    if(nin && this.isPrivate){ 
      this.contributorService.checkEligibilityNin(nin).subscribe(res => {
        this.pensionReformEligibility = res;
        if (res.pensionReformEligible === 'Not Eligible' || res.pensionReformEligible === 'Impacted') {
          this.isPREligible = false;
        } else {
          this.isPREligible = true;
        }
      });
    }
    // this.isPREligible = false; comment above code and uncomment this line #forDisable
  }
}
