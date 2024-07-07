import { Injectable } from '@angular/core';
import { BilingualText, Lov, LovList } from '@gosi-ui/core';
import {
  CURRENT_OWNER_LOV_VALUE,
  NEW_OWNER_LOV_VALUE,
  TERMINATE_CONTRIBUTOR_LOV_VALUE,
  TRANSFER_CONTRIBUTOR_LOV_VALUE,
  TRANSFER_CONTRIBUTOR_NO_ACTION_LOV_VALUE
} from '@gosi-ui/features/establishment';
import { LookupServiceStub } from '../core';

export const CURRENT_ADMIN_LOV_VALUE: BilingualText = {
  english: 'Current Branches Account Manager',
  arabic: 'مدير حساب الفروع الحالي'
};
export const NEW_ADMIN_LOV_VALUE: BilingualText = {
  english: 'Replace Current Branches Account Manager',
  arabic: 'تغيير مدير حساب الفروع'
};

@Injectable({
  providedIn: 'root'
})
export class EstLookupServiceStub extends LookupServiceStub {
  /**
   * This method is to get the admin selection look up values during delink action.
   */
  getAdminSelectionList(): LovList {
    const lovlist: LovList = new LovList([]);
    let lov = new Lov();
    lov.value = CURRENT_ADMIN_LOV_VALUE;
    lovlist.items.push(lov);
    lov = new Lov();
    lov.value = NEW_ADMIN_LOV_VALUE;
    lovlist.items.push(lov);
    return lovlist;
  }
  /**
   * This method is to get the type of terminate contributor look up values during close establishment.
   */
  getTerminateContributorActionLovList = (): LovList => {
    const lovlist: LovList = new LovList([]);
    let lov = new Lov();
    lov.value = TERMINATE_CONTRIBUTOR_LOV_VALUE;
    lovlist.items.push(lov);
    lov = new Lov();
    lov.value = TRANSFER_CONTRIBUTOR_LOV_VALUE;
    lovlist.items.push(lov);
    lov = new Lov();
    lov.value = TRANSFER_CONTRIBUTOR_NO_ACTION_LOV_VALUE;
    lovlist.items.push(lov);
    return lovlist;
  };

  /**
   * Mock method for getSpecialisation.
   *
   * @returns
   * @memberof LookupServiceStub
   */
  getOwnerSelectionList = (): LovList => {
    const lovlist: LovList = new LovList([]);
    let lov = new Lov();
    lov.value = CURRENT_OWNER_LOV_VALUE;
    lovlist.items.push(lov);
    lov = new Lov();
    lov.value = NEW_OWNER_LOV_VALUE;
    lovlist.items.push(lov);
    return lovlist;
  };
}
