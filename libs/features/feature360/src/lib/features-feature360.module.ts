/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GosiHttpInterceptor } from '@gosi-ui/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { Feature360RoutingModule } from './feature-360-routing.module';
import { Feature360Component } from './feature-360.component';

@NgModule({
  imports: [CommonModule, Feature360RoutingModule, RouterModule, ThemeModule, TranslateModule],
  declarations: [Feature360Component],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GosiHttpInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FeaturesFeature360Module {}
