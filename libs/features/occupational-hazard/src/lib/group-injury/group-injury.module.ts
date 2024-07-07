/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA,NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GroupInjuryRoutingModule } from './group-injury-routing.module';
import { ThemeModule, IconsModule } from '@gosi-ui/foundation-theme';

import { GROUP_INJURY_COMPONENTS } from '.';


@NgModule({
  declarations: [...GROUP_INJURY_COMPONENTS  ],
  imports: [CommonModule,SharedModule,ThemeModule,IconsModule,GroupInjuryRoutingModule],
  exports: [...GROUP_INJURY_COMPONENTS ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})

export class GroupInjuryModule { }
