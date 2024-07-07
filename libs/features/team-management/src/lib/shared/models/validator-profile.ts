/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ReporteeRole } from '@gosi-ui/features/team-management';

export class ValidatorProfile {
  employeeId: string = undefined;
  arabicName?: string = undefined;
  englishName?: string = undefined;
  role?: ReporteeRole[];
  status?: string = undefined;
  statusLabel?: string = undefined;
}
