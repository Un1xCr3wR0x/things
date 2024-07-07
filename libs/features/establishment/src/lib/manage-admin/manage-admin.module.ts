/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ADMIN_COMPONENTS } from './components';
import { ManageAdminDcComponent } from './manage-admin-dc.component';
import { ManageAdminRoutingModule } from './manage-admin-routing.module';

@NgModule({
  declarations: [ManageAdminDcComponent, ADMIN_COMPONENTS],
  imports: [CommonModule, SharedModule, ManageAdminRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ManageAdminModule {}
