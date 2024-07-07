/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TEAM_COMPONENTS } from './components';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { NgxPaginationModule } from 'ngx-pagination';
import { ValidatorProfileDcComponent } from './components/validator-profile-dc/validator-profile-dc.component';

@NgModule({
  declarations: [...TEAM_COMPONENTS, ValidatorProfileDcComponent],
  imports: [CommonModule, ThemeModule, NgxPaginationModule],
  exports: [...TEAM_COMPONENTS]
})
export class SharedModule {}
