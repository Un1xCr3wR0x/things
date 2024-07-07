/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AddMemberRoutingModule } from './add-member-routing.module';
import { AddMemberDcComponent } from './add-member-dc.component';
import { ADD_MEMBER_COMPONENTS } from './components';
import { FormFragmentsModule, ValidatorModule } from '@gosi-ui/foundation/form-fragments';
//TODO Use barrel file to import components
@NgModule({
  declarations: [AddMemberDcComponent, ...ADD_MEMBER_COMPONENTS],
  imports: [CommonModule, ValidatorModule, FormFragmentsModule, SharedModule, AddMemberRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddMemberModule {}
