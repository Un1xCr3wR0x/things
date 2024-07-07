/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { TeamManagementDcComponent } from './team-management-dc.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GosiHttpInterceptor } from '@gosi-ui/core';
import { TeamManagementRoutingModule } from './team-management-routing.module';
import { SharedModule } from './shared/shared.module';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { BulkReassignTransactionsScComponent } from './supervisor-view';
import { BulkReassignTabDcComponent } from './supervisor-view/bulk-reassign-tab-dc/bulk-reassign-tab-dc.component';
import { BulkReassignTab1DcComponent } from './supervisor-view/bulk-reassign-tab1-dc/bulk-reassign-tab1-dc.component';
import { BulkReassignTab2DcComponent } from './supervisor-view/bulk-reassign-tab2-dc/bulk-reassign-tab2-dc.component';
import { HistorySearchComponent } from './supervisor-view/history-search/history-search.component';
import { BulkReassignReclaimTabDcComponent} from './supervisor-view/bulk-reassign-reclaim-tab-dc/bulk-reassign-reclaim-tab-dc.component'
@NgModule({
  declarations: [TeamManagementDcComponent,BulkReassignTransactionsScComponent,
    BulkReassignTabDcComponent,BulkReassignTab1DcComponent,BulkReassignTab2DcComponent,
    BulkReassignReclaimTabDcComponent,HistorySearchComponent],
  imports: [CommonModule, TeamManagementRoutingModule, SharedModule, ThemeModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GosiHttpInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TeamManagementModule {}

