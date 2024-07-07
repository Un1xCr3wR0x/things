/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { TransactionHistoryRequest, TransactionHistoryResponse } from '../models';
import { map, catchError } from 'rxjs/operators';
import {
  ApplicationTypeToken,
  BilingualText,
  StorageService,
  AppConstants,
  ApplicationTypeEnum,
  ChannelConstants,
  AlertService,
  PsFeaturesModel
} from '@gosi-ui/core';

import { DatePipe } from '@angular/common';
import { TransactionTypeConstants } from 'libs/core/src/lib/constants/transaction-type-constants';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';
@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  /**Local variables */
  private baseUrl = '/api/v1';
  personIdentifier: number;
  mciTxnUrl: string;
  IsReopenTransaction: boolean = false;

  constructor(
    readonly http: HttpClient,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly datePipe: DatePipe,
    readonly storageService: StorageService,
    readonly alertService: AlertService
  ) {}
  transactionListUrl: string;
  _transactionRequest: TransactionHistoryRequest = undefined;
  /**
   *
   * fetching the transaction list
  /**
   *
   * @param transactionRequest
   *  sorting the list based on the sort parameter
   */
  getTransactions(
    transactionRequest: TransactionHistoryRequest,
    registrationNo?: string
  ): Observable<TransactionHistoryResponse> {
    this._transactionRequest = transactionRequest;
    this.transactionListUrl = `${this.baseUrl}/transaction?`;
    if (registrationNo) {
      this.transactionListUrl += `general=true&registrationNo=${registrationNo}&`;
    }
    if (transactionRequest.page.pageNo && transactionRequest.page.size) {
      this.transactionListUrl += `page.pageNo=${transactionRequest.page.pageNo}&page.size=${transactionRequest.page.size}`;
    } else {
      this.transactionListUrl += `page.pageNo=0&page.size=10`;
    }

    if (transactionRequest.filter.initiatedFrom && transactionRequest.filter.initiatedTo) {
      this.transactionListUrl += `&filter.initiatedDateFrom=${this.datePipe.transform(
        transactionRequest.filter.initiatedFrom,
        'dd-MM-yyyy'
      )}&filter.initiatedDateTo=${this.datePipe.transform(transactionRequest.filter.initiatedTo, 'dd-MM-yyyy')}`;
    }

    if (transactionRequest.filter.lastActionDate) {
      this.transactionListUrl += `&filter.lastActionDate=${this.datePipe.transform(
        transactionRequest.filter.lastActionDate,
        'dd-MM-yyyy'
      )}`;
    }

    if (transactionRequest.filter.status && transactionRequest.filter.status.length > 0) {
      transactionRequest.filter.status.forEach((value: BilingualText) => {
        this.transactionListUrl += `&filter.listOfStatus=${value.english}`;
      });
    }

    if (transactionRequest.filter.channel && transactionRequest.filter.channel.length > 0) {
      transactionRequest.filter.channel.forEach((value: BilingualText) => {
        const items = ChannelConstants.CHANNELS_FILTER_TRANSACTIONS?.find(
          item => item.english === value.english
        )?.value;
        this.transactionListUrl += `&filter.listOfChannels=${items}`;
      });
    }

    if (transactionRequest.search.value) {
      this.transactionListUrl += `&searchKey=${transactionRequest.search.value}`;
    }

    if (transactionRequest.sort.column) {
      this.transactionListUrl += `&sort.column=${transactionRequest.sort.column}`;
      if (transactionRequest.sort.direction) {
        this.transactionListUrl += `&sort.direction=DESC`;
      } else {
        this.transactionListUrl += `&sort.direction=ASC`;
      }
    }

    return this.http.get(this.transactionListUrl).pipe(
      map((resp: TransactionHistoryResponse) => {
        return resp;
      })
    );
  }

  getMCITransactions(registrationNo: number, businessTransaction: number): Observable<TransactionHistoryResponse> {
    this.mciTxnUrl = `${this.baseUrl}/transaction?businessTransaction=${businessTransaction}&general=true&registrationNo=${registrationNo}`;
    return this.http.get(this.mciTxnUrl).pipe(
      map((resp: TransactionHistoryResponse) => {
        return resp;
      })
    );
  }
  
  getServiceRequests(id) {
    const url = `${this.baseUrl}/profile/${id}/service-request`;
    return this.http.get(url);
  }

  getAllowedPSFeatures(): Observable<PsFeaturesModel>{
    const url = `/api/v1/ppa-services/shared/features`; 
    return this.http.get<PsFeaturesModel>(url);
  }


  getIndividualTransactions(
    transactionRequest: TransactionHistoryRequest,
    personIdentifier?: number,
    sin?: number
  ): Observable<TransactionHistoryResponse> {
    this._transactionRequest = transactionRequest;
    this.transactionListUrl = `${this.baseUrl}/transaction?general=true&`;
    if (personIdentifier) {
      this.transactionListUrl += `personIdentifier=${personIdentifier}&`;
    }
    if (sin) {
      this.transactionListUrl += `socialInsuranceNumber=${sin}&`;
    }
    if (transactionRequest.page.pageNo && transactionRequest.page.size) {
      this.transactionListUrl += `page.pageNo=${transactionRequest.page.pageNo}&page.size=${transactionRequest.page.size}`;
    } else {
      this.transactionListUrl += `page.pageNo=0&page.size=10`;
    }
    if (transactionRequest.filter.initiatedFrom && transactionRequest.filter.initiatedTo) {
      this.transactionListUrl += `&filter.initiatedDateFrom=${this.datePipe.transform(
        transactionRequest.filter.initiatedFrom,
        'dd-MM-yyyy'
      )}&filter.initiatedDateTo=${this.datePipe.transform(transactionRequest.filter.initiatedTo, 'dd-MM-yyyy')}`;
    }

    if (transactionRequest.filter.lastActionDate) {
      this.transactionListUrl += `&filter.lastActionDate=${this.datePipe.transform(
        transactionRequest.filter.lastActionDate,
        'dd-MM-yyyy'
      )}`;
    }

    if (transactionRequest.filter.status && transactionRequest.filter.status.length > 0) {
      transactionRequest.filter.status.forEach((value: BilingualText) => {
        this.transactionListUrl += `&filter.listOfStatus=${value.english}`;
      });
    }

    if (transactionRequest.filter.channel && transactionRequest.filter.channel.length > 0) {
      transactionRequest.filter.channel.forEach((value: BilingualText) => {
        const items = ChannelConstants.CHANNELS_FILTER_TRANSACTIONS?.find(
          item => item.english === value.english
        )?.value;
        this.transactionListUrl += `&filter.listOfChannels=${items}`;
      });
    }
    if (transactionRequest.filter.txnType) {
      transactionRequest.filter.txnType.forEach((values: BilingualText) => {
        const items = TransactionTypeConstants.TRANSACTION_TYPE_FILTER_TRANSACTIONS?.find(
          item => item.value.english === values.english
        )?.transactionId;
        this.transactionListUrl += `&transactionId=${items}`;
      });
    }
    if (transactionRequest.search.value) {
      this.transactionListUrl += `&searchKey=${transactionRequest.search.value}`;
    }

    if (transactionRequest.sort.column) {
      this.transactionListUrl += `&sort.column=${transactionRequest.sort.column}`;
      if (transactionRequest.sort.direction) {
        this.transactionListUrl += `&sort.direction=DESC`;
      } else {
        this.transactionListUrl += `&sort.direction=ASC`;
      }
    }

    return this.http.get(this.transactionListUrl).pipe(
      map((resp: TransactionHistoryResponse) => {
        return resp;
      })
    );
  }

  get transactionRequest(): TransactionHistoryRequest {
    return this._transactionRequest;
  }

  /** Method to call system params api to limit joining date of an engagement */
  getSystemParams(): Observable<SystemParameterWrapper[]> {
    const url = `/api/v1/lov/system-parameters?name=ReopenComplaintEnquiryEffectiveDate`;
    return this.http.get<SystemParameterWrapper[]>(url).pipe(catchError(err => this.handleError(err)));
  }

 /** Method to handle error while service call fails */
 private handleError(error: HttpErrorResponse) {
  return throwError(error);
}
}
