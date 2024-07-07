import { Component, OnInit } from '@angular/core';
import {
  ManagePersonService,
  NotificationLimit,
  NotificationRequest,
  NotificationResponse,   
  SMSNotificationTypeEnum
} from '../../../shared';
import { AlertService, SMSNotificationBadge } from '@gosi-ui/core';
import { Pagination } from '@gosi-ui/features/occupational-hazard/lib/shared';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cim-notifications-sc',
  templateUrl: './notifications-sc.component.html',
  styleUrls: ['./notifications-sc.component.scss']
})
export class NotificationComponent implements OnInit {
  filteredNotification: NotificationResponse = new NotificationResponse();
  isPagination = false;
  isLoadMore = false;
  pagination = new Pagination();
  currentTab: number = 0;
  personIdentifier: number;
  selectedOption: string;
  isDescending = true;
  selectedNotificationType: SMSNotificationTypeEnum = SMSNotificationTypeEnum.ACTIVE;
  tabs = [];
  totalItems;
  itemsPerPage = 10;
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  notificationRequest: NotificationRequest = new NotificationRequest();

  constructor(
    readonly manageService: ManagePersonService,
    readonly alertService: AlertService,
    readonly activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.parent.parent.paramMap.subscribe(params => {
      this.personIdentifier = +params.get('personId');
      this.notificationRequest.personIdentifier = this.personIdentifier;
      this.manageService._notificationRequest.personIdentifier = this.personIdentifier;
    });
  }

  ngOnInit(): void {
    if (this.manageService._notificationRequest === undefined) {
      this.allNotification();
    } else {
      this.notificationRequest = this.manageService._notificationRequest;
      this.getNotification();
      this.setResumeTransactionRequest();
    }
  }

  allNotification() {
    this.defaultPagination();
    this.notificationRequestSetter();
    this.getNotification();
  }

  onNotificationTypeChange() {}

  setResumeTransactionRequest() {
    this.selectedOption = this.notificationRequest.sort?.column;
    this.isDescending = this.notificationRequest.sort?.direction;
    this.currentPage =
      this.pageDetails.currentPage =
      this.pageDetails.goToPage =
        this.notificationRequest.page.pageNo + 1;
  }

  /**
   * This method is to set the Transaction Request
   */
  notificationRequestSetter(): void {
    this.notificationRequest.page = new NotificationLimit();
    this.notificationRequest.page.pageNo = this.currentPage - 1;
    this.notificationRequest.page.size = this.itemsPerPage;
    this.notificationRequest.personIdentifier = this.personIdentifier;
  }

  getNotification() {
    this.manageService.getNotification(this.notificationRequest).subscribe(
      (data: NotificationResponse) => {
        this.filteredNotification.list = data?.list ?? [];
        this.filteredNotification.totalRecords = data?.totalRecords ?? 0;
        this.totalItems = data?.totalRecords ?? 0;
      },
      err => {
        this.alertService.showError(err.error.message);
        // this.filteredNotification = [];
        this.totalItems = 0;
      }
    );
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
  }

  statusBadgeType(status: string) {
    return SMSNotificationBadge(status);
  }

  navigateToTimelineView() {
    this.isLoadMore = false;
    this.isPagination = false;
    this.currentTab = 1;
    this.currentPage = 1;
    this.notificationRequestSetter();
    this.getNotification();
  }

  navigateToTableView() {
    this.isLoadMore = false;
    this.isPagination = false;
    this.currentTab = 0;
    this.currentPage = 1;
    this.notificationRequestSetter();
    this.getNotification();
  }

  paginateTransactions(page: number): void {
    this.pageDetails.currentPage = this.currentPage = page;
    this.notificationRequestSetter();
    this.getNotification();
  }

  /**
   *
   * @param loadmoreObj Load more
   */
  onLoadMore(loadmoreObj) {
    this.pageDetails.currentPage = this.currentPage = loadmoreObj.currentPage + 1;
    this.isPagination = false;
    this.isLoadMore = true;
    this.pagination.page.pageNo = loadmoreObj.currentPage;
    this.pagination.page.size = this.itemsPerPage;
    this.notificationRequestSetter();
    this.getNotification();
  }
}
