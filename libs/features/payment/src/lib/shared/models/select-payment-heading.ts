import { BenefitType } from '../enums/benefit-type';

export class SelectPaymentMethodLabels {
  //return lumpsum headings

  womanLumpsum = 'BENEFITS.RETURN-WOMAN-LUMPSUM';
  retirementLumpsum = 'BENEFITS.RETURN-RETIREMENT-LUMPSUM';
  hazardousLumpsum = 'BENEFITS.RETURN-HAZARDOUS-LUMPSUM';
  heirLumpsum = 'BENEFITS.RETURN-HEIR-LUMPSUM-HEADING';
  jailedContributorLumpsum = 'BENEFITS.RETURN-JAILED-LUMPSUM';
  nonOccLumpsumBenefitType = 'BENEFITS.RETURN-NONOCC-LUMPSUM';
  occLumpsum = 'BENEFITS.RETURN-OCC-LUMPSUM-HEADING';
  benefitType: string;

  constructor(btype: string) {
    this.benefitType = btype;
  }

  getHeading() {
    const key = this.getEnumKeyByEnumValue(BenefitType, this.benefitType);
    return this[key] || '';
  }

  getEnumKeyByEnumValue(myEnum, enumValue) {
    const keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
  }
}
