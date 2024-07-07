import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiptRoutingModule } from './receipt-routing.module';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SharedModule } from '../shared/shared.module';
import { RECEIPT_COMPONENTS } from './components';
import { NgxPaginationModule } from 'ngx-pagination';
import { VicReceiptDetailsScComponent } from './components/vic-receipt-details-sc/vic-receipt-details-sc.component';
import { SearchModule } from '@gosi-ui/foundation-dashboard/lib/search/search.module';
import { ReceiptAdvancedSearchDcComponent } from './components/receipt-advanced-search-dc/receipt-advanced-search-dc.component';

@NgModule({
  declarations: [RECEIPT_COMPONENTS, VicReceiptDetailsScComponent, ReceiptAdvancedSearchDcComponent],
  imports: [ThemeModule, CommonModule, SharedModule, ReceiptRoutingModule, NgxPaginationModule, SearchModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReceiptModule {}
