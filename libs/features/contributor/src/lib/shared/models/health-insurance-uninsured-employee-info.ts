/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DependentsRule } from "./health-insurance-dependents-rule";
import {BilingualText} from "@gosi-ui/core";

/**
 * The wrapper class for uninsured employee content response.
 *
 * @export
 * @class UninsuredListEmployeeInfo
 */
// tslint:disable-next-line:class-name
export class UninsuredListEmployeeInfo {
  employeeNameAr: string;
  employeeNameEn: string;
  numberOfDependents: string;
  dependentsRule:DependentsRule[];
  registeredInGOSI: string;
  employeeID: number;
  GOSIJoiningDate:string;

  getJoiningDate(){
    return this.GOSIJoiningDate.split('T')[0].replace(/-/g, '/');
  }

  getName():BilingualText{
    return Object.assign(new BilingualText(), {arabic:this.employeeNameAr, english:this.employeeNameEn});
  }
}

