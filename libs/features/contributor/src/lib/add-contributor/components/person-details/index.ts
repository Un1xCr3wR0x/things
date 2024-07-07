/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { SaudiPersonDetailsDcComponent } from './saudi-person-details-dc/saudi-person-details-dc.component';
import { NonSaudiPersonDetailsDcComponent } from './non-saudi-person-details-dc/non-saudi-person-details-dc.component';
import { GccPersonDetailsDcComponent } from './gcc-person-details-dc/gcc-person-details-dc.component';
import { SplForeignerPersonDetailsDcComponent } from './spl-foreigner-person-details-dc/spl-foreigner-person-details-dc.component';
import { ImmigratedTribePersonDetailsDcComponent } from './immigrated-tribe-person-details-dc/immigrated-tribe-person-details-dc.component';

export const PERSON_DETAILS_COMPONENTS = [
  SaudiPersonDetailsDcComponent,
  NonSaudiPersonDetailsDcComponent,
  GccPersonDetailsDcComponent,
  SplForeignerPersonDetailsDcComponent,
  ImmigratedTribePersonDetailsDcComponent
];

export * from './saudi-person-details-dc/saudi-person-details-dc.component';
export * from './gcc-person-details-dc/gcc-person-details-dc.component';
export * from './non-saudi-person-details-dc/non-saudi-person-details-dc.component';
export * from './immigrated-tribe-person-details-dc/immigrated-tribe-person-details-dc.component';
export * from './spl-foreigner-person-details-dc/spl-foreigner-person-details-dc.component';
