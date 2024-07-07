/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePersonScComponent } from './components';

export const routes: Routes = [{ path: '', component: ChangePersonScComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class ChangePersonRoutingModule {}
