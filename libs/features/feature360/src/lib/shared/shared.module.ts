/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { REGISTER_COMPONENTS } from './components';
import { VerifyNinumberDcComponent } from './components/verify-ninumber-dc/verify-ninumber-dc.component';
import { ChooseDetailsTypeComponent } from './components/choose-details-type/choose-details-type.component';
import { EnterComplaintDcComponent } from './components/enter-complaint-dc/enter-complaint-dc.component';
import { MessageModalComponent } from './components/message-modal/message-modal.component';

@NgModule({
  declarations: [REGISTER_COMPONENTS],
  imports: [CommonModule, ReactiveFormsModule, ThemeModule, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [VerifyNinumberDcComponent, EnterComplaintDcComponent, ChooseDetailsTypeComponent, MessageModalComponent]
})
export class SharedModule {}
