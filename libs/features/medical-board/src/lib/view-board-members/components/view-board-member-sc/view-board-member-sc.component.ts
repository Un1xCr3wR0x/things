import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  LookupService,
  LovList,
  statusBadgeType
} from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal/ngx-bootstrap-modal';
import { Observable } from 'rxjs';
import { MbBaseScComponent } from '../../../shared/components';
import { MbRouteConstants } from '../../../shared/constants';
import { MbList, MbProfile, MemberFilter, MemberRequest, MemberResponse } from '../../../shared/models';
import { MemberService, MedicalBoardService } from '../../../shared/services';

@Component({
  selector: 'mb-view-board-member-sc',
  templateUrl: './view-board-member-sc.component.html',
  styleUrls: ['./view-board-member-sc.component.scss']
})
export class ViewBoardMemberScComponent extends MbBaseScComponent implements OnInit, OnDestroy {
  /**
   * local variables
   */
  isAppPrivate: boolean;
  person: MbProfile;
  modalRef: BsModalRef;
  filteredMember: MbList[] = [];
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  currentPage = 0; // Pagination
  itemsPerPage = 10; // Pagination
  paginationId = 'member-board-list';
  totalItems = 0;
  memberFilter: MemberFilter = new MemberFilter();
  memberRequest: MemberRequest = <MemberRequest>{};

  constructor(
    readonly router: Router,
    private route: ActivatedRoute,
    readonly lookUpService: LookupService,
    readonly alertService: AlertService,
    readonly mbService: MemberService,
    readonly medicalBoardService: MedicalBoardService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(alertService, lookUpService, mbService, appToken);
  }

  /** This method is used to handle initialization tasks. */
  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    super.setLookUpLists();
    this.initializeView();
  }
  /**just in case to test
   *this.medicalBoardService.feedBackMessage=MBConstants.ADD_MEMBER_FEEDBACK_MESSAGE(12334);
   */
  ngOnDestroy() {
    this.medicalBoardService.feedBackMessage = null;
  }

  /**
   * This method is to navigate to domain member details page
   */
  addMember() {
    this.router.navigate([MbRouteConstants.ROUTE_ADD_MEDICAL_MEMBERS]);
  }
  /**
   * This method is to navigate to domain member details page
   */
  memberNavigation(identificationNumber) {
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(identificationNumber)]);
  }

  /** This method is invoked for handling pagination operation. */
  paginateMemberList(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.currentPage = this.pageDetails.currentPage = page;
      this.memberRequest.pageNo = this.currentPage;
      this.getMembers();
    }
  }
  statusBadgeType() {
    return statusBadgeType(status);
  }

  searchMembers(searchValue: string) {
    if (searchValue?.length > 0) this.memberRequest.searchKey = searchValue;
    else this.memberRequest.searchKey = undefined;
    this.getMembers();
  }
 
  filterMembers(memberFilter) {
    this.memberRequest.listOfDoctorType = memberFilter.doctorType;
    this.memberRequest.listOfRegion = memberFilter.listOfRegion;
    this.memberRequest.listOfSpecialty = memberFilter.specialty;
    this.memberRequest.listOfStatus = memberFilter.listOfStatus;
    this.getMembers();
  }

  initializeView() {
    this.memberRequest.pageNo = 0;
    this.memberRequest.pageSize = this.itemsPerPage;
    this.memberRequest.sortOrder = 'DESC';
    this.getMembers();
  }
  /**
   *
   * Method to fetch members from the service
   */
  getMembers() {
    this.medicalBoardService.getTransactions(this.memberRequest).subscribe(
      (data: MemberResponse) => {
        this.filteredMember = data.mbList;
        this.totalItems = data.totalNoOfRecords;
      },
      err => this.showError(err)
    );
  }
}
