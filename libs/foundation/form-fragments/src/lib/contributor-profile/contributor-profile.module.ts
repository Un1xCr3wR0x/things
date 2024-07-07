import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormFragmentsModule } from '../form-fragments.module';
import { EstDetailsDcComponent } from './est-details-dc/est-details-dc.component';
import { NameStatusDcComponent } from './name-status-dc/name-status-dc.component';
import { ProfileTabsDcComponent } from './profile-tabs-dc/profile-tabs-dc.component';

@NgModule({
  declarations: [NameStatusDcComponent, ProfileTabsDcComponent, EstDetailsDcComponent],
  imports: [CommonModule, FormFragmentsModule],
  exports: [NameStatusDcComponent, ProfileTabsDcComponent, EstDetailsDcComponent]
})
export class ContributorProfileModule {}
