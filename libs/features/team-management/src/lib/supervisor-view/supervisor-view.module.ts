/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { SupervisorViewScComponent } from './supervisor-view-sc/supervisor-view-sc.component';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { GosiHttpInterceptor } from '@gosi-ui/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ValidatorProfileScComponent } from './validator-profile-sc/validator-profile-sc.component';
import { PersonProfileViewModule, AddressModule, ContactModule } from '@gosi-ui/foundation/form-fragments';
 

@NgModule({
  declarations: [SupervisorViewScComponent, ValidatorProfileScComponent],
  imports: [CommonModule, SharedModule, ThemeModule, PersonProfileViewModule, AddressModule, ContactModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GosiHttpInterceptor,
      multi: true
    }
  ],
  exports: [SupervisorViewScComponent]
})
export class SupervisorViewModule {}
