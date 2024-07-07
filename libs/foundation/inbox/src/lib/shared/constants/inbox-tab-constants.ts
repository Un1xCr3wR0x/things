import { Tab } from '@gosi-ui/core';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class InboxTabConstants {
  public static get getInboxTabs(): Tab[] {
    return [
      {
        icon: '',
        label: 'TODAY',
        url: '',
        count: 1
      },
      {
        icon: '',
        label: 'LAST-SEVEN-DAYS',
        url: '',
        count: 7
      },
      {
        icon: '',
        label: 'LAST-30-DAYS',
        url: '',
        count: 30
      }
    ];
  }
}
