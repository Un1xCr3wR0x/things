import { Component, OnInit, TemplateRef, Inject } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MBConstants, MbRouteConstants } from '../../../shared/constants';
import {
  ApplicationTypeToken,
  AlertService,
  BilingualText,
  ApplicationTypeEnum,
  AuthTokenService,
  RoleIdEnum,
  LovList,
  LookupService
} from '@gosi-ui/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  DoctorService,
  MemberService,
  SessionFilterRequest,
  SessionInvitationDetails,
  SessionInvitationWrapper
} from '../../../shared';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'mb-sessions-sc',
  templateUrl: './medical-board-session-sc.component.html',
  styleUrls: ['./medical-board-session-sc.component.scss']
})
export class MedicalBoardSessionScComponent implements OnInit {
  sessionCount: number;
  fieldOfficeList$: Observable<LovList>;
  professionalId: number;
  identificationNo: number;
  medicalTab = MBConstants.MB_SESSIONS;
  medicalBoardTabs = [];
  sessionfilter: SessionFilterRequest = new SessionFilterRequest();
  sessions: SessionInvitationWrapper;
  scheduledSessions: SessionInvitationWrapper;
  session = [
    {
      sessionDate: {
        gregorian: new Date('2020-11-21T00:00:00.000Z'),
        hijiri: '1442-04-06'
      },
      sessionID: 12345,
      status: { english: 'Scheduled', arabic: 'مجدول' },
      sessionStartTime: '9::00',
      sessionEndTime: '12::00',
      fee: 500,
      paymentStatus: { english: 'Not Paid', arabic: 'Not Paid' },
      transactionID: 1003126,
      type: { english: 'Regular', arabic: 'Regular' },
      channel: { english: 'GOSI Office', arabic: 'GOSI Office' },
      fieldOffice: { english: 'Riyadh', arabic: 'Riyadh' }
    },
    {
      startDate: {
        gregorian: new Date('2020-11-22T00:00:00.000Z'),
        hijiri: '1442-04-07'
      },
      sessionID: 11478,
      status: { english: 'Completed', arabic: 'منتهي' },
      startTime: '11::00',
      endTime: '13::00',
      fee: 550,
      paymentStatus: { english: 'Paid', arabic: 'Paid' },
      transactionID: 1003890,
      channel: { english: 'Virtual', arabic: 'Virtual' },
      type: { english: 'Regular', arabic: 'Regular' },
      fieldOffice: { english: 'Makkah', arabic: 'Makkah' }
    }
  ];
  modalRef: BsModalRef;
  responseConfirm: BilingualText;
  countInvitation = 0;
  isManagerLogin = false;
  statusList: LovList;
  isMbApp = false;

  constructor(
    private modalService: BsModalService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly doctorService: DoctorService,
    private fb: FormBuilder,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly memberService: MemberService,
    readonly authTokenService: AuthTokenService,
    readonly lookupService: LookupService
  ) {}

