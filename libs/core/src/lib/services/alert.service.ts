/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { AlertIconEnum, AlertTypeEnum, ApplicationTypeEnum } from '../enums';
import { ApplicationTypeToken } from '../tokens';
import { scrollToTop } from '../utils/window';
import { Alert } from '../models/alert';
import { BilingualText } from '../models/bilingual-text';

/**
 * The service class to handle alerts.
 * Using bootstrap alert classes for danger,success,warning and info
 * @export
 * @class AlertService
 */
@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly alerts = new BehaviorSubject<Alert[]>([]);
  private alerts$: Observable<Alert[]> = from([]);

  /**
   * Creates an instance of AlertService.
   *
   * @param {HttpClient} _http
   * @memberof AlertService
   */
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {
    this.alerts$ = this.alerts.asObservable();
  }

  /**
   *
   * @param message -- Actual message for alert
   * @param type -- alert type
   * @param details -- more than one message is there
   */
  private setAlert(message: BilingualText, type: AlertTypeEnum, details?: Alert[], timeout?: number) {
    const alert = new Alert();
    alert.message = message;
    alert.type = type;
    if (timeout) {
      alert.timeout = timeout * 1000;
    }
    alert.icon = this.getIcon(type);

    if (details && details !== null && details.length > 0) {
      for (const item of details) {
        let subAlert = new Alert();
        subAlert = { ...item };
        alert.details.push(subAlert);
      }
    }
    this.pushAlert(alert);
    scrollToTop();
  }

  /**
   * Method to set alert key
   * @param messageKey
   * @param type
   */
  private setAlertKey(
    messageKey: string,
    type: AlertTypeEnum,
    messageParam?: Object,
    timeout?: number,
    subMessageKeys?,
    dismissible?: boolean
  ) {
    const alert = new Alert();
    alert.messageKey = messageKey;
    alert.type = type;
    if (timeout) {
      alert.timeout = timeout * 1000;
    }
    if (dismissible !== undefined) {
      alert.dismissible = dismissible;
    }
    if (messageParam) {
      alert.messageParam = messageParam;
    }
    alert.icon = this.getIcon(type);
    if (subMessageKeys && subMessageKeys.length > 0) {
      for (const item of subMessageKeys) {
        const subAlert = new Alert();
        subAlert.messageKey = item.key;
        subAlert.messageParam = item.param;
        alert.details.push(subAlert);
      }
    }
    this.pushAlert(alert);
    scrollToTop();
  }

  /**
   * This method allow to push new alert only when type is different
   */
  private pushAlert(alert: Alert) {
    let alerts: Alert[] = this.alerts.value;
    if (alerts.length > 0) {
      if (this.alerts.value.filter(res => res.type === alert.type).length > 0) {
        alerts = this.alerts.value.filter(res => res.type !== alert.type);
      }
    }
    alerts.push(alert);
    this.alerts.next(alerts);
  }

  /**
   * Get icon based on alert type
   * @param type
   */
  private getIcon(type: AlertTypeEnum) {
    if (type === AlertTypeEnum.DANGER || type === AlertTypeEnum.WARNING) {
      return AlertIconEnum.ERROR;
    } else if (type === AlertTypeEnum.INFO) {
      return AlertIconEnum.INFO;
    } else {
      return AlertIconEnum.SUCCESS;
    }
  }

  /**
   * set success message from key
   * @param messageKey translation key
   */
  showSuccessByKey(messageKey: string, messageParam?: Object, timeout?: number) {
    this.setAlertKey(messageKey, AlertTypeEnum.SUCCESS, messageParam, timeout);
  }

  /**
   * set error message from key
   * @param messageKey translation key
   */
  showErrorByKey(messageKey: string, messageParam?: Object, timeout?: number, subMessageKeys?, dismissible?: boolean) {
    this.setAlertKey(messageKey, AlertTypeEnum.DANGER, messageParam, timeout, subMessageKeys, dismissible);
  }

  /**
   * set info message from key
   * @param messageKey translation key
   */
  setInfoByKey(messageKey: string, messageParam?: Object) {
    this.setAlertKey(messageKey, AlertTypeEnum.INFO, messageParam);
  }

  /**
   * set warning message from key
   * @param messageKey translation key
   */
  showWarningByKey(
    messageKey: string,
    messageParam?: Object,
    timeout?: number,
    subMessageKeys?,
    dismissible?: boolean
  ) {
    this.setAlertKey(messageKey, AlertTypeEnum.WARNING, messageParam, timeout, subMessageKeys, dismissible);
  }

  /**
   * Method to show success alerts
   * @param message
   * @param details
   */
  showSuccess(message: BilingualText, details?: Alert[], timeout?: number) {
    this.setAlert(message, AlertTypeEnum.SUCCESS, details, timeout);
  }
  /**
   * Method to show warning alerts
   * @param message
   * @param details
   */
  showWarning(message: BilingualText, details?: Alert[]) {
    this.setAlert(message, AlertTypeEnum.WARNING, details);
  }

  /**
   * Method to show error alerts
   * @param message
   * @param details
   */
  showError(message: BilingualText, details?: Alert[], timeout?: number) {
    this.setAlert(message, AlertTypeEnum.DANGER, details, timeout);
  }

  /**
   * Method to show info alerts
   * @param message
   * @param details
   */
  showInfo(message: BilingualText, details?: Alert[]) {
    this.setAlert(message, AlertTypeEnum.INFO, details);
  }

  /**
   * This method is to get alert observable.
   *
   * @memberof AlertService
   */
  getAlerts(): Observable<Alert[]> {
    return this.alerts$;
  }

  /**
   * This method is to add new item to alert details.
   * UI created errors are in the form of BilingualText
   * @memberof AlertService
   */
  clearAlerts() {
    this.alerts.next([]);
  }

  /**
   * This method is to clear all errors in alert .
   * @memberof AlertService
   */
  clearAllErrorAlerts() {
    const tempAlertArray = this.alerts.value;
    this.alerts.value.forEach(function (object: Alert) {
      if (object.type === AlertTypeEnum.DANGER) tempAlertArray.splice(tempAlertArray.indexOf(object), 1);
    });
    this.alerts.next(tempAlertArray);
  }

  /**
   * This method is to clear all success in alert .
   * @memberof AlertService
   */
  clearAllSuccessAlerts() {
    const tempAlertArray = this.alerts.value;
    this.alerts.value.forEach(function (object: Alert) {
      if (object.type === AlertTypeEnum.SUCCESS) tempAlertArray.splice(tempAlertArray.indexOf(object), 1);
    });
    this.alerts.next(tempAlertArray);
  }

  /**
   * This method is to clear all warnings in alert .
   * @memberof AlertService
   */
  clearAllWarningAlerts() {
    const tempAlertArray = this.alerts.value;
    this.alerts.value.forEach(function (object: Alert) {
      if (object.type === AlertTypeEnum.WARNING) tempAlertArray.splice(tempAlertArray.indexOf(object), 1);
    });
    this.alerts.next(tempAlertArray);
  }

  /**
   * Method to show mandatory error message
   */
  showMandatoryErrorMessage() {
    this.showErrorByKey('CORE.ERROR.MANDATORY-FIELDS');
  }

  /**
   * Method to show document error message
   */
  showMandatoryDocumentsError() {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.showErrorByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
    } else {
      this.showErrorByKey('CORE.ERROR.UPLOAD-MANDATORY-DOCUMENTS');
    }
  }

  clearAlert(alert: Alert) {
    const tempAlertArray = this.alerts.value;
    this.alerts.value.forEach(function (object: Alert) {
      if (object === alert) tempAlertArray.splice(tempAlertArray.indexOf(object), 1);
    });
    this.alerts.next(tempAlertArray);
  }

  /**
   * This method is to clear all info in alert .
   * @memberof AlertService
   */
  clearAllInfoAlerts() {
    const tempAlertArray = this.alerts.value;
    this.alerts.value.forEach(function (object: Alert) {
      if (object.type === AlertTypeEnum.INFO) tempAlertArray.splice(tempAlertArray.indexOf(object), 1);
    });
    this.alerts.next(tempAlertArray);
  }
}
