import { of } from 'rxjs';
import { BilingualText, Alert } from '@gosi-ui/core';

enum AlertType {
  success = 'success',
  info = 'info',
  warning = 'warning',
  danger = 'danger'
}

export class AlertServiceStub {
  /**
   * Creates an instance of AlertService.
   *
   * @memberof AlertService
   */

  getAlerts() {
    return of(null);
  }

  clearAlerts() {}
  clearAllErrorAlerts() {}
  clearAllSuccessAlerts() {}
  clearAllWarningAlerts() {}
  clearAllInfoAlerts() {}

  setAlert() {}

  getAlertTypes() {
    return AlertType;
  }
  showMandatoryErrorMessage() {}
  setErrorAlert(errorMessage, errorDetails) {
    if (errorDetails || errorMessage) {
    }
  }
  setMandatoryErrorMessage() {}

  showError(message: BilingualText, details?: Alert[]) {
    if (message || details) {
    }
  }

  showErrorByKey(message: BilingualText, details?: Alert[]) {
    if (message || details) {
    }
  }

  showSuccessByKey() {}

  showSuccess(message: BilingualText, details?: Alert[]) {
    if (message || details) {
    }
  }

  showWarning() {}
  showWarningByKey(messageKey: BilingualText) {
    if (messageKey) {
    }
  }
  clearAlert(_: Alert) {}

  /**
   * Method to show document error message
   */
  showMandatoryDocumentsError() {}
  setInfoByKey(message: BilingualText, details?: Alert[]) {
    if (message || details) {
    }
  }
}
