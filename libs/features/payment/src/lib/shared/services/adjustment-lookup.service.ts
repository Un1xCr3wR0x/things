import { Injectable } from '@angular/core';
import { BilingualText, LovList, Lov, Transaction, CryptoService } from '@gosi-ui/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export const SORT_ADJUSTMENT_LOV_VALUE_DATE_CREATED: BilingualText = {
  english: 'Date Created',
  arabic: 'تاريخ الإنشاء'
};

export const SORT_ADJUSTMENT_LOV_VALUE_ADJUSTMENT_ID: BilingualText = {
  english: 'Adjustment Id',
  arabic: 'رقم التسوية'
};

export const SORT_ADJUSTMENT_LOV_VALUE_ADJUSTMENT_AMOUNT: BilingualText = {
  english: 'Adjustment Amount',
  arabic: 'مبلغ التسوية'
};

export const SORT_ADJUSTMENT_LOV_VALUE_MONTHLY_DEDUCTION: BilingualText = {
  english: 'Monthly Deduction Amount',
  arabic: 'مبلغ الاستقطاع الشهري'
};

export const SORT_ADJUSTMENT_LOV_VALUE_BALANCE_AMOUNT: BilingualText = {
  english: 'Balance Amount',
  arabic: 'الرصيد'
};

@Injectable({
  providedIn: 'root'
})
export class AdjustmentLookupService {
  constructor(private http: HttpClient, private cryptoService: CryptoService) {}
  getGosiAdjustmentSortLov(): Observable<LovList> {
    return of(
      new LovList([
        {
          value: {
            english: 'Date Created',
            arabic: 'تاريخ الإنشاء'
          },
          sequence: 1
        },
        {
          value: {
            english: 'Benefit Request Date',
            arabic: 'تاريخ طلب المنفعة'
          },
          sequence: 2
        },
        {
          value: {
            english: 'Adjustment Amount',
            arabic: 'مبلغ التسوية'
          },
          sequence: 3
        }
      ])
    );
  }

  getTpaAdjustmentSortLov(): Observable<LovList> {
    return of(
      new LovList([
        {
          value: SORT_ADJUSTMENT_LOV_VALUE_DATE_CREATED,
          sequence: 1
        },
        {
          value: SORT_ADJUSTMENT_LOV_VALUE_ADJUSTMENT_ID,
          sequence: 2
        },
        {
          value: SORT_ADJUSTMENT_LOV_VALUE_ADJUSTMENT_AMOUNT,
          sequence: 3
        },
        {
          value: SORT_ADJUSTMENT_LOV_VALUE_MONTHLY_DEDUCTION,
          sequence: 4
        },
        {
          value: SORT_ADJUSTMENT_LOV_VALUE_BALANCE_AMOUNT,
          sequence: 5
        }
      ])
    );
  }
  /** Method to get adjustment reason */
  getAdjustmentReason(eligibleForPensionReform = false): Observable<LovList> {
    const domain =
      (eligibleForPensionReform === true || eligibleForPensionReform.toString() === 'true') ?
        'PensionReformAdjustmentType' : 'AdjustmentType';
    const url = `/api/v1/lov?category=Annuities&domainName=${domain}`;
    return this.http.get<Lov[]>(url).pipe(
      map(lov => {
        return { items: lov };
      })
    );
  }
  /** Method to get transaction id */
  getTransaction(transactionTraceId) {
    const encryptedId = this.cryptoService.encrypt(transactionTraceId);
    const getTxnUrl = `/api/v1/transaction/${encryptedId}`;
    return this.http.get<Transaction>(getTxnUrl);
  }
}
