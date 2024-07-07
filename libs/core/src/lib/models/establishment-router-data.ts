import { TransactionReferenceData } from '@gosi-ui/core';
import { PayloadKeyEnum } from '../enums';
import { RouterData } from './router-data';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class EstablishmentRouterData {
  registrationNo: number = undefined;
  user: string = undefined;
  taskId: string = undefined;
  assignedRole: string = undefined; // Assigned Role - Validator,Validator1,estadmin,Validator2
  previousOwnerRole: string = undefined; // Previous Assigned Role - Validator,Validator1,estadmin,Validator2
  resourceType: string = undefined;
  referenceNo: number = undefined;
  tabIndicator: number = undefined;
  channel: string = undefined;
  flagId: number = undefined;
  inspectionId: number = undefined;
  comments: TransactionReferenceData[] = [];
  previousOutcome?: string = undefined;
  isDraft? = false;
  transactionId?: number = undefined;

  setRouterDataToEstablishmenRouterData(routerData: RouterData) {
    this.fromJsonToObject(routerData);
    if (Number(routerData.resourceId)) {
      this.registrationNo = Number(routerData.resourceId);
    }
    this.user = routerData.assigneeId;
    this.referenceNo = routerData.transactionId;
  }

  resetRouterData() {
    this.registrationNo = 0;
    this.user = null;
    this.taskId = null;
    this.assignedRole = null; // Assigned Role - Validator,Validator1,estadmin,Validator2
    this.previousOwnerRole = null; // Previous Assigned Role - Validator,Validator1,estadmin,Validator2
    this.resourceType = null;
    this.referenceNo = 0;
    this.tabIndicator = 0;
    this.flagId = null;
    this.inspectionId = null;
  }

  //Method to bind value from json to object
  fromJsonToObject(json: RouterData | EstablishmentRouterData) {
    Object.keys(new EstablishmentRouterData()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    if (json['idParams']) {
      this.channel = json['idParams'].get('channel');
      this.registrationNo = json['idParams'].get('id');
      this.flagId = json['idParams'].get('flagId');
      this.inspectionId = +json['idParams'].get('inspectionId');
      this.previousOwnerRole = json['idParams'].get(PayloadKeyEnum.PREVIOUSOWNER);
      this.previousOutcome = json['idParams'].get(PayloadKeyEnum.PREVIOUS_OUTCOME);
    }
    return this;
  }
}
