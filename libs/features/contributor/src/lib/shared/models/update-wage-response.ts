import { UpdateWageError } from './update-wage-error';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/** This class is modal for contributor wage details update response */
export class UpdateWageResponse {
  totalRequests: number = undefined;
  noOfFailures: number = undefined;
  noOfSuccess: number = undefined;
  content: UpdateWageError[] = [];
}
