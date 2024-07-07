import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@gosi-ui/foundation-theme/src';
import { CompleteAdminDetailsDcComponent } from './complete-admin-details-dc.component';
import { CompleteAdminDetailsRoutingModule } from './complete-admin-details-routing.module';

@NgModule({
  declarations: [CompleteAdminDetailsDcComponent],
  imports: [ThemeModule, CommonModule, CompleteAdminDetailsRoutingModule]
})
export class CompleteAdminDetailsModule {}
