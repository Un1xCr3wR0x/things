import { BilingualText, Alert } from '../models';
import { AlertTypeEnum, AlertIconEnum } from '../enums';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const message: BilingualText = {
  english: 'Test',
  arabic: 'Test'
};

export const details: Alert[] = [
  {
    alertId: 0,
    type: AlertTypeEnum.SUCCESS,
    messageKey: '',
    message: {
      english: '',
      arabic: ''
    },
    dismissible: false,
    timeout: 0,
    icon: ''
  }
];

export const alertDanger = {
  message: message,
  type: AlertTypeEnum.DANGER,
  timeout: 2000,
  icon: AlertIconEnum.ERROR,
  details: details,
  messageKey: undefined,
  dismissible: true
};

export const alertInfo = {
  message: message,
  type: AlertTypeEnum.INFO,
  timeout: 2000,
  icon: AlertIconEnum.INFO,
  details: details,
  messageKey: undefined,
  dismissible: true
};

export const alertSuccess = {
  message: message,
  type: AlertTypeEnum.SUCCESS,
  timeout: 2000,
  icon: AlertIconEnum.SUCCESS,
  details: details,
  messageKey: undefined,
  dismissible: true
};

export const alertWarning = {
  message: message,
  type: AlertTypeEnum.WARNING,
  timeout: 2000,
  icon: AlertIconEnum.WARNING,
  details: details,
  messageKey: undefined,
  dismissible: true
};
