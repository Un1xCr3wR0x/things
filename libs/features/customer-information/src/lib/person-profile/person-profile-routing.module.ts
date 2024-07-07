/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { InProgressDcComponent } from '@gosi-ui/foundation-theme';
import { AddIqamaScComponent, AddBorderScComponent, AddPassportScComponent } from './components';
import { MainContentDcComponent, UpdateAddressScComponent } from './components';
import { SearchContributorScComponent, ManagePersonGuard } from '../shared';
import { AddNinScComponent } from './components/add-nin-sc/add-nin-sc.component';

const commonRoutes: Route[] = [
  { path: '', redirectTo: 'info', pathMatch: 'full' },
  {
    path: 'info',
    canActivate: [ManagePersonGuard],
    loadChildren: () => import('../change-person/change-person.module').then(mod => mod.ChangePersonModule)
  },
  {
    path: 'engagement',
    loadChildren: () =>
      import('libs/features/contributor/src/lib/manage-wage/manage-wage.module').then(mod => mod.ManageWageModule)
  },
  // {
  //   path: 'benefits',
  //   loadChildren: () => import('libs/features/benefits/src/lib/benefits.module').then(mod => mod.BenefitsModule)
  // },
  {
    path: 'benefits',
    loadChildren: () => import('libs/features/benefits/src/lib/benefits.module').then(mod => mod.BenefitsModule)
  },
  {
    path: 'occupation',
    component: InProgressDcComponent
  },
  /**
   *   {
    path: 'documents',
    loadChildren: () => import('../manage-document/manage-document.module').then(mod => mod.ManageDocumentModule)
  },
   */

  {
    path: 'injury',
    loadChildren: () =>
      import('libs/features/occupational-hazard/src/lib/injury/injury.module').then(mod => mod.InjuryModule)
  },
  {
    path: 'history',
    loadChildren: () =>
      import('libs/features/occupational-hazard/src/lib/injury/injury.module').then(mod => mod.InjuryModule)
  },

  {
    path: 'injury/history/:socialInsuranceNo',
    loadChildren: () =>
      import('libs/features/occupational-hazard/src/lib/injury/injury.module').then(mod => mod.InjuryModule)
  }
];

export const routes: Routes = [
  {
    path: '',
    component: MainContentDcComponent,
    children: [...commonRoutes]
  },
  {
    path: 'add-iqama',
    component: AddIqamaScComponent,
    data: {
      breadcrumb: 'CUSTOMER-INFORMATION.ADD-IQAMA'
    }
  },
  {
    path: 'add-nin/:id',
    component: AddNinScComponent,
    data: {
      breadcrumb: 'CUSTOMER-INFORMATION.ADD-NIN'
    }
  },
  {
    path: 'edit-nin',
    component: AddNinScComponent,
    data: {
      breadcrumb: 'CUSTOMER-INFORMATION.EDIT-NIN'
    }
  },
  {
    path: 'add-border',
    component: AddBorderScComponent,
    data: {
      breadcrumb: 'CUSTOMER-INFORMATION.ADD-BORDER'
    }
  },
  {
    path: 'add-passport',
    component: AddPassportScComponent,
    data: {
      breadcrumb: 'CUSTOMER-INFORMATION.ADD-PASSPORT'
    }
  },
  {
    path: 'update-address',
    component: UpdateAddressScComponent
  },
  {
    path: 'search',
    component: SearchContributorScComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class PersonProfileRoutingModule {}
