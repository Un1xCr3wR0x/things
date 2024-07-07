import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ADJUSTMENT_VALIDATOR_COMPONENTS } from './components';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SharedModule } from '../../shared/shared.module';
import { ValidatorModule as CommonValidatorModule } from '@gosi-ui/foundation/form-fragments';
import { ValidatorAdjustmentRoutingModule } from './validator-routing.module';

@NgModule({
  declarations: [...ADJUSTMENT_VALIDATOR_COMPONENTS],
  imports: [
    CommonModule,
    ThemeModule,
    SharedModule,
    ValidatorAdjustmentRoutingModule,
    CommonValidatorModule,
    ValidatorAdjustmentRoutingModule
  ]
})
export class ValidatorAdjustmentModule {}
