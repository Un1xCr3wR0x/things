/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import {
  AlertService,
  DocumentService,
  ApplicationTypeToken,
  DocumentItem,
  ApplicationTypeEnum,
  AppConstants,
  StorageService,
  LanguageToken,
  AuthTokenService,
  BilingualText,
  Lov,
  LovList,
  MedicalAssessmentService,
  LookupService,
  CommonIdentity,
  LovStatus,
  getIdentityByType,
  convertToYYYYMMDD,
  CoreAdjustmentService,
  CoreBenefitService,
  RoleIdEnum,
  MedicalAssessment,
  AssessmentData,
  DisabilityData,
  MedicalboardAssessmentService,
  DisabilityDetails,
  MbAllowance,
  scrollToTop,
  scrollToModalError
} from '@gosi-ui/core';
import { ProcessType, InjuryStatus } from '../../shared/enums';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  DiseaseService
} from '../../shared/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OhBaseScComponent } from '../../shared/component/base/oh-base-sc.component';
import { catchError, map, tap } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  EventDetails,
  IndividualSessionEvents,
  SessionCalendar,
  SessionRequest,
  MedicalBoardService,
  SessionCalendarService,
  AssessmentConstants,
  DisabilityAssessmentService
} from '@gosi-ui/features/medical-board';
import moment from 'moment';
import { RouteConstants } from '../../shared';
import { TransactionSearchResponse } from '@gosi-ui/foundation-dashboard/lib/search/models';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/lib/search/services';

@Component({
  selector: 'oh-view-complication-sc',
  templateUrl: './view-complication-sc.component.html',
  styleUrls: ['./view-complication-sc.component.scss']
})
export class ViewComplicationScComponent extends OhBaseScComponent implements OnInit {
  // Common variables and methods are declared in the base component
  /*
   * Local variables
   */
  isValidatorView = true;
  paramValue: Params;
  complicationId: number;
  injuryId: number;
  tabView = false;
  registrationNo: number;
  sessionReg: string;
  socialInsuranceNo: number;
  complicationDocumentList: DocumentItem[] = [];
  bsModalRef: BsModalRef;
  infoMessage = '';
  modalHeading = '';
  statusEst: string;
  //reschedule
  virtual: BilingualText = new BilingualText();
  isAppPrivate = false;
  nin: number;
  assessment: MedicalAssessment[];
  responseConfirm: BilingualText;
  assessmentSlotSequence: number;
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
  identitynumber: number;
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
  minDate: Date;
  maxDate: Date;
  personId: number;
  primaryIdentity: CommonIdentity = new CommonIdentity();
  identifier: number;
  previousDisabilityDetails: DisabilityData;
  isContributor = false;
  isMbo = false;
  isHoDoctor = false;
  isGosiDoctor: boolean = false;
  isMbManager = false;
  heading: string;
  isAppealRoute = false;
  mbAllowanceDto: MbAllowance = new MbAllowance();
  @ViewChild('infoTemplate', { static: true })
  infoTemplate: TemplateRef<HTMLElement>;
  @ViewChild('confirmSubmit', { static: true })
  confirmSubmit: TemplateRef<HTMLElement>;
  successMessage: BilingualText;
  acceptDisbId: any;
  isCSR = false;
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
   * @param alertService
   * @param contributorService
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly assessmentService: MedicalAssessmentService,
    readonly lookupService: LookupService,
    readonly sessionCalendarService: SessionCalendarService,
    readonly medicalBoardService: MedicalBoardService,
    readonly storageService: StorageService,
    readonly contributorService: ContributorService,
    readonly fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly injuryService: InjuryService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly ohService: OhService,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    readonly bsModalService: BsModalService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    private disabilityAssessmentService: DisabilityAssessmentService,
    readonly medicalboardAssessmentService: MedicalboardAssessmentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location,
    readonly authTokenService: AuthTokenService,
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

