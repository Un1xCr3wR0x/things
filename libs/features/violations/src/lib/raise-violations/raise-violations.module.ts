import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { FormFragmentsModule, ValidatorModule as CommonValidatorModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared';
import { ValidatorModule } from '../validator';
import { RAISE_VIOLATIONS_COMPONENTS } from './components';
import { RaiseViolationsDcComponent } from './raise-violations-dc.component';
import { RaiseViolationsRoutingModule } from './raise-violations-routing.module';

@NgModule({
  declarations: [RaiseViolationsDcComponent, ...RAISE_VIOLATIONS_COMPONENTS],
  imports: [
    CommonModule,
    ValidatorModule,
    FormFragmentsModule,
    SharedModule,
    CommonValidatorModule,
    ThemeModule,
    SharedModule,
    FormFragmentsModule,
    RaiseViolationsRoutingModule
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RaiseViolationsModule {}
