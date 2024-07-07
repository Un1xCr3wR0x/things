import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndividualBenefitsRoutingModule } from './individual-benefits-routing';
import { IndividualBenefitsScComponent } from './individual-benefits-sc/individual-benefits-sc.component';
import { INDIVIDUAL_BENEFIT_COMPONENTS } from '.';
import { SharedModule } from '../shared/shared.module';
import { IndividualBenefitsCarouselDcComponent } from './individual-benefits-carousel-dc/individual-benefits-carousel-dc.component';
import { IndividualSearchBenefitsDcComponent } from './individual-search-benefits-dc/individual-search-benefits-dc.component';
import { SanedModule } from '../saned/saned.module';
@NgModule({
  declarations: [
    IndividualBenefitsScComponent,
    INDIVIDUAL_BENEFIT_COMPONENTS,
    IndividualBenefitsCarouselDcComponent,
    IndividualSearchBenefitsDcComponent
  ],
  imports: [CommonModule, IndividualBenefitsRoutingModule, SharedModule, SanedModule],
  exports: [INDIVIDUAL_BENEFIT_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IndividualBenefittModule {}
