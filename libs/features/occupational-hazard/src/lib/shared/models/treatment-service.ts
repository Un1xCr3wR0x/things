import { ClaimsService } from './claims-service';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class TreatmentService {
  invoiceItemId: number;
  serviceCount: number;
  totalAmount?: number;
  services: ClaimsService[];
}
