import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '@gosi-ui/foundation-dashboard';
import { IconsModule, ThemeModule } from '@gosi-ui/foundation-theme';
import { RELATIONSHIP_MANAGER_COMPONENTS } from './components';
import { RelationshipManagerRoutingModule } from './relationship-manager-routing.module';

@NgModule({
  declarations: [RELATIONSHIP_MANAGER_COMPONENTS],
  imports: [CommonModule, RelationshipManagerRoutingModule, ThemeModule, SharedModule, IconsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RelationshipManagerModule {}
