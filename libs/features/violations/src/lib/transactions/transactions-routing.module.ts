import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RaiseViolationsTransactionsScComponent} from './components';
import { CancelViolationsScComponent } from './components/cancel-violations/cancel-violations-sc/cancel-violations-sc.component';
import { ModifyViolationScComponent } from './components/modify-violation/modify-violation-sc/modify-violation-sc.component';
import { AppealOnViolationScComponent } from './components/appeal-on-violation';
import { TransactionDcComponent } from './transaction-dc.component';
const routes: Routes = [
  {
    path: '',
    component: TransactionDcComponent,
    children: [
      // {
      //   path: 'modify-penalty',
      //   component:
      // },
      {
        path: 'raise-violation',
        component: RaiseViolationsTransactionsScComponent
      },
      {
        path: 'cancel-violation',
        component: CancelViolationsScComponent
      },
      {
        path: 'modify-violation',
        component: ModifyViolationScComponent
      },
      {
        path: 'appeal-on-violation',
        component: AppealOnViolationScComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule {}
