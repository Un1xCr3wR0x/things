/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */


/**
 * This is the request DTO used for the APIs
 * {Insured,uninsured,compliance,on-hold}
 *
 * @export
 * @class HealthInsuranceInfoRequest
 */
// tslint:disable-next-line:class-name
export class HealthInsuranceInfoRequest {
  UNN :number | string;
  page: number;
  pageSize : number ;
  constructor(UNN: number | string, page:number, pageSize:number) {
    this.UNN = UNN;
    this.page=page;
    this.pageSize=pageSize;
  }
}

