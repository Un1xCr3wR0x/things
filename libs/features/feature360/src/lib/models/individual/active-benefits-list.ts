import { BenefitComponentList } from './benefit-component-list';

export class ActiveBenefitsList {
  beneficiarystatus: string = undefined;
  beneficiarybentype: string = undefined;
  beneficiarybenstartdate: number = undefined;
  beneficiarybenstartdatestr: Date = new Date();
  beneficiarybenlastpaiddate: number = undefined;
  beneficiarybenlastpaiddatestr: Date = new Date();
  beneficiarybenstopdate: string = undefined;
  beneficiarybenstopdatestr: string = undefined;
  beneficiarybenamount: number = undefined;
  beneficiarybenstatus: string = undefined;
  beneficiarybenstatuscode: number = undefined;

  benefitcomponentlist: BenefitComponentList[] = [];
}
