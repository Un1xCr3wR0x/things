import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillDashboardScComponent } from './components/dashboard/bill-dashboard-sc/bill-dashboard-sc.component';
import { ThirdPartyBillScComponent } from './components/dashboard/third-party-bill-sc/third-party-bill-sc.component';
import { ContributionDetailedBillScComponent } from './components/detailed-bill/contribution-detailed-bill-sc/contribution-detailed-bill-sc';
import { LatefeeDetailedBillScComponent } from './components/detailed-bill/latefee-detailed-bill-sc/latefee-detailed-bill-sc.component';
import { AdjustmentDetailedBillScComponent } from './components/detailed-bill/adjustment-detailed-bill-sc/adjustment-detailed-bill-sc.component';
import { ReceiptCreditDetailedBillScComponent } from './components/detailed-bill/receipt-credit-detailed-bill-sc/receipt-credit-detailed-bill-sc.component';
import { ThirdPartyDetailedBillScComponent } from './components/detailed-bill/third-party-detailed-bill-sc/third-party-detailed-bill-sc.component';
import { BillHistoryScComponent } from './components/bill-history/bill-history-sc/bill-history-sc.component';
import { AllocationBillScomponent } from './components/allocation/allocation-bill-sc/allocation-bill-sc.component';
import { BillHistoryMofScComponent } from './components/bill-history/bill-history-mof-sc/bill-history-mof-sc.component';
import { ContributorAllocationCreditScComponent } from './components/allocation/contributor-allocation-credit-sc/contributor-allocation-credit-sc.component';
import { InstallmentDetailedBillScComponent } from './components/detailed-bill/installment-detailed-bill-sc/installment-detailed-bill-sc.component';
import {
  AllocationBillMofScomponent,
  BillAccountScComponent,
  BillRecordsScComponent,
  RejectedohDetailedBillScComponent,
  ViolationDetailedBillScComponent
} from './components';
import { ViewRecordsScComponent } from './components/bill-details/view-records-sc/view-records-sc.component';
import { BillAdjustmentDetailsComponent } from './components/bill-history/bill-adjustment-details/bill-adjustment-details.component';

// import { ReceiptScComponent, BillDashboardScComponent, ThirdPartyBillScComponent } from './components';

const routes: Routes = [
  {
    path: '',

    children: [
      {
        path: 'dashboard/view',
        component: BillDashboardScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'dashboard/view/:registrationNo',
        component: BillDashboardScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'bill-details/view',
        component: BillRecordsScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'dashboard-mof',
        component: ThirdPartyBillScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: ':registrationNo/dashboard',
        component: BillDashboardScComponent,
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'detailed-bill/violation',
        component: ViolationDetailedBillScComponent,
        data: {
          breadcrumb: 'BILLING.DETAILED-BILL'
        }
      },
      {
        path: 'detailed-bill/installment',
        component: InstallmentDetailedBillScComponent,
        data: {
          breadcrumb: 'BILLING.DETAILED-BILL'
        }
      },
      {
        path: 'detailed-bill/contribution',
        component: ContributionDetailedBillScComponent,
        data: {
          breadcrumb: 'BILLING.DETAILED-BILL'
        }
      },
      {
        path: 'detailed-bill/lateFee',
        component: LatefeeDetailedBillScComponent,
        data: {
          breadcrumb: 'BILLING.DETAILED-BILL'
        }
      },
      {
        path: 'detailed-bill/adjustments',
        component: AdjustmentDetailedBillScComponent,
        data: {
          breadcrumb: 'BILLING.DETAILED-BILL'
        }
      },
      {
        path: 'detailed-bill/receipt-credit',
        component: ReceiptCreditDetailedBillScComponent,
        data: {
          breadcrumb: 'BILLING.DETAILED-BILL'
        }
      },
      {
        path: 'detailed-bill/rejectedOH',
        component: RejectedohDetailedBillScComponent,
        data: {
          breadcrumb: 'BILLING.DETAILED-BILL'
        }
      },
      {
        path: 'detailed-bill/mof',
        component: ThirdPartyDetailedBillScComponent,
        data: {
          breadcrumb: 'BILLING.DETAILED-BILL'
        }
      },
      {
        path: 'bill-history',
        component: BillHistoryScComponent,
        data: {
          breadcrumb: 'BILLING.BILL-HISTORY'
        }
      },
      {
        path: 'bill-history/adjustment-history',
        component: BillAdjustmentDetailsComponent,
        data: {
          breadcrumb: 'BILLING.ADJUSTMENT-HISTORY'
        }
      },
      {
        path: 'bill-history/previous-bill',
        component: ViewRecordsScComponent,
        data: {
          breadcrumb: 'BILLING.BILL-HISTORY'
        }
      },
      {
        path: 'bill-history/previous-bill/old-bills',
        component: BillRecordsScComponent,
        data: {
          breadcrumb: 'BILLING.BILL-HISTORY'
        }
      },
      {
        path: 'bill-history/mof',
        component: BillHistoryMofScComponent,
        data: {
          breadcrumb: 'BILLING.BILL-HISTORY'
        }
      },
      {
        path: 'bill-allocation/view',
        component: AllocationBillScomponent,
        data: {
          breadcrumb: 'BILLING.ALLOCATION'
        }
      },
      {
        path: 'bill-allocation/mof',
        component: AllocationBillMofScomponent,
        data: {
          breadcrumb: 'BILLING.ALLOCATION'
        }
      },
      {
        path: 'bill-allocation/contributor-level',
        component: ContributorAllocationCreditScComponent,
        data: {
          breadcrumb: 'BILLING.ALLOCATION'
        }
      },
      {
        path: 'bill-account',
        component: BillAccountScComponent,
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
export class EstablishmentRoutingModule {}
