import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditManagementBalanceScComponent } from './components/transfer-credit-balance/credit-management-balance-sc/credit-management-balance-sc.component';
import { RefundCreditBalanceScComponent } from './components/refund-credit-balance/refund-credit-balance-sc/refund-credit-balance-sc.component';
import { VicRefundCreditBalanceScComponent } from './components/refund-credit-balance/vic-refund-credit-balance-sc/vic-refund-credit-balance-sc.component';
import { ContributorCreditRefundScComponent } from './components/contirbutor-credit-refund/contributor-credit-refund-sc/contributor-credit-refund-sc.component';
import { RefundContributorAmountScComponent } from './components';
import { RefreshDcComponent } from '@gosi-ui/foundation-theme';

const routes: Routes = [
  {
    path: '',

    children: [
      {
        path: 'establishment-credit-transfer/request',
        component: CreditManagementBalanceScComponent,
        data: {
          breadcrumb: 'BILLING.TRANSFER-CREDIT-BALANCE'
        }
      },
      {
        path: 'establishment-refund-credit-balance/request',
        component: RefundCreditBalanceScComponent,
        data: {
          breadcrumb: 'BILLING.REFUND-CREDIT-BALANCE'
        }
      },
      {
        path: 'vic-refund-credit-balance/request',
        component: VicRefundCreditBalanceScComponent,
        data: {
          breadcrumb: 'BILLING.VIC-REFUND-CREDIT-BALANCE'
        }
      },
      {
        path: 'establishment-credit-transfer/edit',
        component: CreditManagementBalanceScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'establishment-refund-credit-balance/edit',
        component: RefundCreditBalanceScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'vic-refund-credit-balance/edit',
        component: VicRefundCreditBalanceScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'contributor-refund-credit-balance/request',
        component: ContributorCreditRefundScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'contributor-refund-credit-balance/refresh',
        component: RefreshDcComponent
      },
      {
        path: 'contributor-refund-amount',
        component: RefundContributorAmountScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'contributor-refund/edit',
        component: ContributorCreditRefundScComponent,
        data: {
          breadcrumb: ''
        }
      },
      { path: 'refresh', component: RefreshDcComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditManagementRoutingModule {}
