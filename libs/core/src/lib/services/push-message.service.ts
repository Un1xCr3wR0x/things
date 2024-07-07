/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { NotificationService } from './notification.service';
import { tap, pluck } from 'rxjs/operators';
import { PushNotificationSubscriptionResponse, Notification } from '../models';
import { Subject, of, noop } from 'rxjs';
import { ApplicationTypeToken } from '../tokens';
import { ApplicationTypeEnum } from '../enums';
export interface FCMMessage {
  title: string;
  body: string;
}
/**
 * The service class to handle push notification.
 * @export
 * @class PushMessageService
 */
@Injectable({
  providedIn: 'root'
})
export class PushMessageService {
  isTokenValid = false;
  private subscriptionId: number = null;
  private serviceWorkerStatus$: Subject<boolean> = new Subject();
  baseUrl = '/api/v1/notification';
  constructor(
    private http: HttpClient,
    // readonly angularFireMessaging: AngularFireMessaging,
    readonly notificationService: NotificationService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    /**
    if (appToken === ApplicationTypeEnum.PUBLIC) {
      this.isTokenValid = true;
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('./firebase-messaging-sw.js', {
            scope: '/establishment-public/firebase-cloud-messaging-push-scope/'
          })
          .then((swr: ServiceWorkerRegistration) => {
            this.angularFireMessaging.useServiceWorker(swr).then(() => {
              if (swr.active) {
                swr.active.postMessage('ping');
              }
            });
            navigator.serviceWorker.addEventListener('message', event => {
              if (event.data.notification) {
                const message = event.data.notification;
                const notification = new Notification();
                notification.title = { arabic: message.title, english: message.title };
                notification.body = { arabic: message.body, english: message.body };
                notification.timestamp = { gregorian: new Date() };
                this.notificationService.addNotification(notification);
                this.notificationService.updateNotificationCount();
              }
            });
            this.serviceWorkerStatus$.next(true);
          });
      }
    }
    **/
  }
  /**
   * request permission for notification from firebase cloud messaging
   *
   *
   */
  updateToken() {
    /**
    this.serviceWorkerStatus$.subscribe(status => {
      if (status) {
        this.angularFireMessaging.requestPermission
          .pipe(
            tap(() => {
              this.angularFireMessaging.requestToken.subscribe(token => {
                if (token) {
                  const url = `${this.baseUrl}/subscribe`;
                  this.http
                    .post(
                      url,
                      { systemId: token },
                      {
                        headers: { ignoreLoadingBar: '' }
                      }
                    )
                    .pipe(
                      tap((response: PushNotificationSubscriptionResponse) => {
                        this.subscriptionId = response.subscriptionId;
                      })
                    )
                    .subscribe();
                }
              });
            })
          )
          .subscribe();
      }
    });
     */
  }

  removeToken() {
    this.isTokenValid = false;
    if (this.subscriptionId) {
      const url = `${this.baseUrl}/unsubscribe?subscriptionId=${this.subscriptionId}`;
      return this.http.delete(url, {
        headers: { ignoreLoadingBar: '' }
      });
    } else return of(noop);
  }
}
