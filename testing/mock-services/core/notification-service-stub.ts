import { BehaviorSubject, of } from 'rxjs';
import { notification } from '../../test-data';
import { Notification, NotificationWrapper } from '@gosi-ui/core';

/**
 * Stub class for Document Service.
 *
 * @export
 * @class NotificationServiceStub
 */
export class NotificationServiceStub {
  readonly notifications = new BehaviorSubject<Notification[]>([]);
  readonly notificationCount = new BehaviorSubject<NotificationWrapper>(null);
  /**
   * Creates an instance of NotificationService.
   *
   * @memberof NotificationService
   */

  /**
   * This method is to add push notification to subject.
   *
   * @param {Notification} notification
   * @memberof NotificationService
   */
  addNotification(notificationObj: Notification) {
    if (notificationObj) {
      this.notifications.next(this.notifications.getValue().concat(notification));
    }
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
  getNotificationCount() {
    return this.notificationCount.asObservable();
  }
  fetchNotificationList() {
    return of(null);
  }
}
