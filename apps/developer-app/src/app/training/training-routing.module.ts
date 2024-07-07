import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BehaviorSubjectComponent } from './rxjs/behavior-subject/components/behavior-subject/behavior-subject.component';
import { ObservableComponent } from './rxjs/observables/component/observable/observable.component';
import { SubjectComponent } from './rxjs/subject/components/subject/subject.component';

const routes: Routes = [
  { path: '', redirectTo: 'subject', pathMatch: 'full' },
  { path: 'subject', component: SubjectComponent },
  { path: 'behavior-subject', component: BehaviorSubjectComponent },
  { path: 'observable', component: ObservableComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule {}
