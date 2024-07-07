/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MANAGE_WAGE_COMPONENTS } from './components';
import { ManageWageDcComponent } from './manage-wage-dc.component';
import { ManageWageRoutingModule } from './manage-wage-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { CancelRpaPopupDcComponent } from './components/unified-engagement/cancel-rpa-popup-dc/cancel-rpa-popup-dc.component';


@NgModule({
  imports: [CommonModule, SharedModule, ManageWageRoutingModule, TranslateModule],
  declarations: [ManageWageDcComponent, ...MANAGE_WAGE_COMPONENTS, CancelRpaPopupDcComponent],
  exports: [ManageWageDcComponent, ...MANAGE_WAGE_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ManageWageModule {}
