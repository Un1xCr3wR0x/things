/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { INBOX_COMPONENTS } from './components';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { NgxPaginationModule } from 'ngx-pagination';
import { InboxDropdownDcComponent } from './components/inbox-dropdown-dc/inbox-dropdown-dc.component';

@NgModule({
  declarations: [...INBOX_COMPONENTS, InboxDropdownDcComponent],
  imports: [CommonModule, ThemeModule, NgxPaginationModule],
  exports: [...INBOX_COMPONENTS]
})
export class SharedModule {}
