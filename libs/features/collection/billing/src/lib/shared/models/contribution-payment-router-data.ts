/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { RouterData } from '@gosi-ui/core';

export class ContributionPaymentRouterData {
  taskId: string = undefined;
  assignedRole: string = undefined;
  user: string = undefined;
  registrationNumber: number = undefined;
  receiptNo: number = undefined;
  resourceType: string = undefined;
  tabIndicator: number = undefined;

  //Method to set the router data
  setRouterDataToContributionPaymentData(routerData: RouterData) {
    this.fromJsonToObject(routerData);
    const payload = JSON.parse(routerData.payload);
    if (payload.registrationNo) {
      this.registrationNumber = payload.registrationNo;
    }
    if (payload.id) {
      this.receiptNo = payload.id;
    }
    this.user = routerData.assigneeId;
  }

  fromJsonToObject(json) {
    Object.keys(new ContributionPaymentRouterData()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
