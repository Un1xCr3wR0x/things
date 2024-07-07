/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PROFILE_COMPONENTS } from './components';
import { ProfileDcComponent } from './profile-dc.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { EstablishmentProfileLinksComponent } from './components/establishment-profile-links/establishment-profile-links.component';

@NgModule({
  declarations: [ProfileDcComponent, ...PROFILE_COMPONENTS, EstablishmentProfileLinksComponent],
  imports: [CommonModule, SharedModule, ProfileRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileModule {}
