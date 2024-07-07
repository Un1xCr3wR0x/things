import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EVENT_DATE_COMPONENTS } from './components';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { MaintainEventDateRoutingModule } from './maintain-event-date-routing.module';

@NgModule({
  declarations: [EVENT_DATE_COMPONENTS],
  imports: [ThemeModule, CommonModule, MaintainEventDateRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MaintainEventDateModule {}
