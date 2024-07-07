/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AddVicDcComponent } from './add-vic-dc.component';
import { AddVicRoutingModule } from './add-vic-routing.module';
import { ADD_VIC_COMPONENT } from './components';
import {AddContributorModule} from "@gosi-ui/features/contributor/lib/add-contributor/add-contributor.module";

@NgModule({
  declarations: [AddVicDcComponent, ADD_VIC_COMPONENT],
    imports: [CommonModule, AddVicRoutingModule, SharedModule, AddContributorModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddVicModule {}
