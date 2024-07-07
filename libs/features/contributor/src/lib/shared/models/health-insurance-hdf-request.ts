/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CreateHDFEmployee } from './health-insurance-hdf-employee-request';

/**
 * This is the request DTO used for the APIs
 * {Insured,uninsured,compliance,on-hold}
 *
 * @export
 * @class HealthInsuranceHDFRequest
 */
// tslint:disable-next-line:class-name
export class HealthInsuranceHDFRequest {
  unifiedNationalNumber:string;
  commercialRegistrationNumber:string;
  employeesList: CreateHDFEmployee[];
}

