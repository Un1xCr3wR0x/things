/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDcComponent } from './transaction-dc.component';
import { ResumeDcComponent } from './resume-dc.component';
import { TransactionsRoutingModule } from './transaction-routing.module';
import { IconsModule, ThemeModule } from '@gosi-ui/foundation-theme';
import { SharedModule } from '../shared/shared.module';
import { TrackingScComponent } from './tracking-sc/tracking-sc.component';
import { TrackingContributorDetailsDcComponent } from './tracking-contributor-details-dc/tracking-contributor-details-dc.component';
import { TrackingHeirdepDetailsDcComponent } from './tracking-heirdep-details-dc/tracking-heirdep-details-dc.component';
import { TrackingAssessmentDetailsDcComponent } from './tracking-assessment-details-dc/tracking-assessment-details-dc.component';
import { TransactionConveyanceScComponent } from './transaction-conveyance-sc/transaction-conveyance-sc.component';
import { TrackingESignScComponent } from './tracking-e-sign-sc/tracking-e-sign-sc.component';
import { TrackingESignDetailsDcComponent } from './tracking-e-sign-details-dc/tracking-e-sign-details-dc.component';
import { DisabilityDetailsDcComponent } from './disability-details-dc/disability-details-dc.component';
import { MboSessionAssessmentScComponent } from './mbo-session-assessment-sc/mbo-session-assessment-sc.component';
import { TrackingInjcompDetailsDcComponent } from './tracking-injcomp-details-dc/tracking-injcomp-details-dc.component';

@NgModule(
  {
    declarations: [TransactionDcComponent, ResumeDcComponent, TrackingScComponent, TrackingContributorDetailsDcComponent, TrackingHeirdepDetailsDcComponent, TrackingAssessmentDetailsDcComponent, TransactionConveyanceScComponent, TrackingESignScComponent, TrackingESignDetailsDcComponent, DisabilityDetailsDcComponent, MboSessionAssessmentScComponent, TrackingInjcompDetailsDcComponent],
    imports: [
      CommonModule,
      TransactionsRoutingModule,
      ThemeModule,
      SharedModule,
      IconsModule
    ]
  }
)
export class TransactionsModule {

}
