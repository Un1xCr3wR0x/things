import { BilingualText, GosiCalendar } from '@gosi-ui/core';
import { BankAccountDetails } from './bank-account-details';

export class EstablishmentAccountDetails {
  comments: string = undefined;
  contentIds: string = undefined;
  navigationIndicator: boolean = undefined;
  paymentType: BilingualText = new BilingualText();
  registrationNo: string = undefined;
  referenceNo: number = undefined;
  startDate: GosiCalendar = new GosiCalendar();
  uuid: string = undefined;
  bankAccount: BankAccountDetails = new BankAccountDetails();

  fromJsonToObject(json) {
    Object.keys(new EstablishmentAccountDetails()).forEach(key => {
      if (key in json) {
        this[key] = json[key];
      }
    });
    return this;
  }
}
