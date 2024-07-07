import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MISCELLANEOUS_ADJUSTMENT_COMPONENTS } from './components';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { MiscellaneousAdjustmentRoutingModule } from './miscellaneous-adjustment-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [...MISCELLANEOUS_ADJUSTMENT_COMPONENTS],
  imports: [ThemeModule, CommonModule, MiscellaneousAdjustmentRoutingModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MiscellaneousAdjustmentModule {}
