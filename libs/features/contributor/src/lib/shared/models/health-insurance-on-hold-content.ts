/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */


import {BilingualText} from "@gosi-ui/core";

/**
 * The wrapper class for on-hold content response.
 *
 * @export
 * @class OnHoldContent
 */
// tslint:disable-next-line:class-name
export class OnHoldContent {
  employeeNameAr:string;
  employeeNameEn:string;
  employeeID: string;
  GOSIJoiningDate: string;

  getJoiningDate(){
    return this.GOSIJoiningDate.split('T')[0].replace(/-/g, '/');
  }
  getName():BilingualText{
    return Object.assign(new BilingualText(), {arabic:this.employeeNameAr,english:this.employeeNameEn});
  }

  getEmployeeId():number{
    return parseInt(this.employeeID);
  }


}

