enum AlertIcon {
  iconDanger = 'exclamation-triangle',
  iconSuccess = 'check-circle',
  iconInfo = 'info-circle'
}

enum AlertType {
  success = 'success',
  info = 'info',
  warning = 'warning',
  danger = 'danger'
}

export const getAlert = (message, type, details?) => {
  if (message) {
    const alert = new Object();
    alert['message'] = message;
    alert['dismissible'] = false;
    alert['type'] = type;
    if (type === AlertType.danger || type === AlertType.warning) {
      alert['icon'] = AlertIcon.iconDanger;
    } else if (type === AlertType.info) {
      alert['icon'] = AlertIcon.iconInfo;
    } else {
      alert['icon'] = AlertIcon.iconSuccess;
    }
    if (details) {
      alert['details'] = details;
    }

    return alert;
  }
};

export const getAlertInfo = (message, details?) => {
  return getAlert(message, AlertType.info, details);
};
export const getAlertDanger = (message, details?) => {
  return getAlert(message, AlertType.danger, details);
};
export const getAlertWarning = (message, details?) => {
  return getAlert(message, AlertType.warning, details);
};
export const getAlertSuccess = (message, details?) => {
  return getAlert(message, AlertType.success, details);
};
