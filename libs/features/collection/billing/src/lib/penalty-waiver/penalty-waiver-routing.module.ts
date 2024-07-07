import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PenaltyWaiverScComponent, PenaltyWaiverSummaryScComponent, ViolationLateFeeScComponent } from './components';
import { RefreshDcComponent } from '@gosi-ui/foundation-theme';
const routes: Routes = [
  {
    path: '',
    component: PenaltyWaiverScComponent
  },
  {
    path: 'violation-late-fees/create',
    component: ViolationLateFeeScComponent
  },
  { path: 'edit', component: PenaltyWaiverScComponent },
  { path: 'violation-late-fees/edit', component: ViolationLateFeeScComponent },
  { path: 'refresh', component: RefreshDcComponent },
  { path: 'View', component: PenaltyWaiverSummaryScComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PenaltyWaiverRoutingModule {}
