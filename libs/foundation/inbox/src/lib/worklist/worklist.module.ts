/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';

import { ThemeModule } from '@gosi-ui/foundation-theme';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GosiHttpInterceptor } from '@gosi-ui/core';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { SharedModule } from '../shared/shared.module';
import { WORKLIST_COMPONENTS } from './components';
import { WorklistRoutingModule } from './worklist-routing.module';

@NgModule({
  declarations: [...WORKLIST_COMPONENTS],
  imports: [ThemeModule, WorklistRoutingModule, ProgressbarModule.forRoot(), SharedModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GosiHttpInterceptor,
      multi: true
    }
  ]
})
export class WorklistModule {}
