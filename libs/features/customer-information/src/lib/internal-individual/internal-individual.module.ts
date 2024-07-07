import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { INDIVIDUAL_PROFILE_COMPONENTS } from './components';
import { SharedModule } from '../shared';
import { IndividualDashboardModule } from '@gosi-ui/foundation-dashboard/src';
import { ThemeModule } from '@gosi-ui/foundation-theme/src';
import { InternalIndividualRoutingModule } from './internal-individual-routing.module';
import { AddressModule, ContactModule } from '@gosi-ui/foundation/form-fragments';
import { SearchModule } from '@gosi-ui/foundation-dashboard/src/lib/search/search.module';
import { FinancialDetailsScComponent } from './components/financial-details-sc/financial-details-sc.component';
// import { AnnuityModule } from '@gosi-ui/features/benefits/lib/annuity/annuity.module';
import { CertificateDetailsScComponent } from './components/certificate-details-sc/certificate-details-sc.component';
import { DocumentDetailsScComponent } from './components/document-details-sc/document-details-sc.component';

@NgModule({
  declarations: [
    INDIVIDUAL_PROFILE_COMPONENTS,
    FinancialDetailsScComponent,
    CertificateDetailsScComponent,
    DocumentDetailsScComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ThemeModule,
    InternalIndividualRoutingModule,
    AddressModule,
    IndividualDashboardModule,
    ContactModule,
    SearchModule
    // AnnuityModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InternalIndividualModule {}
