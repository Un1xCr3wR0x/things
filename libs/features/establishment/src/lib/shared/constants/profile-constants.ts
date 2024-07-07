/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DropdownItem } from '@gosi-ui/core';
import { EstablishmentActionEnum, EstablishmentRoutesEnum } from '../enums';
import { TransactionDetails } from '../models';
import { getDropDownItem } from '../utils/helper';

export class ProfileConstants {
  public static get groupActionsDropdown(): DropdownItem[] {
    return [
      getDropDownItem(EstablishmentActionEnum.REG_NEW_EST, 'plus'),
      getDropDownItem(EstablishmentActionEnum.CHG_MAIN_EST, 'star'),
      getDropDownItem(EstablishmentActionEnum.DELINK_NEW_GRP, 'unlink'),
      getDropDownItem(EstablishmentActionEnum.DELINK_OTHER, 'external-link-alt')
    ];
  }

  public static get establishmentActionsDropdown(): DropdownItem[] {
    return [getDropDownItem(EstablishmentActionEnum.CLOSE_EST, 'times-circle')];
  }

  public static get establishmentReopenDropdown(): DropdownItem[] {
    return [getDropDownItem(EstablishmentActionEnum.REOPEN_EST, 'redo')];
  }
  public static actionFunctionalityMap(): Map<EstablishmentActionEnum, TransactionDetails> {
    const map: Map<EstablishmentActionEnum, TransactionDetails> = new Map();
    map.set(
      EstablishmentActionEnum.CHG_MAIN_EST,
      ProfileConstants.getValidityCheck(
        EstablishmentActionEnum.CHG_MAIN_EST,
        EstablishmentRoutesEnum.CHANGE_MAIN,
        'ESTABLISHMENT.CHANGE-MAIN-EST'
      )
    );
    map.set(
      EstablishmentActionEnum.DELINK_NEW_GRP,
      ProfileConstants.getValidityCheck(
        EstablishmentActionEnum.DELINK_NEW_GRP,
        EstablishmentRoutesEnum.DELINK_NEW,
        'ESTABLISHMENT.DELINK-NEW-GROUP'
      )
    );
    map.set(
      EstablishmentActionEnum.DELINK_OTHER,
      ProfileConstants.getValidityCheck(
        EstablishmentActionEnum.DELINK_OTHER,
        EstablishmentRoutesEnum.DELINK,
        'ESTABLISHMENT.DELINK-OTHER-GROUP'
      )
    );
    map.set(
      EstablishmentActionEnum.REG_NEW_EST,
      ProfileConstants.getValidityCheck(
        EstablishmentActionEnum.REG_NEW_EST,
        EstablishmentRoutesEnum.VERIFY_REG_ESTABLISHMENT,
        undefined
      )
    );
    return map;
  }

  private static getValidityCheck(action: EstablishmentActionEnum, route: string, header: string): TransactionDetails {
    const transaction = new TransactionDetails();
    transaction.action = action;
    transaction.route = route;
    transaction.heading = header;
    return transaction;
  }
}
