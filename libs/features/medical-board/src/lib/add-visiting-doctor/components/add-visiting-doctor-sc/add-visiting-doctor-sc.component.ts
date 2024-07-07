/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  AppConstants,
  BilingualText,
  convertToYYYYMMDD,
  DocumentItem,
  DocumentService,
  GosiCalendar,
  LookupService,
  Lov,
  LovList,
  markFormGroupTouched,
  MobileDetails,
  RouterConstants,
  RouterData,
  RouterDataToken,
  scrollToTop,
  TransactionReferenceData,
  WorkflowService,
  PersonalInformation,
  AddVisitingDoctorService,
  DisabilityData,
  DisabilityDetails,
  AnnuityResponseDto,
  ContributorAssessmentService,
  AssessmentData,
  MedicalboardAssessmentService,
  CoreAdjustmentService,
  CoreBenefitService,
  MedicalAssessmentService
} from '@gosi-ui/core';
// import {
//   Establishment,
//   EstablishmentService
// } from '@gosi-ui/features/contributor';
// import { bindQueryParamsToForm, createDetailForm } from '@gosi-ui/features/payment/lib/shared';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AssessmentConstants,
  AssessmentDetails,
  BulkParticipants,
  DisabilityAssessmentService,
  DoctorService,
  EventDetails,
  IndividualSessionEvents,
  Injury,
  InjuryWrapper,
  MbList,
  MbRouteConstants,
  MedicalBoardService,
  MemberRequest,
  MemberResponse,
  MemberService,
  SessionCalendar,
  SessionCalendarService,
  SessionFilterRequest,
  SessionLimitRequest,
  SessionRequest,
  SessionStatusService,
  ValidatorMemberBaseScComponent,
  VisitingFilterRequest,
  WorkFlowType,
  bindQueryParamsToForm,
  createDetailForm
} from '../../../shared';
import { VisitingDoctorListDcComponent } from '../visiting-doctor-list-dc/visiting-doctor-list-dc.component';
import { MbAssessmentsubmitRequestDto } from '../../../shared/models/submit-assessment-request';
// import { VicContributorDetails } from '@gosi-ui/features/collection/billing/lib/shared/models';
import { Contributors, VicContributorDetails } from '../../../shared/models/contributors';
import { Content } from '@gosi-ui/features/occupational-hazard/lib/shared';
import { TerminateRequest } from '@gosi-ui/features/establishment';
@Component({
  selector: 'mb-add-visiting-doctor-sc',
  templateUrl: './add-visiting-doctor-sc.component.html',
  styleUrls: ['./add-visiting-doctor-sc.component.scss']
})
export class AddVisitingDoctorScComponent extends ValidatorMemberBaseScComponent implements OnInit {
  referenceNo: number;
  /** Input Variables */
  comment: TransactionReferenceData[];
  documents: DocumentItem[] = [];
  // establishment: Establishment;
  contributor: Contributors;
  modalRef: BsModalRef;
  injury: Injury = new Injury();
  specialtyList: LovList;
  activeBenefitDetails: AnnuityResponseDto;
  bpmContent;
  /** Local  Variables */
  registrationNo: number;
  paramId: number;
  fieldOfficeList$: Observable<LovList>;
  memberRequest: MemberRequest = new MemberRequest();
  sessionFilter: SessionFilterRequest = new SessionFilterRequest();
  filteredMember: MbList[] = [];
  totalItems = 0;
  currentPage = 0; // Pagination
  itemsPerPage = 10; // Pagination
  selectedVistingDr: MbList;
  selectedDate: string;
  idCode: string;
  complicationDocumentList: DocumentItem[] = [];
  selectedMonth: number;
  selectedYear: number;
  injuryDetailsWrapper: InjuryWrapper = new InjuryWrapper();
  isNoSessions = true;
  isAppeal: boolean;
  tpaCode: string;
  contributorLocation: BilingualText[] = [];
  sessionTimeList: LovList;
  region$: Observable<LovList>;
  isMonthchanged = false;
  individualSessionEvents: IndividualSessionEvents[] = [];
  sessionCalendar: SessionCalendar = new SessionCalendar();
  sessionRequest: SessionRequest = new SessionRequest();
  totalSessions: number;
  participantsInQueue: number;
  eventDetails: EventDetails[] = [];
  availableArray: Date[] = [];
  unavailableArray: Date[] = [];
  // sessionTimeList: String[] = [];
  passedDate: string;
  fullyFilled = false;
  servceRegions: BilingualText[] = [];
  isDisabled: boolean;
  noSessions: boolean;
  message: BilingualText;
  contributorDetails: VicContributorDetails = new VicContributorDetails();
  setList: boolean;
  // commonModalRef: BsModalRef;
  disabiltyReturnForm: FormGroup;
  returnReasonList$: Observable<LovList>;
  disabilityDetails: DisabilityDetails;
  @ViewChild('visitingDoctorList', { static: false }) visitingDoctorList: VisitingDoctorListDcComponent;
  socialInsuranceNo: number;
  workflowType: WorkFlowType;
  transactionNumber: number;
  channel: string;
  assessmentRequestId: number;
  engagementId: number;
  submitAssessment: MbAssessmentsubmitRequestDto = new MbAssessmentsubmitRequestDto();
  previousDisabilityDetails: DisabilityData;
  singleAssessmentDetails: AssessmentData;
  injuryDate: GosiCalendar;
  isdCode: string;
  injuryId: number;
  collapseView: boolean;
  parentForm: FormGroup = new FormGroup({});
  assessmentSlotSequence: number;
  assessmentSession: number;
  successMessage: BilingualText;
  isReassessment = false;
  isScheduleReminder = false;
  isNonOcc = false;
  heirDisabilityAssessment = false;
  dependentDisabilityAssessment = false;
  description: string;
  benefitRequestId: number;
  hideInjury = false;
  isOcc = false;
  personIdentifier: number;
  personalInformation: PersonalInformation;
  isEarlyReassessment = false;
  appealDisabilityAssessmentId: number;
  disabilityAssessmentId: number;
  isVdRequired = false;
  isRescheduled = false;
  headOffice = { value: { english: 'Head office', arabic: 'المركز الرئيسي ' }, sequence: 1 };
  isOccDisab = false;
  modifiedDisability = false;
  constructor(
    readonly contributorService: ContributorAssessmentService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly injuryService: AddVisitingDoctorService,
    readonly modalService: BsModalService,
    readonly medicalBoardService: MedicalBoardService,
    readonly router: Router,
    readonly sessionCalendarService: SessionCalendarService,
    readonly workflowService: WorkflowService,
    readonly doctorService: DoctorService,
    readonly memberService: MemberService,
    readonly disabilityAssessmentService: DisabilityAssessmentService,
    readonly sessionStatusService: SessionStatusService,
    readonly addVisitingDoctorService: AddVisitingDoctorService,
    readonly fb: FormBuilder,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    readonly coreMedicalAssessmentService: MedicalAssessmentService,
    @Inject(RouterDataToken) readonly routerData: RouterData
  ) {
    super(
      doctorService,
      medicalBoardService,
      memberService,
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router,
      routerData
    );
  }

