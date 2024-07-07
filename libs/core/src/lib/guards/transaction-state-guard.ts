/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TransactionInterface } from '../models/transaction-interface';

@Injectable({
  providedIn: 'root'
})
export class TransactionStateGuard implements CanDeactivate<TransactionInterface> {
  constructor() {}

  canDeactivate(
    component: TransactionInterface,
    _1: ActivatedRouteSnapshot,
    _2: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    component.reRoute = undefined;
    if (component.hasCompleted) {
      return true;
    } else {
      component.reRoute = nextState?.url;
      component.askForCancel();
      return false;
    }
  }
}
