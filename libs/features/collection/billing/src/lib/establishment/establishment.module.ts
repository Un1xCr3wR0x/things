import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { EstablishmentRoutingModule } from './establishment-routing.module';
import { ESTABLISHMENT_DASHBOARD_COMPONENTS } from './components';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ContributorBreakupTableViewDcComponent } from './components/dashboard/contributor-breakup-table-view-dc/contributor-breakup-table-view-dc.component';
import { ItemizedGosiInitiativeViewDcComponent } from './components/detailed-bill/itemized-gosi-initiative-view-dc/itemized-gosi-initiative-view-dc.component';
import { ItrmizedMedicalInsuranceDetailsDcComponent } from './components/detailed-bill/itemized-medical-Insurance-details-dc/itemized-medical-insurance-details-dc.component';

@NgModule({
  declarations: [...ESTABLISHMENT_DASHBOARD_COMPONENTS, ContributorBreakupTableViewDcComponent, ItemizedGosiInitiativeViewDcComponent, ItrmizedMedicalInsuranceDetailsDcComponent],
  imports: [ThemeModule, CommonModule, EstablishmentRoutingModule, SharedModule, NgxPaginationModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EstablishmentModule {}
