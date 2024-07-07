import { AfterViewInit, Component, OnChanges, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, AuthTokenService, BilingualText, LookupService, LovList, MenuService, RoleIdEnum } from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AddMemberFilterRequest,
  AddParticipantsList,
  CreateSessionService,
  MedicalBoardService,
  MedicalMembersBaseScComponent,
  ParticipantsDetails,
  SessionLimitRequest,
  SessionRequest,
  SessionStatusService
} from '../../../shared';
import { ParticipantQueueService } from '../../../shared/services/participant-queue.service';
import { ParticipantDetailsDcComponent } from '../participant-details-dc/participant-details-dc.component';
import { ParticipantQueueHeadingDcComponent } from '../participant-queue-heading-dc/participant-queue-heading-dc.component';
import { AssignSessionScComponent } from '../assign-session-sc/assign-session-sc.component';
//import { MemberRequest } from '@gosi-ui/features/occupational-hazard/lib/shared/models';

@Component({
  selector: 'mb-participant-queue-sc',
  templateUrl: './participant-queue-sc.component.html',
  styleUrls: ['./participant-queue-sc.component.scss']
})
export class ParticipantQueueScComponent extends MedicalMembersBaseScComponent implements OnInit, OnChanges {
  participantsInQueue: ParticipantsDetails;
  sessionRequest: SessionRequest = new SessionRequest();
  participantSpeciality;
  specialityCountArray = [];
  @ViewChild('assignparticipant') assignparticipant: AssignSessionScComponent;
  @ViewChild(ParticipantQueueHeadingDcComponent) participantQueueHeading: ParticipantDetailsDcComponent;
  @ViewChild('participantList', { static: false }) addMembersListParicipant: ParticipantDetailsDcComponent;
  assessmentTypeLists$: Observable<LovList>;
  fieldOfficeList$: Observable<LovList>;
  specialityList$: Observable<LovList>;
  //pagination
  totalItems = 0;
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  itemsPerPage = 10;
  paginationId = 'member-board-list';
  isPmb: Boolean;
  accessRoles:string[];
  constructor(
    readonly participantQueueService: ParticipantQueueService,
    readonly alertService: AlertService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly medicalBoardService: MedicalBoardService,
    readonly sessionStatusService: SessionStatusService,
    readonly modalService: BsModalService,
    readonly sessionService: CreateSessionService,
    readonly lookUpService: LookupService,
    readonly authTokenService: AuthTokenService,
    readonly menuService: MenuService
  ) {
    super(alertService, sessionStatusService, modalService, lookUpService, router, sessionService);
  }

  ngOnInit(): void {
    this.getUserlogin(); // check Amb or Pmb login 
    this.sessionRequest = history.state.sessionRequest;
    this.sessionRequest = {...this.sessionRequest, filter: {...this.sessionRequest.filter, initiatorLocation: this.menuService.getLocation()}};
    this.getParticipantsInQueue(this.sessionRequest);
    this.getLovValues();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes?.sessionRequest) {
      const newSessionRequest = changes.sessionRequest.currentValue;
      const searchKey = '';
      this.searchWithKey(searchKey, newSessionRequest);
    }
    this.getUserlogin();
  }
  searchWithKey(searchKey: string, sessionRequest: SessionRequest) {
    if (this.sessionRequest) {
      sessionRequest.searchKey = searchKey;
      this.resetFilter();
      this.getParticipantsInQueue(sessionRequest);
    }
  }
  onSearchParicipantMember(searchKey: string) {
    this.pageDetails.currentPage = 1;
    const currentSessionRequest = this.sessionRequest;
    this.searchWithKey(searchKey, currentSessionRequest);
  }
  onFilterValueParticipant(value: AddMemberFilterRequest) {
    if (this.sessionRequest) this.sessionRequest.filterData = value;
    // this.onResetPagination();
    this.getParticipantsInQueue(this.sessionRequest);
  }
  handleparticipantSpeciality(participantSpecialities) {
    this.participantQueueService.getAssignParticipantDetails(participantSpecialities).subscribe(
      response => {
        this.participantsInQueue = response;
        this.medicalBoardService.Participant(participantSpecialities);
        this.medicalBoardService.updateParticipant(response);
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  resetFilter() {}

  getLovValues() {
    this.specialityList$ = this.lookupService.getSpecialityList();
    this.getOfficeLists();
    this.getAssessmentTypes();
    this.getLocationLists();
    // this.region$ = this.lookupService.getRegionList(); //TODO Use Camel Case
  }
  getAssessmentTypes() {
    this.assessmentTypeLists$ = this.lookupService.getAssessmentTypeList();
  }
  getOfficeLists() {
    this.fieldOfficeList$ = this.lookupService.getMbOfficeLocations().pipe(
      map((lists: LovList) => {
        if (lists) {
          lists.items.forEach(values => {
            values.value.arabic = values.value.arabic.trim();
            values.value.english = values.value.english.trim();
          });
          return lists;
        }
      })
    );
  }
  onCheckboxSelected(
    selected: boolean,
    data: { primarySpeciality: BilingualText[]; secondarySpeciality: BilingualText[] }
  ) {
    this.participantQueueHeading.checkboxSelected = selected;
    this.participantQueueHeading.appendSelectedspecialities(data.primarySpeciality);
    // this.participantQueueHeading.primarySpeciality = data.primarySpeciality
    // this.participantQueueHeading.secondarySpeciality = data.secondarySpeciality;
  }
  /**
   *
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
      this.getParticipantsInQueue(this.sessionRequest);
    }
  }
  /** This method is invoked for handling pagination operation. */
  paginateMemberList(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.currentPage = this.pageDetails.currentPage = page;
      this.participantsInQueue.pageNo = this.currentPage;
      this.getParticipantsInQueue(this.sessionRequest);
    }
  }
  getUserlogin() {
    const gosiscp = this.authTokenService.getEntitlements(); // to get login details from authToken
    // gosiscp[0].role.forEach(role => {
    //   role.toString() === RoleIdEnum.APPEAL_MEDICAL_BOARD_OFFICER.toString()
    //     ? (this.isPmb = false)
    //     : (this.isPmb = true);
    // });
    this.accessRoles = gosiscp ? gosiscp?.[0].role?.map(r => r.toString()) : [];
    if (this.accessRoles.includes(RoleIdEnum.APPEAL_MEDICAL_BOARD_OFFICER.toString())) {
      this.isPmb = false;
    } else{
      this.isPmb = true
    }
  }
  getParticipantsInQueue(sessionRequest?: SessionRequest) {
    this.participantQueueService
      .getParticipantQueueDetails(sessionRequest, this.currentPage - 1, this.itemsPerPage, this.isPmb)
      .subscribe(
        response => {
          this.participantsInQueue = response;
          this.totalItems = response.count;
        },
        () => {}
      );
  }
  filterParticipantBySpeciality(speciality) {
    this.sessionRequest = {...this.sessionRequest, filterData: {...this.sessionRequest?.filterData, speciality:[{english:speciality, arabic: speciality}]}};
    this.getParticipantsInQueue(this.sessionRequest);
  }
  // /**
  //  * Method to get the office list
  //  */
  // getLocationLists() {
  //   this.locationList$ = this.lookupService.getFieldOfficeList().pipe(
  //     map((lists: LovList) => {
  //       if (lists) {
  //         lists.items.forEach(item => {
  //           item.value.arabic = item.value.arabic.trim();
  //           item.value.english = item.value.english.trim();
  //         });
  //         return lists;
  //       }
  //     })
  //   );
  // }
}
