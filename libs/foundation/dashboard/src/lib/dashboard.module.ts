/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GosiHttpInterceptor } from '@gosi-ui/core';
import { IconsModule, ThemeModule } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  imports: [ThemeModule, InfiniteScrollModule, DashboardRoutingModule, IconsModule, TranslateModule],
  declarations: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GosiHttpInterceptor,
      multi: true
    }
  ],
  exports: [IconsModule, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule {}
