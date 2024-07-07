/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AddAdminScComponent,
  AdminScComponent,
  ReplaceAdminScComponent,
  ReplaceSuperAdminScComponent,
  UpdateAdminScComponent,
  UpdateMissingDetailsScComponent
} from './components';
import { ManageAdminDcComponent } from './manage-admin-dc.component';
import { RegisterSuperAdminScComponent } from './components/register-super-admin-sc/register-super-admin-sc.component';
import { TransactionStateGuard } from '@gosi-ui/core/lib/guards';

const routes: Routes = [
  {
    path: '',
    component: ManageAdminDcComponent,
    children: [
      //view all admin of the group when searched when accessed with admin id
      {
        path: 'group/:registrationNo/user/:adminId',
        component: AdminScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.MANAGE-ADMIN'
        }
      },
      //view all admin of the branch when accessed with admin id and branch regno
      {
        path: 'branch/:registrationNo/user/:adminId',
        component: AdminScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.MANAGE-ADMIN'
        }
      },
      {
        path: ':registrationNo/:adminId/add',
        component: AddAdminScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.ADD-ESTABLISHMENT-ADMIN'
        }
      },
      {
        path: ':registrationNo/:adminId/assign-branches',
        component: UpdateAdminScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.ASSIGN-NEW-BRANCHES'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: ':registrationNo/:adminId/modify',
        component: UpdateAdminScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.MODIFY-ADMIN'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: ':registrationNo/replace-admin',
        component: ReplaceSuperAdminScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.REPLACE'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: ':registrationNo/validate-replace-admin',
        component: ReplaceSuperAdminScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.REPLACE'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: ':adminId/:registrationNo/replace',
        component: ReplaceAdminScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.REPLACE-EST-ADMIN'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: ':registrationNo/register',
        component: RegisterSuperAdminScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.REGISTER-BRANCH-MANAGER'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: ':registrationNo/validate/register',
        component: RegisterSuperAdminScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.REGISTER-BRANCH-MANAGER'
        },
        canDeactivate: [TransactionStateGuard]
      },
      {
        path: ':registrationNo/missing-details/:adminId',
        component: UpdateMissingDetailsScComponent,
        data: {
          breadcrumb: 'ESTABLISHMENT.REGISTER-EST-ADMIN'
        }
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class ManageAdminRoutingModule {}
