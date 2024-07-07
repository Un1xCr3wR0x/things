import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MANAGE_PERSON_VALIDATOR_COMPONENTS } from './components';
import { ValidatorDcComponent } from './validator-dc.component';
import { ValidatorRoutingModule } from './validator-routing.module';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { ValidatorModule as ValidatorFormModule } from '@gosi-ui/foundation/form-fragments';
import { AddNinDetailsDcComponent } from './components/add-nin-details-dc/add-nin-details-dc.component';

@NgModule({
  declarations: [ValidatorDcComponent, MANAGE_PERSON_VALIDATOR_COMPONENTS, AddNinDetailsDcComponent],
  imports: [CommonModule, ThemeModule, ValidatorFormModule, ValidatorRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ValidatorModule {}
