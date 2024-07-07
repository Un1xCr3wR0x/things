import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContributorAssessmentScComponent } from './contributor-assessment-sc/contributor-assessment-sc.component';
import { EarlyParticipantReassessmentScComponent } from './early-participant-reassessment-sc/early-participant-reassessment-sc.component';

export const routes: Routes = [
  {
    path:'',
    redirectTo: 'contributor-assessment'
  },
  {
    path: 'contributor-assessment',
    component: ContributorAssessmentScComponent,
    data: {
      breadcrumb: 'Establishment Services'
    }
  },
  {
    path: 'early-reassessment',
    component: EarlyParticipantReassessmentScComponent,
    data: {
      breadcrumb: 'Establishment Services'
    } 
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class reassessmentRoutingModule {}
