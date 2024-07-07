import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFragmentsModule } from '../form-fragments.module';
import { ITSM_ACTION_COMPONENTS } from '.';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [...ITSM_ACTION_COMPONENTS],
  imports: [CommonModule, FormFragmentsModule,SharedModule],
  exports: [...ITSM_ACTION_COMPONENTS]
})
export class ItsmModule {}
