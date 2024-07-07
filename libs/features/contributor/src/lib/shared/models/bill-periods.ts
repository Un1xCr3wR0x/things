import { BilingualText } from '@gosi-ui/core';

export class BillPeriods {
  billMonths: BillMonth[] = [];
}
export class BillMonth {
  year: number = undefined;
  months: BillDropMonth[] = [];
}
export class BillDropMonth {
  drop: number = undefined;
  months: BilingualText = new BilingualText();
}
