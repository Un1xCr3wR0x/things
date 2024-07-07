/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ThemeModule ,IconsModule} from '@gosi-ui/foundation-theme';
import { SharedModule } from '../shared';
import { USER_ACTIVITY_COMPONENTS } from './components';
import { UserActivityRoutingModule } from './user-activity-routing.module';

@NgModule({
  declarations: [...USER_ACTIVITY_COMPONENTS],
  imports: [CommonModule, SharedModule, ThemeModule, UserActivityRoutingModule]
})
export class UserActivityModule {}
