/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { ManageDocumentRoutingModule } from './manage-document-routing.module';
import { MANAGE_DOCUMENT_COMPONENTS } from './components';
import { SharedModule } from '../shared';

@NgModule({
  declarations: [MANAGE_DOCUMENT_COMPONENTS],
  imports: [CommonModule, ManageDocumentRoutingModule, ThemeModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ManageDocumentModule {}
