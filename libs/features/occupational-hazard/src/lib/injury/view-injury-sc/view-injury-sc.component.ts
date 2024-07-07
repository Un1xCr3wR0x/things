/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OhBaseScComponent } from '../../shared/component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  scrollToTop,
  ApplicationTypeEnum,
  MedicalAssessmentService,
  BilingualText,
  LanguageToken,
  LovList,
  LookupService,
  convertToYYYYMMDD,
  Lov,
  LovStatus,
  getIdentityByType,
  CommonIdentity,
  RoleIdEnum,
  CoreAdjustmentService,
  CoreBenefitService,
  AuthTokenService,
  AssessmentData,
  DisabilityData,
  MedicalboardAssessmentService,
  DisabilityDetails,
  MbAllowance,
  DocumentItem,
  scrollToModalError,
  GosiCalendar,
  CalendarService,
  addDays
} from '@gosi-ui/core';
import { InjuryStatus, OHReportTypes, TabSetVariables } from '../../shared/enums';
import {
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  ComplicationService,
  DiseaseService
} from '../../shared/services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  AssessmentConstants,
  DisabilityAssessmentService,
  EventDetails,
  IndividualSessionEvents,
  MedicalBoardService,
  SessionCalendar,
  SessionCalendarService,
  SessionRequest
} from '@gosi-ui/features/medical-board';
import moment from 'moment';
import { RouteConstants } from '../../shared';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/lib/search/services';
import { TransactionSearchResponse } from '@gosi-ui/foundation-dashboard/lib/search/models';

