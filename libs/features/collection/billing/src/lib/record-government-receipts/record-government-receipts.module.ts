/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RECORD_GOVERNMENT_RECEIPTS_COMPONENTS } from './components';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { RecordGovernmentReceiptsRoutingModule } from './record-government-receipts-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [...RECORD_GOVERNMENT_RECEIPTS_COMPONENTS],
  imports: [ThemeModule, CommonModule, RecordGovernmentReceiptsRoutingModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RecordGovernmentReceiptsModule {}
