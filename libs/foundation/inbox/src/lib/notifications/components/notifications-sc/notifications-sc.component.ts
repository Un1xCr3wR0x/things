/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Inject } from '@angular/core';
import { NotificationsService } from '../../services';
import { tap } from 'rxjs/operators';
import {
  LanguageToken,
  SortDirectionEnum,
  TransactionService,
  NotificationRequest,
  NotificationResponse,
  NotificationWrapper,
  NotificationService
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ibx-notifications-sc',
  templateUrl: './notifications-sc.component.html',
  styleUrls: ['./notifications-sc.component.scss']
})
export class NotificationsScComponent implements OnInit {
  pageSize = 10;
  unViewed = 0;
  totalCount = 0;
  itemsPerPage = 10;
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  lang = 'en';
  notificaionsRequest = new NotificationRequest();
  notificationList: NotificationResponse[] = [];
  constructor(
    private notificationsService: NotificationsService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly transactionService: TransactionService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.language.subscribe((res: string) => {
      this.lang = res;
    });

    this.initiateRequest();
  }
  /**
   * This method is to intiate Notification Request.
   *
   */
  initiateRequest() {
    this.notificaionsRequest.page.pageNo = this.currentPage - 1;
    this.notificaionsRequest.page.pageSize = this.pageSize;
    this.notificaionsRequest.sort.column = 'Date';
    this.notificaionsRequest.sort.direction = SortDirectionEnum.ASCENDING;

    this.requestHandler(this.notificaionsRequest);
  }

  /**
   * This method is to get Notification List.
   *
   */
  requestHandler(notificationListRequest) {
    this.notificationsService
      .fetchNotificationList(notificationListRequest)
      .pipe(
        tap(res => {
          this.unViewed = res.unViewedCount;
          this.totalCount = res.totalCount;
          this.notificationService.setNotificationCount({ ...res });
          this.transactionService.notificationUnViewedCount.next(this.unViewed);
          this.transactionService.notificationTotalCount.next(this.totalCount);
        })
      )
      .subscribe((res: NotificationWrapper) => {
        this.notificationList = res.notificationEntries;
      });
  }
  urlify(text) {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.replace(urlRegex, url => {
      return '<a href="' + url + '">' + url + '</a>';
    });
  }
  getText(text) {
    return this.urlify(text);
  }

  /**
   * This method is to select page.
   *
   */
  selectPage(page: number): void {
    this.currentPage = this.pageDetails.currentPage = page;
    this.initiateRequest();
  }

  /**
   * This method is to update Notification List.
   *
   */
  updateNotification(item: NotificationResponse) {
    if (item.readFlag !== 1) {
      this.notificationsService.updateNotification(item).subscribe(() => {
        this.initiateRequest();
      });
    }
  }
}
