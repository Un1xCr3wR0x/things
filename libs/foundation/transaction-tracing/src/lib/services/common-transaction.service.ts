import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AlertService, ApplicationTypeToken, StorageService } from '@gosi-ui/core';
import { IndividualCommonTransfer } from '@gosi-ui/core/lib/models/inidividual-common-transfer';
import { BaseService } from '@gosi-ui/foundation/transaction-tracing/lib/services/base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonTransactionDenodoApi } from '../models/common-transaction-denodo-api';

@Injectable({
  providedIn: 'root'
})
export class CommonTransactionService extends BaseService {
  constructor(
    readonly http: HttpClient,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly datePipe: DatePipe,
    readonly storageService: StorageService,
    readonly alertService: AlertService
  ) {
    super();
  }

  getDenodoTransactions(nin: number): Observable<IndividualCommonTransfer[]> {
    //const getDenodoTransactionsUrl = `${this.interceptUrl}/customer360/dv_rased_inspectionservice_query/views/dv_rased_inspectionservice_query/?id=${nin}`;
    const getDenodoTransactionsUrl = `/api/v1/denodosmsapiproxy/server/customer360/dv_rased_inspectionservice_query/views/dv_rased_inspectionservice_query?id=${nin}`;
    return this.http
      .get<{
        elements: CommonTransactionDenodoApi[];
      //}>(getDenodoTransactionsUrl, { headers: this.getHeaders() })
    }>(getDenodoTransactionsUrl)
      .pipe(
        map(resp => {
          const rasedList = [];
          resp.elements.forEach(elem => {
            const transaction: IndividualCommonTransfer = {
              transactionId: 0,
              transactionRefNo: elem.fieldactivitynumber,
              title: { arabic: elem.transaction_name_ar, english: elem.transaction_name_en },
              description: { english: null, arabic: null },
              status: { english: elem.status_en, arabic: elem.status_ar },
              initiatedDate: {
                gregorian: elem.createdon == null ? null : new Date(elem.createdon),
                entryFormat: elem.createdon,
                hijiri: elem.createdon
              },
              lastActionedDate: {
                gregorian: elem.updatedon == null ? null : new Date(elem.updatedon),
                entryFormat: elem.updatedon,
                hijiri: elem.updatedon
              },
              channel: null,
              assignedTo: null,
              assigneeName: null,
              businessId: null,
              contributorId: null,
              registrationNo: null,
              params: null,
              establishmentId: null,
              sin: null,
              idParams: null,
              taskId: null,
              pendingWith: null,
              fromJsonToObject(json) {
                return null;
              }
            };
            rasedList.push(transaction);
          });
          return rasedList;
        })
      );
  }
}
