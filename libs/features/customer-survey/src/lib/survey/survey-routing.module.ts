import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SurveyScComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: SurveyScComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class SurveyRoutingModule {}
