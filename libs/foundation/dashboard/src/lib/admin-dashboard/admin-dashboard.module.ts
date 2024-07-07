/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { ADMIN_DASHBOARD_COMPONENTS } from './components';
import { ThemeModule } from '@gosi-ui/foundation-theme/src';
import { AdminDashboardDcComponent } from './admin-dashboard-dc.component';
import { SharedModule } from '../shared';
import { AdminContactDisplayMessageComponent } from './components/admin-contact-display-message/admin-contact-display-message.component';
//import {UpdateUserContactOtpComponent} from  '@gosi-ui/features/customer-information/lib/user-activity/components/update-user-contact-sc/update-user-contact-otp/update-user-contact-otp.component'
//import {USER_ACTIVITY_COMPONENTS} from  '@gosi-ui/features/customer-information/lib/user-activity/components';
import {UserActivityModule} from '@gosi-ui/features/customer-information/lib/user-activity/user-activity.module';
@NgModule({
  declarations: [AdminDashboardDcComponent, ADMIN_DASHBOARD_COMPONENTS, AdminContactDisplayMessageComponent],
  imports: [ThemeModule, CommonModule, AdminDashboardRoutingModule, SharedModule,UserActivityModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminDashboardModule {}