  /**
   * Method for initialization tasks
   */
  ngOnInit() {
    super.ngOnInit();
    this.sessionReg = this.storageService.getSessionValue(AppConstants.ESTABLISHMENT_REG_KEY);
    this.selectedDate = convertToYYYYMMDD(moment(new Date()).toDate().toString());
    this.ohService.setNavigation(null);
    this.activatedRoute.queryParams.subscribe(params => {
      if (
        params.status === ProcessType.MODIFY ||
        params.status === ProcessType.REOPEN ||
        params.status === ProcessType.RE_OPEN ||
        params.status === 'modified' ||
        params.status === 'rejected'
      ) {
        this.hasModifyIndicator = true;
      }
    });
    this.setUser();
    this.forOTPAuthentication();
    this.registrationNo = this.ohService.getRegistrationNumber();
    this.socialInsuranceNo = this.ohService.getSocialInsuranceNo();
    this.injuryId = this.ohService.getInjuryNumber();
    this.ohService.setInjuryNumber(this.injuryId);
    this.complicationId = this.ohService.getComplicationId();
    this.isAppealRoute = this.ohService.getAppealRoute();
    if (!this.complicationId) {
      this.activatedRoute.paramMap.subscribe(res => {
        this.registrationNo = parseInt(res.get('registrationNo'), 10);
        this.socialInsuranceNo = parseInt(res.get('socialInsuranceNo'), 10);
        this.injuryId = parseInt(res.get('injuryId'), 10);
        this.injuryNumber = parseInt(res.get('injuryId'), 10);
        this.ohService.setInjuryNumber(this.injuryId);
        this.complicationId = parseInt(res.get('complicationId'), 10);
      });
    }
    if (!this.hasModifyIndicator) {
      if (this.isAppealRoute) {
        this.alertService.clearAllWarningAlerts();
        this.alertService.clearAllErrorAlerts();
      } else this.alertService.clearAlerts();
    }
    if (this.appToken !== ApplicationTypeEnum.INDIVIDUAL_APP) this.getEstablishment();
    this.getComplication();
    if (this.registrationNo && this.socialInsuranceNo) this.getContributorById();
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
  }
  /**
   *
   * rejectComplication Route while rejecting an injury
   */
  rejectComplication() {
    if (
      this.complication.hasPendingChangeRequest &&
      (this.complication.status.english === InjuryStatus.CURED_WITHOUT_DISABILITY ||
        this.complication.status.english === InjuryStatus.CURED_WITH_DISABILITY ||
        this.complication.status.english === InjuryStatus.CLOSED_WITHOUT_CONTINUING_TREATMENT)
    ) {
      this.showModal(this.infoTemplate, 'lg');
      this.infoMessage = 'OCCUPATIONAL-HAZARD.REOPEN_IN_PROGRESS_COMPLICATION';
      this.modalHeading = 'OCCUPATIONAL-HAZARD.COMPLICATION.REJECT-COMPLICATION-TRANSACTION';
    } else if (
      this.complication.hasPendingChangeRequest &&
      this.complication.status.english === InjuryStatus.APPROVED
    ) {
      this.showModal(this.infoTemplate, 'lg');
      this.infoMessage = 'OCCUPATIONAL-HAZARD.MODIFY_IN_PROGRESS_INJURY';
      this.modalHeading = 'OCCUPATIONAL-HAZARD.COMPLICATION.REJECT-COMPLICATION-TRANSACTION';
    } else {
      this.ohService.setNavigation('rejectByOh');
      this.ohService.setComplicationId(this.complicationId);
      this.router.navigate(
        [`home/oh/complication/${this.registrationNo}/${this.socialInsuranceNo}/${this.complicationId}/reject`],
        {
          queryParams: {
            type: 'complication'
          }
        }
      );
    }
  }

