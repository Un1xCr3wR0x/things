import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { REACTIVATE_VIC_COMPONENTS } from './components';
import { SharedModule } from '../shared/shared.module';
import { ReactivateVicScComponent } from './components/reactivate-vic-sc/reactivate-vic-sc.component';
import { ReactivateVicRoutingModule } from './reactivate-vic-routing.module';

@NgModule({
  declarations: [ REACTIVATE_VIC_COMPONENTS, ReactivateVicScComponent,],
  imports: [CommonModule, SharedModule,
    ReactivateVicRoutingModule
  ],
  exports: [REACTIVATE_VIC_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})


export class ReactivateVicModule {}
