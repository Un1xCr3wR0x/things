/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AddSecondedDcComponent } from './add-seconded-dc.component';
import { AddSecondedRoutingModule } from './add-seconded-routing.module';
import { ADD_SECONDED_COMPONENTS } from './components';

@NgModule({
  declarations: [AddSecondedDcComponent, ADD_SECONDED_COMPONENTS],
  imports: [CommonModule, AddSecondedRoutingModule, SharedModule],
  exports: [ADD_SECONDED_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddSecondedModule {}