  /**
   * Metod to get the complication details
   */
  getComplication() {
    let modify = false;
    if (this.hasModifyIndicator) {
      modify = true;
    }
    const isChangeRequired = false;
    this.complicationService
      .getComplication(
        this.registrationNo,
        this.socialInsuranceNo,
        this.injuryId,
        this.complicationId,
        isChangeRequired
      )
      .pipe(
        tap(res => {
          this.complication = res.complicationDetailsDto;
          this.ohService.setComplicationstatus(this.complication.status);
          this.complication.injuryDetails.injuryTime =
            this.complication.injuryTime != null
              ? this.complication.injuryTime + ':' + this.complication.injuryDetails.injuryTime
              : null;
          this.injuryId = this.complication.injuryDetails.injuryId;
          this.engagementId = this.complication.engagementId;
        })
      )
      .subscribe(
        () => {
          this.documentService.getOldDocuments(this.complication.complicationId).subscribe(documentResponse => {
            this.complicationDocumentList = documentResponse.filter(item => item.documentContent !== null);
          });

          if (this.complication.isComplicationIsInInjuryEstablishment) {
            this.getInjury(false);
          }
          this.getPerson();
          if (this.appToken !== ApplicationTypeEnum.INDIVIDUAL_APP) this.getEngagement();
        },
        err => {
          this.showError(err);
        }
      );
  }

  setComplicationParams() {
    this.ohService.setRegistrationNo(this.complication.establishmentRegNo);
    this.ohService.setInjuryNumber(this.complication.injuryNo);
    this.ohService.setInjuryId(this.complication.injuryDetails.injuryId);
    this.ohService.setComplicationId(this.complication.complicationId);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
  }
  /**
   * Event while clicking modify button
   */
  modifyComplicationTransaction() {
    this.setComplicationParams();
    if (this.complication.hasRejectionInprogress) {
      this.showModal(this.infoTemplate, 'lg');
      this.infoMessage = 'OCCUPATIONAL-HAZARD.ERR-PROHIBIT-REJECT';
      this.modalHeading = 'OCCUPATIONAL-HAZARD.COMPLICATION.MODIFY-COMPLICATION-TRANSACTION';
    } else if (
      this.complication.hasPendingChangeRequest &&
      this.complication.status.english === InjuryStatus.APPROVED
    ) {
      this.showModal(this.infoTemplate, 'lg');
      this.infoMessage = 'OCCUPATIONAL-HAZARD.REOPEN_IN_PROGRESS_COMPLICATION';
      this.modalHeading = 'OCCUPATIONAL-HAZARD.COMPLICATION.MODIFY-COMPLICATION-TRANSACTION';
    } else {
      this.router.navigate([`home/oh/complication/modify`]);
    }
  }

  /**
   * Event while clicking REopen button
   */
  reopenComplicationTransaction() {
    this.setComplicationParams();
    if (!this.isAppPrivate && this.isEstClosed) {
      this.language.subscribe(language => {
        this.lang = language;
        this.statusEst = this.establishment.status.english;
        if (this.lang === 'ar') {
          this.statusEst = this.establishment.status.arabic;
        }
      });
      this.showModal(this.infoTemplate, 'lg');
      this.infoMessage = 'OCCUPATIONAL-HAZARD.PROHIBIT-REOPEN-COMPLICATION';
      this.modalHeading = 'OCCUPATIONAL-HAZARD.REOPEN-INJURY-TRANSACTION';
    } else {
      if (this.complication.hasRejectionInprogress) {
        this.showModal(this.infoTemplate, 'lg');
        this.infoMessage = 'OCCUPATIONAL-HAZARD.ERR-PROHIBIT-REJECT';
        this.modalHeading = 'OCCUPATIONAL-HAZARD.COMPLICATION.REOPEN-COMPLICATION-TRANSACTION';
      } else if (
        this.complication.status.english === InjuryStatus.REJECTED &&
        !this.complication.reopenAllowedIndicator &&
        (this.appToken === ApplicationTypeEnum.PUBLIC || this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP)
      ) {
        this.showModal(this.infoTemplate, 'lg');
        this.infoMessage = 'OCCUPATIONAL-HAZARD.ERR-PROHIBIT-REOPEN-COMPLICATION';
        this.modalHeading = 'OCCUPATIONAL-HAZARD.COMPLICATION.REOPEN-COMPLICATION-TRANSACTION';
      } else if (
        this.complication.injuryDetails.injuryStatus.english !== InjuryStatus.CURED_WITHOUT_DISABILITY &&
        this.complication.injuryDetails.injuryStatus.english !== InjuryStatus.CURED_WITH_DISABILITY
      ) {
        this.showModal(this.infoTemplate, 'lg');
        this.infoMessage = 'OCCUPATIONAL-HAZARD.PROHIBIT-REJECT-PARENTINJURY';
        this.modalHeading = 'OCCUPATIONAL-HAZARD.COMPLICATION.REOPEN-COMPLICATION-TRANSACTION';
      } else {
        this.router.navigate([`home/oh/complication/re-open`]);
      }
    }
  }

