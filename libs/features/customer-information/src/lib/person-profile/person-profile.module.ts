/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AddressModule, ContributorProfileModule } from '@gosi-ui/foundation/form-fragments';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SharedModule } from '../shared';
import { PERSON_PROFILE_COMPONENTS } from './components';
import { PersonProfileRoutingModule } from './person-profile-routing.module';
import { AddNinScComponent } from './components/add-nin-sc/add-nin-sc.component';
import { AddNinDcComponent } from './components/add-nin-dc/add-nin-dc.component';

@NgModule({
  declarations: [PERSON_PROFILE_COMPONENTS, AddNinScComponent, AddNinDcComponent],
  imports: [
    CommonModule,
    SharedModule,
    ThemeModule,
    AddressModule,
    ContributorProfileModule,
    PersonProfileRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PersonProfileModule {}
