/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BilingualText, LookupService, Lov, LovList } from '@gosi-ui/core';
import { Observable, of } from 'rxjs';

export const CURRENT_OWNER_LOV_VALUE: BilingualText = { english: 'Current Owners', arabic: 'الملاك الحاليين' };
export const NEW_OWNER_LOV_VALUE: BilingualText = { english: 'New Owners', arabic: 'الملاك المضافين ' };

export const CURRENT_ADMIN_LOV_VALUE: BilingualText = {
  english: 'Current Branches Account Manager',
  arabic: 'مدير حساب الفروع الحالي'
};
export const NEW_ADMIN_LOV_VALUE: BilingualText = {
  english: 'Replace Current Branches Account Manager',
  arabic: 'تغيير مدير حساب الفروع'
};

export const TERMINATE_CONTRIBUTOR_LOV_VALUE: BilingualText = {
  english: 'Terminate all contributors',
  arabic: 'استبعاد جميع المشتركين'
};
export const TRANSFER_CONTRIBUTOR_LOV_VALUE: BilingualText = {
  english: 'Transfer all contributors to a branch ',
  arabic: 'نقل جميع المشتركين إلى الفرع'
};
export const TRANSFER_CONTRIBUTOR_NO_ACTION_LOV_VALUE: BilingualText = {
  english: 'Proceed without any action',
  arabic: 'المتابعة دون اتخاذ أي إجراء'
};

export const SORT_FLAG_LOV_VALUE_START_DATE: BilingualText = {
  english: 'Start Date',
  arabic: 'تاريخ البداية'
};
export const SORT_FLAG_LOV_VALUE_END_DATE: BilingualText = {
  english: 'End Date',
  arabic: 'تاريخ النهاية'
};
export const CONTRIBUTOR_TRANSFER_REASON: BilingualText = {
  english: 'Transfer',
  arabic: 'نقل بين فروع المنشأة'
};
export const CONTRIBUTOR_TERMINATE_REASON: BilingualText = {
  english: 'Closure of Establishment',
  arabic: 'انهاء نشاط'
};

@Injectable({
  providedIn: 'root'
})
export class EstLookupService extends LookupService {
  constructor(readonly http: HttpClient) {
    super(http);
  }

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

  getOwnerSelectionList(): LovList {
    const lovlist: LovList = new LovList([]);
    let lov = new Lov();
    lov.value = CURRENT_OWNER_LOV_VALUE;
    lovlist.items.push(lov);
    lov = new Lov();
    lov.value = NEW_OWNER_LOV_VALUE;
    lovlist.items.push(lov);
    return lovlist;
  }

  getSortByList(): LovList {
    const lovlist: LovList = new LovList([]);
    let lov = new Lov();
    lov.value = SORT_FLAG_LOV_VALUE_START_DATE;
    lovlist.items.push(lov);
    lov = new Lov();
    lov.value = SORT_FLAG_LOV_VALUE_END_DATE;
    lovlist.items.push(lov);
    return lovlist;
  }

  getContributorLeavingReasonList(): Observable<LovList> {
    const lovlist: LovList = new LovList([]);
    let lov = new Lov();
    lov.value = CONTRIBUTOR_TRANSFER_REASON;
    lovlist.items.push(lov);
    lov = new Lov();
    lov.value = CONTRIBUTOR_TERMINATE_REASON;
    lovlist.items.push(lov);
    return of(lovlist);
  }
}
