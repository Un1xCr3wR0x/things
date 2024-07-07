import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimsDcComponent } from './claims-dc.component';
import { ClaimsDetailsScComponent } from './claims-details-sc/claims-details-sc.component';

export const routes: Routes = [
  {
    path: '',
    component: ClaimsDcComponent,
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      {
        path: 'info',
        component: ClaimsDetailsScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.CLAIMS-DETAILS'
        }
      },
      {
        path: 'detail',
        component: ClaimsDetailsScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.CLAIMS-DETAILS'
        }
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimsRoutingModule {}
