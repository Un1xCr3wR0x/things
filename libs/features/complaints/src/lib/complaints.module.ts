/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintsRoutingModule } from './complaints-routing.module';
import { ComplaintsDcComponent } from './complaints-dc.component';

@NgModule({
  imports: [CommonModule, ComplaintsRoutingModule],
  declarations: [ComplaintsDcComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComplaintsModule {}
