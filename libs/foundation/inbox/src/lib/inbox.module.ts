/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { InboxRoutingModule } from './inbox-routing.module';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GosiHttpInterceptor } from '@gosi-ui/core';
import { RouterModule } from '@angular/router';
import { InboxDcComponent } from './inbox-dc.component';

@NgModule({
  imports: [ThemeModule, InboxRoutingModule, RouterModule, SharedModule],
  declarations: [InboxDcComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GosiHttpInterceptor,
      multi: true
    }
  ]
})
export class InboxModule {}
