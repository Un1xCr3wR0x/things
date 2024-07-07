/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ModifyNationalityRoutingModule } from './modify-nationality-routing.module';
import { ModifyNationalityScComponent } from './components/modify-nationality-sc.component';
import { ThemeModule } from '@gosi-ui/foundation-theme';

@NgModule({
  declarations: [ModifyNationalityScComponent],
  imports: [CommonModule, ModifyNationalityRoutingModule, SharedModule,SharedModule,
    ThemeModule
],
  exports: [ModifyNationalityScComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModifyNationalityModule {}
