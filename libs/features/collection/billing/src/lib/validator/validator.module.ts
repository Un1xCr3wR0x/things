import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { BILLING_VALIDTOR_COMPONENTS } from './components';
import { ValidatorRoutingModule } from './validator-routing.module';
import { ValidatorModule as ValidatorTemplateModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared/shared.module';
import {
  MiscellaneousEstAdjustmentDetailsDcComponent
} from "@gosi-ui/features/collection/billing/lib/validator/components/miscellaneous-adjustment";

@NgModule({
  declarations: [BILLING_VALIDTOR_COMPONENTS],
  imports: [ThemeModule, CommonModule, ValidatorRoutingModule, ValidatorTemplateModule, SharedModule],
  exports: [
    MiscellaneousEstAdjustmentDetailsDcComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ValidatorModule {}