  ngOnInit(): void {
    if(this.appToken === ApplicationTypeEnum.MEDICAL_BOARD){this.isMbApp = true}
    this.route.parent.params.subscribe(params => {
      this.identificationNo = params?.identificationNo || this.authTokenService.getEstablishment();;
    });
    this.getAccountTabsetDetails();
    this.getInvitationDetails();
    this.getScheduledSessions();
    this.getUserRoles(); //To get role of a member (Manager or Officer)
    this.getOfficeLists();
    this.getMBSessionStatusType();
  }
  confirmWithdraw(session) {
    this.confirmInvitation(session);
    // this.getInvitationDetails();
    if (this.modalRef) this.modalRef.hide();
  }
  confirmAccept(sessionValue: SessionInvitationDetails) {
    this.withdrawAcceptance(sessionValue, this.identificationNo);
    if (this.modalRef) this.modalRef.hide();
  }
  withdrawAcceptance(sessionData, identifier?) {
    this.doctorService.withdrawAcceptance(sessionData, this.isMbApp?identifier:null).subscribe(
      res => {
        this.alertService.showSuccess(res);
        this.getScheduledSessions();
        this.getInvitationDetails();
      },
      err => this.showError(err)
    );
  }
  /** This method is to trigger show modal event
   * @param template
   */
  showModal(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  getAccountTabsetDetails() {
    this.medicalBoardTabs = [];
    this.medicalBoardTabs.push({
      tabName: MBConstants.MB_SESSIONS
    });
    this.medicalBoardTabs.push({
      tabName: MBConstants.INVTATIONS
    });
  }
  getUserRoles() {
    const gosiscp = this.authTokenService.getEntitlements();
    if (gosiscp[0].role.toString() === RoleIdEnum.MEDICAL_SERVICES_DEPARTMENT_MANAGER.toString()) {
      this.isManagerLogin = true;
    }
  }
  getInvitationDetails() {
    if (this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      this.doctorService.getInvitationDetailsContract(this.identificationNo).subscribe(
        res => {
          this.sessions = res;
          this.countInvitation = res.count;
        },
        err => this.showError(err)
      );
    } else {
      this.professionalId = this.doctorService.getmbProfessionalId();
      if (this.professionalId) {
        this.doctorService.getInvitationDetails(this.professionalId).subscribe(
          res => {
            this.sessions = res;
            this.countInvitation = res.count;
          },
          err => this.showError(err)
        );
      } else {
        this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
      }
    }
  }
  getScheduledSessions() {
    if (this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      this.doctorService.getSessionDetailsContract(this.identificationNo).subscribe(
        res => {
          this.scheduledSessions = res;
          this.sessionCount = res.count;
        },
        err => this.showError(err)
      );
    } else {
      this.professionalId = this.doctorService.getmbProfessionalId();
      if (this.professionalId) {
        this.doctorService.getSessionDetails(this.professionalId).subscribe(
          res => {
            this.scheduledSessions = res;
            this.sessionCount = res.count;
          },
          err => this.showError(err)
        );
      } else {
        this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
      }
    }
  }
  confirmInvitation(session) {
    this.alertService.clearAlerts();
    if (this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      this.doctorService.acceptInvitationContract(session.sessionId, this.identificationNo, session.inviteId).subscribe(
        res => {
          this.responseConfirm = res;
          this.alertService.showSuccess(res);
          this.getInvitationDetails();
        },
        err => this.showError(err)
      );
    } else {
      this.doctorService.acceptInvitation(session.inviteId, session.sessionId).subscribe(
        res => {
          this.responseConfirm = res;
          this.alertService.showSuccess(res);
          this.getInvitationDetails();
        },
        err => this.showError(err)
      );
    }
  }

  /**
   *
   * @param err This method to show the page level error
   */
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  /*
   * This method is to trigger hide modal
   */
  hideModal() {
    if (this.modalRef) this.modalRef.hide();
  }
  onMedicalBoardToNewTab(accountTabs: string) {
    this.medicalTab = accountTabs;
    if (this.medicalTab === MBConstants.MB_SESSIONS) {
      this.getScheduledSessions();
    }
  }
  onSearchSession(searchKey: string) {
    this.sessionfilter.searchkey = searchKey;
    if (this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      this.doctorService.getSessionDetailsContract(this.identificationNo, this.sessionfilter).subscribe(
        res => {
          this.scheduledSessions = res;
          this.sessionCount = res.count;
        },
        err => this.showError(err)
      );
    } else {
      this.professionalId = this.doctorService.getmbProfessionalId();
      if (this.professionalId) {
        this.doctorService.getSessionDetails(this.professionalId, this.sessionfilter).subscribe(
          res => {
            this.scheduledSessions = res;
            this.sessionCount = res.count;
          },
          err => this.showError(err)
        );
      } else {
        this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
      }
    }
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
  getMBSessionStatusType() {
    this.lookupService.getMBSessionStatusType().subscribe(res => {
      this.statusList = res;
    });
  }
  onFilterValue(filter: SessionFilterRequest) {
    this.sessionfilter = filter;

    if (this.appToken === ApplicationTypeEnum.MEDICAL_BOARD) {
      this.doctorService.getSessionDetailsContract(this.identificationNo, this.sessionfilter).subscribe(
        res => {
          this.scheduledSessions = res;
          this.sessionCount = res.count;
        },
        err => this.showError(err)
      );
    } else {
      this.professionalId = this.doctorService.getmbProfessionalId();
      if (this.professionalId) {
        this.doctorService.getSessionDetails(this.professionalId, this.sessionfilter).subscribe(
          res => {
            this.scheduledSessions = res;
            this.sessionCount = res.count;
          },
          err => this.showError(err)
        );
      } else {
        this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
      }
    }
  }
}
