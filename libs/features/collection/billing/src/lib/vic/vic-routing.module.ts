import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VicDashboardScComponent } from './components/vic-dashboard';
import { AllocationBillVicScomponent } from './components/vic-allocation/allocation-bill-vic-sc/allocation-bill-vic-sc.component';
import { BillHistoryVicScComponent } from './components/vic-bill-history/bill-history-vic-sc/bill-history-vic-sc.component';

const routes: Routes = [
  {
    path: '',

    children: [
      {
        path: 'dashboard',
        component: VicDashboardScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'bill-history',
        component: BillHistoryVicScComponent,
        data: {
          breadcrumb: 'BILLING.BILL-HISTORY'
        }
      },
      {
        path: 'bill-allocation',
        component: AllocationBillVicScomponent,
        data: {
          breadcrumb: 'BILLING.ALLOCATION'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VicRoutingModule {}
