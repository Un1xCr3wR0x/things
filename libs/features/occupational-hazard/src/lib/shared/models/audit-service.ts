import { BilingualText } from '@gosi-ui/core';
import { RejectedUnitService } from './rejected-units';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class AuditService {
  invoiceItemId: number;
  serviceRejectionDetails: RejectedUnitService[] = [];
}
