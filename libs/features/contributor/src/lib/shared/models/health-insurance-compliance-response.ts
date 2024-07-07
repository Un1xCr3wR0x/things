/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { InsuranceClass } from "./health-insurance-class";
import {BilingualText} from "@gosi-ui/core";

/**
 * The wrapper class compliance details
 *
 * @export
 * @class ComplianceDetails
 */
export class ComplianceDetails {
  StatusCode: string;
  StatusDesc: string;
  compliancePercentage: string;
  insurancePolicyNumber: number;
  policyExpiryDate: string;
  insuranceCompanyNameAr:string;
  insuranceCompanyNameEn:string;
  additionFlag: boolean;
  deletionFlag: boolean;
  InsuranceClass:InsuranceClass[];

  getCompanyName():BilingualText{
    return Object.assign(new BilingualText(), {arabic:this.insuranceCompanyNameAr, english: this.insuranceCompanyNameEn});
  }
  getCommitmentPercentage():number{
    return parseInt(this.compliancePercentage.split("%")[0],10);
  }
}
