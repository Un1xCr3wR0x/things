/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable, Inject } from '@angular/core';
import { RouterDataToken, RouterData, RouterConstants, ApplicationTypeToken, ApplicationTypeEnum } from '@gosi-ui/core';
import { Router } from '@angular/router';
import { RouterConstants as ComplaintsRouterConstants } from '../constants';
import { ComplaintRouterData } from '../models';
@Injectable({
  providedIn: 'root'
})
export class ValidatorRoutingService {
  /**
   *
   * @param router
   * @param routerData
   * @param appToken
   */
  complaintRouterData: ComplaintRouterData;
  constructor(
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}
  /**
   * method to navigate to a particular txn details page
   */
  navigateTo() {
    if (
      this.routerData !== undefined &&
      this.routerData.resourceType !== undefined &&
      RouterConstants &&
      RouterConstants.TRANSACTIONS_UNDER_COMPLAINTS &&
      RouterConstants.TRANSACTIONS_UNDER_COMPLAINTS.length > 0 &&
      RouterConstants.TRANSACTIONS_UNDER_COMPLAINTS.indexOf(this.routerData.resourceType) >= 0
    ) {
      this.setRouterToken();
      switch (this.complaintRouterData.requestType) {
        case RouterConstants.TRANSACTION_COMPLAINT:
          this.router.navigate([ComplaintsRouterConstants.ROUTE_VALIDATOR_COMPLAINT]);
          break;
        case RouterConstants.TRANSACTION_ENQUIRY:
          this.router.navigate([ComplaintsRouterConstants.ROUTE_VALIDATOR_ENQUIRY]);
          break;
        case RouterConstants.TRANSACTION_APPEAL:
          this.router.navigate([ComplaintsRouterConstants.ROUTE_VALIDATOR_APPEAL]);
          break;
        case RouterConstants.TRANSACTION_PLEA:
          this.router.navigate([ComplaintsRouterConstants.ROUTE_VALIDATOR_PLEA]);
          break;
        case RouterConstants.TRANSACTION_SUGGESTION:
          this.router.navigate([ComplaintsRouterConstants.ROUTE_VALIDATOR_SUGGESTION]);
          break;
        default:
          this.router.navigate([
            this.appToken === ApplicationTypeEnum.PRIVATE ? RouterConstants.ROUTE_INBOX : RouterConstants.ROUTE_TODOLIST
          ]);
          break;
      }
    } else if (this.routerData !== undefined &&
      this.routerData.resourceType !== undefined &&
      RouterConstants.PRIVATE_SECTOR_APPEAl == this.routerData.resourceType && 
      this.appToken === ApplicationTypeEnum.PUBLIC) {
        this.setRouterToken();
        this.router.navigate([ComplaintsRouterConstants.ROUTE_VALIDATOR_PRIVATE_SECTOR_APPEAL]);
    } else
      this.router.navigate([
        this.appToken === ApplicationTypeEnum.PRIVATE ? RouterConstants.ROUTE_INBOX : RouterConstants.ROUTE_TODOLIST
      ]);
  }
  /**
   * method to remove token
   */
  removeRouterToken() {
    this.complaintRouterData = null;
    this.routerData.resourceType = null;
  }
  /**
   * method to set router token
   */
  setRouterToken() {
    this.complaintRouterData = new ComplaintRouterData(this.routerData);
  }
}
