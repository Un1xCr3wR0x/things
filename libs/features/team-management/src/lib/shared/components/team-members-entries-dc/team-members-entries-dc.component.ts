/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { statusBadgeType, LanguageToken, TransactionStatus } from '@gosi-ui/core';
import { TeamMemberProps } from '../../enums';
import { MyTeamResponse, TeamRequest, TeamLimit, ReporteeObject } from '../../models';
import { BehaviorSubject } from 'rxjs';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme/src';

@Component({
  selector: 'tm-team-members-entries-dc',
  templateUrl: './team-members-entries-dc.component.html',
  styleUrls: ['./team-members-entries-dc.component.scss']
})
export class TeamMembersEntriesDcComponent implements OnInit, OnChanges {
  @ViewChild('paginationComponent') paginationComponent: PaginationDcComponent;
  /**
   * input variables
   */
  @Input() members: MyTeamResponse;
  @Output() sortEvent = new EventEmitter<string>();
  /**
   * output variables
   */
  @Output() request = new EventEmitter<TeamRequest>();
  @Output() navigate = new EventEmitter<ReporteeObject>();
  /**
   * local variables
   */
  teamMemberPropsEnum = TeamMemberProps;
  teamMemberStatus = TransactionStatus;
  sortOption = '';
  itemsPerPage = 10;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  teamRequest: TeamRequest = <TeamRequest>{};
  lang = 'en';
  /**
   *
   * @param language
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.language.subscribe((res: string) => {
      this.lang = res;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.members && changes.members.currentValue) this.members = changes.members.currentValue;
  }
  /**
   * method to sort team member
   * @param option
   */
  sortTeamMembers(option) {
    this.sortOption = option;
    this.sortEvent.emit(option);
  }
  /**
   * clear sort option
   */
  clearSort() {
    this.sortOption = null;
  }
  /**
   * This method is to set the Transaction Request
   */
  transactionRequestSetter(): void {
    this.teamRequest.page = new TeamLimit();
    this.teamRequest.page.pageNo = this.pageDetails.currentPage - 1;
    this.teamRequest.page.size = this.itemsPerPage;
  }
  /**method to paginate
   *
   * @param page
   */
  paginateTransactions(page) {
    this.pageDetails.currentPage = page;
    this.transactionRequestSetter();
    this.request.emit(this.teamRequest);
  }

  /**
   * This method is used to style the status badge based on the received status
   */
  statusBadgeType(status) {
    if (status) return statusBadgeType(status);
  }
  /**
   * Method to reset pagination
   */
  clearPagination() {
    this.pageDetails.currentPage = 1;
    this.pageDetails.goToPage = '1';
    if (this.paginationComponent) this.paginationComponent.resetPage();
  }
  /**
   * Method to navigate to validator profile
   * @param member
   */
  onNavigate(member: ReporteeObject) {
    this.navigate.emit(member);
  }
}
