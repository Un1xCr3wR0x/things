/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AdjustmentAddModifyScComponent,
  AdjustmentCreateScComponent,
  AdjustmentDetailsScComponent,
  BenefitDetailsScComponent,
  BenefitIdentifierScComponent,
  BenefitListScComponent,
  CreateThirdPartyAdjustmentScComponent,
  IdentifierSearchScComponent,
  ManageThirdPartyAdjustmentScComponent,
  PayAdjustmentScComponent,
  ThirdPartyAdjustmentListDcComponent,
  ThirdPartyAdjustmentViewScComponent,
  AddDocumentScComponent,
  AdjustmentHeirScComponent
} from './components';
import { AdjustmentPaymentMethodScComponent } from './components/adjustment-payment-method-sc/adjustment-payment-method-sc.component';
import { BenefitAdjustmentDetailsScComponent } from './components/benefit-adjustment-details-sc/benefit-adjustment-details-sc.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'search'
  },
  {
    path: 'adjustment-details',
    component: AdjustmentDetailsScComponent,
    data: {
      breadcrumb: 'ADJUSTMENT.ADJUSTMENT-DETAILS'
    }
  },
  {
    path: 'search',
    component: IdentifierSearchScComponent
  },
  {
    path: 'benefit-search',
    component: BenefitIdentifierScComponent
  },
  {
    path: 'benefit-list',
    component: BenefitListScComponent
  },
  {
    path: 'benefit-details',
    component: BenefitDetailsScComponent
  },
  {
    path: 'create',
    component: AdjustmentCreateScComponent
  },
  {
    path: 'add-modify',
    component: AdjustmentAddModifyScComponent
  },
  {
    path: 'benefit-adjustment',
    component: BenefitAdjustmentDetailsScComponent
  },
  {
    path: 'pay-adjustment',
    component: PayAdjustmentScComponent,
    data: {
      breadcrumb: 'ADJUSTMENT.RECOVER-ADJUSTMENTS'
    }
  },
  {
    path: 'adjustment-payment-method',
    component: AdjustmentPaymentMethodScComponent,
    data: {
      breadcrumb: 'ADJUSTMENT.RECOVER-ADJUSTMENTS'
    }
  },
  {
    path: 'third-party-adjustment',
    component: ThirdPartyAdjustmentListDcComponent,
    data: {
      breadcrumb: 'ADJUSTMENT.ADJUSTMENT-DETAILS'
    }
  },
  {
    path: 'create-adjustment',
    component: CreateThirdPartyAdjustmentScComponent,
    data: {
      breadcrumb: 'ADJUSTMENT.ADD-THIRDPARTY-ADJUSTMENT'
    }
  },
  {
    path: 'create-adjustment/edit',
    component: CreateThirdPartyAdjustmentScComponent,
    data: {
      breadcrumb: 'ADJUSTMENT.ADD-THIRDPARTY-ADJUSTMENT'
    }
  },
  {
    path: 'manage-adjustment',
    component: ManageThirdPartyAdjustmentScComponent,
    data: {
      breadcrumb: 'ADJUSTMENT.ADD-MANAGE-ADJUSTMENT'
    }
  },
  {
    path: 'manage-adjustment/edit',
    component: ManageThirdPartyAdjustmentScComponent,
    data: {
      breadcrumb: 'ADJUSTMENT.ADD-MANAGE-ADJUSTMENT'
    }
  },
  {
    path: 'thirdPartyAdjustmentView',
    component: ThirdPartyAdjustmentViewScComponent,
    data: {
      breadcrumb: 'ADJUSTMENT.THIRD-PARTY-ADJUSTMENT-DETAILS'
    }
  },
  {
    path: 'addDocuments',
    component: AddDocumentScComponent,
    data: {
      breadcrumb: 'ADJUSTMENT.ADJUSTMENT.ADD-DOCUMENTS'
    }
  },
  {
    path: 'validator',
    loadChildren: () => import('./validator').then(m => m.ValidatorAdjustmentModule)
  },
  {
    path: 'heir-adjustment',
    component: AdjustmentHeirScComponent,
    data: {
      breadcrumb: ''
    }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdjustmentRoutingModule {}
