/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BranchOverviewRoutingModule } from './branch-overview-routing.module';
import { BranchOverviewScComponent } from './components/branch-overview-sc/branch-overview-sc.component';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { BranchListDcComponent } from './components/branch-list-dc/branch-list-dc.component';
import { BranchSearchDcComponent } from './components/branch-search-dc/branch-search-dc.component';

@NgModule({
  declarations: [BranchOverviewScComponent, BranchListDcComponent, BranchSearchDcComponent],
  imports: [CommonModule, BranchOverviewRoutingModule, InfiniteScrollModule, ThemeModule]
})
export class BranchOverviewModule {}
