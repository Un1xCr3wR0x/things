/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText } from './bilingual-text';
import { AlertTypeEnum } from '../enums';

/**
 * Model class to hold alert elements.
 *
 * @export
 * @class Alert
 */
export class Alert {
  alertId: number = Math.floor(1 + (10000 - 1) * Math.random());
  type: AlertTypeEnum = null;
  code?: string = undefined;
  status?: string = undefined;
  timeStamp?: Date = undefined;
  message: BilingualText = new BilingualText();
  //String type message received after translation
  messageKey: string = undefined;
  details?: Alert[] = [];
  dismissible = true;
  timeout: number = undefined;
  icon: string = undefined;
  messageParam?: Object;
}