  /**
   * Method to navigate to injury view page
   * @param injuryId
   * @param complicationNumber
   */
  viewInjury(injury: number) {
    this.setComplicationParams();
    this.router.navigate([
      `home/oh/view/${this.complication.establishmentRegNo}/${this.socialInsuranceNo}/${injury}/injury/info`
    ]);
    this.alertService.clearAlerts();
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
  /**
   * Method to cancel the transaction
   */
  clearModal() {
    this.bsModalRef.hide();
  }
  //reschedule methods
  /** Method to show modal. */
  /** This method is to trigger show modal event
   * @param template
   */
  showModalAccept(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.bsModalService.show(template);
  }
  hideassessmentModal() {
    if (this.modalRef) this.modalRef.hide();
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
  showreschedule(eventData: any): void {
    const temp = eventData.temp;
    const assessmentreschedule = eventData.medicalAssessmentreschedule;
    this.assessment = assessmentreschedule;
    this.alertService.clearAlerts();
    this.noSessions = false;
    this.onHold = false;
    this.noSessionscalendar = false;
    this.modalRef = this.bsModalService.show(temp, assessmentreschedule);
  }
  getAssessment() {
    if ((this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE)) {
      this.identitynumber = this.identifier;
    } else {
      this.identitynumber = this.nin || this.authTokenService.getIndividual();
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
  getDisabiltyAssessmentDetails(mbAssessmentRequestId: number) {
    if ((this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE)) {
      this.identitynumber = this.identifier;
    } else {
      this.identitynumber = this.nin || this.authTokenService.getIndividual();
    }
    this.medicalBoardService.getDisabilityDetails(this.identitynumber, mbAssessmentRequestId).subscribe(
      res => {
        this.disabilityDetailsMedical = res;
        this.disabilityDetailsMedical.specialtyList.forEach(items => {
          this.sessionRequest.filter.specialty.push(items.specialty);
          items.subSpecialty.forEach(res => {
            this.sessionRequest.filter.subSpecialty.push({
              english: res.english,
              arabic: res.arabic
            });
          });
        });
      },
      err => {
        this.alertService.showError(err.error?.message);
      }
    );
  }
  showModalReschedule(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.bsModalService.show(template);
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
  finalCancelreschedule() {
    if (this.modalRef) this.modalRef.hide();
  }
  getContributorById() {
    this.contributorService
      .getContributor(
        this.ohService.getRegistrationNumber() || this.registrationNo,
        this.ohService.getSocialInsuranceNo() || this.socialInsuranceNo
      )
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
                      arTime[0] = arTime[0] + 'م';
                    }
                  } else if (arTime[0].indexOf('PM') >= 0) {
                    {
                      arTime[0] = arTime[0].replace('PM', '');
                      arTime[0] = arTime[0] + 'ص';
                    }
                  }
                  if (arTime[1].indexOf('AM') >= 1) {
                    {
                      arTime[1] = arTime[1].replace('AM', '');
                      arTime[1] = arTime[1] + 'م';
                    }
                  } else if (arTime[1].indexOf('PM') >= 1) {
                    {
                      arTime[1] = arTime[1].replace('PM', '');
                      arTime[1] = arTime[1] + 'ص';
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
                  arTime[0] = arTime[0] + 'م';
                }
              } else if (arTime[0].indexOf('PM') >= 0) {
                {
                  arTime[0] = arTime[0].replace('PM', '');
                  arTime[0] = arTime[0] + 'ص';
                }
              }
              if (arTime[1].indexOf('AM') >= 1) {
                {
                  arTime[1] = arTime[1].replace('AM', '');
                  arTime[1] = arTime[1] + 'م';
                }
              } else if (arTime[1].indexOf('PM') >= 1) {
                {
                  arTime[1] = arTime[1].replace('PM', '');
                  arTime[1] = arTime[1] + 'ص';
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
                  arTime[0] = arTime[0] + 'م';
                }
              } else if (arTime[0].indexOf('PM') >= 0) {
                {
                  arTime[0] = arTime[0].replace('PM', '');
                  arTime[0] = arTime[0] + 'ص';
                }
              }
              if (arTime[1].indexOf('AM') >= 1) {
                {
                  arTime[1] = arTime[1].replace('AM', '');
                  arTime[1] = arTime[1] + 'م';
                }
              } else if (arTime[1].indexOf('PM') >= 1) {
                {
                  arTime[1] = arTime[1].replace('PM', '');
                  arTime[1] = arTime[1] + 'ص';
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
          this.minDate = new Date();
          this.maxDate = new Date();
          this.noSessions = true;
        } else if (moment(new Date(this.sessionCalendar?.sessionForLocSpecEndDate.gregorian)).diff(new Date()) < 0)
          this.minDate = new Date();
        else if (moment(new Date()).month() + 1 - currentMonth == 0)
          this.minDate = moment(this.sessionCalendar?.sessionForLocSpecStartDate.gregorian).toDate();
        this.maxDate = moment(this.sessionCalendar?.sessionForLocSpecEndDate.gregorian).toDate();
        if (this.sessionCalendar?.sessionForLocSpecEndDate || this.sessionCalendar?.sessionForLocSpecStartDate) {
          this.noSessionscalendar = false;
        }

        if (this.sessionCalendar.sessionDetails) {
          this.sessionCalendar?.sessionDetails?.forEach(item => {
            if (item.isSlotsAvailable == true && item.dateString >= this.selectedDate) {
              const date = new Date(item.dateString);

              this.availableArray.push(date);
            } else {
              if (item.dateString >= this.selectedDate) {
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
  onLocationListModified(value: BilingualText) {
    this.sessionRequest.filter.fieldOffice = [];
    this.sessionRequest.filter.fieldOffice.push(value);
    this.selectedMonth = moment(new Date()).toDate().getMonth() + 1;

    this.selectedYear = moment(new Date()).toDate().getFullYear();
    this.getCurrentMonthDetails(this.selectedMonth, this.selectedYear, this.sessionRequest);
  }
  getLocation(value: BilingualText) {
    this.sessionRequest.filter.fieldOffice = [];
    this.sessionRequest.filter.fieldOffice.push(value);
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
  hiderescheduleModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
  getNinIqamaGccId() {
    this.primaryIdentity =
      this.contributor?.person?.identity != null
        ? getIdentityByType(this.contributor.person.identity, this.contributor.person.nationality.english)
        : null;
    this.identifier = this.primaryIdentity !== null ? this.primaryIdentity.id : this.socialInsuranceNo;
    // this.getAllowance();
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
        this.complicationId ? this.complicationId : this.complication?.complicationId
      )
      .subscribe(res => {
        this.previousDisabilityDetails = res;
        if( this.previousDisabilityDetails?.data.find(value => value?.canAppeal || value?.canAccept)) {
          this.infoNeeded = true;
         }
        if (this.previousDisabilityDetails) this.complicationAccordianView(); // accordian view for only complication details
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
        this.ohService.setIsComplication(true);
        this.ohService.setInjuryNumber(this.complication.injuryNo);
        // this.ohService.setInjuryId(this.complication.injuryDetails.injuryId);
        this.ohService.setComplicationId(this.complication.complicationId);
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
      this.ohService.setAppealDate(assessment.daysCompleted);
      this.ohService.setIsComplication(true);
      this.ohService.setInjuryNumber(this.complication.injuryNo);
      // this.ohService.setInjuryId(this.complication.injuryDetails.injuryId);
      this.ohService.setComplicationId(this.complication.complicationId);
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
        this.ohService.setIsComplication(true);
      });
    } else {
      this.ohService.setAssessmentRequestId(assessment.mbAssessmentReqId);
      this.ohService.setDisablilityAssessmentId(assessment.assessmentId);
      this.ohService.setRegistrationNo(this.registrationNo);
      this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
      this.ohService.setInjuryId(this.injuryId);
      this.ohService.setIdentifier(this.identitynumber);
      this.ohService.setIsComplication(true);
    }
    this.router.navigate([RouteConstants.ROUTE_INJURY_APPEAL_INFO]);
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
  viewAcceptModal(assessment: AssessmentData) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    // , class: `modal-${'xl'} modal-dialog-centered`
    this.heading = 'BENEFITS.CONFIRM-SUBMIT';
    this.modalRef = this.bsModalService.show(this.confirmSubmit, config);
    this.acceptDisbId = assessment.assessmentId;
    this.acceptConEntitlement = {
      assessmentId: assessment.assessmentId,
      occBenefitId: assessment?.occBenefitId,
      sin: this.socialInsuranceNo
    };
    this.alertService.clearAllErrorAlerts();
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
        if (this.modalRef) this.modalRef?.hide();
        this.successMessage = res;
        this.getPreviousDisability();
        this.alertService.showSuccess(this.successMessage, null, 10);
      },
      err => this.alertService.showError(err?.error?.message)
    );
    // this.medicalboardAssessmentService
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
    //     err => this.alertService.showError(err?.error?.message)
    //   );
  }

  complicationAccordianView() {
    this.previousDisabilityDetails.data = this.previousDisabilityDetails?.data?.filter(forComp => {
      return (
        (forComp?.assessmentType?.english === 'Occupational Disability' ||
          forComp.assessmentType.english === 'Reassessment Occupational Disability' ||
          forComp.assessmentType.english === 'Occupational Disability Reassessment') &&
        forComp?.ohType === 2
      );
    });
  }
  viewPaymentReqId(assessment: AssessmentData) {
    this.getNinIqamaGccId();
    const paymentAssessmentId = assessment.mbAssessmentReqId;
    this.getAllowance(paymentAssessmentId);
  }
  getAllowance(paymentAssessmentId?) {
    this.medicalboardAssessmentService.getAllowanceDetails(this.identifier, paymentAssessmentId).subscribe(
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

  /** This method is to set error messages. */
  setError(messageKey: string) {
    this.showOtpErrorMsg = messageKey;
    this.showOtpFlag = true;
  }
  /** Method to Clear alerts when otp error is null. */
  clearAlert() {
    this.showOtpFlag = false;
  }
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
  // verifyOTP() {
  //   this.medicalboardAssessmentService.getOTPValidation(this.identifier).subscribe(
  //     res => {
  //       this.otpResponse = res;
  //       this.otpResponse ? (this.isValidOTP = true) : (this.isValidOTP = false);
  //     },
  //     err => {
  //       scrollToTop();
  //       this.stringAuthentication = err?.error?.fault ? err.error.fault.faultstring : err?.error.message;
  //     }
  //   );
  // }
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
        scrollToTop();
        scrollToModalError();
        if (this.modalRef) this.modalRef.hide();
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
}
