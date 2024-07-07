import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeModule, IconsModule } from '@gosi-ui/foundation-theme';
import { SHARED_COMPONENTS } from './components';
import { AddressModule } from '@gosi-ui/foundation/form-fragments';

@NgModule({
  declarations: [...SHARED_COMPONENTS],
  imports: [CommonModule, ThemeModule, IconsModule,AddressModule],
  exports: [ThemeModule, IconsModule,AddressModule, ...SHARED_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
