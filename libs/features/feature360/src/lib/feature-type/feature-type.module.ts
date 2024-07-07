/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { REGISTER_COMPONENTS } from './components';
import { FeatureTypeRoutingModule } from './feature-type-routing.module';
import { EstablishmentsModule } from '../establishments/establishments.module';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { IndividualModule } from '../individual/individual.module';

@NgModule({
  declarations: [REGISTER_COMPONENTS],
  imports: [
    CommonModule,
    FeatureTypeRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    EstablishmentsModule,
    ThemeModule,
    IndividualModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FeatureTypeModule {}
