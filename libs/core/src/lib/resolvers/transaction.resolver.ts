/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionResolver implements Resolve<Observable<Transaction>> {
  constructor(private transactionService: TransactionService) {}

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<Transaction> {
    const transactionRefId = route.paramMap.get('transactionRefId');
    return this.transactionService.getTransaction(transactionRefId);
  }
}
