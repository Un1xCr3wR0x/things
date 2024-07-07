/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class ContributorFilter {
  maxWage: string = undefined;
  minWage: string = undefined;
  maxDate: string = undefined;
  minDate: string = undefined;
  nationalityList: string[] = undefined;
  occupationList?:String[]=undefined;
  engMinStartDate?:string=undefined;
  engMaxStartDate?:string=undefined;
}
