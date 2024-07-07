import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicalBoardAssessmentsScComponent } from './components';

export const routes: Routes = [
  {
    path: 'medical-board-assessments',
    component: MedicalBoardAssessmentsScComponent,
    data: {
      breadcrumb: 'Medical Board Assessments'
    }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: []
})
export class MedicalBoardAssessmentsRoutingModule {}
