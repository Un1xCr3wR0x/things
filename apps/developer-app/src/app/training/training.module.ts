import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { BehaviorSubjectComponent } from './rxjs/behavior-subject/components/behavior-subject/behavior-subject.component';
import { PublisherComponent } from './rxjs/publisher/publisher.component';
import { SubjectComponent } from './rxjs/subject/components/subject/subject.component';
import { SubscriberComponent } from './rxjs/subscriber/subscriber.component';
import { TrainingRoutingModule } from './training-routing.module';
import { ObservableComponent } from './rxjs/observables/component/observable/observable.component';

@NgModule({
  declarations: [
    SubjectComponent,
    PublisherComponent,
    BehaviorSubjectComponent,
    SubscriberComponent,
    ObservableComponent
  ],
  imports: [CommonModule, TrainingRoutingModule, ThemeModule]
})
export class TrainingModule {}