@Component({
  selector: 'oh-view-injury-sc',
  templateUrl: './view-injury-sc.component.html',
  styleUrls: ['./view-injury-sc.component.scss']
})
export class ViewInjuryScComponent extends OhBaseScComponent implements OnInit, OnDestroy {
  // Local Variables
  collapse = false;
  selectedType: OHReportTypes = null;
  showComplication = false;
  bsModalRef: BsModalRef;
  @ViewChild('errorTemplate', { static: true })
  errorTemplate: TemplateRef<HTMLElement>;
  errorMessage = '';
  dismissible = false;
  injuryStatus: BilingualText;
  modalHeader = '';
  tabView = false;
  statusEst: string;
  responseConfirm: BilingualText;
  //reschedule
  virtual: BilingualText = new BilingualText();
  isAppPrivate = false;
  nin: number;
  assessmentSlotSequence: number;
  identityno: any;
  identitynumber: number;
  assessmentSession: number;
  fieldOfficeList$: Observable<LovList>;
  parentForm: FormGroup = new FormGroup({});
  disabilityDetailsMedical: DisabilityDetails;
  availableArray: Date[] = [];
  unavailableArray: Date[] = [];
  sessionCalendar: SessionCalendar = new SessionCalendar();
  selectedDate: string;
  noSessions: boolean;
  onHold: boolean;
  noSessionscalendar: boolean;
  totalSessions: number;
  invitenumber: number;
  locationamb: BilingualText = new BilingualText();
  sessionnumber: number;
  participantsInQueue: number;
  eventDetails: EventDetails[] = [];
  fullyFilled = false;
  passedDate: string;
  sessionRequest: SessionRequest = new SessionRequest();
  setList: boolean;
  sessionTimeList: LovList;
  individualSessionEvents: IndividualSessionEvents[] = [];
  isNoSessions = true;
  isDisabled: boolean;
  isMonthchanged = false;
  selectedMonth: number;
  region$: Observable<LovList>;
  selectedYear: number;
  // minDate: Date;
  maxDate: Date;
  previousDisabilityDetails: DisabilityData;
  personIdentifier: number;
  primaryIdentity: CommonIdentity = new CommonIdentity();
  identifier: number;
  isContributor = false;
  isMbo = false;
  isHoDoctor = false;
  isGosiDoctor: boolean = false;
  isMbManager = false;
  heading: string;
  acceptDisbId: number;
  successMessage: BilingualText;
  isAppealRoute = false;
  isCSR = false;
  mbAllowanceDto: MbAllowance = new MbAllowance();
  showOTPField = true;
  radioFormControl: FormGroup = new FormGroup({});
  authenticationList: LovList = new LovList([]);
  otpForm: FormGroup = new FormGroup({});
  showDocumentField = false;
  giveOTPData = false;
  noOfIncorrectOtp = 0;
  MaxEntriedReached = 'CONTRIBUTOR.ERROR.MAX-ENTRIES-OTP';
  showOtpErrorMsg: string;
  showOtpFlag = false;
  minutes = 4;
  isValidOTP = false;
  disabledOTP = false; //max entry reached
  isResend = false; // Timer finished
  noOfResend = 3;
  otpResponse: BilingualText;
  documentScanList: DocumentItem[] = [];
  documentList$: Observable<DocumentItem[]>;
  uploadFailed;
  isSmallScreen: boolean;
  successOTPMessage;
  acceptConEntitlement;
  authenticatedOtp = false;
  systemRunDate: GosiCalendar;
  minimumDate: Date;
  authenticationErrorMessage = {
    english: 'Please Authenticate OTP/Document to proceed ',
    arabic: 'Please Authenticate OTP/Document to proceed. '
  };
  otpValidated = {
    english: 'Authentication has been done. you can proceed by clicking yes',
    arabic: 'Authentication has been done. you can proceed by clicking yes'
  };
  errorRes: BilingualText;
  uuid: string;
  xOtp: string;
  repatriationButton: boolean = false;
  infoNeeded = false;
  transaction: TransactionSearchResponse;
  repatriationCompleted: boolean = false;
  repatriationInProgress: boolean = false;
  /**
   * Initializing constructor
   */
  constructor(
    readonly authTokenService: AuthTokenService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly assessmentService: MedicalAssessmentService,
    readonly establishmentService: EstablishmentService,
    readonly lookupService: LookupService,
    readonly fb: FormBuilder,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly injuryService: InjuryService,
    readonly medicalBoardService: MedicalBoardService,
    readonly modalService: BsModalService,
    readonly sessionCalendarService: SessionCalendarService,
    readonly ohService: OhService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location,
    readonly bsModalService: BsModalService,
    readonly activatedRoute: ActivatedRoute,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    private disabilityAssessmentService: DisabilityAssessmentService,
    readonly medicalboardAssessmentService: MedicalboardAssessmentService,
    readonly medicaAssessmentService: MedicalboardAssessmentService,
    readonly calendarService: CalendarService,
    readonly dashboardSearchService: DashboardSearchService
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
  }
  @ViewChild('confirmSubmit', { static: true })
  confirmSubmit: TemplateRef<HTMLElement>;
  /**
   * After initializing component
   */
  ngOnInit() {
    super.ngOnInit();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.ohService.setNavigation(null);
    this.ohService.setHasRoutedBack(false);
    this.ohService.setSelectedTabid(TabSetVariables.Injury);
    if(this.ohService.getCurrentPath()){
      this.ohService.setPreviousPath(this.ohService.getCurrentPath());      
    }
    this.ohService.setCurrentPath(this.router.url);
    this.setUser();
    this.forOTPAuthentication();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.status === 'modified' || params.status === 're-open' || params.status === 'rejected') {
        this.hasModifyIndicator = true;
      }
    });
    this.registrationNo = this.ohService.getRegistrationNumber();
    this.socialInsuranceNo = this.ohService.getSocialInsuranceNo();
    this.personId = this.ohService.getPersonId();
    this.injuryId = this.ohService.getInjuryId();
    this.transferInjuryId = this.ohService.getTransferInjuryId();
    this.nin = this.authTokenService.getIndividual();
    this.isAppealRoute = this.ohService.getAppealRoute();
    this.getInjury(true);
    if (!this.injuryId) {
      this.activatedRoute.paramMap.subscribe(res => {
        this.registrationNo = parseInt(res.get('registrationNo'), 10);
        this.socialInsuranceNo = parseInt(res.get('socialInsuranceNo'), 10);
        this.injuryId = parseInt(res.get('injuryId'), 10);
        if(res.get('transferInjuryId')){
          this.injuryId = parseInt(res.get('transferInjuryId'), 10);
        }
        this.ohService.setRegistrationNo(this.registrationNo);
        this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
      });
    }
    this.getContributorById();
    //this.getOfficeListsmB();

    this.region$ = this.lookupService.getRegionsList();
    this.selectedDate = convertToYYYYMMDD(moment(new Date()).toDate().toString());
    this.selectedType = this.ohService.getReportType();
    if (OHReportTypes.Complication === this.selectedType) {
      this.showComplication = true;
    }
    if (!this.hasModifyIndicator) {
      if (this.isAppealRoute) {
        this.alertService.clearAllWarningAlerts();
        this.alertService.clearAllErrorAlerts();
      } else this.alertService.clearAlerts();
    }
    this.getEstablishment();
    this.getContributor();
    this.repatriationButton = this.ohService.getRepatriationButton();
    this.transaction = this.dashboardSearchService.getIndividualTransactionDetails();
    if(this.transaction) {
      console.log('trr ', this.transaction);
      this.transaction.listOfTransactionDetails.forEach(item => {
        const title = item.title.english.split(' ').join('');
        if(title === 'Adddeadbodyrepatriation') {
          if(item.status.english === 'Completed') {
            this.repatriationCompleted = true;
          } else if(item.status.english === 'In Progress') {
            this.repatriationInProgress = true;
          }
        }
      })
    }
    scrollToTop();
  }
  getContributorById() {
    this.contributorService
      .getContributor(this.ohService.getRegistrationNumber(), this.ohService.getSocialInsuranceNo())
      .subscribe(
        response => {
          this.contributor = response;
          this.getNinIqamaGccId();
          this.getAssessment();
          this.getPreviousDisability();
          // this.ohService.assessmentidentityvalue(response.person?.identity[0]['idType']);
        },
        err => {
          this.showError(err);
        }
      );
  }
  setUser() {
    const gosiscp = this.authTokenService.getEntitlements(); // to get login details from authToken
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.isContributor = true;
    } else if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      gosiscp[0].role.forEach(roleid => {
        if (RoleIdEnum.BOARD_OFFICER.toString() === roleid.toString()) {
          this.isMbo = true;
        } else if (RoleIdEnum.HEAD_OFFICE_DOCTOR.toString() === roleid.toString()) {
          this.isHoDoctor = true;
        } else if (RoleIdEnum.CSR.toString() === roleid.toString()) {
          this.isCSR = true;
        }
        // else if (RoleIdEnum.WORK_INJURIES_OCUPATIONAL_DISEASES_DOCTOR.toString() === roleid.toString()) {
        //   this.isGosiDoctor = true;
        // }
        else if (RoleIdEnum.MEDICAL_SERVICES_DEPARTMENT_MANAGER.toString() === roleid.toString()) {
          this.isMbManager = true;
        }
      });
    }
  }
  /**
   *
   * rejectInjury Route while rejecting an injury
   */
  rejectInjury() {
    if (
      !this.injury.rejectionAllowedIndicator &&
      (this.injury.injuryStatus.english === InjuryStatus.CURED_WITHOUT_DISABILITY ||
        this.injury.injuryStatus.english === InjuryStatus.CURED_WITH_DISABILITY ||
        this.injury.injuryStatus.english === InjuryStatus.CLOSED_WITHOUT_CONTINUING_TREATMENT ||
        this.injury.injuryStatus.english === InjuryStatus.RESULTED_IN_DEATH ||
        this.injury.injuryStatus.english === InjuryStatus.APPROVED)
    ) {
      this.showModal(this.errorTemplate, 'lg');
      this.errorMessage = 'OCCUPATIONAL-HAZARD.OPEN_COMPLICATION_REJECT_ERROR';
      this.modalHeader = 'OCCUPATIONAL-HAZARD.INJURY.REJECT-INJURY-TRANSACTION';
    } else if (
      this.injury.hasPendingChangeRequest &&
      (this.injury.injuryStatus.english === InjuryStatus.CURED_WITHOUT_DISABILITY ||
        this.injury.injuryStatus.english === InjuryStatus.CURED_WITH_DISABILITY ||
        this.injury.injuryStatus.english === InjuryStatus.CLOSED_WITHOUT_CONTINUING_TREATMENT)
    ) {
      this.showModal(this.errorTemplate, 'lg');
      this.errorMessage = 'OCCUPATIONAL-HAZARD.REOPEN_IN_PROGRESS_INJURY';
      this.modalHeader = 'OCCUPATIONAL-HAZARD.INJURY.REJECT-INJURY-TRANSACTION';
    } else if (this.injury.hasPendingChangeRequest && this.injury.injuryStatus.english === InjuryStatus.APPROVED) {
      this.showModal(this.errorTemplate, 'lg');
      this.errorMessage = 'OCCUPATIONAL-HAZARD.MODIFY_IN_PROGRESS_INJURY';
      this.modalHeader = 'OCCUPATIONAL-HAZARD.INJURY.REJECT-INJURY-TRANSACTION';
    } else if (
      !this.injury.rejectionAllowedIndicator &&
      !this.injury.hasPendingChangeRequest &&
      (this.injury.injuryStatus.english === InjuryStatus.CURED_WITHOUT_DISABILITY ||
        this.injury.injuryStatus.english === InjuryStatus.CURED_WITH_DISABILITY)
    ) {
      this.showModal(this.errorTemplate, 'lg');
      this.errorMessage = 'OCCUPATIONAL-HAZARD.ERR-PROHIBIT-REJECT';
      this.modalHeader = 'OCCUPATIONAL-HAZARD.INJURY.REJECT-INJURY-TRANSACTION';
    } else {
      this.ohService.setNavigation('rejectByOh');
      this.router.navigate(
        [`home/oh/injury/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/reject`],
        {
          queryParams: {
            type: 'injury'
          }
        }
      );
    }
  }
  /**
   * Method to Set RegistrationNo,InjuryId ans SIN to Ohservice
   */
  setServiceVariables() {
    this.ohService.setRegistrationNo(this.registrationNo);
    this.ohService.setInjuryId(this.injuryId);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
  }
  /**
   * Event while clicking modify button
   */
  modifyInjuryTransaction() {
    this.setServiceVariables();
    if (this.injury.hasRejectionInProgress) {
      this.showModal(this.errorTemplate, 'lg');
      this.errorMessage = 'OCCUPATIONAL-HAZARD.REJECTION_ERROR';
      this.modalHeader = 'OCCUPATIONAL-HAZARD.MODIFY-INJURY-TRANSACTION';
    } else if (
      !this.injury.hasRejectionInProgress &&
      this.injury.hasPendingChangeRequest &&
      this.injury.injuryStatus.english === InjuryStatus.APPROVED
    ) {
      this.showModal(this.errorTemplate, 'lg');
      this.errorMessage = 'OCCUPATIONAL-HAZARD.MODIFY_IN_PROGRESS_INJURY';
      this.modalHeader = 'OCCUPATIONAL-HAZARD.MODIFY-INJURY-TRANSACTION';
    } else if (this.injury.hasPendingChangeRequest && this.injury.injuryStatus.english === InjuryStatus.APPROVED) {
      this.showModal(this.errorTemplate, 'lg');
      this.errorMessage = 'OCCUPATIONAL-HAZARD.REOPEN_IN_PROGRESS_INJURY';
      this.modalHeader = 'OCCUPATIONAL-HAZARD.MODIFY-INJURY-TRANSACTION';
    } else {
      this.router.navigate([`home/oh/injury/modify`]);
    }
  }
  onEventChange(value: Date) {
    this.fullyFilled = false;
    this.unavailableArray.forEach(item => {
      if (convertToYYYYMMDD(item.toString()) === convertToYYYYMMDD(value.toString())) {
        this.fullyFilled = true;
      }
    });
    // this.sessionFilter.listOfDoctorType = [{ english: 'Visiting Doctor', arabic: '' }];
    if (value) {
      this.passedDate = convertToYYYYMMDD(value.toString());
      this.getIndividualSessionDetails(this.passedDate, this.sessionRequest);
    }
  }
  BindAssessmentTime(value: LovStatus) {
    if (this.isAppPrivate) {
      this.assessmentSlotSequence = value.sequence;
      this.assessmentSession = value.code;
      this.sessionnumber = value.code;
      this.virtual = value.channel;
      const status = value?.status;
      if (status.english === 'Hold' || status.arabic === 'معلق') {
        this.onHold = true;
      } else {
        this.onHold = false;
      }
    } else {
      this.assessmentSlotSequence = value.sequence;
      this.assessmentSession = value.code;
      this.sessionnumber = value.code;
      this.virtual = value.channel;
    }
  }
  getLocation(value: BilingualText) {
    this.sessionRequest.filter.fieldOffice = [];
    this.sessionRequest.filter.fieldOffice.push(value);
    // this.sessionFilter.specialty=[{english: 'Anesthesia', arabic: 'التخدير'
    // }]
    // this.sessionRequest.filter = this.sessionFilter;
  }
  getIndividualSessionDetails(selectedDate: string, sessionRequest?: SessionRequest) {
    this.sessionCalendarService.getRescheduleDateSessionDetails(selectedDate, sessionRequest).subscribe(
      res => {
        this.individualSessionEvents = res;
        this.isNoSessions = false;
        if (this.individualSessionEvents?.length === 0) this.isNoSessions = true;
        if (!this.fullyFilled) {
          this.isDisabled = false;
          this.sessionTimeList = new LovList([]);
          const sessionTimeList = new LovList([]);
          const lovarr: LovStatus[] = [];
          this.individualSessionEvents.forEach((item, index) => {
            this.setList = true;
            if (item.maximumBeneficiaries !== item.noOfParticipants) {
              item.sessionSlotDetails.forEach((res, j) => {
                const arabicchannel = item.channel.arabic;
                const englishchannel = item.channel.english;
                if (res.isSlotsFilled) {
                  const sessionTime = res.slotTime.english;
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
                  lovarr.forEach(item => {
                    if (sessionTime === item.value.english) {
                      this.setList = false;
                    }
                  });
                  if (this.setList) {
                    {
                      lovarr.push({
                        sequence: res.slotSequence,
                        value: { english: sessionTime, arabic: arabicTime },
                        code: item.sessionId,
                        status: item?.status,
                        channel: { english: arabicchannel, arabic: englishchannel }
                      });
                    }
                  }
                  sessionTimeList.items = lovarr;
                }
              });
            } else {
              const arabicchannel = item.channel.arabic;
              const englishchannel = item.channel.english;
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
              lovarr.forEach(item => {
                if (sessionTime === item.value.english) {
                  this.setList = false;
                }
              });
              if (this.setList) {
                {
                  lovarr.push({
                    sequence: item.sessionSlotDetails[0].slotSequence,
                    value: { english: sessionTime, arabic: arabicTime },
                    code: item.sessionId,
                    status: item?.status,
                    channel: { english: arabicchannel, arabic: englishchannel }
                  });
                }
              }
              sessionTimeList.items = lovarr;
            }
          });
          this.sessionTimeList = sessionTimeList;
        } else {
          {
            this.sessionTimeList = new LovList([]);
            const lovarr: LovStatus[] = [];
            const sessionTimeList = new LovList([]);
            this.individualSessionEvents.forEach((item, index) => {
              const arabicchannel = item.channel.arabic;
              const englishchannel = item.channel.english;
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
                code: item.sessionId,
                status: item?.status,
                channel: { english: arabicchannel, arabic: englishchannel }
              });
              sessionTimeList.items = lovarr;
            });
            this.sessionTimeList = sessionTimeList;
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

  getCurrentMonthDetails(currentMonth: number, currentYear: number, sessionRequest?: SessionRequest) {
    this.sessionCalendarService.getRescheduleSessionDetails(currentMonth, currentYear, sessionRequest).subscribe(
      res => {
        this.sessionCalendar = res;

        this.availableArray = [];
        this.unavailableArray = [];

        if (!this.sessionCalendar?.sessionForLocSpecEndDate || !this.sessionCalendar?.sessionForLocSpecStartDate) {
          this.noSessionscalendar = true;
          // this.minDate = new Date();
          this.maxDate = new Date();
          this.noSessions = true;
        }
        // else if (moment(new Date(this.sessionCalendar?.sessionForLocSpecEndDate.gregorian)).diff(new Date()) < 0)
        // this.minDate = new Date();
        // else if (moment(new Date()).month() + 1 - currentMonth == 0)
        //   this.minDate = moment(this.sessionCalendar?.sessionForLocSpecStartDate.gregorian).toDate();
        this.getSystemRunDate();
        this.maxDate = moment(this.sessionCalendar?.sessionForLocSpecEndDate.gregorian).toDate();
        if (this.sessionCalendar?.sessionForLocSpecEndDate || this.sessionCalendar?.sessionForLocSpecStartDate) {
          this.noSessionscalendar = false;
        }

        if (this.sessionCalendar.sessionDetails) {
          this.sessionCalendar?.sessionDetails?.forEach(item => {
            if (item.isSlotsAvailable == true && item.dateString > this.selectedDate) {
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
  getDisabiltyAssessmentDetails(mbAssessmentRequestId: number) {
    if (this.appToken === ApplicationTypeEnum.PRIVATE || this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.identitynumber = this.identifier;
    } else {
      this.identitynumber = this.nin;
    }
    this.medicalBoardService.getDisabilityDetails(this.identitynumber, mbAssessmentRequestId).subscribe(
      res => {
        this.disabilityDetailsMedical = res;
        if (this.disabilityDetailsMedical?.specialtyList) {
          this.disabilityDetailsMedical?.specialtyList.forEach(items => {
            this.sessionRequest?.filter?.specialty.push(items.specialty);
            items?.subSpecialty?.forEach(res => {
              this.sessionRequest?.filter?.subSpecialty.push({
                english: res.english,
                arabic: res.arabic
              });
            });
          });
        }
      },
      err => {
        this.alertService.showError(err.error?.message);
      }
    );
  }
  onDateChange(value: Date) {
    this.selectedMonth = value.getMonth() + 1;
    this.selectedYear = value.getFullYear();
    this.getCurrentMonthDetails(this.selectedMonth, this.selectedYear, this.sessionRequest);
  }

  /**
   * Event while clicking Reopen button
   */
  reopenInjuryTransaction() {
    this.setServiceVariables();
    if (!this.isAppPrivate && this.isEstClosed) {
      this.language.subscribe(language => {
        this.lang = language;
        if (this.lang === 'ar') {
          this.statusEst = this.establishment.status.arabic;
        } else {
          this.statusEst = this.establishment.status.english;
        }
      });
      this.showModal(this.errorTemplate, 'lg');
      this.errorMessage = 'OCCUPATIONAL-HAZARD.PROHIBIT-REOPEN-INJURY';
      this.modalHeader = 'OCCUPATIONAL-HAZARD.REOPEN-INJURY-TRANSACTION';
    } else {
      if (this.injury.hasRejectionInProgress) {
        this.showModal(this.errorTemplate, 'lg');
        this.errorMessage = 'OCCUPATIONAL-HAZARD.ERR-PROHIBIT-REJECT';
        this.modalHeader = 'OCCUPATIONAL-HAZARD.REOPEN-INJURY-TRANSACTION';
      } else if (
        this.injury.injuryStatus.english === InjuryStatus.REJECTED &&
        (this.injury.hasRejectedComplication || this.injury.reopenAllowedIndicator === false)
      ) {
        if (this.injury.hasRejectedComplication && this.appToken === ApplicationTypeEnum.PUBLIC) {
          this.showModal(this.errorTemplate, 'lg');
          this.errorMessage = 'OCCUPATIONAL-HAZARD.ERR-LIMIT-REJECT';
          this.modalHeader = 'OCCUPATIONAL-HAZARD.REOPEN-INJURY-TRANSACTION';
        } else if (this.injury.hasPendingChangeRequest === true) {
          this.showModal(this.errorTemplate, 'lg');
          this.errorMessage = 'OCCUPATIONAL-HAZARD.REOPEN_IN_PROGRESS_INJURY';
          this.modalHeader = 'OCCUPATIONAL-HAZARD.REOPEN-INJURY-TRANSACTION';
        } else if (this.injury.hasRejectedComplication && this.appToken === ApplicationTypeEnum.PRIVATE) {
          this.showModal(this.errorTemplate, 'lg');
          this.dismissible = true;
          this.errorMessage = 'OCCUPATIONAL-HAZARD.INFO-LIMIT-REJECT';
          this.modalHeader = 'OCCUPATIONAL-HAZARD.REOPEN-INJURY-TRANSACTION';
        } else if (!this.injury.reopenAllowedIndicator && this.appToken === ApplicationTypeEnum.PUBLIC) {
          this.showModal(this.errorTemplate, 'lg');
          this.errorMessage = 'OCCUPATIONAL-HAZARD.ERR-PROHIBIT-REOPEN';
          this.modalHeader = 'OCCUPATIONAL-HAZARD.REOPEN-INJURY-TRANSACTION';
        } else {
          this.router.navigate([`home/oh/injury/reopen`]);
        }
      } else if (this.injury.injuryStatus.english === InjuryStatus.CLOSED_WITHOUT_CONTINUING_TREATMENT) {
        if (this.injury.hasRejectionInProgress) {
          this.showModal(this.errorTemplate, 'lg');
          this.errorMessage = 'OCCUPATIONAL-HAZARD.ERR-PROHIBIT-REOPEN';
          this.modalHeader = 'OCCUPATIONAL-HAZARD.REOPEN-INJURY-TRANSACTION';
        } else if (this.injury.hasPendingChangeRequest) {
          this.showModal(this.errorTemplate, 'lg');
          this.errorMessage = 'OCCUPATIONAL-HAZARD.REOPEN_IN_PROGRESS_INJURY';
          this.modalHeader = 'OCCUPATIONAL-HAZARD.REOPEN-INJURY-TRANSACTION';
        } else {
          this.router.navigate([`home/oh/injury/reopen`]);
        }
      } else {
        this.router.navigate([`home/oh/injury/reopen`]);
      }
    }
  }

  onLocationListModified(value: BilingualText) {
    this.sessionRequest.filter.fieldOffice = [];
    this.sessionRequest.filter.fieldOffice.push(value);
    this.selectedMonth = moment(new Date()).toDate().getMonth() + 1;

    this.selectedYear = moment(new Date()).toDate().getFullYear();
    this.getCurrentMonthDetails(this.selectedMonth, this.selectedYear, this.sessionRequest);
  }
  /** Method to get Assessment Details */
  getAssessment() {
    // if (this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE) {
    //   this.ohService.assessmentidentity$.subscribe(data => {
    //     this.identityno = data;
    //     this.identitynumber = this.identityno;
    //   });
    if (this.appToken === ApplicationTypeEnum.PRIVATE || this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.identitynumber = this.identifier;
    } else {
      this.identitynumber = this.nin;
    }
    this.assessmentService.getAssessmentDetails(this.identitynumber).subscribe(res => {
      this.assessment = res;
      this.getDisabiltyAssessmentDetails(this.assessment[0].assessmentRequestId);
      this.invitenumber = this.assessment[0].inviteeId;
      this.locationamb = this.assessment[0].location;
      if (this.assessment[0].medicalBoardType.english === 'Appeal Medical Board') {
        this.getOfficeListsmB();
      } else {
        this.getOfficeLists();
      }
    });
  }
  getOfficeListsmB() {
    const location = this.locationamb;
    this.fieldOfficeList$ = this.transformBilingualtoLov(location);
  }
  getOfficeLists() {
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
  transformBilingualtoLov(bilingualText: BilingualText): Observable<LovList> {
    const lov: Lov = {
      value: bilingualText,
      sequence: 1,
      items: [],
      disabled: false
    };
    const lovlist: LovList = new LovList([lov]);
    return new Observable(observer => {
      observer.next(lovlist);
      observer.complete();
    });
  }
  confirmInvitation(assessment) {
    this.alertService.clearAlerts();
    this.hideassessmentModal();
    this.assessmentService.acceptAssessmentInvite(assessment.sessionId, assessment.inviteeId).subscribe(
      res => {
        this.responseConfirm = res;
        this.alertService.showSuccess(res);
        this.getAssessment();
      },
      err => {
        this.showError(err);
      }
    );
  }
  confirmrescheduleInvitation() {
    this.alertService.clearAlerts();
    this.finalCancelreschedule();
    this.assessmentService.acceptAssessmentRescheduleInvite(this.sessionnumber, this.invitenumber).subscribe(
      res => {
        this.responseConfirm = res;
        this.alertService.showSuccess(res);
        this.getAssessment();
      },
      err => {
        this.showError(err);
      }
    );
  }
  /*
   * This method is to trigger hide modal
   */
  hideassessmentModal() {
    if (this.modalRef) this.modalRef.hide();
  }
  hiderescheduleModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
  finalCancelreschedule() {
    if (this.modalRef) this.modalRef.hide();
  }
  /**
   * Method to show modal
   * @param template
   */
  showModal(modalRef: TemplateRef<HTMLElement>, size?: string): void {
    const config = {};
    if (size) {
      Object.assign(config, { class: 'modal-' + size });
    }
    this.bsModalRef = this.bsModalService.show(modalRef, config);
  }
  /** Method to show modal. */
  /** This method is to trigger show modal event
   * @param template
   */
  showModalAccept(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  showreschedule(eventData: any): void {
    const temp = eventData.temp;
    const assessmentreschedule = eventData.medicalAssessmentreschedule;
    this.assessment = assessmentreschedule;
    this.alertService.clearAlerts();
    this.noSessions = false;
    this.onHold = false;
    this.noSessionscalendar = false;
    this.modalRef = this.modalService.show(temp, assessmentreschedule);
  }
  showModalReschedule(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  /**
   * Method to cancel the transaction
   */
  clearModal() {
    this.bsModalRef.hide();
    if (this.dismissible) {
      this.router.navigate([`home/oh/injury/reopen`]);
    }
  }

  getPreviousDisability() {
    /**
     * as discussed with anjana is mbo should be true for both csr and mbo
     */
    this.isMbo = this.isMbo ? true : this.isCSR ? true : false;
    this.medicalboardAssessmentService
      .getPreviousDisability(
        this.identitynumber,
        null,
        null,
        null,
        {
          isContributor: this.isContributor,
          isMbo: this.isMbo,
          isHoDoctor: this.isHoDoctor,
          isMbManager: this.isMbManager
        },
        this.injuryId ? this.injuryId : this.injury.injuryId
      )
      .subscribe(res => {
        this.previousDisabilityDetails = res;
       if( this.previousDisabilityDetails?.data.find(value => value?.canAppeal || value?.canAccept)) {
        this.infoNeeded = true;
       }
        if (this.previousDisabilityDetails) this.injuryAccordianView(); // accordian view for only injury details
        // this.totalItems = res.count;
      });
  }
  viewAssessmentById(data: AssessmentData) {
    this.coreAdjustmentService.identifier = this.personId;
    this.coreAdjustmentService.socialNumber = this.socialInsuranceNo;
    this.coreBenefitService.injuryId = this.injuryId;
    this.coreBenefitService.regNo = this.registrationNo;
    this.disabilityAssessmentService.disabilityAssessmentId = data.assessmentId;
    this.disabilityAssessmentService.disabilityType = data.disabilityType;
    this.disabilityAssessmentService.contractDoctor = false;
    this.disabilityAssessmentService.assessmentTypes = data?.assessmentType;
    this.disabilityAssessmentService.benefitReqId = data?.benefitReqId;
    this.disabilityAssessmentService.referenceNo = data?.referenceNo;
    this.router.navigate([AssessmentConstants.ROUTE_VIEW_ASSESSMENT]);
  }
  navigateToApppeal(assessment: AssessmentData) {
    // this.disabilityAssessmentService.socialInsuranceNo = this.socialInsuranceNo;
    if (!this.injuryId) {
      this.activatedRoute.paramMap.subscribe(res => {
        this.registrationNo = parseInt(res.get('registrationNo'), 10);
        this.socialInsuranceNo = parseInt(res.get('socialInsuranceNo'), 10);
        this.injuryId = parseInt(res.get('injuryId'), 10);
        this.ohService.setRegistrationNo(this.registrationNo);
        this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
        this.medicalboardAssessmentService.disabilityAssessmentId = assessment.assessmentId;
        this.ohService.setDisabilityType(assessment.assessmentType.english);
        this.ohService.setIdentifier(this.identitynumber);
        this.ohService.setAppealDate(assessment.daysCompleted);
        this.ohService.setIsComplication(false);
        this.ohService.setIsHoWorkitem(false);
        this.ohService.setStatusCode(assessment?.statusCode);
        if (assessment?.canWithdraw && !assessment?.canAppeal) {
          this.medicalboardAssessmentService.isWithdraw = assessment?.canWithdraw;
        }
      });
    } else {
      this.medicalboardAssessmentService.disabilityAssessmentId = assessment.assessmentId;
      this.ohService.setRegistrationNo(this.registrationNo);
      this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
      this.ohService.setInjuryId(this.injuryId);
      this.ohService.setDisabilityType(assessment.assessmentType.english);
      this.ohService.setIdentifier(this.identitynumber);
      this.ohService.setIsComplication(false);
      this.ohService.setAppealDate(assessment.daysCompleted);
      this.ohService.setIsHoWorkitem(false);
      this.ohService.setStatusCode(assessment?.statusCode);
      if (assessment?.canWithdraw && !assessment?.canAppeal) {
        this.medicalboardAssessmentService.isWithdraw = assessment?.canWithdraw;
      }
    }

    this.router.navigate([RouteConstants.ROUTE_INJURY_APPEAL]);
  }
  //For Routing to Early Reassessment
  navigateToEarlyReassessment(assessment: AssessmentData) {
    this.setUser();
    this.getNinIqamaGccId();
    this.personId = this.contributor?.person?.personId;
    this.socialInsuranceNo = this.socialInsuranceNo;
    this.isContributor = this.isContributor;
    this.isMbo = this.isMbo;
    const Participant = {
      ...assessment,
      socInsNo: this.socialInsuranceNo,
      isContributor: this.isContributor,
      isMBO: this.isMbo,
      identitynumber: this.identifier,
      personId: this.personId
    };
    this.ohService.setParticipantdetails(Participant);
    this.router.navigate([RouteConstants.ROUTE_EARLY_REASSESSMENT_CONTRIBUTOR]);
  }
  navigateToAppealHistory(assessment: AssessmentData) {
    if (!this.injuryId) {
      this.activatedRoute.paramMap.subscribe(res => {
        this.registrationNo = parseInt(res.get('registrationNo'), 10);
        this.socialInsuranceNo = parseInt(res.get('socialInsuranceNo'), 10);
        this.injuryId = parseInt(res.get('injuryId'), 10);
        this.ohService.setRegistrationNo(this.registrationNo);
        this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
        this.ohService.setDisablilityAssessmentId(assessment.assessmentId);
        this.ohService.setAssessmentRequestId(assessment.mbAssessmentReqId);
        this.ohService.setIdentifier(this.identitynumber);
        this.ohService.setIsComplication(false);
      });
    } else {
      this.ohService.setAssessmentRequestId(assessment.mbAssessmentReqId);
      this.ohService.setDisablilityAssessmentId(assessment.assessmentId);
      this.ohService.setRegistrationNo(this.registrationNo);
      this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
      this.ohService.setInjuryId(this.injuryId);
      this.ohService.setIdentifier(this.identitynumber);
      this.ohService.setIsComplication(false);
    }
    this.router.navigate([RouteConstants.ROUTE_INJURY_APPEAL_INFO]);
  }
  getNinIqamaGccId() {
    this.primaryIdentity =
      this.contributor?.person?.identity != null
        ? getIdentityByType(this.contributor.person.identity, this.contributor.person.nationality.english)
        : null;
    this.identifier = this.primaryIdentity !== null ? this.primaryIdentity.id : this.socialInsuranceNo;
    // this.getAllowance();
  }
  viewAcceptModal(assessment: AssessmentData) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${'xl'} modal-dialog-centered` };
    // , class: `modal-${'xl'} modal-dialog-centered`
    this.heading = 'BENEFITS.CONFIRM-SUBMIT';
    this.modalRef = this.modalService.show(this.confirmSubmit, config);
    this.acceptConEntitlement = {
      assessmentId: assessment.assessmentId,
      occBenefitId: assessment?.occBenefitId,
      sin: this.socialInsuranceNo
    };
    this.alertService.clearAllErrorAlerts();
    this.acceptDisbId = assessment.assessmentId;
    this.authenticatedOtp = false;
    this.successOTPMessage = new BilingualText();
  }
  decline() {
    this.modalRef.hide();
  }
  continueAccept() {
    //reverted the old api call due to business change
    this.modalRef.hide();
    this.medicalboardAssessmentService.appealAccept(this.identitynumber, this.acceptDisbId).subscribe(
      res => {
        if (this.modalRef) {
          this.modalRef.hide();
        }
        this.successMessage = res;
        this.getPreviousDisability();
        this.alertService.showSuccess(this.successMessage, null, 10);
      },
      err => this.alertService.showError(err?.err?.message)
    );
    // this.medicaAssessmentService
    //   .acceptContinueEntitlement(
    //     this.acceptConEntitlement?.sin,
    //     this.acceptConEntitlement?.occBenefitId,
    //     this.acceptConEntitlement?.assessmentId
    //   )
    //   .subscribe(
    //     res => {
    //       if (this.modalRef) this.modalRef?.hide();
    //       this.successMessage = res;
    //       this.getPreviousDisability();
    //       this.alertService.showSuccess(this.successMessage, null, 10);
    //     },
    //     err => {
    //       if (this.modalRef) this.modalRef?.hide();
    //       this.alertService.showError(err?.error?.message);
    //     }
    //   );
  }

  injuryAccordianView() {
    this.previousDisabilityDetails.data = this.previousDisabilityDetails?.data?.filter(forInjury => {
      return (
        (forInjury?.assessmentType?.english === 'Occupational Disability' ||
          forInjury.assessmentType.english === 'Occupational Disability Reassessment' ||
          forInjury.assessmentType.english === 'Reassessment Occupational Disability') &&
        forInjury?.ohType === 0
      );
    });
  }
  viewPaymentReqId(assessment: AssessmentData) {
    this.getNinIqamaGccId();
    const paymentAssessmentId = assessment.mbAssessmentReqId;
    this.getAllowance(paymentAssessmentId);
  }
  getAllowance(paymentAssessmentId?) {
    this.medicaAssessmentService.getAllowanceDetails(this.identifier, paymentAssessmentId).subscribe(
      res => {
        this.mbAllowanceDto = res;
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  forOTPAuthentication() {
    this.authenticationList = new LovList([
      { value: { english: 'OTP', arabic: '' }, sequence: 0, code: 10001 },
      { value: { english: 'Document', arabic: '' }, sequence: 1, code: 10002 }
    ]);
    // form to create radio button
    this.radioFormControl = this.fb.group({
      authMethod: this.fb.group({
        english: ['OTP', Validators.required],
        arabic: [null]
      })
    });
    this.otpForm = this.fb.group({ otp: [null, { validators: Validators.required }] });
  }
  selectRadio(value) {
    value === 'OTP'
      ? ((this.showOTPField = true), (this.showDocumentField = false))
      : ((this.showDocumentField = true),
        this.getAuthenticationDocList(),
        (this.giveOTPData = false),
        (this.showOTPField = false));
  }
  reSendOtp() {
    this.clearAlert();
    if (this.noOfIncorrectOtp === 3) {
      this.setError(this.MaxEntriedReached);
      this.disabledOTP = true;
    } else {
      this.noOfIncorrectOtp += 1;
      this.otpForm.get('otp').reset();
      this.generateOTP();
    }
  }
  /** Check if the resend has exceeded the defined limit. */
  hasRetriesExceeded() {
    if (this.noOfIncorrectOtp === 3) {
      this.setError(this.MaxEntriedReached);
    }
  }

  repatriationTransaction() {
    if(this.repatriationCompleted) {
      this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.REPATRIATION-ERROR');
      scrollToTop();
    } else if(this.repatriationInProgress) {
      this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.REPATRIATION-INPROGRESS-ERROR');
      scrollToTop();
    } else {
      this.router.navigate([`home/oh/injury/repatriation`]);
    }
  }

  /** This method is to set error messages. */
  setError(messageKey: string) {
    this.showOtpErrorMsg = messageKey;
    this.showOtpFlag = true;
  }
  /** Method to Clear alerts when otp error is null. */
  clearAlert() {
    this.showOtpFlag = false;
  }
  // generateOTP() {
  // }
  generateOTP() {
    // this.medicalboardAssessmentService.getOTPValidation(this.identifier).subscribe(
    //   res => {
    //     this.otpResponse = res;
    //     this.otpResponse ? (this.isValidOTP = true) : (this.isValidOTP = false);
    //   },
    //   err => {
    //     scrollToTop();
    //     this.stringAuthentication = err?.error?.fault ? err.error.fault.faultstring : err?.error.message;
    //   }
    // );
    if (this.successOTPMessage?.english) {
      this.authenticatedOtp = true;
    } else {
      this.giveOTPData = true;
      this.medicalboardAssessmentService.getOTPValidation(this.identifier).subscribe(
        res => {
          this.otpResponse = res;
        },
        err => {
          if (err?.status === 401) {
            this.uuid = err['error']['uuid'];
            this.isValidOTP = true;
          } else {
            this.isValidOTP = false;
            this.errorRes = err['error']['message'];
          }
        }
      );
    }
  }
  verifyOTP() {
    const otpValue = this.otpForm.get('otp').value;
    this.xOtp = this.uuid + ':' + otpValue;
    this.medicalboardAssessmentService.verifyOTP(this.identifier, this.xOtp).subscribe(
      data => {
        this.successOTPMessage = data;
        data
          ? ((this.isValidOTP = true),
            (this.giveOTPData = false),
            (this.showOTPField = false),
            this.alertService.showSuccess(this.otpResponse),
            scrollToTop())
          : (this.isValidOTP = false);
        this.alertService.clearAlerts();
      },
      err => this.alertService.showError(err?.error?.message)
    );
  }
  confirmCancel() {
    this.showOTPField = false;
  }
  cancelTransaction() {
    this.modalRef ? this.modalRef?.hide() : null;
  }
  checkOtpDocValidation() {
    if (this.isMbo || this.isCSR) {
      if (this.showDocumentField) {
        // if (this.documentScanList.filter(item => item?.required).every(doc => doc?.documentContent !== null)) {
        //   this.continueAccept();
        // } else {
        //   this.documentScanList.forEach((item: DocumentItem, index) => {
        //     item?.required && item?.documentContent == null ? (this.documentScanList[index].uploadFailed = true) : null;
        //   });
        //   this.showMandatoryDocErrorMessage(true);
        // }
        this.continueAccept();
      } else if (this.isValidOTP) {
        this.continueAccept();
      } else {
        if (this.modalRef) this.modalRef.hide();
        scrollToTop();
        scrollToModalError();
        this.alertService.showError(this.authenticationErrorMessage);
      }
    } else {
      this.continueAccept();
    }
  }
  getAuthenticationDocList() {
    this.documentList$ = this.ohService.getReqDocEarlyReassessment('CONTINUE_WITH_ENTITLEMENT', 'MEDICAL_BOARD').pipe(
      map(documents => this.documentService.removeDuplicateDocs(documents)),
      catchError(error => of(error))
    );
    this.documentList$.subscribe((documents: DocumentItem[]) => {
      this.documentScanList = [];
      documents.forEach(items => {
        if (items) {
          items.canDelete = true;
          this.documentScanList.push(items);
        }
      });
    });
  }
  showFormValidation() {
    this.alertService.clearAlerts();
    this.alertService.showMandatoryErrorMessage();
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }
  //Method to handle pagination logic
  showMandatoryDocErrorMessage($event) {
    this.uploadFailed = $event;
    if (this.uploadFailed) {
      this.alertService.showErrorByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
    }
  }
  refreshDocument(document: DocumentItem) {
    this.documentService.refreshDocument(document, this.acceptDisbId).subscribe(res => (document = res));
  }
  getSystemRunDate() {
    this.calendarService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
      this.minimumDate = addDays(moment(this.systemRunDate.gregorian).toDate(), 1);
    });
  }
}
