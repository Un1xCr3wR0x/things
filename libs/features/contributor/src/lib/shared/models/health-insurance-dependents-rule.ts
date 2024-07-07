/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */


/**
 * The wrapper class for Insurance Classes in compliance response
 *
 * @export
 * @class DependentsRule
 */
export class DependentsRule {
  ruleId: number;
  ruleNameAr: string;
  ruleNameEn: string;

  constructor(ruleId:number, ruleNameAr:string,ruleNameEn:string){
    this.ruleId=ruleId;
    this.ruleNameAr=ruleNameAr;
    this.ruleNameEn=ruleNameEn;
  }
}


