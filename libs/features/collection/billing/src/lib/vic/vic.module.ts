import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { ValidatorModule as ValidatorTemplateModule } from '@gosi-ui/foundation/form-fragments';
import { VicRoutingModule } from './vic-routing.module';
import { SharedModule } from '../shared/shared.module';
import { VIC_COMPONENTS } from './components';

@NgModule({
  declarations: [...VIC_COMPONENTS],
  imports: [ThemeModule, CommonModule, ValidatorTemplateModule, VicRoutingModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VicModule {}
