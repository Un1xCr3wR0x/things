/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormFragmentsModule, ValidatorModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared';
import { ViolationProfileDcComponent } from './violation-profile-dc.component';
import { ViolationProfileRoutingModule } from './violation-profile-routing.module';
import { VIOLATION_PROFILE_COMPONENTS } from './components';
import { TransactionTracingModule } from '@gosi-ui/foundation/transaction-tracing'; 


@NgModule({
  declarations: [ViolationProfileDcComponent, ...VIOLATION_PROFILE_COMPONENTS],
  imports: [CommonModule, ValidatorModule, FormFragmentsModule, SharedModule, ViolationProfileRoutingModule, TransactionTracingModule]
})
export class ViolationProfileModule {}
