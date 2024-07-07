import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiscellaneousAdjustmentDetailsScComponent } from './components';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'create', component: MiscellaneousAdjustmentDetailsScComponent },
      { path: 'edit', component: MiscellaneousAdjustmentDetailsScComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiscellaneousAdjustmentRoutingModule {}
