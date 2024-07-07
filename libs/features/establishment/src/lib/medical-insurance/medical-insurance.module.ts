/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { MEDICAL_INSURANCE_COMPONENTS } from '@gosi-ui/features/establishment/lib/medical-insurance/components';
import { SharedModule } from '@gosi-ui/features/establishment/lib/shared/shared.module';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { MedicalInsuranceRoutingModule } from './medical-insurance-routing.module';

@NgModule({
  declarations: [MEDICAL_INSURANCE_COMPONENTS],
  imports: [CommonModule, MedicalInsuranceRoutingModule, ThemeModule, SharedModule, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MedicalInsuranceModule {}
