/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { IndividualSearchDcComponent, REGISTER_COMPONENTS } from './components';
import { IndividualRoutingModule } from './individual-routing.module';

@NgModule({
  declarations: [REGISTER_COMPONENTS],
  imports: [CommonModule, IndividualRoutingModule, ReactiveFormsModule, ThemeModule, TranslateModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [IndividualSearchDcComponent]
})
export class IndividualModule {}
