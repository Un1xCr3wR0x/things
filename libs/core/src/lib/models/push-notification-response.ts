import { BilingualText } from './bilingual-text';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class PushNotificationSubscriptionResponse {
  subscriptionId: number = undefined;
  message: BilingualText = new BilingualText();
}
