import { BilingualText } from '@gosi-ui/core';

export class OwnerFilter {
  startDate: string = undefined;
  endDate: string = undefined;
  status = []; //undefined = 0, active =1 , inactive =2;
  nationalityList: Array<BilingualText> = [];
}
