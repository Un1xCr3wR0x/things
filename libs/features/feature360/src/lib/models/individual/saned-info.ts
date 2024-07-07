import { BeneficiaryBean } from './beneficiary-bean';
import { Reasons } from './reasons';
import { SanedBenefitList } from './saned-benefit-list';
import { SanedRequestList } from './saned-request-list';

export class SanedInfo {
  reasons: Reasons[] = [];

  eligable: string = undefined;
  message: string = undefined;
  sanedmonths: number = undefined;
  requiredmonths: number = undefined;
  iseligiblemonths: string = undefined;
  sanedbenefitforfirstthreemonths: number = undefined;
  sanedbenefitafterfirstthreemonths: number = undefined;
  issuspended: string = undefined;
  isibanincorrect: string = undefined;
  id: number = undefined;

  sanedrequestlist: SanedRequestList[] = [];

  personbean: string = undefined;
  contributorbean: string = undefined;
  socialinsurancenumber: string = undefined;
  benefitrequestbean: string = undefined;

  beneficiarybean: BeneficiaryBean[] = [];

  benefitbean: string = undefined;
  calculationdetaillist: string = undefined;

  sanedbenefitlist: SanedBenefitList[] = [];

  bankcode: string = undefined;
  leavingdate: Date = new Date();
  leavingdateentfmt: string = undefined;
  leavingdatestd: string = undefined;
  sanedtype: string = undefined;
  totalcontributionmonths: string = undefined;
  sanedeligiblemonths: string = undefined;
  adjustmentsbeanlist: string = undefined;
  sanedadjustmentsbean: string = undefined;
  comments: string = undefined;
  previousadjustment: string = undefined;
  amw: string = undefined;
  iban: string = undefined;
}
