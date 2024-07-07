import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HEALTH_INSURANCE_COMPONENTS } from './components';
import { SharedModule } from '../shared/shared.module';
import { HealthInsuranceRoutingModule } from './health-insurance-routing.module';
import { HealthInsuranceComponent } from './health-insurance.component';

@NgModule({
  declarations: [HealthInsuranceComponent, HEALTH_INSURANCE_COMPONENTS ],
  imports: [CommonModule, HealthInsuranceRoutingModule,SharedModule ],
  exports: [HEALTH_INSURANCE_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class HealthInsuranceModule {}
