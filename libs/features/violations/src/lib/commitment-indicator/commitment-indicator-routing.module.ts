import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommitmentIndicatorScComponent } from './components';
import { CommitmentIndicatorsDcComponent } from './commitment-indicators-dc.component';

export const routes: Routes = [
  {
    path: '',
    component: CommitmentIndicatorsDcComponent,
    children: [
      {
        path: ':registrationNo',
        component: CommitmentIndicatorScComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CommitmentIndicatorRoutingModule { }
