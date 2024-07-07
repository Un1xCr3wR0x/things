/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {
  DocumentViewScComponent,
  EstablishmentGroupProfileScComponent,
  EstablishmentProfileScComponent,
  UploadDocumentScComponent
} from './components';
import { ProfileDcComponent } from './profile-dc.component';
const profileChildRoutes: Route[] = [
  {
    path: 'bill',
    loadChildren: () =>
      import('libs/features/collection/billing/src/lib/establishment/establishment.module').then(
        mod => mod.EstablishmentModule
      )
  },
  {
    path: 'contributor-list',
    loadChildren: () =>
      import('libs/features/contributor/src/lib/contributor-list/contributor-list.module').then(
        mod => mod.ContributorListModule
      )
  },
  {
    path: 'documents',
    component: DocumentViewScComponent,
    data: {
      breadcrumb: 'ESTABLISHMENT.EST-PROFILE'
    }
  }
];

const routes: Route[] = [
  {
    path: '',
    component: ProfileDcComponent,
    children: [
      {
        path: 'group/user/:adminId',
        component: EstablishmentGroupProfileScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.ESTABLISHMENT.ESTABLISHMENTS'
        }
      },
      {
        path: 'group/:registrationNo',
        component: EstablishmentGroupProfileScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.ESTABLISHMENT.ESTABLISHMENTS'
        }
      },
      {
        path: ':registrationNo/user/:adminId',
        component: EstablishmentProfileScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.EST-PROFILE'
        },
        children: profileChildRoutes
      },
      {
        path: ':registrationNo/view',
        component: EstablishmentProfileScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.EST-PROFILE'
        },
        children: profileChildRoutes
      },
      {
        path: ':registrationNo/view/documents/upload',
        component: UploadDocumentScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.EST-PROFILE'
        }
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
