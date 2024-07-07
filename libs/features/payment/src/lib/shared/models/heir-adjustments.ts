import { BilingualText, NIN, Iqama, NationalId, Passport, BorderNumber } from '@gosi-ui/core';

export class HeirAdjustments {
  adjustmentAmount: number;
  adjustmentPercentage: number;
  adjustmentReason: BilingualText;
  adjustmentType: BilingualText;
  eligible: boolean;
  gosiAdjustmentErrorMessages: BilingualText[];
  heirList: Heir[];
  infoMessages: BilingualText[];
  notes?: string;
  referenceNo?: number;
}

export class Heir {
  adjustmentAmount: number;
  directPaymentStatus: boolean;
  heirPersonId: number;
  identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  name: {
    arabic: NameArabic;
    english: NameEnglish;
    title: BilingualText;
    titleCode: number;
  };
  netAdjustmentAmount: number;
  previousAdjustmentAmount: number;
  relationship: BilingualText;
}
export class NameArabic {
  familyName: string;
  firstName: string;
  secondName: string;
  thirdName: string;
}
export class NameEnglish {
  name: string;
}
