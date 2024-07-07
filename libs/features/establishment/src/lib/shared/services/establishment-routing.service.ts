/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, ParamMap, Router } from '@angular/router';
import {
  BaseRoutingService,
  EstablishmentRouterData,
  EstablishmentToken,
  RouterConstants,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService
} from '@gosi-ui/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import { EstablishmentConstants } from '../constants';
import { EstablishmentRoutesEnum } from '../enums';
import { navigateWithTransactionId } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentRoutingService extends BaseRoutingService {
  private _currentUrl: string;
  private previousUrlSubject: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(EstablishmentToken) public establishmentToken: EstablishmentRouterData,
    readonly transactionService: TransactionService,
    readonly location: Location
  ) {
    super(routerData, router);
    if (this.router.events) {
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
        this.previousUrlSubject.next(this._currentUrl);
        this._currentUrl = event.url;
      });
    }
  }

  get previousUrl$(): Observable<string> {
    return this.previousUrlSubject.asObservable();
  }

  /**
   * Method to set the global router token to local token
   */
  setToLocalToken(params?: ParamMap) {
    if (this.routerData.taskId) {
      this.establishmentToken.setRouterDataToEstablishmenRouterData(this.routerData);
      // this.routerData.taskId = null;
      if (this.isValidator()) {
        this.navigateToValidator();
      } else if (this.isAdmin()) {
        this.navigateToAdminTransactions();
      } else {
        this.navigateToEdit();
      }
    } else if (
      this.router.url.indexOf(EstablishmentRoutesEnum.DRAFT_ROUTE) !== -1 &&
      !this.establishmentToken?.isDraft
    ) {
      this.transactionService
        .getTransaction(params.get('transactionRefId'))
        .pipe(
          tap(res => {
            const transaction: Transaction = res;
            const routerData = new EstablishmentRouterData();
            routerData.isDraft = true;
            routerData.registrationNo = +transaction.params.REGISTRATION_NO;
            routerData.referenceNo = transaction.transactionRefNo;
            routerData.transactionId = transaction.transactionId;
            this.establishmentToken.fromJsonToObject(routerData);
            this.navigateToResume(transaction.transactionId.toString(), routerData.registrationNo);
          }),
          catchError(() => {
            return of(null);
          })
        )
        .subscribe();
    } else if (
      this.establishmentToken?.isDraft &&
      this.router.url.indexOf(EstablishmentRoutesEnum.DRAFT_ROUTE) !== -1
    ) {
      this.location.back();
      this.establishmentToken.fromJsonToObject(new EstablishmentRouterData());
    }
  }

  /**
   * Method to navigate to validator view
   */
  navigateToValidator() {
    switch (this.establishmentToken.resourceType) {
      case RouterConstants.TRANSACTION_CHANGE_EST_BASIC_DETAILS: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_BASIC_DETAILS]);
        break;
      }
      case RouterConstants.TRANSACTION_CHANGE_EST_IDENTIFIER_DETAILS: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_IDENTIFIERS]);
        break;
      }
      case RouterConstants.TRANSACTION_CHANGE_EST_BANK_DETAILS: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_BANK_DETAILS]);
        break;
      }
      case RouterConstants.TRANSACTION_REOPEN_ESTABLISHMENT: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_RE_OPEN]);
        break;
      }
      case RouterConstants.TRANSACTION_CHANGE_EST_ADDRESS_DETAILS: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_ADDRESS_DETAILS]);
        break;
      }
      case RouterConstants.TRANSACTION_CHANGE_EST_CONTACT_DETAILS: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_CONTACT_DETAILS]);
        break;
      }
      case RouterConstants.TRANSACTION_CHANGE_EST_OWNER: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_CHANGE_OWNER]);
        break;
      }
      case RouterConstants.TRANSACTION_CHANGE_LEGAL_ENTITY: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_LEGAL_ENTITY]);
        break;
      }
      case RouterConstants.TRANSACTION_CHANGE_MAIN_ESTABLISHMENT: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_CHANGE_MAIN_EST]);
        break;
      }
      case RouterConstants.TRANSACTION_DELINK_ESTABLISHMENT: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_DELINK]);
        break;
      }
      case RouterConstants.TRANSACTION_LINK_ESTABLISHMENT: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_LINK_EST]);
        break;
      }
      case RouterConstants.TRANSACTION_REPLACE_SUPER_ADMIN:
      case RouterConstants.TRANSACTION_REPLACE_GCC_ADMIN: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_REPLACE_SUPER_ADMIN]);
        break;
      }
      case RouterConstants.TRANSACTION_TERMINATE_ESTABLISHMENT:
      case RouterConstants.TRANSACTION_GOL_TERMINATE_ESTABLISHMENT: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_TERMINATE]);
        break;
      }
      case RouterConstants.TRANSACTION_REGISTER_ESTABLISHMENT:
      case RouterConstants.TRANSACTION_REGISTER_GCC_ESTABLISHMENT:
      case RouterConstants.TRANSACTION_PROACTIVE_FEED: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_REGISTER_ESTABLISHMENT]);
        break;
      }
      case RouterConstants.TRANSACTION_FLAG_ESTABLISHMENT: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_FLAG]);
        break;
      }
      case RouterConstants.TRANSACTION_MODIFY_FLAG_ESTABLISHMENT: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_FLAG]);
        break;
      }
      case RouterConstants.TRANSACTION_INSPECTION: {
        this.router.navigate([EstablishmentRoutesEnum.INSURANCE_OP_HEAD_INSPECTION]);
        break;
      }
      case RouterConstants.TRANSACTION_LATE_FEE: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_LATE_FEE]);
        break;
      }
      case RouterConstants.TRANSACTION_ADD_GCC_ADMIN:
      case RouterConstants.TRANSACTION_ADD_SUPER_ADMIN: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_REGISTER_SUPER_ADMIN]);
        break;
      }
      case RouterConstants.TRANSACTION_CHANGE_MOF_PAYMENT_DETAILS: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_CHANGE_MOF_PAYMENT]);
        break;
      }
    }
  }

  /**
   * Method to navigate to Edit View
   */
  navigateToEdit() {
    switch (this.establishmentToken.resourceType) {
      case RouterConstants.TRANSACTION_CHANGE_EST_BASIC_DETAILS: {
        this.router.navigate([EstablishmentRoutesEnum.ADMIN_EDIT_CHANGE_BASIC_DETAILS]);
        break;
      }
      case RouterConstants.TRANSACTION_CHANGE_EST_IDENTIFIER_DETAILS: {
        this.router.navigate([EstablishmentRoutesEnum.ADMIN_EDIT_CHANGE_IDENTIFIER_DETAILS]);
        break;
      }
      case RouterConstants.TRANSACTION_CHANGE_EST_BANK_DETAILS: {
        this.router.navigate([EstablishmentRoutesEnum.ADMIN_EDIT_CHANGE_BANK_DETAILS]);
        break;
      }
      case RouterConstants.TRANSACTION_CHANGE_EST_CONTACT_DETAILS: {
        this.router.navigate([EstablishmentRoutesEnum.ADMIN_EDIT_CHANGE_CONTACT_DETAILS]);
        break;
      }
      case RouterConstants.TRANSACTION_CHANGE_EST_ADDRESS_DETAILS: {
        this.router.navigate([EstablishmentRoutesEnum.ADMIN_EDIT_CHANGE_ADDRESS_DETAILS]);
        break;
      }
      case RouterConstants.TRANSACTION_CHANGE_EST_OWNER: {
        this.router.navigate([EstablishmentRoutesEnum.ADMIN_EDIT_CHANGE_OWNER]);
        break;
      }
      case RouterConstants.TRANSACTION_CHANGE_LEGAL_ENTITY: {
        this.router.navigate([EstablishmentRoutesEnum.ADMIN_EDIT_CHANGE_LEGAL_ENTITY]);
        break;
      }
      case RouterConstants.TRANSACTION_PROACTIVE_FEED: {
        this.router.navigate([EstablishmentConstants.PROACTIVE_ADMIN_REENTER_ROUTE()]);
        break;
      }
      case RouterConstants.TRANSACTION_CHANGE_MAIN_ESTABLISHMENT: {
        this.router.navigate([EstablishmentRoutesEnum.CHANGE_MAIN]);
        break;
      }
      case RouterConstants.TRANSACTION_REPLACE_SUPER_ADMIN:
      case RouterConstants.TRANSACTION_REPLACE_GCC_ADMIN: {
        this.router.navigate([
          EstablishmentConstants.REPLACE_SUPER_ADMIN_ROUTE(this.establishmentToken.registrationNo)
        ]);
        break;
      }
      case RouterConstants.TRANSACTION_ADD_GCC_ADMIN:
      case RouterConstants.TRANSACTION_ADD_SUPER_ADMIN: {
        this.router.navigate([
          EstablishmentConstants.ROUTE_REGISTER_SUPER_ADMIN(this.establishmentToken.registrationNo)
        ]);
        break;
      }
      case RouterConstants.TRANSACTION_TERMINATE_ESTABLISHMENT: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_TERMINATE]);
        break;
      }
      case RouterConstants.TRANSACTION_REOPEN_ESTABLISHMENT: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_RE_OPEN]);
        break;
      }
      case RouterConstants.TRANSACTION_GOL_TERMINATE_ESTABLISHMENT: {
        this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_TERMINATE_ADMIN_MODIFY]);
        break;
      }
      case RouterConstants.TRANSACTION_FLAG_ESTABLISHMENT: {
        this.router.navigate([EstablishmentRoutesEnum.ADD_FLAG]);
        break;
      }
      case RouterConstants.TRANSACTION_MODIFY_FLAG_ESTABLISHMENT: {
        this.router.navigate([
          EstablishmentConstants.MODIFY_FLAG_ROUTE(
            this.establishmentToken.registrationNo,
            this.establishmentToken.flagId
          )
        ]);
        break;
      }
      case RouterConstants.TRANSACTION_LATE_FEE: {
        this.router.navigate([EstablishmentRoutesEnum.MODIFY_LATE_FEE]);
        break;
      }
      case RouterConstants.RASED_DOCUMENT_UPLOAD: {
        this.router.navigate([EstablishmentRoutesEnum.RASED_DCOUMENT_UPLOAD]);
        break;
      }
    }
  }

  navigateToResume(transactionId: string, registrationNo: number) {
    navigateWithTransactionId(this.router, transactionId, registrationNo);
  }
  /**
   * Method to navigate to validator view
   */
  navigateToAdminTransactions() {
    switch (this.establishmentToken?.resourceType) {
      // change resourceType and router url
      case RouterConstants.TRANSACTION_SC_ADMIN_EVALUATION: {
        this.router.navigate([EstablishmentRoutesEnum.SC_ADMIN_EVALUATION_TRANSACTION]);
        break;
      }
    }
  }
}
