import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CLAIMS_COMPONENTS } from '.';
import { SharedModule } from '../shared/shared.module';
import { IconsModule, ThemeModule } from '@gosi-ui/foundation-theme';
import { ClaimsRoutingModule } from './claims-routing.module';

@NgModule({
  declarations: [...CLAIMS_COMPONENTS],
  imports: [CommonModule, SharedModule, IconsModule, ThemeModule, ClaimsRoutingModule],
  exports: [...CLAIMS_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClaimsModule {}
