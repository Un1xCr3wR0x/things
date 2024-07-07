/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MedicalBoardMembersRoutingModule } from './medical-board-routing.module';
import { MedicalBoardDcComponent } from './medical-board-dc.component';
// import { GooglePlaceModule } from "ngx-google-places-autocomplete";

@NgModule({
  imports: [CommonModule, MedicalBoardMembersRoutingModule],
  declarations: [MedicalBoardDcComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MedicalBoardModule {}
