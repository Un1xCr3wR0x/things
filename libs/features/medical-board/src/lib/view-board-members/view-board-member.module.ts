/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormFragmentsModule, ValidatorModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared/shared.module';
import { ViewBoardMemberDcComponent } from './view-board-member-dc.component';
import { ViewBoardMemberRoutingModule } from './view-board-member-routing.module';
import { VIEW_BOARD_MEMBERS_COMPONENTS } from './components';

//TODO Try to provide the same name as the folder(ViewMemberModule) for modules. No need to append mb in file name
@NgModule({
  declarations: [ViewBoardMemberDcComponent, ...VIEW_BOARD_MEMBERS_COMPONENTS],
  imports: [CommonModule, ValidatorModule, FormFragmentsModule, SharedModule, ViewBoardMemberRoutingModule]
})
export class ViewBoardMemberModule {}
