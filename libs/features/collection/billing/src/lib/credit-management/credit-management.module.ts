import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CREDIT_MANAGEMENT_COMPONENTS } from './components';
import { CreditManagementRoutingModule } from './credit-management-routing.module';

@NgModule({
  declarations: [...CREDIT_MANAGEMENT_COMPONENTS],
  imports: [ThemeModule, CommonModule, CreditManagementRoutingModule, SharedModule, NgxPaginationModule]
})
export class CreditManagementModule {}
