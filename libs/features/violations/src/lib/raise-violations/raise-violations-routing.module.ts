import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionStateGuard } from '@gosi-ui/core';
import { RefreshDcComponent } from '@gosi-ui/foundation-theme';
import { ReportViolationScComponent } from './components/report-violation-sc/report-violation-sc.component';
import { RaiseViolationsDcComponent } from './raise-violations-dc.component';

const routes: Routes = [
  {
    path: '',
    component: RaiseViolationsDcComponent,
    children: [
      {
        path: ':regno/new-violation',
        component: ReportViolationScComponent,
        data: {
          breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: ':regno/new-violation/edit',
        component: ReportViolationScComponent,
        data: {
          breadcrumb: 'VIOLATIONS.ESTABLISHMENT-SERVICES'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: 'refresh',
        component: RefreshDcComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RaiseViolationsRoutingModule {}
