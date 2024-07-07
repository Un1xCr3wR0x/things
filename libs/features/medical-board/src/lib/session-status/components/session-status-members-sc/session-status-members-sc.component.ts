/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, AppConstants, BilingualText, LanguageToken, LookupService, RoleIdEnum } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  ConfigurationTypeEnum,
  CreateSessionService,
  MBConstants,
  MbRouteConstants,
  MedicalBoardList,
  MedicalMembersBaseScComponent,
  SessionStatusDetails,
  SessionStatusService
} from '../../../shared';

@Component({
  selector: 'mb-session-status-members-sc',
  templateUrl: './session-status-members-sc.component.html',
  styleUrls: ['./session-status-members-sc.component.scss']
})
export class SessionStatusMembersScComponent extends MedicalMembersBaseScComponent implements OnInit, OnChanges {
  /**
   *  Local Variables
   * */
  lang = 'en';
  index = 0;
  modalRef: BsModalRef;
  doctorname: BilingualText = new BilingualText();
  itemsPerPage = 10;
  type = 'member';
  paginationId = 'paginationId';
  totalRecords = 0;
  message: BilingualText;
  noOfConctractedDr = 0;
  noOfGosiDr = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  currentPage = 1;
  disabled = false;
  allowedMedicalOfficerRole = [RoleIdEnum.BOARD_OFFICER, RoleIdEnum.APPEAL_MEDICAL_BOARD_OFFICER];

  //Input Variables
  @Input() sessionStatusDetails: SessionStatusDetails = new SessionStatusDetails();
  @Input() sessionId: number;
  @Input() isAmb: boolean;
  @Input() canPmbRemove: boolean;
  @Input() mbManager = false;

  //Output Variables
  @Output() remove: EventEmitter<null> = new EventEmitter();
  /**
   *
   * @param sessionStatusService
   * @param modalService
   * @param alertService
   * @param router
   * @param language
   */
  constructor(
    readonly sessionStatusService: SessionStatusService,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly lookupService: LookupService,
    readonly sessionService: CreateSessionService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    super(alertService, sessionStatusService, modalService, lookupService, router, sessionService);
  }

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  ngOnChanges() {
    this.getSessionstatusDetails(this.sessionId);
  }
  /**Method to fetch isd code */
  getISDCodePrefix(participant: MedicalBoardList) {
    let prefix = '';
    Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === participant.isdCode) {
        prefix = AppConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
  /**
   * Method to get selected page
   * @param page
   */
  selectPage(page: number) {
    this.pageDetails.currentPage = this.currentPage = page;
  }

  showRemoveModal(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  navigateToProfile(identificationNo: number) {
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(identificationNo)]);
  }
  cancelRemoving() {
    this.modalRef.hide();
  }
  setIndex(index) {
    this.index = index;
    this.doctorname = new BilingualText();
    this.doctorname = MBConstants.REMOVEMEMBER(this.sessionStatusDetails?.mbList[index]?.name);
  }
  removeMember() {
    const invitteeId = this.sessionStatusDetails?.mbList[this.index]?.inviteeId;
    this.removeMedicalMember(this.sessionId, invitteeId, ConfigurationTypeEnum.REMOVE_MEMBER);
    this.modalRef?.hide();
    // setTimeout(() => {
    //   this.reload();
    // }, 1000);
    this.getSessionstatusDetails(this.sessionId);
  }
  // reload() {
  //   window.location.reload(true);
  // }
}
