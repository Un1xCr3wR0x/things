/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionStateGuard } from '@gosi-ui/core';
import { ChangeEstablishmentDcComponent } from './change-establishment-dc.component';
import {
  ChangeAddressDetailsScComponent,
  ChangeBankDetailsScComponent,
  ChangeBasicDetailsScComponent,
  ChangeContactDetailsScComponent,
  ChangeIdentifierDetailsScComponent,
  ChangeLegalEntityDetailsScComponent,
  ChangeMofPaymentScComponent,
  ChangeOwnerScComponent,
  ModifyLateFeeScComponent,
  MofPaymentDetailsScComponent,
  OwnersScComponent,
  SearchEstablishmentScComponent
} from './components';
export const routes: Routes = [
  {
    path: '',
    component: ChangeEstablishmentDcComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'search', component: SearchEstablishmentScComponent },
      {
        path: 'basic-details',
        component: ChangeBasicDetailsScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.ESTABLISHMENT-DETAILS'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: 'identifiers',
        component: ChangeIdentifierDetailsScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.EST-IDENTIFIER-DETAILS'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: 'owners',
        component: OwnersScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.MANAGE-OWNER'
        }
      },
      {
        path: 'owners/modify',
        component: ChangeOwnerScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.MODIFY-EST-OWNERS'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: 'bank-details',
        component: ChangeBankDetailsScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.EDIT-BANK-ACCOUNT-DETAILS'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: 'address-details',
        component: ChangeAddressDetailsScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.ADDRESS-DETAILS'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: 'legal-entity',
        component: ChangeLegalEntityDetailsScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.CHANGE-LEGAL-ENTITY'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: 'contact-details',
        component: ChangeContactDetailsScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.CONTACT-DETAILS'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: 'late-fee',
        component: ModifyLateFeeScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.MODIFY-LATE-FEE'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: 'mof-payment',
        component: MofPaymentDetailsScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.MOF-PAYMENT-DETAILS'
        }
      },
      {
        path: 'mof-payment/modify',
        component: ChangeMofPaymentScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.MODIFY-MOF-PAYMENT-DETAILS'
        },
        canDeactivate: [TransactionStateGuard]
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeEstablishmentRoutingModule {}
