import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  ReceiptScComponent,
  MofReceiptScComponent,
  ReceiptDetailsScComponent,
  MofAllocationBreakupScComponent,
  VicReceiptScComponent,
  ReceiptSearchScComponent
} from './components';
import { VicReceiptDetailsScComponent } from './components/vic-receipt-details-sc/vic-receipt-details-sc.component';

const routes: Routes = [
  {
    path: '',

    children: [
      {
        path: 'establishment',
        component: ReceiptScComponent,
        data: {
          breadcrumb: 'BILLING.ESTABLISHMENT-RECEIPTS'
        }
      },
      {
        path: ':registrationNo/establishment',
        component: ReceiptScComponent,
        data: {
          breadcrumb: 'BILLING.ESTABLISHMENT-RECEIPTS'
        }
      },
      {
        path: 'vic',
        component: VicReceiptScComponent,
        data: {
          breadcrumb: 'BILLING.VIC-RECEIPTS'
        }
      },
      {
        path: 'mof',
        component: MofReceiptScComponent,
        data: {
          breadcrumb: 'BILLING.MOF-PAYMENT-RECEIPTS'
        }
      },
      {
        path: 'establishment/receiptDetails',
        component: ReceiptDetailsScComponent,
        data: {
          breadcrumb: 'BILLING.ESTABLISHMENT-RECEIPTS'
        }
      },
      {
        path: 'mof/receiptDetails',
        component: ReceiptDetailsScComponent,
        data: {
          breadcrumb: 'BILLING.MOF-PAYMENT-RECEIPTS'
        }
      },

      {
        path: 'vic/receiptDetails',
        component: VicReceiptDetailsScComponent,
        data: {
          breadcrumb: 'BILLING.VIC-RECEIPTS'
        }
      },

      {
        path: 'mof/allocationDetails',
        component: MofAllocationBreakupScComponent,
        data: {
          breadcrumb: 'BILLING.MOF-PAYMENT-RECEIPTS'
        }
      },

      {
        path: 'receipt-search',
        component: ReceiptSearchScComponent,
        data: {
          breadcrumb: 'BILLING.RECEIPT-SEARCH'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiptRoutingModule {}
