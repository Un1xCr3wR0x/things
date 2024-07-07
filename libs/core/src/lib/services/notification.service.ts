/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable } from '@angular/core';
import {
  Notification,
  BPMResponse,
  request,
  NotificationWrapper,
  NotificationCount,
  NotificationResponse
} from '../models';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConstants } from '../constants';
import { map } from 'rxjs/operators';

/**
 * The service class to manage push notification client.
 *
 * @export
 * @class NotificationService
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly notifications = new BehaviorSubject<Notification[]>([]);
  readonly notificationCount = new BehaviorSubject<NotificationCount>(null);
  /**
   * Creates an instance of NotificationService.
   *
   * @memberof NotificationService
   */
  constructor(readonly _http: HttpClient) {}

  fetchNotificationList() {
    const notificationUrl = AppConstants.NOTIFICATION_URL;
    const url = `${notificationUrl}?page.pageNo=0&page.size=3&sort.column=Date&sort.direction=DESC`;
    return this._http.get<NotificationWrapper>(url).pipe(
      map(resp => {
        this.notifications.next([]);
        resp.notificationEntries.forEach((item: NotificationResponse) => {
          const notification: Notification = new Notification();
          notification.body = item.message;
          notification.id = item.notificationId;
          notification.title = item.title;
          const currentDate = new Date();
          const date = new Date(item.date.gregorian);
          date.setHours(date.getHours() + currentDate.getTimezoneOffset() / 60);
          notification.timestamp.gregorian = date;
          this.addNotification(notification);
        });

        const notificationCount = new NotificationCount();
        notificationCount.totalCount = resp.totalCount;
        notificationCount.unViewedCount = resp.unViewedCount;
        this.setNotificationCount(notificationCount);
      })
    );
  }
  /**
   * This method is to add push notification to subject.
   *
   * @param {Notification} notification
   * @memberof NotificationService
   */
  addNotification(notification: Notification) {
    this.notifications.next(
      this.notifications
        .getValue()
        .sort((v1, v2) => Number(new Date(v2.timestamp.gregorian)) - Number(new Date(v1.timestamp.gregorian)))
        .slice(0, 2)
        .concat(notification)
    );
  }
  getConversionData(fromGre, fromHij, toGreg, toHij) {
    let params = new HttpParams();
    if (fromGre) {
      params = params.set('fromGregorian', fromGre);
    }
    if (fromHij) {
      params = params.set('fromHijiri', fromHij);
    }
    if (toGreg) {
      params = params.set('toGregorian', toGreg);
    }
    if (toHij) {
      params = params.set('toHijiri', toHij);
    }
    // const params = new HttpParams()
    //   .set('fromGregorian', fromGre)
    //   .set('fromHijiri',  fromHij )
    //   .set('toGregorian', toGreg)
    //   .set('toHijiri', toHij);
    const url = '/api/v1/calendar/convert-dates';
    return this._http.get(url, { params });
  }

  getNumberOfDays(gregorian, hijiri) {
    let params = new HttpParams();
    if (gregorian) {
      params = params.set('gregorian', gregorian);
    }
    if (hijiri) {
      params = params.set('hijiri', hijiri);
    }
    const url = '/api/v1/calendar/day-count';
    return this._http.get(url, { params });
  }
  setNotificationCount(count: NotificationCount) {
    this.notificationCount.next(count);
  }
  updateNotificationCount() {
    const currentCount = this.notificationCount.getValue();
    currentCount.totalCount++;
    currentCount.unViewedCount++;
    this.setNotificationCount(currentCount);
  }
  getNotificationCount() {
    return this.notificationCount.asObservable();
  }

  /**
   * This method is to get push notification.
   *
   * @returns
   * @memberof NotificationService
   */
  getNotification() {
    return this.notifications.asObservable();
  }
}
