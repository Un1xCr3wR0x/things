/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';

import { LAYOUT_COMPONENTS } from './components';
import { HomeRoutingModule } from './home-routing.module';
import { ThemeModule } from '@gosi-ui/foundation-theme';

/**
 * Base Module for Home
 *
 * @export
 * @class HomeModule
 */
@NgModule({
  imports: [HomeRoutingModule, ThemeModule],
  declarations: [...LAYOUT_COMPONENTS],
  exports: [...LAYOUT_COMPONENTS]
})
export class HomeModule {}
