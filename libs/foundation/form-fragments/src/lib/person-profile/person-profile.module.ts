import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonProfileDcComponent } from './person-profile-dc/person-profile-dc.component';
import { FormFragmentsModule } from '../form-fragments.module';
import { PersonCardIconDcComponent } from './person-card-icon-dc/person-card-icon-dc.component';

@NgModule({
  declarations: [PersonProfileDcComponent, PersonCardIconDcComponent],
  imports: [CommonModule, FormFragmentsModule],
  exports: [PersonProfileDcComponent]
})
export class PersonProfileViewModule {}
