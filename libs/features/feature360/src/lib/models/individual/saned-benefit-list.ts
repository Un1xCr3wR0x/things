import { ReasonForLastChangeAsList } from './reason-for-last-change-as-list';

export class SanedBenefitList {
  createdby: string = undefined;
  creationtimestamp: Date = new Date();
  lastmodifiedby: string = undefined;
  lastmodifiedtimestamp: string = undefined;
  moduleid: number = undefined;
  mode: string = undefined;
  benefitrequestid: number = undefined;
  sanedtype: number = undefined;
  versionnumber: number = undefined;
  benefitid: number = undefined;
  beneficiaryid: number = undefined;
  contactid: number = undefined;
  benefitdate: number = undefined;
  benefitdateentfmt: string = undefined;
  benefitdatestr: Date = new Date();
  paymentdate: number = undefined;
  paymentdateentfmt: string = undefined;
  paymentdatestr: Date = new Date();
  benefitamount: number = undefined;
  workflowstatus: string = undefined;
  statusdate: string = undefined;
  statusdateentfmt: string = undefined;
  paymentmode: string = undefined;
  paymentreturnreason: string = undefined;
  adjustmentamount: number = undefined;
  creditamount: number = undefined;
  fieldoffice: number = undefined;
  reasonforlastchange: string = undefined;
  amw: number = undefined;
  sanedbenefitstatus: number = undefined;
  sanedcontributionmonths: number = undefined;
  sanedbenefitid: string = undefined;
  iban: string = undefined;

  reasonforlastchangeaslist: ReasonForLastChangeAsList[] = [];

  sinumber: number = undefined;
}
