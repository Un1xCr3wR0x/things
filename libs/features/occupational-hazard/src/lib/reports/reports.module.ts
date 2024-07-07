import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IconsModule, ThemeModule } from '@gosi-ui/foundation-theme';
import { REPORT_COMPONENTS } from '.';
import { SharedModule } from '../shared/shared.module';
import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
  declarations: [...REPORT_COMPONENTS],
  imports: [CommonModule, ReportsRoutingModule, SharedModule, IconsModule, ThemeModule],
  exports: [...REPORT_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportsModule {}

