/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  AuthTokenService,
  Environment,
  EnvironmentToken,
  RouterService,
  SortDirectionEnum,
  TransactionService,
  WorkflowService
} from '@gosi-ui/core';
import { SearchDcComponent } from '@gosi-ui/foundation-theme/src';
import { Subscription } from 'rxjs';
import { RouterConstants } from '../../constants';
import {
  ActiveCount,
  MyTeamResponse,
  ReporteeObject,
  TeamLimit,
  TeamMember,
  TeamRequest,
  TeamSearch
} from '../../models';
import { TeamManagementService } from '../../services';
import { TeamBaseScComponent } from '../base/team-base-sc.component';
import { TeamMembersEntriesDcComponent } from '../team-members-entries-dc/team-members-entries-dc.component';

@Component({
  selector: 'tm-my-team-view-sc',
  templateUrl: './my-team-view-sc.component.html',
  styleUrls: ['./my-team-view-sc.component.scss']
})
export class MyTeamViewScComponent extends TeamBaseScComponent implements OnInit, OnDestroy {
  /**
   * local variables
   */
  specialKeys: Array<string> = ['Enter', 'Backspace', 'Delete'];
  members: TeamMember[] = [];
  filteredMembers: TeamMember[] = [];
  sortDirection = 'ASC';
  nameValue: string[];
  isSearched = false;
  searchParam = '';
  myTeamResponse: MyTeamResponse;
  getReporteeSubscription: Subscription;
  teamSearch: TeamSearch = new TeamSearch();
  teamRequest: TeamRequest = <TeamRequest>{};
  itemsPerPage = 10;
  currentPage = 1;
  searchResults: MyTeamResponse = null;
  activeCount = 0;
  onLeaveCount = 0;
  @ViewChild('search') searchbtn: SearchDcComponent;
  @ViewChild('teamMembersEntry') teamMembersEntry: TeamMembersEntriesDcComponent;
  sortOptions = [
    { name: 'TEAM-MANAGEMENT.ID', value: 'id' },
    { name: 'TEAM-MANAGEMENT.NAME', value: 'name' },
    { name: 'TEAM-MANAGEMENT.ROLE', value: 'role' },
    { name: 'TEAM-MANAGEMENT.PENDING_TRANSACTIONS', value: 'pendingTransactions' },
    { name: 'TEAM-MANAGEMENT.OLA_EXCEEDED', value: 'olaExceeded' },
    { name: 'TEAM-MANAGEMENT.STATUS', value: 'status' }
  ];
  /**
   *
   * @param workflowService
   * @param alertService
   * @param tmService
   */
  constructor(
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    readonly tmService: TeamManagementService,
    readonly router: Router,
    @Inject(EnvironmentToken) readonly environment: Environment,
    readonly transactionService: TransactionService,
    readonly routerService: RouterService,
    readonly authTokenService: AuthTokenService
  ) {
    super(workflowService, tmService, environment, transactionService, routerService, authTokenService);
  }
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.fromTeam = true;
    this.alertService.clearAlerts();
    this.requestSetter();
    this.getReportees();
    this.getActiveCount();
  }
  /**
   *
   * Methods to set default Parameters
   */
  defaultPagination() {
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.pageDetails = {
      currentPage: this.currentPage,
      goToPage: 1
    };
    if (this.teamRequest && this.teamRequest.page && this.teamRequest.page.pageNo) {
      this.teamRequest.page.pageNo = this.currentPage - 1;
      this.teamRequest.page.size = this.itemsPerPage;
    }
  }
  /**
   * method to reset search
   */
  defaultSearch() {
    this.teamSearch.value = undefined;
  }
  /**
   * method to search with null value
   * @param value
   */
  searchwithEmptyValue(value: string, event: KeyboardEvent) {
    if (event !== null && !this.specialKeys?.includes(event?.key)) return;
    if (!value && this.searchbtn?.searchbutton?.nativeElement?.contains(event?.target)) {
      this.isSearched = false;
    }
    if (!value && (this.isSearched || !this.searchbtn?.searchbutton?.nativeElement?.contains(event?.target))) {
      this.isSearched = false;
      this.searchParam = value;
      const response = this.tmService?.myTeamInitialListOfReportees?.response;
      this.myTeamResponse.response = response;
      this.getCount();
      this.defaultPagination();
      this.teamMembersEntry?.clearPagination();
      this.teamMembersEntry?.clearSort();
      this.getResponsePerPage();
    }
  }
  /**
   * method to search team members
   */
  searchTeamMember(value: string) {
    if (!value) {
      const response = this.tmService?.myTeamInitialListOfReportees?.response;
      this.isSearched = false;
      this.searchResults = null;
      this.myTeamResponse.response = response;
    } else {
      this.isSearched = true;
      this.searchParam = value;
      this.teamSearch.value = value;
      const response = this.tmService?.myTeamInitialListOfReportees?.response?.filter(
        item => item?.name?.includes(value) || item?.id?.includes(value)
      );
      this.searchResults = new MyTeamResponse();
      this.searchResults.response = response;
      this.myTeamResponse.response = response;
    }
    this.getCount();
    this.defaultPagination();
    this.getResponsePerPage();
  }

  /**
   * method to sort into list
   * @param list
   */
  sortArrayList(list) {
    this.isSearched = true;
    this.searchResults = new MyTeamResponse();
    this.searchResults.response = list;
    this.myTeamResponse.response = list;
    this.getCount();
    this.defaultPagination();
    this.getResponsePerPage();
    this.teamMembersEntry?.clearPagination();
  }
  /**
   * method to sort team member
   * @param sort
   */
  sortTeamMember(sort) {
    if (sort !== null) {
      let sortItems: ReporteeObject[] = [];
      if (!this.isSearched) {
        sortItems = this.tmService?.myTeamInitialListOfReportees?.response;
      } else if (this.isSearched) {
        sortItems = this.searchResults?.response;
      }
      if (this.sortDirection === SortDirectionEnum.ASCENDING) {
        this.sortDirection = SortDirectionEnum.DESCENDING;
        const descendingList = sortItems?.sort((a, b) =>
          a?.name?.replace(/\s/g, '').localeCompare(b?.name?.replace(/\s/g, ''))
        );
        this.sortArrayList(descendingList);
      } else if (this.sortDirection === SortDirectionEnum.DESCENDING) {
        this.sortDirection = SortDirectionEnum.ASCENDING;
        const ascendingList = sortItems?.sort((a, b) =>
          b?.name?.replace(/\s/g, '').localeCompare(a?.name?.replace(/\s/g, ''))
        );
        this.sortArrayList(ascendingList);
      }
    }
  }
  /**
   * method to initiate request
   * @param request
   */
  entryRequest(request) {
    this.requestSetter(request.page);
    this.getResponsePerPage();
  }
  /**
   * method to initiate request params
   * @param paginationObject
   */
  requestSetter(paginationObject?) {
    if (paginationObject) {
      this.teamRequest.page = paginationObject;
    } else {
      this.teamRequest.page = new TeamLimit();
      this.teamRequest.page.pageNo = this.currentPage - 1;
      this.teamRequest.page.size = this.itemsPerPage;
    }
    this.teamRequest.search = new TeamSearch();
    this.teamRequest.search = this.teamSearch;
  }
  /**
   * method to get count
   */
  getCount() {
    this.myTeamResponse.totalCount = this.myTeamResponse.response?.length;
  }

  /**
   * method to get reportees
   */
  getReportees() {
    if (this.getReporteeSubscription) this.getReporteeSubscription.unsubscribe();
    if (
      !this.tmService.myTeamInitialListOfReportees ||
      (this.tmService.myTeamInitialListOfReportees &&
        this.tmService.myTeamInitialListOfReportees?.response?.filter(item => item.status === null).length > 0)
    ) {
      this.getReporteeSubscription = this.tmService.getMyTeamMembers().subscribe((response: MyTeamResponse) => {
        this.tmService.myTeamInitialListOfReportees = { ...response };
        this.myTeamResponse = { ...response };
        this.getCount();
        this.getResponsePerPage();
      });
    } else {
      this.myTeamResponse = { ...this.tmService.myTeamInitialListOfReportees };
      this.getCount();
      this.getResponsePerPage();
    }
  }
  /**
   * method to get filtered reportees
   */
  getReporteesFilter() {
    if (this.getReporteeSubscription) this.getReporteeSubscription.unsubscribe();
    this.getReporteeSubscription = this.tmService.getMyTeamMembers().subscribe((response: MyTeamResponse) => {
      this.myTeamResponse = response;
      this.getCount();
      this.getResponsePerPage();
    });
  }
  /**
   * method to get response per page
   */
  getResponsePerPage() {
    const pageCount = this.teamRequest.page?.pageNo * 10;
    if (this.isSearched) {
      if (pageCount < this.searchResults.response?.length) {
        this.myTeamResponse.response = this.searchResults?.response?.slice(
          pageCount,
          pageCount + this.teamRequest.page.size
        );
        if (this.myTeamResponse?.response) {
          this.myTeamResponse?.response?.forEach(item => {
            item = this.setResponse(item);
          });
        }
      }
    } else if (
      this.tmService.myTeamInitialListOfReportees &&
      this.tmService.myTeamInitialListOfReportees?.response &&
      this.tmService.myTeamInitialListOfReportees?.response?.length
    ) {
      if (pageCount < this.tmService?.myTeamInitialListOfReportees?.response?.length) {
        this.myTeamResponse.response = this.tmService.myTeamInitialListOfReportees?.response?.slice(
          pageCount,
          pageCount + this.teamRequest.page.size
        );
        if (this.myTeamResponse?.response?.length > 0) {
          this.myTeamResponse?.response?.forEach(item => {
            item = this.setResponse(item);
          });
        }
      }
    }
  }
  /**
   * method to get active count
   */
  getActiveCount() {
    if (this.tmService)
      this.tmService.getActiveAndLeaveCount().subscribe((response: ActiveCount) => {
        this.activeCount = response.activeCount;
        this.onLeaveCount = response.inActiveCount;
      });
  }
  /**
   *
   * This method is to perform cleanup activities when an instance of component is destroyed.

   */
  ngOnDestroy(): void {
    if (this.getReporteeSubscription) {
      this.getReporteeSubscription.unsubscribe();
    }
  }
  /**
   * Method to navigate to validator profile
   * @param reporteeId
   */
  navigateToProfile(reportee: ReporteeObject) {
    this.tmService.validatorProfile = reportee;
    this.router.navigate([RouterConstants.ROUTE_VALIDATOR_PROFILE]);
  }
}
