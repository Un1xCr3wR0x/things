/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NOTIFICATIONS_COMPONENTS } from './components';

@NgModule({
  declarations: [...NOTIFICATIONS_COMPONENTS],
  imports: [ThemeModule, NgxPaginationModule, NotificationsRoutingModule]
})
export class NotificationsModule {}
