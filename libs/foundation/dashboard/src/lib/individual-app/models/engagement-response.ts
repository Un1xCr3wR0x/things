import { BilingualText } from '@gosi-ui/core';
import { CoveragePeriod } from './coverage-period';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class EngagementResponse {
  activeEngagements: ActiveEngagements[];
}
export class ActiveEngagements {
  engagementId: number;
  establishmentName: BilingualText;
  registrationNo: number;
  coverageDetails?: CoveragePeriod;
}
