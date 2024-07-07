import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HealthInsuranceListRoutingModule } from './health-insurance-list-routing.module';
import {SharedModule} from "@gosi-ui/features/establishment/lib/shared/shared.module";
import {HEALTH_INSURANCE_LIST_COMPONENTS} from "@gosi-ui/features/establishment/lib/health-insurance-list/components";
import { InsuranceCompanyCardComponent } from './components/insurance-company-card/insurance-company-card.component';
import {ThemeModule} from "@gosi-ui/foundation-theme";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [HEALTH_INSURANCE_LIST_COMPONENTS, InsuranceCompanyCardComponent],
  imports: [
    CommonModule,
    HealthInsuranceListRoutingModule,
    SharedModule,
    ThemeModule, TranslateModule
  ]
})
export class HealthInsuranceListModule { }
