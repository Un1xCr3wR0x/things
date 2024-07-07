import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefreshDcComponent } from '@gosi-ui/foundation-theme/src';
import {
  InstallmentDetailsScComponent,
  InstallmentSummaryScComponent,
  InstallmentHistoryScComponent
} from './components';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'create', component: InstallmentDetailsScComponent },
      { path: 'edit', component: InstallmentDetailsScComponent },
      { path: 'refresh', component: RefreshDcComponent },
      { path: 'summary', component: InstallmentSummaryScComponent },
      { path: 'summary/:regNo', component: InstallmentSummaryScComponent },
      {
        path: 'history',
        component: InstallmentHistoryScComponent,
        data: {
          breadcrumb: 'BILLING.INSTALLMENT-HISTORY'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstallmentRoutingModule {}
