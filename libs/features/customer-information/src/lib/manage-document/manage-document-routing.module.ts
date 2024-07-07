/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageDocumentScComponent } from './components/manage-document-sc/manage-document-sc.component';

const routes: Routes = [
  {
    path: '',
    component: ManageDocumentScComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageDocumentRoutingModule {}
