/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ReactivateCoverageWageDcComponent } from './reactivate-coverage-wage-dc/reactivate-coverage-wage-dc.component';
import { ReactivateDcComponent } from './reactivate-dc/reactivate-dc.component';
import { ReactivateEngagementDetailsDcComponent } from './reactivate-engagement-details-dc/reactivate-engagement-details-dc.component';
import { ReactivateWageTableDcComponent } from './reactivate-wage-table-dc/reactivate-wage-table-dc.component';
import { ValidatorReactivateVicScComponent } from './validator-reactivate-vic-sc/validator-reactivate-vic-sc.component';

export const REACTIVATE_VIC_COMPONENTS = [ValidatorReactivateVicScComponent,ReactivateDcComponent,ReactivateEngagementDetailsDcComponent,ReactivateWageTableDcComponent,ReactivateCoverageWageDcComponent ];

export * from './validator-reactivate-vic-sc/validator-reactivate-vic-sc.component';
export * from './reactivate-dc/reactivate-dc.component';
export * from './reactivate-engagement-details-dc/reactivate-engagement-details-dc.component';
export * from './reactivate-wage-table-dc/reactivate-wage-table-dc.component';
export * from './reactivate-coverage-wage-dc/reactivate-coverage-wage-dc.component';

