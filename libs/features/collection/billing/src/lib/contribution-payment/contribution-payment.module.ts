import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContributionPaymentRoutingModule } from './contribution-payment-routing.module';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { CONTRIBUTION_PAYMENT_COMPONENTS } from './components';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CONTRIBUTION_PAYMENT_COMPONENTS],
  imports: [ThemeModule, CommonModule, SharedModule, ContributionPaymentRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContributionPaymentModule {}
