import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { REACTIVATE_COMPONENTS } from './components';
import { SharedModule } from '../shared/shared.module';
import { ReactivateRoutingModule } from './reactivate-routing.module';
import { ReactivateComponent } from './reactivate.component';

@NgModule({
  declarations: [ReactivateComponent, REACTIVATE_COMPONENTS],
  imports: [CommonModule, SharedModule,
    ReactivateRoutingModule
  ],
  exports: [REACTIVATE_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})


export class ReactivateModule {}
