/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CreateFormEmployee } from "./health-insurance-hdf-employee-response";

/**
 * The wrapper class create form response.
 *
 * @export
 * @class ComplianceDetails
 */
export class CreateFormResponse {
  StatusCode: string;
  StatusDesc: string;
  topLevelArray: CreateFormEmployee[];
}
