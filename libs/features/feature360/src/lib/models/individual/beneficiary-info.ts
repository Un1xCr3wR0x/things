import { ActiveBenefitsList } from './active-benefits-list';
import { InActiveBenefitsList } from './in-active-benefits-list';
import { OneTimePaymentBenefitList } from './one-time-payment-benefit-list';

export class BeneficiaryInfo {
  id: number = undefined;
  bankname: string = undefined;
  payeename: string = undefined;
  payeetype: string = undefined;
  bankaccountnumber: string = undefined;
  beneficiarybankdetials_isholdbank: string = undefined;
  nin: string = undefined;
  lastpaymentamount: number = undefined;
  benefittype: string = undefined;
  benefitstatus: string = undefined;
  lastpaymentrecieved_isholdbank: string = undefined;
  paymentmode: string = undefined;
  paymentduedate: Date = new Date();
  disabilitydate: Date = new Date();
  disabilitydatestr: string = undefined;
  amw: number = undefined;
  totalbenefitamount: number = undefined;
  totalactivebenefitamount: number = undefined;

  activebenefitslist: ActiveBenefitsList[] = [];
  inactivebenefitslist: InActiveBenefitsList[] = [];
  onetimepaymentbenefitlist: OneTimePaymentBenefitList[] = [];
}
