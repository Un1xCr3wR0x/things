/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EngagementActionGuard } from '../shared/guards';
import { AddContractScComponent } from './components/add-contract-sc/add-contract-sc.component';
import { ContractAuthPreviewScComponent } from './components/contract-auth-preview-sc/contract-auth-preview-sc.component';
import { ContractDocumentScComponent } from './components/contract-document-sc/contract-document-sc.component';
import { ContractPreviewScComponent } from './components/contract-preview-sc/contract-preview-sc.component';
import { InvalidContractDcComponent } from './components/invalid-contract-dc/invalid-contract-dc.component';
import { ValidateIndividualContractScComponent } from './components/validate-individual-contract-sc/validate-individual-contract-sc.component';
import { ViewContractScComponent } from './components/view-contract-sc/view-contract-sc.component';

const routes: Routes = [
  { path: '', redirectTo: 'add-contract' },
  { path: 'add-contract', component: AddContractScComponent, canActivate: [EngagementActionGuard] },
  {
    path: 'add-contract/edit',
    component: AddContractScComponent
  },
  { path: 'cancel-contract', component: ContractPreviewScComponent },
  {
    path: 'view',
    component: ViewContractScComponent
    // canActivate: [EngagementActionGuard]
  },
  { path: 'individual-contract', component: ViewContractScComponent },
  { path: 'individual-contract-view', component: ContractPreviewScComponent },
  { path: 'individual-contract-auth', component: ContractAuthPreviewScComponent },
  {
    path: 'preview',
    component: ContractPreviewScComponent,
    canActivate: [EngagementActionGuard]
  },
  {
    path: 'contract-document',
    component: ContractDocumentScComponent
    // canActivate: [EngagementActionGuard]
  },
  //Contract stand alone app routes
  { path: 'login', component: ValidateIndividualContractScComponent },
  { path: 'validate', component: ContractAuthPreviewScComponent },
  { path: 'invalid', component: InvalidContractDcComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticateContractRoutingModule {}
