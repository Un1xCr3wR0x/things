/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InboxDcComponent } from './inbox-dc.component';

const routes: Routes = [
  {
    path: '',
    component: InboxDcComponent,
    children: [
      {
        path: 'worklist',
        loadChildren: () => import('@gosi-ui/foundation/inbox/lib/worklist').then(mod => mod.WorklistModule)
      },
      {
        path: 'todolist',
        loadChildren: () =>
          import('@gosi-ui/foundation/inbox/lib/todolist/todolist.module').then(mod => mod.TodolistModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InboxRoutingModule {}