  ngOnInit(): void {
    this.disabiltyReturnForm = createDetailForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.disabiltyReturnForm);
    this.getSpecialityList();
    if (this.routerData.taskId === null || this.routerData.taskId === undefined) {
      this.intialiseTheView(this.addVisitingDoctorService.getRouterData());
    }
    if (this.routerData.taskId !== null && this.routerData.taskId !== null) {
      this.intialiseTheView(this.routerData);
    }
    this.getDisabiltyAssessmentDetails(this.assessmentRequestId);
    this.returnReasonList$ = this.lookupService.getRegistrationReturnReasonList();
    this.region$ = this.lookupService.getRegionsList(); //TODO Use Camel Case
    this.selectedDate = convertToYYYYMMDD(moment(new Date()).toDate().toString());
    this.message = {
      english: 'Map the participant to the medical board session once the visiting doctor arrangement is completed',
      arabic: 'حدد المشارك في جلسة اللجنة الطبية بمجرد الانتهاء من إجراءات زيارة الطبيب.'
    };
    this.getPreviousDisability();

    // this.selectedMonth = moment(new Date()).toDate().getMonth() + 1;
    // this.selectedYear = moment(new Date()).toDate().getFullYear();
    // this.getCurrentMonthDetails(this.selectedMonth, this.selectedYear);
    this.routerData.resourceType === RouterConstants.TRANSACTION_EARLY_REASSESSMENT
      ? ((this.isEarlyReassessment = true), this.documentFetch(this.assessmentRequestId, this.transactionNumber))
      : (this.isEarlyReassessment = false);
    // if (this.isScheduleReminder && this.disabilityDetails) {
    //   this.getOfficeLists();
    // }
  }
  navigateToScan() {}
  return() {}
  cancel() {}
  intialiseTheView(routerData: RouterData) {
    if (routerData && routerData.taskId) {
      this.alertService.clearAlerts();
      this.addVisitingDoctorService.setRouterData(routerData);
      this.bpmContent = routerData.content;
      if (routerData.payload) {
        const payload = JSON.parse(routerData.payload);
        this.setValues(routerData);
        this.comment = this.routerData.comments;
        if (
          !this.hideInjury &&
          this.socialInsuranceNo &&
          this.registrationNo &&
          !isNaN(Number(this.injuryId)) &&
          this.injuryId !== 0
        ) {
          this.getInjuryDetails();
        }

        if (this.heirDisabilityAssessment || this.dependentDisabilityAssessment) {
          this.getBenefitsDescription(this.socialInsuranceNo, this.benefitRequestId);
        }
      }
    }
    if (routerData.resourceType === RouterConstants.ASSIGN_PARTICIPANT_TO_SESSION) {
      this.isNoReturn = true;
    }
  }
  // Method to set values from workitem
  setValues(routerData) {
    const payload = JSON.parse(routerData.payload);
    this.registrationNo = payload.registrationNo;
    // this.getWorkFlowType(this.routerData, true);
    this.socialInsuranceNo = payload.socialInsuranceNo;
    this.assessmentRequestId = payload.assessmentRequestId;
    this.injuryId = payload.id !== 'NULL' ? payload.id : null || payload?.injuryId;
    this.channel = payload.channel;
    this.workflowType = payload.resource;
    this.transactionNumber = payload.referenceNo;
    this.benefitRequestId = payload.benefitRequestId;
    this.personIdentifier = payload?.identifier;
    this.disabilityAssessmentId = payload?.disabilityAssessmentId;
    if (payload.resource === RouterConstants.TRANSACTION_MB_APPOINTMENT_REMINDER) {
      this.isScheduleReminder = true;
      this.injuryId = payload.injuryId;
      if (
        payload.assessmentType === 'Dependent Disability' ||
        payload.assessmentType === 'Dependent Disability Reassessment' || 
        payload.resource ===  RouterConstants.TRANSACTION_NON_OCC_DEPENDENT_DISABILITY_REASSESSMENT
      ) {
        this.dependentDisabilityAssessment = true;
        this.isNonOcc = true;
        this.hideInjury = true;
        // this.isReassessment = true;
      }
      if (payload.assessmentType === 'Heir Disability' || payload.assessmentType === 'Heir Disability Reassessment') {
        this.hideInjury = true;
        this.isNonOcc = true;
        // this.isReassessment = true;
        this.heirDisabilityAssessment = true;
      }
      if (
        payload.assessmentType === 'Non-Occupational Disability' ||
        payload.assessmentType === 'Non-Occupational Disability Reassessment'
      ) {
        this.isNonOcc = true;
        // this.dependentDisabilityAssessment = true; removed do not show heir / dep details for non occ contributor
        // this.isReassessment = true;
        this.hideInjury = true;
      }
    }
    if (
      routerData?.resourceType === RouterConstants.TRANSACTION_ASSIGN_TO_HO ||
      routerData?.resourceType === RouterConstants.TRANSACTION_MB_ASSIGN_SESSION_GOSI_DOCTOR
    ) {
      this.modifiedDisability = true;
    }
    if (payload.resource === 'Reassessment') {
      this.isReassessment = true;
    }
    if (payload.resource === 'MB Benefit Assessment') {
      this.isNonOcc = true;
      if (payload?.titleEnglish === RouterConstants.TRANSACTION_BENEFIT_HEIR_ASSESSMEMT) {
        this.heirDisabilityAssessment = true;
      }
      if (payload?.titleEnglish === RouterConstants.TRANSACTION_BENEFIT_DEPENDENT_ASSESSMEMT) {
        this.dependentDisabilityAssessment = true;
      }
      // this.getMedicalBoardBenefitDocs(payload);
    }
    if (payload.resource === 'Non-Occupational Disability Reassessment' || payload.resource === RouterConstants.TRANSACTION_NON_OCC_DEPENDENT_DISABILITY_REASSESSMENT) {
      this.isNonOcc = true;
      this.isReassessment = true;
      this.hideInjury = true;
      if (
        payload.assessmentType === 'Dependent Disability' ||
        payload.resource === RouterConstants.TRANSACTION_NON_OCC_DEPENDENT_DISABILITY_REASSESSMENT
      ) {
        this.dependentDisabilityAssessment = true;
        this.isNonOcc = true;
      }
    }
    if (
      payload.resource === 'Occupational Disability Assessment' ||
      payload.assessmentType === 'Occupational Disability'
    ) {
      this.isOcc = true;
    }
    if (payload.resource === 'Occupational Disability Reassessment') {
      this.isReassessment = true;
    }
    if (payload.resource === 'Heir Disability Reassessment') {
      this.hideInjury = true;
      this.isNonOcc = true;
      this.isReassessment = true;
      this.heirDisabilityAssessment = true;
    }
    if (
      payload.resource === 'Benefit Disability Assessment' ||
      payload.resource === 'Non-Occupational Disability Assessment'
    ) {
      this.isNonOcc = true;
      this.hideInjury = true;
      if (payload.assessmentType === 'Dependent Disability') {
        this.heirDisabilityAssessment = true;
      }
    }
    if (payload.resource === 'Heir Disability Assessment') {
      this.hideInjury = true;
      this.isNonOcc = true;
      this.heirDisabilityAssessment = true;
    }
    if (payload.resource === 'Assign participant to Session') {
      this.isRescheduled = true;
      this.isNonOcc = true;
    }
    // this.ohService.setComplicationId(payload.id);
    this.addVisitingDoctorService.setRegistrationNo(this.registrationNo);
    this.addVisitingDoctorService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.addVisitingDoctorService.setIdForValidatorAction(payload.id);
    if (payload.resource === 'Appeal Assessment') {
      switch (payload.assessmentType) {
        case 'Dependent Disability Reassessment':
        case 'Dependent Disability':
          this.dependentDisabilityAssessment = true;
          this.isNonOcc = true;
          this.hideInjury = true;
          break;
        case 'Heir Disability':
        case 'Heir Disability Reassessment':
          this.hideInjury = true;
          this.isNonOcc = true;
          this.heirDisabilityAssessment = true;
          break;
        case 'Non-Occupational Disability':
        case 'Non-Occupational Disability Reassessment':
          this.isNonOcc = true;
          // this.dependentDisabilityAssessment = true;removed do not show heir / dep details for non occ contributor
          this.hideInjury = true;
          break;
        case 'Occupational Disability':
          this.isOcc = true;
          break;
      }
    }
    // if (this.isNonOcc || this.modifiedDisability) {
      this.getNonOccContributorDretails(this.socialInsuranceNo);
    // } else {
    //   this.getContributor();
    // }
  }
  //Method to get injury details
  getInjuryDetails() {
    const isChangeRequired = false;
    this.injuryService
      .getInjuryDetails(this.registrationNo, this.socialInsuranceNo, this.injuryId, isChangeRequired)
      .subscribe(
        response => {
          this.injuryDetailsWrapper = response;
          if (isChangeRequired) {
          } else {
            this.injury = this.injuryDetailsWrapper.injuryDetailsDto;
            this.tpaCode = this.injury.tpaCode;
            // this.setShowComments(this.injury.workFlowStatus, this.rejectionAction, this.routerData.assignedRole);
            this.engagementId = this.injury.engagementId;
            this.injuryDate = this.injury.injuryDate;
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
  //Method tp get previous disability details
  getPreviousDisability() {
    this.disabilityAssessmentService.getPreviousDisability(this.personIdentifier).subscribe(res => {
      this.previousDisabilityDetails = res;
      this.singleAssessmentDetails = res.data.filter(result => result?.assessmentId === this.disabilityAssessmentId)[0];
    });
  }
  //Method to get benefit details
  getBenefitsDescription(socialInsuranceNo, benefitRequestId) {
    this.addVisitingDoctorService.getAnnuityBenefitRequestDetail(socialInsuranceNo, benefitRequestId).subscribe(
      response => {
        if (response) {
          this.activeBenefitDetails = response;
          // this.description = response?.disabilityDescription;
        }
      },
      err => {
        this.showError(err);
      }
    );
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
  //Method to fetch documents
  documentFetch(ohId, referenceNo, isMBBenefitDoc?) {
    if (isMBBenefitDoc) {
      this.documentService.getOldDocuments(ohId, null, null, referenceNo).subscribe(responseOfDoc => {
        if (responseOfDoc) this.documents.concat(...responseOfDoc.filter(item => item.documentContent !== null));
      });
    } else
      this.documentService.getOldDocuments(ohId, null, null, referenceNo).subscribe(documentResponse => {
        if (documentResponse) {
          this.complicationDocumentList = documentResponse.filter(item => item.documentContent !== null);
          this.documents = documentResponse.filter(item => item.documentContent !== null);
        }
      });
  }
  viewInjuryHistory() {
    // this.router.navigate(['/home/oh/injury/history']);
    this.router.navigate([`/home/oh/injury/history/${this.socialInsuranceNo}/true`]);
  }
  //Method to get contributor details
  getContributor(value?) {
    this.contributorService
      .getContributor(
        this.addVisitingDoctorService.getRegistrationNumber(),
        this.addVisitingDoctorService.getSocialInsuranceNo()
      )
      .subscribe(
        response => {
          this.contributor = response;
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
  //Method triggered when visisting doctor is added
  addVisitingDoctor(TemplateValue: TemplateRef<HTMLElement>) {
    // this.getDateArray();
    this.memberRequest.listOfDoctorType = [{ english: 'Visiting Doctor', arabic: '' }];
    this.memberRequest.listOfRegion = [];
    this.contributorLocation = [];
    this.contributorLocation.push(this.disabilityDetails?.foCode);
    this.getRegions(this.contributorLocation);
    // this.memberRequest.listOfSpecialty = this.disabilityDetails.vdDetails.vdSpecialties;
    this.memberRequest.listOfSpecialty = [];
    // this.disabilityDetails.specialtyList.forEach(items => {
    //   this.memberRequest.listOfSpecialty.push(items?.specialty);
    // });
    this.memberRequest.listOfSpecialty = this.disabilityDetails?.vdDetails?.vdSpecialties;
    this.memberRequest.pageNo = 0; // for closing modal and reopening the pg no tp be passed is 0
    setTimeout(() => {
      this.getMembers();
    }, 500);

    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-lg modal-dialog-centered` };
    this.modalRef = this.modalService.show(TemplateValue, config);
    this.getOfficeLists();
  }

  onDateChange(value: Date) {
    this.selectedMonth = value.getMonth() + 1;
    this.selectedYear = value.getFullYear();
    this.getCurrentMonthDetails(this.selectedMonth, this.selectedYear, this.sessionRequest);
  }
  onEventChange(value: Date) {
    this.fullyFilled = false;
    this.unavailableArray.forEach(item => {
      if (convertToYYYYMMDD(item.toString()) === convertToYYYYMMDD(value.toString())) {
        this.fullyFilled = true;
      }
    });
    if (value) {
      this.passedDate = convertToYYYYMMDD(value.toString());
      this.getIndividualSessionDetails(this.passedDate, this.sessionRequest);
    }
  }

  //method triggered when field office location is changed
  getLocation(value: BilingualText) {
    this.sessionRequest.filter.fieldOffice = [];
    this.sessionRequest.filter.fieldOffice.push(value);
  }
  //Method to get days in a month having sessions
  getCurrentMonthDetails(currentMonth: number, currentYear: number, sessionRequest?: SessionRequest) {
    this.sessionCalendarService.getSessionDetails(currentMonth, currentYear, sessionRequest, true).subscribe(
      res => {
        this.sessionCalendar = res;
        this.availableArray = [];
        this.unavailableArray = [];
        if (this.sessionCalendar.sessionDetails) {
          this.sessionCalendar?.sessionDetails?.forEach(item => {
            if (item.isSlotsAvailable === true && item.dateString > this.selectedDate) {
              const date = new Date(item.dateString);
              this.availableArray.push(date);
            } else {
              if (item.dateString > this.selectedDate) {
                const date = new Date(item.dateString);
                this.unavailableArray.push(date);
              }
            }
          });
          this.noSessions = false;
          if (this.availableArray.length === 0 && this.unavailableArray.length === 0) {
            this.noSessions = true;
          }
        }
        this.totalSessions = res.totalCount;
        this.participantsInQueue = res.participantsInQueue;
        this.eventDetails = new Array(this.sessionCalendar?.sessionDetails?.length);
      },
      err => {
        this.alertService.showError(err.error?.message);
      }
    );
  }
  // getDateArray() {}
  // To get list of medical board members
  getMembers() {
    this.medicalBoardService.getTransactions(this.memberRequest).subscribe(
      (data: MemberResponse) => {
        this.filteredMember = data.mbList;
        this.totalItems = data.totalNoOfRecords;
      },
      err => this.showError(err)
    );
  }
  //Method to get corresponding service region for a field office location
  getRegions(value: BilingualText[]) {
    this.medicalBoardService.getServiceRegion(this.personIdentifier, value).subscribe(
      (data: BilingualText[]) => {
        this.servceRegions = data;
        this.servceRegions.forEach(items => {
          this.memberRequest.listOfRegion.push(items);
        });
        // this.memberRequest.listOfRegion = this.servceRegions;
      },
      err => this.showError(err)
    );
  }
  //To get fieldofficeList LOV
  getOfficeLists() {
    if (this.isAppeal) {
      this.fieldOfficeList$ = of(new LovList([this.headOffice]));
    } else {
      this.fieldOfficeList$ = this.lookupService.getFieldOfficeList().pipe(
        map((lovList: LovList) => {
          if (lovList) {
            lovList.items.forEach(item => {
              item.value.arabic = item.value.arabic.trim();
              item.value.english = item.value.english.trim();
            });
            return lovList;
          }
        })
      );
    }
  }
  /**
   * To get SpecialtyList LOV
   */
  getSpecialityList() {
    this.lookupService.getSpecialityList().subscribe(res => {
      if (res) this.specialtyList = res;
    });
  }
  // to get filtered value in api
  onFilterValue(value: VisitingFilterRequest) {
    if (value.region?.length > 0) {
      if (value.location?.length === 0 || value.location?.length === undefined) {
        this.memberRequest.listOfRegion = [];
      }
      value.region.forEach(items => {
        this.memberRequest.listOfRegion.push(items);
      });
    } else if (value.location?.length === 0 || value.location?.length === undefined) {
      this.memberRequest.listOfRegion = [];
      this.getRegions(this.contributorLocation);
    }
    if (value.location?.length > 0) {
      if (value.region?.length === 0 || value.region?.length === undefined) {
        this.memberRequest.listOfRegion = [];
      }
      // console.log(value.location);

      this.getRegions(value.location);
    }
    this.memberRequest.listOfDoctorType = [{ english: 'Visiting Doctor', arabic: '' }];
    if (value.speciality?.length > 0) {
      this.memberRequest.listOfSpecialty = value.speciality;
    } else {
      this.memberRequest.listOfSpecialty = [];
      // this.disabilityDetails.specialtyList.forEach(items => {
      //   this.memberRequest.listOfSpecialty.push(items.specialty);
      // });
      this.memberRequest.listOfSpecialty = this.disabilityDetails?.vdDetails?.vdSpecialties;
    }

    setTimeout(() => {
      this.getMembers();
    }, 500);
  }
  onAddDoctor(value: MbList) {
    this.selectedVistingDr = value;
    // console.log(value);

    this.modalRef.hide();
    this.alertService.showInfo(this.message, null);
    scrollToTop();
  }
  navigateToProfile(identificationNo: number) {
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(identificationNo)]);
    this.hideModal();
  }
  //Method to get sessiondetails and corresponding slot details for LOV
  getIndividualSessionDetails(selectedDate: string, sessionRequest?: SessionRequest) {
    this.sessionCalendarService.getDateSessionDetails(selectedDate, sessionRequest, true).subscribe(
      res => {
        this.individualSessionEvents = res;
        this.isNoSessions = false;
        if (this.individualSessionEvents?.length === 0) this.isNoSessions = true;
        if (!this.fullyFilled) {
          this.isDisabled = false;
          this.sessionTimeList = new LovList([]);
          const sessionTimeList = new LovList([]);
          const lovarr: Lov[] = [];
          this.individualSessionEvents.forEach((item, index) => {
            this.setList = true;
            if (item.maximumBeneficiaries !== item.noOfParticipants) {
              item.sessionSlotDetails.forEach((resVal, j) => {
                this.setList = true;
                if (resVal.isSlotsFilled) {
                  const sessionTime = resVal.slotTime.english;
                  const arTime = sessionTime.split('-');
                  if (arTime[0].indexOf('AM') >= 0) {
                    {
                      arTime[0] = arTime[0].replace('AM', '');
                      arTime[0] = arTime[0] + 'ص';
                    }
                  } else if (arTime[0].indexOf('PM') >= 0) {
                    {
                      arTime[0] = arTime[0].replace('PM', '');
                      arTime[0] = arTime[0] + 'م';
                    }
                  }
                  if (arTime[1].indexOf('AM') >= 1) {
                    {
                      arTime[1] = arTime[1].replace('AM', '');
                      arTime[1] = arTime[1] + 'ص';
                    }
                  } else if (arTime[1].indexOf('PM') >= 1) {
                    {
                      arTime[1] = arTime[1].replace('PM', '');
                      arTime[1] = arTime[1] + 'م';
                    }
                  }
                  const arabicTime = arTime[0] + '-' + arTime[1];
                  // this.sessionTimeList.push(sessionTime);
                  lovarr.forEach(resData => {
                    if (sessionTime === resData.value.english) {
                      this.setList = false;
                    }
                  });
                  if (this.setList) {
                    {
                      lovarr.push({
                        sequence: resVal.slotSequence,
                        value: { english: sessionTime, arabic: arabicTime },
                        code: item.sessionId
                      });
                    }
                  }
                  sessionTimeList.items = lovarr;
                }
              });
            } else {
              const sessionTime = item.sessionSlotDetails[0].slotTime.english;
              const arTime = sessionTime.split('-');
              if (arTime[0].indexOf('AM') >= 0) {
                {
                  arTime[0] = arTime[0].replace('AM', '');
                  arTime[0] = arTime[0] + 'ص';
                }
              } else if (arTime[0].indexOf('PM') >= 0) {
                {
                  arTime[0] = arTime[0].replace('PM', '');
                  arTime[0] = arTime[0] + 'م';
                }
              }
              if (arTime[1].indexOf('AM') >= 1) {
                {
                  arTime[1] = arTime[1].replace('AM', '');
                  arTime[1] = arTime[1] + 'ص';
                }
              } else if (arTime[1].indexOf('PM') >= 1) {
                {
                  arTime[1] = arTime[1].replace('PM', '');
                  arTime[1] = arTime[1] + 'م';
                }
              }
              const arabicTime = arTime[0] + '-' + arTime[1];
              // this.sessionTimeList.push(sessionTime);
              lovarr.forEach(time => {
                if (sessionTime === time.value.english) {
                  this.setList = false;
                }
              });
              if (this.setList) {
                {
                  lovarr.push({
                    sequence: item.sessionSlotDetails[0].slotSequence,
                    value: { english: sessionTime, arabic: arabicTime },
                    code: item.sessionId
                  });
                }
              }
              sessionTimeList.items = lovarr;
            }
          });
          this.sessionTimeList = sessionTimeList;
          // console.log(this.sessionTimeList);
        } else {
          {
            this.sessionTimeList = new LovList([]);
            const sessionTimeList = new LovList([]);
            const lovarr: Lov[] = [];
            this.individualSessionEvents.forEach((item, index) => {
              const sessionTime = item.sessionSlotDetails[0]?.slotTime.english;
              const arTime = sessionTime.split('-');
              if (arTime[0].indexOf('AM') >= 0) {
                {
                  arTime[0] = arTime[0].replace('AM', '');
                  arTime[0] = arTime[0] + 'ص';
                }
              } else if (arTime[0].indexOf('PM') >= 0) {
                {
                  arTime[0] = arTime[0].replace('PM', '');
                  arTime[0] = arTime[0] + 'م';
                }
              }
              if (arTime[1].indexOf('AM') >= 1) {
                {
                  arTime[1] = arTime[1].replace('AM', '');
                  arTime[1] = arTime[1] + 'ص';
                }
              } else if (arTime[1].indexOf('PM') >= 1) {
                {
                  arTime[1] = arTime[1].replace('PM', '');
                  arTime[1] = arTime[1] + 'م';
                }
              }
              const arabicTime = arTime[0] + '-' + arTime[1];

              lovarr.push({
                sequence: item.sessionSlotDetails[0].slotSequence,
                value: { english: sessionTime, arabic: arabicTime },
                code: item.sessionId
              });
              sessionTimeList.items = lovarr;
            });
            this.sessionTimeList = sessionTimeList;
            // console.log(this.sessionTimeList);
            if (this.fullyFilled) {
              this.isDisabled = true;
            } else {
              this.isDisabled = false;
            }
          }
        }
      },
      err => {
        this.isNoSessions = true;
        this.alertService.showError(err.error?.message);
      }
    );
    this.isMonthchanged = false;
  }
  //Method to get Disability details
  getDisabiltyAssessmentDetails(mbAssessmentRequestId: number) {
    this.medicalBoardService.getDisabilityDetails(this.personIdentifier, mbAssessmentRequestId).subscribe(
      res => {
        this.disabilityDetails = res;
        this.isVdRequired = this.disabilityDetails?.isParticipantAttendanceRequired === 'Yes';
        this.isAppeal = this.disabilityDetails?.medicalBoard?.english === 'Appeal Medical Board' ? true : false;
        this.getPersonDetails(res?.personId);
        // if (this.isAppeal) {
        //   this.appealDisabilityAssessmentId = this.disabilityDetails.primaryAssessmentDetails.disabilityAssessmentId;
        //   if (this.isAppeal && this.appealDisabilityAssessmentId) {
        //     if (this.isRescheduled) {
        //       this.documentFetch(this.disabilityAssessmentId, null);
        //     } else {
        //       this.documentFetch(this.appealDisabilityAssessmentId, null);
        //     }
        //   }
        // }
        let assessmentId: number;
        if (this.isAppeal && !this.isRescheduled) {
          this.appealDisabilityAssessmentId = this.disabilityDetails.primaryAssessmentDetails.disabilityAssessmentId;
          assessmentId = this.appealDisabilityAssessmentId;
        } else {
          assessmentId = this.disabilityDetails?.assessmentId;
        }
        this.getMedicalBoardBenefitDocs(assessmentId);
        // else {
        //   if (this.isReassessment) {
        //     this.documentFetch(this.assessmentRequestId, this.transactionNumber);
        //   } else if (this.isOcc && this.injuryId && this.disabilityDetails.referenceNo) {
        //     this.documentFetch(this.injuryId, this.disabilityDetails.referenceNo);
        //   } else if (this.isOcc === false && this.benefitRequestId && this.disabilityDetails.referenceNo) {
        //     // this.documentFetch(this.benefitRequestId, this.disabilityDetails.referenceNo);
        //     this.getMedicalBoardBenefitDocs();
        //   } else if (this.isRescheduled && this.disabilityDetails?.disabilityType.english.includes('Reassessment')) {
        //     this.documentFetch(this.disabilityDetails?.mbAssessmentRequestId, this.disabilityDetails.referenceNo);
        //   }
        // }
        this.sessionRequest.filter.fieldOffice.push(this.disabilityDetails?.foCode);
        if (this.disabilityDetails?.specialtyList) {
          this.disabilityDetails.specialtyList.forEach(items => {
            // this.sessionRequest.filter.specialty.push(items?.specialty); // as discussed with alex
            // specialoity is filtered as main and withoutmain adn filtered and passed in api as q param
            if (items.subSpecialty) {
              items.subSpecialty.forEach(subSpecRes => {
                this.sessionRequest.filter.subSpecialty.push({
                  english: subSpecRes.english,
                  arabic: subSpecRes.arabic
                });
              });
            }
          });
          //get speciality list for without main speciality - changes done to be asked by kiran ,Alex
          this.disabilityDetails?.specialtyList
            .filter(eachOne => {
              return eachOne?.isMainSpecialty;
            })
            .forEach(specWithoutMain => {
              this.sessionRequest.filter.specialty.push(specWithoutMain?.specialty);
            });
          // get specilityList for with main spociality- changes done to be asked by kiran ,Alex
          this.disabilityDetails?.specialtyList
            .filter(noMain => {
              return !noMain?.isMainSpecialty;
            })
            .forEach(specwithMain => {
              this.sessionRequest.filter.listOfSecSpecialty.push(specwithMain?.specialty);
            });
        }
        if (this.isScheduleReminder) {
          this.getOfficeLists();
        }
      },
      err => {
        this.alertService.showError(err.error?.message);
      }
    );
  }
  onLimit(limit: number) {
    if (this.currentPage !== limit) {
      this.currentPage = limit;
      this.memberRequest.pageNo = this.currentPage;
      this.getMembers();
    }
    // if (this.sessionRequest) {
    //   this.sessionRequest.limit.pageNo = limit;
    // }
  }
  onSearchMember(searchKey: string) {
    if (this.memberRequest) this.memberRequest.searchKey = searchKey;
    this.memberRequest.listOfSpecialty = [];
    // this.disabilityDetails.specialtyList.forEach(items => {
    //   this.memberRequest.listOfSpecialty.push(items.specialty);
    // })
    this.memberRequest.listOfSpecialty = this.disabilityDetails?.vdDetails?.vdSpecialties;
    // this.resetFilter();
    this.onResetPagination();
    this.getMembers();

    // this.getcontactedMembers(this.dateSession, this.sessionRequest);
  }
  //Method to get contributor details in Non-Occ transactions
  getNonOccContributorDretails(socialInsuranceNo: number) {
    this.addVisitingDoctorService.getContirbutorDetails(socialInsuranceNo).subscribe(
      response => {
        if (response) {
          this.contributorDetails = response;
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  onResetPagination() {
    this.sessionRequest.limit = new SessionLimitRequest();
    if (this.visitingDoctorList) this.visitingDoctorList.resetPagination();
  }
  //Method to get slot details from form
  BindAssessmentTime(value: Lov) {
    this.assessmentSlotSequence = value.sequence;
    this.assessmentSession = value.code;
  }
  //Method to set bpm approve task
  confirmReturn(key) {
    this.alertService.clearAllInfoAlerts();
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerData, action);
    super.saveWorkflow(data);
    super.hideModal();
  }
  onCollapse(value: boolean) {
    this.collapseView = value;
  }
  showApprovalModal(templateRef: TemplateRef<HTMLElement>): void {
    this.alertService.clearAlerts();
    if (
      ((this.isNoReturn && this.isVdRequired) || !this.isNoReturn) &&
      !this.selectedVistingDr &&
      !this.isScheduleReminder
    ) {
      this.alertService.showMandatoryErrorMessage();
    } else if (this.parentForm.invalid) {
      markFormGroupTouched(this.parentForm);
      this.alertService.showMandatoryErrorMessage();
    } else {
      this.modalRef = this.modalService.show(templateRef, { class: 'modal-lg modal-dialog-centered' });
    }
  }
  confirmCancel() {
    this.alertService.clearAllInfoAlerts();
    this.modalRef.hide();
    this.router.navigateByUrl(RouterConstants.ROUTE_INBOX);
  }
  //Method to submit assessment details
  approve() {
    this.alertService.clearAllInfoAlerts();
    if (
      ((this.isNoReturn && this.isVdRequired) || !this.isNoReturn) &&
      !this.selectedVistingDr &&
      !this.isScheduleReminder
    ) {
      this.alertService.showErrorByKey('MEDICAL-BOARD.ERROR.ASSIGN-VISITING-DOCTOR');
    } else if (this.parentForm.invalid) {
      markFormGroupTouched(this.parentForm);
      this.alertService.showMandatoryErrorMessage();
    } else {
      this.alertService.clearAllInfoAlerts();
      let vdReqiured = false;
      if (this.isNoReturn) {
        vdReqiured =
          this.parentForm.get('visitingDoctorFormValue')?.get('visitingDoctor')?.value?.english === 'Yes'
            ? true
            : false;
      } else {
        vdReqiured = this.disabilityDetails?.isVdRequired;
      }
      this.submitAssessment.mbAssessmentRequestId = this.assessmentRequestId;
      this.submitAssessment.slotSequence = this.assessmentSlotSequence;
      this.submitAssessment.sessionId = this.assessmentSession;
      this.submitAssessment.isReturn = false;
      this.submitAssessment.mbContractId = this.selectedVistingDr?.contractId;
      this.submitAssessment.mbProfessionalId = this.selectedVistingDr?.mbProfessionId;
      this.submitAssessment.assessmenttype = this.disabilityDetails?.disabilityType;
      this.submitAssessment.isVDRequired = vdReqiured;
      this.submitAssessment.isRescheduled = this.isNoReturn ? true : false;
      this.submitAssessment.disabilityAssessmentId = this.disabilityAssessmentId;
      this.submitAssessment.selectedAssessmentDate = this.parentForm
        ?.get('disabilityAssessmentForm')
        ?.get('assessmentDate')
        .get('gregorian').value;
      this.medicalBoardService
        .submitAssessment(this.personIdentifier, this.assessmentRequestId, this.submitAssessment, this.transactionNumber)
        .subscribe(
          res => {
            // this.alertService.showSuccess(res.message);
            this.successMessage = res.message;
            this.confirmReturn(0);
          },
          err => this.showError(err)
        );
    }
  }
  assign() {
    this.alertService.clearAllInfoAlerts();
    if (this.parentForm.invalid) {
      markFormGroupTouched(this.parentForm);
      this.alertService.showMandatoryErrorMessage();
    } else {
      const payload = [];
      const req = new BulkParticipants();
      req.participantId = this.assessmentRequestId;
      const sessionID = this.assessmentSession;
      const sessionSlot = this.assessmentSlotSequence;
      const workflowData = this.setWorkFlowDataForConfirmation(
        this.routerData,
        sessionID,
        sessionSlot,
        this.bpmContent
      );
      this.workflowService.mergeAndUpdateTask(workflowData).subscribe(
        () => {
          const successMessage = this.getSuccessMessage(workflowData.outcome);
          this.alertService.showSuccessByKey(successMessage, null, 20);
          this.router.navigate([RouterConstants.ROUTE_INBOX]);
          this.hideModal();
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
    super.hideModal();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  getPersonDetails(personId) {
    this.contributorService.getPersonById(personId).subscribe(data => {
      this.personalInformation = data;
    });
  }
  navigateToPreviousAssessment(assessment: AssessmentDetails) {
    this.coreAdjustmentService.identifier = this.personId;
    this.coreAdjustmentService.socialNumber = this.socialInsuranceNo;
    this.coreBenefitService.injuryId = assessment?.injuryId;
    this.coreBenefitService.regNo = this.registrationNo;
    this.disabilityAssessmentService.disabilityAssessmentId = assessment?.assessmentId;
    this.disabilityAssessmentService.disabilityType = assessment?.disabilityType;
    this.disabilityAssessmentService.contractDoctor = false;
    this.disabilityAssessmentService.assessmentTypes = assessment?.assessmentType;
    this.disabilityAssessmentService.benefitReqId = assessment?.benefitReqId;
    this.disabilityAssessmentService.referenceNo = assessment?.referenceNo;
    this.router.navigate([AssessmentConstants.ROUTE_VIEW_ASSESSMENT]);
  }
  selectedVd(value) {
    if (value === 'Yes') {
      this.isVdRequired = true;
    } else {
      this.isVdRequired = false;
    }
    this.alertService.clearAlerts();
  }
  // getMedicalBoardBenefitDocs(payload) {
  //   const references = [this.disabilityDetails.referenceNo, payload?.referenceNo];
  //   references.forEach(referenceNumber => {
  //     this.documentFetch(null, referenceNumber, true);
  //   });
  // }
  getMedicalBoardBenefitDocs(disabilityAssessmentId) {
    this.coreMedicalAssessmentService
      .getMedicalBoardDocuments(this.personIdentifier, disabilityAssessmentId)
      .subscribe(documentsResponse => {
        if (documentsResponse.length > 0) {
          this.documents = documentsResponse?.filter(item => item.documentContent !== null);
        }
      });
  }
}
