import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RejectedInjuryReportsScComponent } from './rejected-injury-reports-sc/rejected-injury-reports-sc.component';
import { CommonModule } from '@angular/common';
import { ReportDcComponent } from './report-dc.component';

export const routes: Routes = [
  {
    path: '',
    component: ReportDcComponent,
    children: [
      { path: '', redirectTo: 'viewreport', pathMatch: 'full' },
      {
        path: 'viewreport',
        component: RejectedInjuryReportsScComponent,
        data: {
          breadcrumb: 'OCCUPATIONAL-HAZARD.REPORTS.REPORTS'
        }
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {
  
}
