/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BulkWageDetails } from './bulk-wage-details';

/**
 * This class is model class for bulk wage response
 */
export class BulkWageRequestDetails {
  bulkWageRequests: BulkWageDetails[] = [];
  bulkWageRequestCount: number = undefined;
}
