/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CORE_COMPONENTS } from './components';
import { CoreRoutingModule } from './core-routing.module';
import { CORE_GUARDS } from './guards';

@NgModule({
  imports: [BrowserAnimationsModule, CommonModule, CoreRoutingModule, TranslateModule],
  providers: [CORE_GUARDS],
  declarations: [CORE_COMPONENTS],
  exports: [CORE_COMPONENTS]
})
export class CoreModule {}
