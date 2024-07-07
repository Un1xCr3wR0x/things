import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService, BilingualText, AppConstants, NotificationResponse, NotificationWrapper } from '@gosi-ui/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  notificationUrl: string;
  /**
   * Creates an instance of TodolistService.
   *
   * @param {HttpClient} _http
   * @memberof TodolistService
   */
  constructor(readonly http: HttpClient, private alertService: AlertService) {}

  /**
   * This method is to fetch Notification List.
   *
   */
  fetchNotificationList(notificationListRequest) {
    this.alertService.clearAllErrorAlerts();
    this.notificationUrl = AppConstants.NOTIFICATION_URL;
    const url = (this.notificationUrl += `?page.pageNo=${notificationListRequest.page.pageNo}&page.size=${notificationListRequest.page.pageSize}&sort.column=Date&sort.direction=ASC`);

    return this.http.get<NotificationWrapper>(url).pipe(
      map(resp => {
        return <NotificationWrapper>resp;
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * This method is to update Notification List.
   *
   */
  updateNotification(item: NotificationResponse): Observable<BilingualText> {
    let url = AppConstants.NOTIFICATION_URL;
    url += `/${item.notificationId}`;
    return this.http.put<BilingualText>(url, null);
  }

  /**
   * This method is to handle error response.
   *
   * @private
   * @param {string} msg
   * @returns
   * @memberof LookupService
   */
  private handleError(msg: string) {
    return throwError(msg);
  }
}
