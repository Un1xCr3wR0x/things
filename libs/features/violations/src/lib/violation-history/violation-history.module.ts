/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormFragmentsModule, ValidatorModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared';
import { VIOLATION_HISTORY_COMPONENTS } from './components';
import { ViolationHistoryDcComponent } from './violation-history-dc.component';
import { ViolationHistoryRoutingModule } from './violation-history-routing-module';

//TODO Try to provide the same name as the folder(ViewMemberModule) for modules. No need to append mb in file name
@NgModule({
  declarations: [ViolationHistoryDcComponent, ...VIOLATION_HISTORY_COMPONENTS],
  imports: [CommonModule, ValidatorModule, FormFragmentsModule, SharedModule, ViolationHistoryRoutingModule]
})
export class ViolationHistoryModule {}
