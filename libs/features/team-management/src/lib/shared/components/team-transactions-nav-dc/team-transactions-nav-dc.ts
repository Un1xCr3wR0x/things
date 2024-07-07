/*
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TransactionModalTypeEnum } from '../../enums';
import { SearchColumn } from '@gosi-ui/core';

interface Action {
  name: string;
  icon: string;
  key: string;
}

/**
 * This class is to return Team Transaction Navigation details.
 * @export
 * @class TeamTransactionsNav
 */

export class TeamTransactionsNav {
  public static get TO_HOLD_ACTION() {
    const holdAction: Action[] = [
      {
        name: 'TEAM-MANAGEMENT.REASSIGN_TRANSACTIONS',
        icon: 'exchange-alt',
        key: TransactionModalTypeEnum.REASSIGN
      },
      {
        name: 'TEAM-MANAGEMENT.HOLD_TRANSACTIONS',
        icon: 'lock',
        key: TransactionModalTypeEnum.HOLD
      }
    ];
    return holdAction;
  }

  public static get TO_UNHOLD_ACTION() {
    const unholdAction: Action[] = [
      {
        name: 'TEAM-MANAGEMENT.UNHOLD',
        icon: 'unlock',
        key: TransactionModalTypeEnum.UNHOLD
      },
      {
        name: 'TEAM-MANAGEMENT.UNHOLD_AND_REASSIGN',
        icon: 'exchange-alt',
        key: TransactionModalTypeEnum.UNHOLD_AND_REASSIGN
      }
    ];
    return unholdAction;
  }

  public static get ACTION_MESSAGE() {
    return [TeamTransactionsNav.TO_HOLD_ACTION, TeamTransactionsNav.TO_UNHOLD_ACTION];
  }
}
