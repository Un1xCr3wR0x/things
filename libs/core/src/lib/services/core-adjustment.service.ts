import { Injectable } from '@angular/core';
import { Messages } from '@gosi-ui/features/payment/lib/shared';
import { AlertTypeEnum } from '../enums';
import { Alert } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CoreAdjustmentService {
  idNumber;
  type;
  benefits;
  benefitRequestId;
  sin;
  constructor() {}
  public set identifier(id) {
    this.idNumber = id;
  }
  public get identifier() {
    return this.idNumber;
  }
  public set benefitType(type) {
    this.type = type;
  }
  public get benefitType() {
    return this.type;
  }
  public get benefitDetails() {
    return this.benefits;
  }
  public set benefitDetails(benefits) {
    this.benefits = benefits;
  }
  mapMessagesToAlert(warningMessages: Messages, type: AlertTypeEnum = AlertTypeEnum.WARNING): Alert {
    const alert = new Alert();
    alert.message = undefined;
    alert.type = type;
    alert.dismissible = false;
    alert.details = warningMessages?.details?.map(val => {
      return { ...new Alert(), ...{ message: val } };
    });
    return alert;
  }
  public set benefitRequestNumber(benefitId) {
    this.benefitRequestId = benefitId;
  }
  public get benefitRequestNumber() {
    return this.benefitRequestId;
  }
  public set socialNumber(sin) {
    this.sin = sin;
  }
  public get socialNumber() {
    return this.sin;
  }
}
